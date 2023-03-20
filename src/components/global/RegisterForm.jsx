import { useState } from "react";
import { Form, Input, Button, message, Typography  } from "antd";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { redirect } from "react-router-dom";
import { authServiceUrl } from "../../config/config";

const RegisterForm = () => {
    const { Title } = Typography;
    const { Text, Link } = Typography;

    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();
    const onFinish = async (values) => {
        setIsLoading(true);
        try {
        const response = await axios.post(
            authServiceUrl+"/register",
            {
            username: values.username,
            email: values.email,
            password: values.password,
            role: "user"
            }
        );
        message.success(response.data.message);
        navigate("/login");
        } catch (error) {
        message.error(error.response.data.message);
        }
        setIsLoading(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            <div className="w-full h-screen flex flex-col items-center justify-center">
            <Title level={4}>Register</Title>
            <Form
                name="basic"
                labelCol={{
                span: 10,
                }}
                wrapperCol={{
                span: 26,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="w-100 p-5"
            >
                <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                    required: true,
                    message: "Please input your username!",
                    },
                ]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                    type: "email",
                    message: "Please enter a valid email address!",
                    },
                    {
                    required: true,
                    message: "Please input your email address!",
                    },
                ]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                    required: true,
                    message: "Please input your password!",
                    },
                    {
                    min: 8,
                    message: "Password must be at least 8 characters long!",
                    },
                    {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: "Password must only contain alphanumeric characters!",
                    },
                ]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item
                label="Confirm Password"
                name="confirm"
                dependencies={["password"]}
                rules={[
                    {
                    required: true,
                    message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                        }
                        return Promise.reject(
                        new Error("The two passwords do not match!")
                        );
                    },
                    }),
                ]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                >
                    Submit
                </Button>
                </Form.Item>
            </Form>
            <Link href="/login">
                Already have an account ? Login
            </Link>
            </div>
        </>
    );
};

export default RegisterForm;
