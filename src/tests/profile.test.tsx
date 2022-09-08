import { isConstructorDeclaration } from "typescript";
import { getDistancesForRegionsWith, getMatrixOfSortedProviders, getProvidersToSortedRegionsMap, getRegionDistanceMatrix, ProviderTuple } from "../reducers/distanceMatrix";
import { getProvidersToRegionMatrix, ProviderToRegionMatrix } from "../reducers/providerToRegionMatrix";
import { Coordinates } from "../tools/geoWrappers";
import { CalcType } from "../types/apps";
import { getArrayOfStrings, populateValue } from "./tools";

describe('distance matrix performace', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    const coordinates: Coordinates = {
        latitude: 30,
        longitude: 30
    }

    const calcType: CalcType = 'Center';

    test('multiple provider, multiple region, multiple cloud', () => {

        const providerNames = getArrayOfStrings(100);
        const regionNames = getArrayOfStrings(100);

        const clouds = populateValue(value, 10000).map((cloud) => ({
            ...cloud,
            cloud_name: providerNames[Math.floor(Math.random() * (providerNames.length - 1))] + '-provider',
            geo_region: regionNames[Math.floor(Math.random() * (regionNames.length - 1))] + '-region',
            geo_latitude: Math.floor(Math.random() * 60),
            geo_longitude: Math.floor(Math.random() * 60)
        }));

        const startTime = performance.now()

        const matrix = getProvidersToRegionMatrix(clouds);
        const result = getRegionDistanceMatrix(matrix, coordinates, calcType);

        const endTime = performance.now()

        expect(result.size).not.toBe(0);
        expect(endTime - startTime).toBeLessThan(1000);
    });
});