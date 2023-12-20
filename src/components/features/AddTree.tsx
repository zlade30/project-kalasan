import { db, storage } from '@/firebase';
import { fbUpdateArea } from '@/firebase-api/areas';
import { fbAddTree, fbUpdateTree } from '@/firebase-api/trees';
import { createTree, setSelectedPosition, setSelectedTree, updateArea, updateTree } from '@/redux/reducers/app';
import { useAppSelector } from '@/redux/store';
import { generateId } from '@/utils/helpers';
import { InboxOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import { Option } from 'antd/es/mentions';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { ChangeEvent, Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

const AddTree = ({ open, handleClose }: { open: boolean; handleClose: VoidFunction }) => {
    const dispatch = useDispatch();
    const { selectedBarangay, selectedPosition, selectedTree } = useAppSelector((state) => state.app);
    const isUpdate = selectedTree?.id;

    const [form] = Form.useForm<TreeProps>();

    const [treeData, setTreeData] = useState<TreeProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File>();

    const onFinish = async (values: TreeProps) => {
        setSubmitting(true);
        let result;
        let img = '';
        if (selectedPhoto) {
            const storageRef = ref(storage, `/trees/${generateId(20)}.png`);
            const uploadTask = await uploadBytes(storageRef, selectedPhoto, {
                contentType: 'image/png'
            });
            img = await getDownloadURL(uploadTask.ref);
        }

        const barangay = selectedBarangay || values.barangay;
        const q = await getDocs(query(collection(db, 'areas'), where('name', '==', barangay)));
        const area: any = q.docs.map((item) => ({ id: item.id, ...item.data() }));

        if (isUpdate) {
            result = await fbUpdateTree({
                ...values,
                id: selectedTree.id,
                path: selectedTree.path,
                image: img || values.image,
                dateAdded: selectedTree.dateAdded,
                dateUpdated: new Date().getTime()
            });
            dispatch(updateTree(result!));

            const trees = values.status === 'removed' ? (area[0].trees || 0) - 1 : values.status;
            await fbUpdateArea({
                id: area[0].id,
                trees,
                color: area[0].color,
                name: area[0].name,
                paths: area[0].paths
            });
            dispatch(
                updateArea({
                    id: area[0].id,
                    trees,
                    color: area[0].color,
                    name: area[0].name,
                    paths: area[0].paths
                })
            );
        } else {
            result = await fbAddTree({
                ...values,
                image: img,
                status: 'good-condition',
                path: selectedPosition,
                dateAdded: new Date().getTime()
            });

            await fbUpdateArea({
                id: area[0].id,
                trees: (area[0].trees || 0) + 1,
                color: area[0].color,
                name: area[0].name,
                paths: area[0].paths
            });
            dispatch(
                updateArea({
                    id: area[0].id,
                    trees: (area[0].trees || 0) + 1,
                    color: area[0].color,
                    name: area[0].name,
                    paths: area[0].paths
                })
            );
            dispatch(createTree(result!));
        }

        setSelectedPhoto(undefined);
        setSubmitting(false);
        dispatch(setSelectedTree(undefined));
        dispatch(setSelectedPosition({ lat: 0, lng: 0 }));
        handleClose();
    };

    const initialValues: TreeProps = {
        name: isUpdate ? selectedTree?.name : '',
        image: isUpdate ? selectedTree?.image : '',
        path: isUpdate ? selectedTree?.path : { lat: 0, lng: 0 },
        barangay: isUpdate ? selectedTree?.barangay! : selectedBarangay,
        status: isUpdate ? selectedTree?.status : 'good-condition'
    };

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setSelectedPhoto(info.file.originFileObj);
                setTreeData({ ...treeData!, image: url });
            });
        }
    };

    const onFinishFailed = (error: any) => {
        console.log(error);
    };

    const onHandleCancel = () => {
        if (submitting) return;
        else handleClose();
        setSelectedPhoto(undefined);
        dispatch(setSelectedTree(undefined));
        dispatch(setSelectedPosition({ lat: 0, lng: 0 }));
    };

    const onSelectStatus = (value: 'good-condition' | 'removed') => {
        form.setFieldsValue({ status: value });
    };

    const UploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Modal
            title={isUpdate ? 'Update Tree' : 'Add Tree'}
            open={open}
            footer={null}
            destroyOnClose
            onCancel={onHandleCancel}
        >
            <Form
                name="basic"
                initialValues={initialValues}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                className="w-full flex flex-col items-center justify-center"
            >
                <Form.Item<TreeProps>
                    className={selectedTree?.image ? 'w-full' : ''}
                    name="image"
                    rules={[{ required: true, message: 'Please select an image!' }]}
                >
                    <div className="w-full flex items-center justify-center">
                        <label className="w-full">
                            <input
                                type="file"
                                className="hidden"
                                style={{ visibility: 'hidden' }}
                                accept=".png, .jpg, .jpeg"
                                onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                                    if (evt.target.files) {
                                        const file = evt.target.files[0];
                                        const url = URL.createObjectURL(file);
                                        setSelectedPhoto(file);
                                        dispatch(setSelectedTree({ ...selectedTree!, image: url }));
                                    }
                                }}
                            />
                            <div className="w-full h-[300px] flex flex-col items-center justify-center rounded-[12px] cursor-pointer">
                                {selectedTree?.image ? (
                                    <Image src={selectedTree.image} fill alt="image" objectFit="contain" />
                                ) : (
                                    <Fragment>
                                        <InboxOutlined className="text-[50px]" />
                                        <p className="text-[14px] font-normal">Upload Tree Photo</p>
                                    </Fragment>
                                )}
                            </div>
                        </label>
                    </div>
                </Form.Item>
                <Form.Item<TreeProps>
                    className="w-full"
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input a tree name!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                {isUpdate && (
                    <Form.Item<TreeProps> className="w-full" name="status" label="Status">
                        <Select size="large" placeholder="Select Status" onChange={onSelectStatus} allowClear>
                            <Option value="good-condition">Good Condition</Option>
                            <Option value="removed">Removed</Option>
                        </Select>
                    </Form.Item>
                )}
                <Form.Item<TreeProps> className="w-full" label="Barangay" name="barangay">
                    <Input size="large" disabled />
                </Form.Item>
                <Button size="large" htmlType="submit" loading={submitting}>
                    {submitting ? 'Submitting' : 'Submit'}
                </Button>
            </Form>
        </Modal>
    );
};

export default AddTree;
