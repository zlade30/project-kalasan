import { setCurrentAcount, setIsLogin, setShowAddTreeInfo } from '@/redux/reducers/app';
import { useAppSelector } from '@/redux/store';
import { EyeOutlined, LogoutOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const Actions = ({ handleReset }: { handleReset: VoidFunction }) => {
    const dispatch = useDispatch();
    const { currentAccount } = useAppSelector((state) => state.app);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleAddTree = () => {
        dispatch(setShowAddTreeInfo(true));
    };

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            setIsLoggingOut(false);
            dispatch(setCurrentAcount(undefined));
            localStorage.clear();
            dispatch(setIsLogin(false));
        }, 1500);
    };

    const handleLogin = () => {
        dispatch(setIsLogin(true));
    };

    return (
        <div className="p-[12px] bg-white absolute left-[12px] top-1/2 -translate-y-1/2 rounded-[12px]">
            <div className="w-full h-full flex flex-col gap-[10px]">
                {currentAccount && (
                    <Button onClick={handleAddTree} size="large" icon={<PlusOutlined />}>
                        Add Tree
                    </Button>
                )}
                <Button onClick={handleReset} size="large" icon={<EyeOutlined />}>
                    Reset View
                </Button>
                {!currentAccount && (
                    <Button onClick={handleLogin} size="large" icon={<LogoutOutlined />} loading={isLoggingOut}>
                        Login
                    </Button>
                )}
                {currentAccount && (
                    <Button onClick={handleLogout} size="large" icon={<LogoutOutlined />} loading={isLoggingOut}>
                        Logout
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Actions;
