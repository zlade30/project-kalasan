'use client';

import { GoogleMap, InfoWindow, Libraries, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { fbAddArea, fbGetAreas } from '@/firebase-api/areas';
import { Actions, AddTree, Dashboard, Login } from '@/components/features';
import treeIcon from '@/public/images/tree.png';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
    setAreas,
    setCurrentAcount,
    setSelectedBarangay,
    setSelectedPosition,
    setSelectedTree,
    setShowAddTree,
    setShowAddTreeInfo,
    setTrees
} from '@/redux/reducers/app';
import { fbGetTrees } from '@/firebase-api/trees';
import Image from 'next/image';
import { account, formatDate } from '@/utils/helpers';
import { EditOutlined } from '@ant-design/icons';
import { cutTreeIcon } from '@/public/images';

const libraries: Libraries = ['drawing', 'places'];

const Page = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCsi0j44tq_VI_3WlhNjZn25l2j-azcj7s',
        libraries
    });
    const dispatch = useDispatch();
    const mapRef = useRef<GoogleMap>(null);
    const { areas, showAddTreeInfo, showAddTree, trees, selectedPosition, currentAccount } = useAppSelector(
        (state) => state.app
    );

    const [kisolonArea, setKisolonArea] = useState<AreaProps>();
    const [barangays, setBarangays] = useState<{ value: string; label: string }[]>();
    const [map, setMap] = useState<google.maps.Map | null>();

    const mapOptions: google.maps.MapOptions = {
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'landscape',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ],
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false
    };

    const center = {
        lat: 8.25089433379534,
        lng: 124.96775323302153
    };

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        getAreas(map);
        getTrees(map);
        setMap(map);
    }, []);

    const getAreas = async (map: google.maps.Map) => {
        const list = await fbGetAreas();
        const kisolon = list.find((area) => area.name === 'Kisolon');
        map.setZoom(12);
        setKisolonArea(kisolon);
        setBarangays(list.map((area) => ({ value: area.name, label: area.name })));
        dispatch(setAreas(list));
    };

    const getTrees = async (map: google.maps.Map) => {
        const list = await fbGetTrees();
        dispatch(setTrees(list));
    };

    const handleClickedArea = (area: AreaProps) => (event: google.maps.MapMouseEvent) => {
        if (showAddTreeInfo) {
            const clickedPaths = event.latLng;
            dispatch(setSelectedBarangay(area.name));
            dispatch(setSelectedPosition({ lat: clickedPaths!.lat(), lng: clickedPaths!.lng() }));
            dispatch(setShowAddTree(true));
            dispatch(setShowAddTreeInfo(false));
        }
    };

    const handleCloseWindow = (tree: TreeProps) => {
        const update = trees.map((item) => (item.id === tree.id ? { ...item, showInfo: false } : item));
        dispatch(setTrees(update));
    };

    const handleSelectedTree = (tree: TreeProps) => {
        const update = trees.map((item) => (item.id === tree.id ? { ...item, showInfo: true } : item));
        dispatch(setTrees(update));
    };

    const handleMapDrag = () => {
        const mapCenter = map?.getCenter();
        console.log({
            lat: mapCenter!.lat(),
            lng: mapCenter!.lng()
        });
    };

    useEffect(() => {
        console.log(localStorage.getItem('login') === 'true');
        if (localStorage.getItem('login') === 'true') {
            dispatch(setCurrentAcount(account));
        } else {
            dispatch(setCurrentAcount(undefined));
        }
    }, []);

    return isLoaded ? (
        <GoogleMap
            id="google-map-script"
            mapContainerClassName="w-full h-full"
            onLoad={onLoad}
            options={mapOptions}
            onDragEnd={handleMapDrag}
            center={center}
        >
            <AddTree open={showAddTree} handleClose={() => dispatch(setShowAddTree(false))} />
            <Polygon
                paths={kisolonArea?.paths}
                options={{
                    fillColor: kisolonArea?.color,
                    strokeOpacity: 0
                }}
            />
            {areas.map((area) => (
                <Polygon
                    key={area.id}
                    paths={area.paths}
                    options={{
                        fillColor: area.color,
                        strokeOpacity: showAddTreeInfo ? 1 : 0,
                        strokeColor: showAddTreeInfo ? area.color : ''
                    }}
                    onClick={handleClickedArea(area)}
                />
            ))}
            <Actions
                handleReset={() => {
                    map?.setCenter(center);
                    map?.setZoom(12);
                }}
            />
            {trees.map((tree) => (
                <Marker
                    key={tree.id}
                    position={tree.path}
                    icon={{
                        url: tree.status === 'removed' ? cutTreeIcon.src : treeIcon.src,
                        scaledSize:
                            tree.status === 'removed'
                                ? new window.google.maps.Size(30, 30)
                                : new window.google.maps.Size(35, 35)
                    }}
                    onClick={() => handleSelectedTree(tree)}
                >
                    {tree.showInfo && (
                        <InfoWindow position={tree.path} onCloseClick={() => handleCloseWindow(tree)}>
                            <div className="w-[400px] h-[300px]">
                                <div className="w-full h-[200px] bg-black relative">
                                    <Image src={tree.image} alt="image" fill objectFit="contain" />
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col gap-[5px] py-[10px]">
                                        <div className="flex items-center text-[14px] gap-[10px]">
                                            <p className="font-medium">Tree Name:</p>
                                            <p className="font-normal">{tree.name}</p>
                                        </div>
                                        <div className="flex items-center text-[14px] gap-[10px]">
                                            <p className="font-medium">Status:</p>
                                            <p className="font-normal">{tree.status}</p>
                                        </div>
                                        <div className="flex items-center text-[14px] gap-[10px]">
                                            <p className="font-medium">Date Planted:</p>
                                            <p className="font-normal">{formatDate(new Date(tree.dateAdded!))}</p>
                                        </div>
                                        <div className="flex items-center text-[14px] gap-[10px]">
                                            <p className="font-medium">Barangay:</p>
                                            <p className="font-normal">{tree.barangay}</p>
                                        </div>
                                    </div>
                                    {currentAccount && (
                                        <div>
                                            <Button
                                                onClick={() => {
                                                    dispatch(setSelectedTree(tree));
                                                    dispatch(setShowAddTree(true));
                                                }}
                                                size="middle"
                                                icon={<EditOutlined />}
                                            >
                                                Update Tree
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            ))}
            {selectedPosition && (
                <Marker
                    position={selectedPosition}
                    icon={{ url: treeIcon.src, scaledSize: new window.google.maps.Size(35, 35) }}
                />
            )}
            {showAddTreeInfo && (
                <Alert
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-[12px]"
                    message="Please click anywhere inside the Sumilao border to add a tree."
                />
            )}
            {!currentAccount ? <Login /> : <Dashboard barangays={barangays || []} />}
        </GoogleMap>
    ) : (
        <div className="w-full h-full flex items-center justify-center">
            <Spin size="large" />
        </div>
    );
};

export default Page;
