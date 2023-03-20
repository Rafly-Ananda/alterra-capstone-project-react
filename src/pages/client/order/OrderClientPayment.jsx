import React, { Component } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState,useEffect } from "react";
import { UploadOutlined,LeftOutlined,PlusOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Components
import { Form,Spin,Alert,Button,notification,Upload,Card } from 'antd';

//inital variable
import {
    orderServiceUrl,
} from "../../../config/config";

export default function OrderClientPayment() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
    const [fileList, setFileList] = useState(null);

    const { id } = useParams();

    const axios = useAxiosPrivate();

    let navigate = useNavigate();
	const sendNotification = (type,message,description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};
    const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    };

    const onSubmit = async () => {
        console.log(fileList)
        setIsLoading(true);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("images", file.originFileObj);
        });
        console.log(formData);
        try {
            await axios.put(orderServiceUrl + "/payment/" + id, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            sendNotification('success', 'Upload Success', 'Payment receipt has been uploaded')
            navigate("/orders/" + id)
        } catch (e) {
            console.log(e);
            sendNotification('error', 'Upload Failed', 'Failed uploading payment receipt :' + e.message)
        } finally {
            setIsLoading(false);
        }
    };


return (
	<>
		<div className="p-8">
			<div className="grid grid-cols-1 lg:grid-cols-4">
				<div className="col-span-4">
					<h1 className="text-4xl font-semibold py-5">Confirm Payment</h1>
					<h5 className="text-sm text-gray-600 py-3"></h5>
				</div>
			</div>
			<div className="overflow-y-auto max-h-full p-2">
            <Button href={"/orders/"+id} type="primary my-4">
                <LeftOutlined type="left" />Back to Order Detail
            </Button>
            <Card className="p-5 shadow rounded-md">
                <Form>
                <Form.Item label="Upload" valuePropName="fileList">
                <Upload
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    fileList={fileList}
                    listType="picture-card"
                    >
                    {fileList ? null : (
                        <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                    </Upload>
                </Form.Item>
                    <Button
                        type="submit"
                        size="large"
                        className="mt-6  items-center justify-center rounded-md border bg-green-600 py-3 px-8 font-medium text-white hover:bg-indigo-700"
                        onClick={onSubmit}
                    >
                        Upload Payment Receipt
                    </Button>
                </Form>
            </Card>
			</div>
		</div>
	</>
	);
}
