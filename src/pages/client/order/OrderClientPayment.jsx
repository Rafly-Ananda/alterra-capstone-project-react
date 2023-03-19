import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { useState,useEffect } from "react";
import { UploadOutlined } from '@ant-design/icons';

// Components
import { Form,Spin,Alert,Button,notification,Upload } from 'antd';
import StatusBadge from "../../../components/global/StatusBadge";

//inital variable
import {
    productServiceUrl,
    orderServiceUrl,
    s3ServiceUrl,
} from "../../../config/config";

export default function OrderClientPayment() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const sendNotification = (type,message,description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};

    const onSubmit = async () => {
        setIsLoading(true);
        if (fileList.length > 0) {
            fileList.forEach((e) => {
                formData.append("images", e.originFileObj);
            });
        } else {
            formData.append("images", []);
        }
        try {
            await axios.post(orderServiceUrl+"/payment/1", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchProduct();
            handleCancel();
        } catch (e) {
            console.log(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            }
        },
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
            <Form>
                <Upload>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <div className="hidden">
                <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                >
                    Submit
                </Button>
                </div>
            </Form>
			</div>
		</div>
	</>
	);
}
