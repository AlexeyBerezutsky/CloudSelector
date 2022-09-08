import { Coordinates, distanceToPont } from "../tools/geoWrappers";
import { Cloud } from "../types/apps";
import { ProviderToRegionMatrix } from "./providerToRegionMatrix";

const sortByCloudDistance = (getDistance: (coordinates: Coordinates) => number) => (left: Cloud, right: Cloud): number => {
    return getDistance({ latitude: left.geo_latitude, longitude: left.geo_longitude }) - getDistance({ latitude: right.geo_latitude, longitude: right.geo_longitude });
}

export const getSortedClouds = (matrix: ProviderToRegionMatrix, providerName: string, regionName: string, coordinates: Coordinates) => {
    const getDistance = distanceToPont(coordinates);

    if (!matrix[providerName]) {
        throw new Error(`There is no provider with name ${providerName}`);
    }

    if (!matrix[providerName][regionName]) {
        throw new Error(`There is no region with name ${regionName} for provider ${providerName}`);
    }

    const cloudsToSort = [...matrix[providerName][regionName]];

    cloudsToSort.sort(sortByCloudDistance(getDistance));

    return cloudsToSort;
};