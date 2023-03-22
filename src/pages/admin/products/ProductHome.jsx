import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import React, { useEffect, useState, useRef } from "react";
import { Button, Form } from "antd";
import AddProductModal from "../../../components/product/AddProductModal";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import { Space, Table, Tag } from "antd";
import { message, Popconfirm } from "antd";
import {
  productServiceUrl,
  categoryServiceUrl,
  s3ServiceUrl,
} from "../../../config/config";
import { NumericFormat } from "react-number-format";

export default function ProductHome() {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const formButton = useRef(null);
  const axios = useAxiosPrivate();

  const handleOk = () => {
    formButton.current.click();
  };

  const handleCancel = () => {
    setFileList([]);
    form.resetFields();
    setSelectedProduct(null);
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const cancelDelete = (e) => {
    message.error("Product deletion canceled");
  };

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(productServiceUrl);
      const categoriesRes = await axios.get(categoryServiceUrl);

      setProducts(
        res.data.data.map((e) => ({
          key: e.product_id,
          name: e.name,
          category: categoriesRes.data.data.find(
            (f) => f.p_category_id === e.category_id
          ).name,
          price: e.price,
          stock: e.stock,
          date_added: moment(e.createAt).format("MM/DD/YY"),
        }))
      );
      setIsLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    const newProduct = { ...values };

    if (fileList.length > 0) {
      fileList.forEach((e) => {
        formData.append("images", e.originFileObj);
      });
    } else {
      formData.append("images", []);
    }

    try {
      if (isEdit) {
        newProduct["images"] = fileList
          .filter((e) => selectedProduct.product.images.includes(e.name))
          .map((e) => e.name);

        formData.append("product", JSON.stringify(newProduct));

        await axios.put(
          `${productServiceUrl}/image/${selectedProduct.product.product_id}`,
          formData
        );

        message.success("Product edited");
      } else {
        formData.append("product", JSON.stringify(newProduct));

        await axios.post(productServiceUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Product created");
      }

      await fetchProduct();
      handleCancel();
    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (product) => {
    try {
      await axios.delete(`${productServiceUrl}/${product.key}`);
      message.success("Product deleted");
      setProducts((prev) => prev.filter((e) => e.key !== product.key));
    } catch (e) {
      console.log(e.message);
    }
  };

  const onEditProduct = async (product) => {
    setIsEdit(true);
    let imageRequests = [];
    let imageUrls = [];
    let imageKey = [];
    const res = await axios.get(`${productServiceUrl}/${product.key}`);
    const productDetail = res.data.data[0];
    setSelectedProduct(productDetail);

    // return error because i was trying to update the filelist here
    form.setFieldsValue({
      name: productDetail.product.name,
      description: productDetail.product.description,
      category_id: productDetail.category.p_category_id,
      price: productDetail.product.price,
      stock: productDetail.product.stock,
    });

    productDetail.product.images.forEach((e) => {
      imageRequests.push(axios.get(`${s3ServiceUrl}/${e}`));
      imageKey.push(e);
    });

    const imgRes = await Promise.all(imageRequests);
    imageUrls = imgRes.map((e, i) => ({
      uid: i,
      name: imageKey[i],
      status: "done",
      url: e.data.data[0],
    }));

    console.log(productDetail);

    setFileList(imageUrls);

    setIsModalOpen(true);
  };

  const openAddProduct = () => {
    setIsEdit(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record) => (
        <NumericFormat
          value={record.price}
          thousandSeparator="."
          decimalSeparator=","
          displayType="text"
          prefix={"Rp "}
        />
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Date Added",
      dataIndex: "date_added",
      key: "date_added",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => onEditProduct(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            onConfirm={() => deleteProduct(record)}
            onCancel={cancelDelete}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
            onClick={openAddProduct}
          >
            Add new product
          </Button>
        </div>
        <Table className="w-full" columns={columns} dataSource={products} />
      </div>
    </div>
  );
}
