import React from "react";
import { Button, Form, Input } from "antd";

export default function AddCategoryForm({ onSubmit, formButton, form }) {
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
        <Form.Item label="Name" name="name">
          <Input placeholder="Input Category name" />
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
