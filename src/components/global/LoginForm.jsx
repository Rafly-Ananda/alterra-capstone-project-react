import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authServiceUrl } from "../../config/config";

// import { loginStart, loginFailure, loginSuccess } from "../../redux/slice/usersSlice";
// dispatch(loginSuccess(res.data.data[0]));

export default function LoginForm() {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/auth/login`,
        values
      );
      console.log(res.data.data[0]);
    } catch (e) {}
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-96 p-5"
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
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
