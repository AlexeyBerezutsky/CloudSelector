import { getSortedClouds } from "../reducers/cloudsLists";
import { ProviderToRegionMatrix } from "../reducers/providerToRegionMatrix";
import { Coordinates } from "../tools/geoWrappers";
import { Cloud } from "../types/apps";
import { populateValue, shuffle } from "./tools";

describe('getSortedClouds - get sorted list of clouds by provider/region names', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    const coordinates: Coordinates = {
        latitude: 1,
        longitude: 1
    }

    test('throw if non correct provider name', () => {
        expect(() => {
            getSortedClouds({}, 'test', '', coordinates);
        }).toThrow()
    });

    test('throw if non correct region name', () => {
        expect(() => {
            getSortedClouds({ 'test': { 'testRegion': [] } }, 'test', 'nonCorrectName', coordinates);
        }).toThrow()
    });

    test('accep empty array of clouds', () => {
        const matrix: ProviderToRegionMatrix = { 'test': { 'testRegion': [] } };
        const result = getSortedClouds(matrix, 'test', 'testRegion', coordinates);

        expect(result.length).toBe(0);
    });

    test('sort clouds by distance', () => {
        const clouds = populateValue<Cloud>(value, 10).map((cloud, ix) => ({ ...cloud, cloud_description: String(ix), geo_latitude: (100 - ix), geo_longitude: (100 - ix) }))

        const matrix: ProviderToRegionMatrix = { 'test': { 'testRegion': clouds } };
        const result = getSortedClouds(matrix, 'test', 'testRegion', coordinates);

        expect(result.length).toBe(10);
        expect(result.map(item => item.cloud_description)).toStrictEqual(Array.from(Array(10).keys()).map(String));
    });

    test('does not depend on initial order', () => {
        const clouds = populateValue<Cloud>(value, 10).map((cloud, ix) => ({ ...cloud, cloud_description: String(ix), geo_latitude: (100 - ix), geo_longitude: (100 - ix) }))
        const matrix: ProviderToRegionMatrix = { 'test': { 'testRegion': clouds } };
        const result = getSortedClouds(matrix, 'test', 'testRegion', coordinates);

        const shuffleClouds = shuffle(clouds);
        const shuffleMatrix: ProviderToRegionMatrix = { 'test': { 'testRegion': shuffleClouds } };
        const shuffleResult = getSortedClouds(shuffleMatrix, 'test', 'testRegion', coordinates);

        expect(result.length).toBe(10);
        expect(shuffleResult.length).toBe(10);
        expect(result.map(item => item.cloud_description)).toStrictEqual(shuffleResult.map(item => item.cloud_description));
    });
});