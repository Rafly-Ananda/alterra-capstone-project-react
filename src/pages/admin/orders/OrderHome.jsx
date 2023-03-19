import React, { useEffect, useState, useRef } from "react";
import { Space, Table } from "antd";
import { Button, Form } from "antd";
import moment from "moment/moment";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import axios from "axios";
import { message, Popconfirm } from "antd";
import DetailModal from "../../../components/order/DetailModal";
import { orderServiceUrl, userServiceUrl } from "../../../config/config";

export default function OrderHome() {
  const [form] = Form.useForm();
  const [orders, setOrders] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
  const formButton = useRef(null);
  const axios = useAxiosPrivate();

  const handleOk = () => {
    formButton.current.click();
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedOrder(false);
    setIsModalOpen(false);
  };

  const cancelDecline = (e) => {
    message.error("Order cancellation canceled");
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(orderServiceUrl);
      setOrders(
        res.data.data.map((e) => ({
          key: e.order_id,
          user: e.userId,
          price: e.total,
          status: e.status.orderState.order_state_name,
          date_created: moment(e.createAt).format("MM/DD/YY"),
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    const newOrderState = { order_state: values.order_state };

    try {
      await axios.put(
        `${orderServiceUrl}/update-state-order/${selectedOrder.order_id}`,
        newOrderState
      );

      message.success("Order updated");
      await fetchOrder();
      handleCancel();
    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const orderCancellation = async (order) => {
    try {
      await axios.put(`${orderServiceUrl}/cancel-state-order/${order.key}`);
      await fetchOrder();
      message.success("Order cancelled");
    } catch (e) {
      console.log(e.message);
    }
  };

  const onOrderDetail = async (order) => {
    try {
      const res = await axios.get(`${orderServiceUrl}/${order.key}`);
      const orderDetail = res.data.data[0];
      const userRes = await axios.get(
        `${userServiceUrl}/${orderDetail.userId}`
      );
      setSelectedOrder(orderDetail);
      form.setFieldsValue({
        order_id: orderDetail.order_id,
        order_state: orderDetail.status.orderState.order_state_id,
        price: orderDetail.total,
        date_created: moment(orderDetail.createAt),
        user: userRes.data.data[0].username,
      });

      setIsModalOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <p>
          {record.status
            .split("_")
            .map((e) => e.toLowerCase())
            .map((e) => e[0].toUpperCase() + e.slice(1))
            .join(" ")}
        </p>
      ),
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => onOrderDetail(record)}
          >
            Detail
          </Button>

          <Popconfirm
            title="Decline the order"
            description="Are you sure to decline this order?"
            onConfirm={() => orderCancellation(record)}
            onCancel={cancelDecline}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Decline</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-10 overflow-x-scroll font-inter">
      <DetailModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isLoading={isLoading}
        onSubmit={onSubmit}
        formButton={formButton}
        form={form}
        selectedOrder={selectedOrder}
      />

      <div className="w-full h-full flex flex-col gap-10 justify-start items-center">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Orders</h1>
        </div>
        <Table className="w-full" columns={columns} dataSource={orders} />
      </div>
    </div>
  );
}
