import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";
import { Space, Table, Tag } from "antd";
import { orderServiceUrl, productServiceUrl } from "../../config/config";

export default function DetailOrderForm({
  onSubmit,
  formButton,
  form,
  selectedOrder,
}) {
  const [orderState, setOrderState] = useState();
  const [products, setProducts] = useState([]);
  const axios = useAxiosPrivate();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${orderServiceUrl}/orderstates`);
      setOrderState(res.data);
    })();

    for (let i = 0; i < selectedOrder.orderDetails.length; i++) {
      (async () => {
        let singleProd = await axios.get(
          `${productServiceUrl}/${selectedOrder.orderDetails[i].product_id}`
        );

        let finalObj = {
          ...singleProd.data.data[0].product,
          quantity: selectedOrder.orderDetails[i].quantity,
          key: i,
        };

        setProducts((prev) => [...prev, finalObj]);
      })();
    }
  }, []);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
    },
  ];

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
        <Form.Item label="Order Id" name="order_id">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Order State" name="order_state">
          <Select placeholder="Select product category">
            {orderState?.map((e) => (
              <Select.Option
                key={e.order_state_id + e.order_state_name}
                value={e.order_state_id}
              >
                {e.order_state_name
                  .split("_")
                  .map((e) => e.toLowerCase())
                  .map((e) => e[0].toUpperCase() + e.slice(1))
                  .join(" ")}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Total Price" name="price">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Date Created" name="date_created">
          <DatePicker disabled />
        </Form.Item>

        <Form.Item label="User" name="user">
          <Input disabled />
        </Form.Item>

        {products && (
          <Table
            className="w-full"
            columns={columns}
            dataSource={products}
            pagination={false}
          />
        )}

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
