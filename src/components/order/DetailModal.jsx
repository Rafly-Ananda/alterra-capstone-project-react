import { Modal } from "antd";
import DetailOrderForm from "./DetailOrderForm";

export default function DetailModal({
  isModalOpen,
  handleOk,
  handleCancel,
  isLoading,
  onSubmit,
  formButton,
  form,
  selectedOrder,
}) {
  return (
    <Modal
      centered
      title="Order detail"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Submit"
      bodyStyle={{
        paddingTop: "2em",
      }}
    >
      <DetailOrderForm
        onSubmit={onSubmit}
        formButton={formButton}
        form={form}
        selectedOrder={selectedOrder}
      />
    </Modal>
  );
}
