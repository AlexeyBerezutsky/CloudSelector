import { Box, Typography } from "@mui/material";
import { ComponentType, useEffect, useState } from "react";
import useGeolocation from "../hooks/useGeolocation";
import { useModal } from "../hooks/useModal";
import { Coordinates } from "../tools/geoWrappers";
import { getRegionsCenters } from "../reducers/providerToRegionMatrix";
import { Cloud } from "../types/apps";
import { RegionGeoData, RegionsList } from "../components/RegionsList";
import { deniedText, promptText, unavailableText } from "../tools/geolocation.constants";
import { isEmpty } from "lodash";

type WithGeoProps = {
    clouds: Cloud[];
    coordinates?: Coordinates;
}

export const withGeolocation = <T extends WithGeoProps>(Component: ComponentType<T>) => (props: Omit<T, 'coordinates'>) => {
    const { clouds } = props;
    const geolocation = useGeolocation();
    const [fallbackCoordinates, setFallbackCoordinates] = useState<Coordinates>();
    const [regionGeoData, setRegionGeoData] = useState<RegionGeoData[]>([]);
    const { showModal } = useModal();
    const [geolocationIsAvailable, setGeolocationIsAvailable] = useState(true);

    useEffect(() => {
        if (isEmpty(clouds) || geolocationIsAvailable) {
            return;
        }

        const geoData = getRegionsCenters(clouds);
        setRegionGeoData(geoData);
    }, [clouds, geolocationIsAvailable]);

    useEffect(() => {
        if (!geolocation?.permission) {
            return;
        }

        switch (geolocation?.permission) {
            case "granted": {
                setGeolocationIsAvailable(true)
                break;
            }

            case "prompt": {
                showModal({
                    text: promptText,
                    confirmation: "ok"
                });

                break;
            }

            case "denied": {
                showModal({
                    text: deniedText,
                    confirmation: "ok",
                    onHide: () => setGeolocationIsAvailable(false)
                });

                break;
            }

            default:
                showModal({
                    text: unavailableText,
                    confirmation: "ok"
                });
        }


    }, [geolocation.permission]);

    useEffect(() => {
        if (!!geolocation?.error) {
            setGeolocationIsAvailable(false);
        }
    }, [geolocation?.error]);

    const coordinates = geolocationIsAvailable ? geolocation?.coordinates : fallbackCoordinates;

    const newPros = { ...props, coordinates } as T;

    return <>
        {!geolocationIsAvailable && (
            <Box margin={2}>
                <Typography>Geolocation has been switched off. Please, select the region closest to your preferred position.</Typography>
                <RegionsList list={regionGeoData} onChanged={(coordinates) => setFallbackCoordinates(coordinates)} />
            </Box>)}
        <Box margin={2}>
            {coordinates && <Component {...newPros} />}
        </Box>
    </>;
}