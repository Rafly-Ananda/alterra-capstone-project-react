import React from "react";
import { Modal } from "antd";
import AddProductForm from "./AddProductForm";

export default function AddProductModal({
  isModalOpen,
  handleOk,
  handleCancel,
  isLoading,
  onSubmit,
  fileList,
  setFileList,
  formButton,
  form,
}) {
  return (
    <Modal
      centered
      title="Add new product"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Submit"
      bodyStyle={{
        paddingTop: "2em",
      }}
    >
      <AddProductForm
        onSubmit={onSubmit}
        fileList={fileList}
        setFileList={setFileList}
        formButton={formButton}
        form={form}
      />
    </Modal>
  );
}
