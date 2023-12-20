import { setShowAddTreeInfo } from '@/redux/reducers/app';
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

const Actions = () => {
    const dispatch = useDispatch();

    const handleAddTree = () => {
        dispatch(setShowAddTreeInfo(true));
    };

    return (
        <div className="p-[12px] bg-white absolute left-[12px] top-1/2 -translate-y-1/2 rounded-[12px]">
            <div className="w-full h-full flex flex-col gap-[10px]">
                <Button onClick={handleAddTree} size="large" icon={<PlusOutlined />}>
                    Add Tree
                </Button>
                <Button size="large" icon={<EyeOutlined />}>
                    Reset View
                </Button>
            </div>
        </div>
    );
};

export default Actions;
