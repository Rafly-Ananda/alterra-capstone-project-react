import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Button, Form } from "antd";
import AddCategoryModal from "../../../components/category/AddCategoryModal";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { Space, Table, Tag } from "antd";
import { message, Popconfirm } from "antd";
import { categoryServiceUrl } from "../../../config/config";

export default function ProductCategories() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const formButton = useRef(null);

  const handleOk = () => {
    formButton.current.click();
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCategory(null);
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const cancelDelete = (e) => {
    message.error("Category deletion canceled");
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(categoryServiceUrl);

      setCategories(
        res.data.data.map((e) => ({
          key: e.p_category_id,
          name: e.name,
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
    const newCategory = { ...values };

    try {
      if (isEdit) {
        await axios.put(
          `${categoryServiceUrl}/${selectedCategory.p_category_id}`,
          newCategory
        );
        message.success("Category updated");
      } else {
        await axios.post(categoryServiceUrl, newCategory);
        message.success("Category created");
      }

      await fetchCategories();
      handleCancel();
    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (category) => {
    try {
      await axios.delete(`${categoryServiceUrl}/${category.key}`);
      message.success("Category deleted");
      setCategories((prev) => prev.filter((e) => e.key !== category.key));
    } catch (e) {
      console.log(e.message);
    }
  };

  const onEditCategory = async (product) => {
    setIsEdit(true);
    const res = await axios.get(`${categoryServiceUrl}/${product.key}`);
    const categoryDetail = res.data.data[0];
    setSelectedCategory(categoryDetail);
    form.setFieldsValue({
      name: categoryDetail.name,
    });
    setIsModalOpen(true);
  };

  const openAddCategory = () => {
    setIsEdit(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
            onClick={() => onEditCategory(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete the category"
            description="Are you sure to delete this category?"
            onConfirm={() => deleteCategory(record)}
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
      <AddCategoryModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isLoading={isLoading}
        onSubmit={onSubmit}
        formButton={formButton}
        form={form}
      />
      <div className="w-full h-full flex flex-col gap-10 justify-start items-center">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Product Categories</h1>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-[#5590ff]"
            icon={<PlusOutlined />}
            onClick={openAddCategory}
          >
            Add new category
          </Button>
        </div>
        <Table className="w-full" columns={columns} dataSource={categories} />
      </div>
    </div>
  );
}
