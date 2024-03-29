import { db } from '@/firebase';
import { treeIcon } from '@/public/images';
import { setAreas, setReportData, setSelectedPolygon } from '@/redux/reducers/app';
import { useAppSelector } from '@/redux/store';
import { printDate } from '@/utils/helpers';
import { ArrowLeftOutlined, BackwardOutlined, CheckOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';
import { TreesReport } from '.';

const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const Dashboard = ({ barangays }: { barangays: { value: string; label: string }[] }) => {
    const treesRef = useRef();
    const dispatch = useDispatch();
    const { areas, selectedPolygon, currentAccount } = useAppSelector((state) => state.app);
    const [list, setList] = useState<AreaProps[]>([]);
    const [treeList, setTreeList] = useState<TreeProps[]>([]);

    const handleTotal = (item: AreaProps[]) => {
        const total = item.reduce((accumulator, currentObject) => {
            return accumulator + (currentObject.trees || 0);
        }, 0);
        return total;
    };

    const memoizedHandleTotal = useMemo(() => handleTotal, [list]);

    const handleSelectedBarangay = (value: string) => {
        const update = areas.filter((item) => item.name === value);
        setList(update);
    };

    const tallyValuesByProperty = (arr: any, property: any) => {
        const counts: any = {};

        arr.forEach((item: any) => {
            const key = item[property];

            if (key in counts) {
                counts[key]++;
            } else {
                counts[key] = 1;
            }
        });

        return counts;
    };

    useEffect(() => {
        setList(areas);
    }, [areas]);

    useEffect(() => {
        const load = async () => {
            const list = await getDocs(query(collection(db, 'trees'), where('barangay', '==', selectedPolygon?.name)));
            const trees: any = list.docs.map((item) => ({ id: item.id, ...item.data() }));
            setTreeList(trees.sort((a: any, b: any) => a.key - b.key));
            dispatch(
                setReportData({
                    area: selectedPolygon!,
                    trees
                })
            );
        };
        if (selectedPolygon) {
            load();
        }
    }, [selectedPolygon]);

    return (
        <div className="w-[400px] h-full p-[12px] bg-white absolute right-0 top-1/2 -translate-y-1/2 rounded-[12px]">
            <TreesReport ref={treesRef} />
            <div className="w-full h-full flex flex-col items-center gap-[10px]">
                {!selectedPolygon ? (
                    <p className="w-full font-medium text-[14px]">Filter Barangay</p>
                ) : (
                    <div className="w-full">
                        <ArrowLeftOutlined
                            onClick={() => {
                                dispatch(setSelectedPolygon(undefined));
                                setList(areas);
                            }}
                        />
                    </div>
                )}
                {!selectedPolygon ? (
                    <Select
                        showSearch
                        size="large"
                        className="w-full"
                        placeholder="Filter Barangay"
                        optionFilterProp="children"
                        options={barangays}
                        filterOption={filterOption}
                        onSelect={handleSelectedBarangay}
                        allowClear
                        onClear={() => setList(areas)}
                    />
                ) : (
                    <p className="w-full text-[20px] font-medium">{`Barangay ${selectedPolygon.name}`}</p>
                )}
                <thead className="bg-slate-100 w-full">
                    <tr className="flex items-center justify-between">
                        {selectedPolygon ? (
                            <th align="left" className="p-2 flex items-center gap-[8px]">
                                <p className="font-medium">#</p>
                                <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                                <p className="font-medium">Trees</p>
                            </th>
                        ) : (
                            <th align="left" className="font-medium p-2">
                                Barangay
                            </th>
                        )}
                        {!selectedPolygon ? (
                            <th align="right" className="p-2">
                                <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                            </th>
                        ) : (
                            <th align="right" className="font-medium p-2">
                                Status
                            </th>
                        )}
                    </tr>
                </thead>
                <div className="w-full h-[400px] overflow-y-auto">
                    <table className="w-full table-auto text-[14px]">
                        {!selectedPolygon ? (
                            <tbody>
                                {list.map((area) => (
                                    <tr
                                        key={area.id}
                                        className="border-b border-slate-400 cursor-pointer hover:bg-slate-100"
                                        onClick={() => dispatch(setSelectedPolygon(area))}
                                    >
                                        <td className="p-2" align="left">
                                            <p>{area.name}</p>
                                        </td>
                                        <td className="p-2" align="right">
                                            {area.trees || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                {treeList.map((tree) => (
                                    <tr key={tree.id} className="border-b border-slate-400">
                                        <td className="p-2 flex items-center gap-[40px]" align="left">
                                            <p>{tree.key}</p>
                                            <p>{tree.name}</p>
                                        </td>
                                        <td
                                            className={`p-2 ${
                                                tree.status === 'removed' ? 'text-red-800' : 'text-green-800'
                                            }`}
                                            align="right"
                                        >
                                            {tree.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
                {!selectedPolygon && <p>{`Total Barangay: ${barangays.length}`}</p>}
                {selectedPolygon && (
                    <Fragment>
                        <thead className="bg-slate-100 w-full mt-[20px]">
                            <tr className="flex items-center justify-between">
                                <th align="left" className="font-medium p-2">
                                    Summary
                                </th>
                                <th align="right" className="p-2">
                                    <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                                </th>
                            </tr>
                        </thead>
                        <div className="w-full h-[400px] overflow-y-auto">
                            <table className="w-full table-auto text-[14px]">
                                <tbody>
                                    {Object.entries(tallyValuesByProperty(treeList, 'name')).map(([key, value]) => (
                                        <tr key={key} className="border-b border-slate-400">
                                            <td className="p-2" align="left">
                                                {key}
                                            </td>
                                            <td className="p-2" align="right">
                                                {String(value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Fragment>
                )}
                <div className="w-[200px] flex items-center justify-center py-[20px] border-b border-slate-400">
                    <Image className="w-[100px] h-[100px]" src={treeIcon} alt="tree-icon" />
                    <p className="text-[40px] font-bold text-green-500">
                        {!selectedPolygon ? memoizedHandleTotal(list) : treeList.length}
                    </p>
                </div>
                <p className="w-[150px] text-center text-[14px]">{`as of Today ${printDate()}`}</p>
                {selectedPolygon && currentAccount && (
                    <ReactToPrint
                        trigger={() => (
                            <Button size="large" className="w-[200px] mt-[100px]" icon={<PrinterOutlined />}>
                                Print
                            </Button>
                        )}
                        content={() => treesRef.current!}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
