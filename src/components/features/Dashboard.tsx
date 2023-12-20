import { treeIcon } from '@/public/images';
import { useAppSelector } from '@/redux/store';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import Image from 'next/image';
import React, { useMemo } from 'react';

const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const Dashboard = ({ barangays }: { barangays: { value: string; label: string }[] }) => {
    const { areas } = useAppSelector((state) => state.app);

    const handleTotal = (item: AreaProps[]) => {
        const total = item.reduce((accumulator, currentObject) => {
            return accumulator + (currentObject.trees || 0);
        }, 0);
        return total;
    };

    const memoizedHandleTotal = useMemo(() => handleTotal, [areas]);

    return (
        <div className="w-[400px] h-full p-[12px] bg-white absolute right-0 top-1/2 -translate-y-1/2 rounded-[12px]">
            <div className="w-full h-full flex flex-col items-center gap-[10px]">
                <p className="w-full font-medium text-[14px]">Search Barangay</p>
                <Select
                    showSearch
                    size="large"
                    className="w-full"
                    placeholder="Search Barangay"
                    optionFilterProp="children"
                    options={barangays}
                    filterOption={filterOption}
                />
                {/* <div className="w-full flex items-center justify-center py-[20px]">
                    <Image className="w-[100px] h-[100px]" src={treeIcon} alt="tree-icon" />
                    <p className="text-[40px] font-bold text-green-500">20</p>
                </div>
                <div className="w-[200px]">
                    <div className="flex items-center text-[14px] text-green-700 gap-[10px]">
                        <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                        <p>10 - Good Condition</p>
                    </div>
                    <div className="flex items-center text-[14px] text-red-700 gap-[10px]">
                        <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                        <p>10 - Cut</p>
                    </div>
                </div> */}
                <table className="w-full table-auto text-[14px] my-2">
                    <thead className="bg-slate-100">
                        <tr>
                            <th align="left" className="font-medium p-2">
                                Barangay
                            </th>
                            <th align="right" className="p-2">
                                <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {areas.map((area) => (
                            <tr key={area.id} className="border-b border-slate-400">
                                <td className="p-2" align="left">
                                    {area.name}
                                </td>
                                <td className="p-2" align="right">
                                    {area.trees || 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="w-[200px] flex flex-col items-center justify-center py-[20px] border-b border-slate-400">
                    <Image className="w-[100px] h-[100px]" src={treeIcon} alt="tree-icon" />
                    <p className="text-[40px] font-bold text-green-500">{memoizedHandleTotal(areas)}</p>
                </div>
                <p className="w-[100px] text-center text-[14px]">as of Today 12/20/2023 10:10 AM</p>
            </div>
        </div>
    );
};

export default Dashboard;
