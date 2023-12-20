import { db, storage } from '@/firebase';
import { fbUpdateArea } from '@/firebase-api/areas';
import { fbAddTree, fbUpdateTree } from '@/firebase-api/trees';
import { createTree, updateArea, updateTree } from '@/redux/reducers/app';
import { useAppSelector } from '@/redux/store';
import { generateId } from '@/utils/helpers';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const AddTree = ({ open, handleClose }: { open: boolean; handleClose: VoidFunction }) => {
    const dispatch = useDispatch();
    const { selectedBarangay, selectedPosition, selectedTree } = useAppSelector((state) => state.app);
    const isUpdate = selectedTree?.id;

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
        if (isUpdate) {
            result = await fbUpdateTree({
                ...values,
                image: img || values.image,
                dateUpdated: new Date().getTime()
            });
            dispatch(updateTree(result!));
        } else {
            result = await fbAddTree({
                ...values,
                image: img,
                path: selectedPosition,
                dateAdded: new Date().getTime()
            });
            const barangay = selectedBarangay || values.barangay;
            const q = await getDocs(query(collection(db, 'areas'), where('name', '==', barangay)));
            const area: any = q.docs.map((item) => ({ id: item.id, ...item.data() }));

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
        handleClose();
    };

    const initialValues: TreeProps = {
        name: '',
        image: '',
        path: { lat: 0, lng: 0 },
        barangay: selectedBarangay || treeData?.barangay!,
        status: 'good-condition'
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
    };

    const UploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Modal title="Add Tree" open={open} footer={null} destroyOnClose onCancel={onHandleCancel}>
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
                    className={treeData?.image ? 'w-full' : ''}
                    name="image"
                    rules={[{ required: true, message: 'Please select an image!' }]}
                >
                    {!treeData?.image ? (
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {UploadButton}
                        </Upload>
                    ) : (
                        <div className="w-full h-[300px] relative bg-black">
                            <Image src={treeData.image} fill objectFit="contain" alt="image" />
                        </div>
                    )}
                </Form.Item>
                <Form.Item<TreeProps>
                    className="w-full"
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input a tree name!' }]}
                >
                    <Input size="large" />
                </Form.Item>
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
