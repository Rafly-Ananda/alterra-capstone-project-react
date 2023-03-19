import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authServiceUrl } from "../../config/config";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";

import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "../../redux/slice/usersSlice";

export default function LoginForm() {
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    dispatch(loginStart());
    try {
      const res = await axios.post(`${authServiceUrl}/login`, values);
      dispatch(loginSuccess(res.data.data[0]));
      message.success("You are logged in");
      navigate("/");
    } catch (e) {
      dispatch(loginFailure());
      message.error("Login failed");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (user.isLoggedIn) navigate("/");
  }, [user]);

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
          <Button
            type="primary"
            htmlType="submit"
            loading={user.isUsersFetching}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
