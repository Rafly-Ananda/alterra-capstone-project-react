import React from "react";
import { Modal } from "antd";
import EditUserForm from "./EditUserForm";

export default function EditUserModal({
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
      title="Add new user"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Submit"
      bodyStyle={{
        paddingTop: "2em",
      }}
    >
      <EditUserForm onSubmit={onSubmit} formButton={formButton} form={form} />
    </Modal>
  );
}
