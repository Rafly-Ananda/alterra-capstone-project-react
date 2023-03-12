import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Modal } from "antd";
import AddProductModal from "../../../components/product/AddProductModal";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { Link } from "react-router-dom";

const productServiceUrl = "http://localhost:8084/api/v1/products";

export default function ProductHome() {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const formButton = useRef(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formButton.current.click();
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(productServiceUrl);
      setProducts(res.data.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    const newProduct = { ...values };
    formData.append("product", JSON.stringify(newProduct));

    if (fileList.length > 0) {
      fileList.forEach((e) => {
        formData.append("images", e.originFileObj);
      });
    } else {
      formData.append("images", []);
    }

    try {
      await axios.post(productServiceUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProduct();
      setIsLoading(false);
      setIsModalOpen(false);
      form.resetFields();
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-10 overflow-x-scroll font-inter">
      <AddProductModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isLoading={isLoading}
        onSubmit={onSubmit}
        fileList={fileList}
        setFileList={setFileList}
        formButton={formButton}
        form={form}
      />
      <div className="w-full h-full flex flex-col gap-10 justify-start items-center">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Product Inventory</h1>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-[#5590ff]"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Add new product
          </Button>
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="grid grid-cols-8 p-2 shadow-md rounded-md bg-[#5590ff] font-semibold text-white">
            <div className="col-span-1">NO</div>
            <div className="col-span-2">NAME</div>
            <div className="col-span-2">CATEGORY</div>
            <div className="col-span-1">PRICE</div>
            <div className="col-span-1">STOCK</div>
            <div className="col-span-1">DATE ADDED</div>
          </div>

          {products.map((e, i) => (
            <Link
              to={`/admin/products/${e.product_id}`}
              key={e.name + i}
              className="no-underline"
            >
              <div className="grid grid-cols-8 p-2 py-4 shadow-md rounded-md font-medium text-[#797d85] hover:bg-[#f2f7ff] hover:cursor-pointer">
                <div className="col-span-1">{i + 1}</div>
                <div className="col-span-2">{e.name}</div>
                <div className="col-span-2">Processor</div>
                <div className="col-span-1">{e.price}</div>
                <div className="col-span-1">{e.stock}</div>
                <div className="col-span-1">
                  {moment(e.createAt).format("MM/DD/YY")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
