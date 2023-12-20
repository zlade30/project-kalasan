import { ReactElement } from "react";

export {};

declare global {
    /**
     * Now declare things that go in the global namespace,
     * or augment existing declarations in the global namespace.
     */
    type AreaProps = {
        id?: string;
        name: string;
        paths: { lat: number, lng: number }[]
        color: string;
        trees?: numbers;
        dateAdded?: number;
    }

    type TreeProps = {
        id?: string;
        name: string;
        path: google.maps.LatLng | google.maps.LatLngLiteral;
        status: 'cut' | 'good-condition';
        barangay: string;
        dateAdded?: number;
        dateUpdated?: number;
        image: string;
        showInfo?: boolean;
    }
}
