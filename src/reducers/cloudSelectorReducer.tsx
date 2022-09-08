import { State } from "../components/CloudSelector";
import { Cloud } from "../types/apps";
import { getSortedClouds } from "./cloudsLists";
import { getRegionDistanceMatrix } from "./distanceMatrix";
import { extractRegions, extractProviders } from "./helpers";
import { getProvidersToRegionMatrix } from "./providerToRegionMatrix";

type Action = { type: 'setProvider' | 'setRegion' | 'setCloud' | 'reset', payload: any };

const setProvider = (state: State, action: Action) => {
    const { provider: newProvider, coordinates } = action.payload;
    const regions = extractRegions(state.distances, newProvider);
    const currentRegion = regions.includes(state.currentRegion) ? state.currentRegion : regions[0];
    const serverClouds = getSortedClouds(state.matrix, newProvider, currentRegion, coordinates);
    state.matrix[newProvider][currentRegion] = serverClouds;

    return {
        ...state,
        currentProvider: newProvider,
        regions,
        currentRegion,
        serverClouds
    }
}

const setRegion = (state: State, action: Action) => {
    const { region: newRegion, coordinates } = action.payload;
    const serverClouds = getSortedClouds(state.matrix, state.currentProvider, newRegion, coordinates);
    state.matrix[state.currentProvider][newRegion] = serverClouds;

    return {
        ...state,
        currentRegion: newRegion,
        serverClouds
    }
}

export const init = (clouds: Cloud[]) => (state: State) => {
    const matrix = getProvidersToRegionMatrix(clouds);

    return {
        ...state,
        matrix,
    }
}

const reset = (state: State, action: Action) => {
    const { coordinates, calcType } = action.payload;

    const distances = getRegionDistanceMatrix(state.matrix, coordinates, calcType);

    const providers = extractProviders(distances);
    const currentProvider = providers[0];
    const regions = extractRegions(distances, currentProvider);
    const currentRegion = regions[0];
    const serverClouds = getSortedClouds(state.matrix, currentProvider, currentRegion, coordinates);
    state.matrix[currentProvider][currentRegion] = serverClouds;

    return {
        ...state,
        distances,
        providers,
        currentProvider,
        regions,
        currentRegion,
        serverClouds,
    }
}

export const cloudSelectorReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setProvider': return setProvider(state, action);
        case 'setRegion': return setRegion(state, action);
        case 'setCloud': return { ...state, currentCloud: action.payload };
        case 'reset': return reset(state, action)
        default:
            throw new Error();
    }
}