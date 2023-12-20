import { treeIcon } from '@/public/images';
import { useAppSelector } from '@/redux/store';
import { formatDate, printDate } from '@/utils/helpers';
import Image from 'next/image';
import React, { forwardRef, useRef } from 'react';

const TreesReport = forwardRef(({}, ref) => {
    const playersReportRef = useRef<HTMLDivElement>(null);
    const { reportData } = useAppSelector((state) => state.app);

    if (ref) {
        if (typeof ref === 'function') {
            ref(playersReportRef.current);
        } else {
            ref.current = playersReportRef.current;
        }
    }

    return (
        <div className="hidden">
            <div
                ref={playersReportRef}
                className="w-[800px] flex flex-col items-center h-full bg-white z-[100] p-[40px]"
            >
                <h1 className="text-[20px] font-bold">Monitoring and Evaluation</h1>
                <div className="w-full flex flex-col items-center justify-between text-[14px] py-[20px]">
                    <div className="w-full flex items-center gap-[10px]">
                        <p className="font-medium">Location of project: </p>
                        <p>{`${reportData?.area.name}, Sumilao, Bukidnon`}</p>
                    </div>
                    <div className="w-full flex items-center gap-[10px]">
                        <p className="font-medium">Implementing Agency: </p>
                        <p>MENRO</p>
                    </div>
                    <div className="w-full flex items-center gap-[10px]">
                        <p className="font-medium">Source of Fund: </p>
                        <p>LGU Sumilao</p>
                    </div>
                    <p className="w-full flex items-center gap-[10px]">
                        <p className="font-medium">Date:</p>
                        <p>{printDate()}</p>
                    </p>
                </div>
                <table className="w-full table-auto text-[14px] my-2">
                    <thead className="bg-slate-100">
                        <tr>
                            <th align="left" className="p-2 flex items-center gap-[8px]">
                                <Image className="w-[20px] h-[20px]" src={treeIcon} alt="tree-icon" />
                                <p className="font-medium">Trees</p>
                            </th>
                            <th align="right" className="font-medium p-2">
                                Status
                            </th>
                            <th align="right" className="font-medium p-2">
                                Date Planted
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData?.trees.map((tree) => (
                            <tr key={tree.id} className="border-b border-slate-400">
                                <td className="p-2" align="left">
                                    {tree.name}
                                </td>
                                <td
                                    className={`p-2 ${tree.status === 'removed' ? 'text-red-800' : 'text-green-800'}`}
                                    align="right"
                                >
                                    {tree.status}
                                </td>
                                <td className="p-2" align="right">
                                    {formatDate(new Date(tree.dateAdded!))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
TreesReport.displayName = 'TreesReport';

export default TreesReport;
