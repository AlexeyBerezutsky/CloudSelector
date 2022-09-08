import { useEffect, useReducer } from "react";
import { BrandButtons } from "../components/BrandButtons";
import { RegionPanels } from "../components/RegionPanels";
import { RegionTabs } from "../components/RegionTabs";
import { withGeolocation } from "../hoc/withGeolocation";
import { cloudSelectorReducer, init } from "../reducers/cloudSelectorReducer";
import { DistancesMatrix } from "../reducers/distanceMatrix";
import { ProviderToRegionMatrix } from "../reducers/providerToRegionMatrix";
import { Coordinates } from "../tools/geoWrappers";
import { CalcType, Cloud } from "../types/apps";

export type State = {
    matrix: ProviderToRegionMatrix,
    distances: DistancesMatrix,
    currentProvider: string;
    providers: string[];
    currentRegion: string;
    regions: string[];
    currentCloud: Cloud | null;
    serverClouds: Cloud[];
};

type CloudSelectorProps = { clouds: Cloud[], onSelected: (cloud: Cloud) => void, coordinates: Coordinates, calcType: CalcType };

const initialState: State = {
    matrix: {},
    distances: new Map(),
    currentProvider: '',
    providers: [],
    currentRegion: '',
    regions: [],
    currentCloud: null,
    serverClouds: []
}

export function CloudSelector({ clouds, onSelected, coordinates, calcType }: CloudSelectorProps) {
    const [state, dispatch] = useReducer(cloudSelectorReducer, initialState, init(clouds));

    useEffect(() => {
        if (!coordinates || !calcType) {
            return;
        }

        dispatch({ type: 'reset', payload: { coordinates, calcType } });
    }, [coordinates, calcType])

    return (<>
        <BrandButtons
            providers={state.providers}
            currentProvider={state.currentProvider}
            setCurrentProvider={(provider: string) => dispatch({ type: 'setProvider', payload: { provider, coordinates } })} />
        <RegionTabs
            regions={state.regions}
            currentRegionName={state.currentRegion}
            setCurrentRegionName={(region: string) => dispatch({ type: 'setRegion', payload: { region, coordinates } })} />
        <RegionPanels
            clouds={state.serverClouds}
            currentCloud={state.currentCloud}
            setCurrentCloud={(cloud: Cloud) => {
                dispatch({ type: 'setCloud', payload: cloud });
                onSelected(cloud);
            }}
        />
    </>
    )
}

export const CloudSelectorWithGeolocation = withGeolocation<CloudSelectorProps>(CloudSelector);
