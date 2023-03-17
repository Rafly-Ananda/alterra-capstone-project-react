import React from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";

const ROLES = ["user", "admin"];

export default function EditUserForm({ onSubmit, formButton, form }) {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="h-full w-full flex flex-col gap-10 items-center justify-center">
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        initialValues={{ remember: true }}
        onFinish={(e) => {
          onSubmit(e);
        }}
        onFinishFailed={onFinishFailed}
        className="w-full "
      >
        <Form.Item label="Username" name="username">
          <Input placeholder="Edit user username" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Edit user email" />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Select placeholder="Select user role">
            {ROLES.map((e, i) => (
              <Select.Option key={e + i} value={e}>
                {e}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="hidden">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            ref={formButton}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
