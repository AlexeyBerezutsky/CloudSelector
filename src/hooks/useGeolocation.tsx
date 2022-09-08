import isEqual from "lodash.isequal";
import { useEffect, useMemo, useState } from "react";
import { Coordinates } from "../tools/geoWrappers";

//SOURCE https://github.com/streamich/react-use/blob/master/src/useGeolocation.ts
//SOURCE https://stackoverflow.com/a/26354847
//SOURCE https://web.dev/native-hardware-user-location/

const browserSupport = 'geolocation' in navigator && 'permissions' in navigator;

type GeolocationPositionError = {
    readonly code: number;
    readonly message: string;
    readonly PERMISSION_DENIED: number;
    readonly POSITION_UNAVAILABLE: number;
    readonly TIMEOUT: number;
}

export enum GeolocationErrors {
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMEOUT = 3,
    UNSUPORTED = 4
}

type GeolocationState = {
    coordinates?: Coordinates;
    error?: number;
    permission?: string;
};

const useGeolocation = (): GeolocationState => {
    const [state, setState] = useState<GeolocationState>({});
    let watchId: any;

    const onEvent = (event: any) => {
        const newCoordinates = {
            latitude: event.coords.latitude,
            longitude: event.coords.latitude
        }

        setState((state) => {
            // Prevent state updating with same coordinates  
            if (isEqual(state.coordinates, newCoordinates)) {
                return state;
            }

            return {
                permission: state.permission,
                coordinates: {
                    latitude: event.coords.latitude,
                    longitude: event.coords.latitude
                }
            }
        });
    };
    const onEventError = (error: GeolocationPositionError) => {
        if (error.code !== GeolocationErrors.PERMISSION_DENIED) {
            setState({ ...state, error: error.code });
        }
    };

    const startWatch = () => {
        navigator.geolocation.getCurrentPosition(onEvent, onEventError);
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
        watchId = navigator.geolocation.watchPosition(onEvent, onEventError);
    }

    useEffect(() => {
        if (!browserSupport) {
            setState({ ...state, error: GeolocationErrors.UNSUPORTED })
            return;
        }

        (async () => {
            const permissions = await navigator.permissions.query({ name: "geolocation" });
            setState((state) => ({ ...state, permission: permissions.state }));

            permissions.onchange = () => {
                setState((state) => ({ ...state, permission: permissions.state }));
                startWatch();
            };
        })();

        startWatch();

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);
    return state;
};

export default useGeolocation;