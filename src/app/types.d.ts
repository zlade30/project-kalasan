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
        key?: number;
        name: string;
        path: google.maps.LatLng | google.maps.LatLngLiteral;
        status: 'removed' | 'good-condition';
        barangay: string;
        dateAdded?: number;
        dateUpdated?: number;
        image: string;
        showInfo?: boolean;
    }

    type ReportProps = {
        area: AreaProps,
        trees: TreesProps[]
    }

    type AccountProps = {
        username: string;
        password: string;
    }
}
