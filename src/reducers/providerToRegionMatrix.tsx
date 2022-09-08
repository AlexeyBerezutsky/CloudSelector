import { Coordinates } from "../tools/geoWrappers";
import { Cloud } from "../types/apps";
import { getCenter } from "geolib";
import { getProviderName } from "./helpers";

export type ProviderToRegionMatrix = { [key: string]: { [key: string]: Cloud[] } };
export type RegionToDistanceGroups = { [name: string]: Coordinates[] };

export const groupCoordinatesByRegions = (clouds: Cloud[]) =>
    clouds.reduce((acc, cloud) => {
        const region = cloud.geo_region;
        if (!acc[region]) {
            acc[region] = []
        }

        acc[region].push({
            latitude: cloud.geo_latitude,
            longitude: cloud.geo_longitude
        });
        return acc;
    }, {} as RegionToDistanceGroups);

export const calculateRegionCenters = (geoData: RegionToDistanceGroups) => Object.entries(geoData).map(([region, points]) => {
    return { name: region, coordinates: getCenter(points) as Coordinates };
});

export const getRegionsCenters = (clouds: Cloud[]) => {
    const geoData = groupCoordinatesByRegions(clouds);

    const centers = calculateRegionCenters(geoData);

    return centers;
}

export const getProvidersToRegionMatrix = (clouds: Cloud[]) => {
    return clouds.reduce((acc, cloud) => {
        const providerName = getProviderName(cloud.cloud_name)
        if (!acc[providerName]) {
            acc[providerName] = {}
        }

        if (!acc[providerName][cloud.geo_region]) {
            acc[providerName][cloud.geo_region] = [];
        }

        acc[providerName][cloud.geo_region].push(cloud)
        return acc;
    }, {} as ProviderToRegionMatrix);
}