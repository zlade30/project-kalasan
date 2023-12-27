import { setCurrentAcount, setIsLogin } from '@/redux/reducers/app';
import { account } from '@/utils/helpers';
import { Alert, Button, Form, Input } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const Login = () => {
    const initialValues: AccountProps = {
        username: '',
        password: ''
    };
    const dispatch = useDispatch();
    const [submitting, setSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);

    const onFinish = (values: AccountProps) => {
        setSubmitting(true);
        setTimeout(() => {
            if (values.username === account.username && values.password === account.password) {
                setSubmitting(false);
                dispatch(setCurrentAcount(account));
                localStorage.setItem('login', 'true');
                dispatch(setIsLogin(false));
            } else {
                setSubmitting(false);
                setIsError(true);
            }
        }, 1500);
    };

    return (
        <div className="w-[400px] h-full p-[12px] bg-white absolute right-0 top-1/2 -translate-y-1/2 rounded-[12px] py-[100px]">
            <p className="w-full font-bold text-[20px] text-center">Login</p>
            {isError && <Alert className="my-[20px]" message="Account does not exist" type="error" />}
            <Form
                name="basic"
                initialValues={initialValues}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="w-full flex flex-col items-center justify-center"
            >
                <Form.Item<AccountProps>
                    className="w-full"
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input a username!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item<AccountProps>
                    className="w-full"
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input a password!' }]}
                >
                    <Password size="large" />
                </Form.Item>
                <Button size="large" htmlType="submit" loading={submitting}>
                    {submitting ? 'Logging in...' : 'Login'}
                </Button>
            </Form>
        </div>
    );
};

export default Login;
