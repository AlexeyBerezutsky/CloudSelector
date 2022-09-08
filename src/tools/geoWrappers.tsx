import { findNearest, getCenter, getCenterOfBounds, getDistance } from "geolib"
import { GeolibInputCoordinates } from "geolib/es/types";

export type Coordinates = GeolibInputCoordinates;

export const distanceToCenter = (point: Coordinates) => (field: Coordinates[]) => {
    const center = getCenter(field);

    return getDistance(point, center as Coordinates);
}

export const distanceToNearest = (point: Coordinates) => (field: Coordinates[]) => {
    const center = findNearest(point, field);

    return getDistance(point, center);
}

export const distanceToPont = (point: Coordinates) => (point2: Coordinates) => {
    return getDistance(point, point2);
}

