import React from "react";
import { Modal } from "antd";
import AddCategoryForm from "./AddCategoryForm";

export default function AddCategoryModal({
  isModalOpen,
  handleOk,
  handleCancel,
  isLoading,
  onSubmit,
  formButton,
  form,
}) {
  return (
    <Modal
      centered
      title="Add new category"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Submit"
      bodyStyle={{
        paddingTop: "2em",
      }}
    >
      <AddCategoryForm
        onSubmit={onSubmit}
        formButton={formButton}
        form={form}
      />
    </Modal>
  );
}
