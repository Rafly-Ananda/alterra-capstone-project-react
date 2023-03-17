import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Button, Form } from "antd";
import moment from "moment/moment";
import { Space, Table } from "antd";
import { message, Popconfirm } from "antd";
import EditUserModal from "../../../components/user/EditUserModal";
import { userServiceUrl } from "../../../config/config";

export default function UserHome() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formButton = useRef(null);

  const handleOk = () => {
    formButton.current.click();
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const cancelDelete = (e) => {
    message.error("User deletion canceled");
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(userServiceUrl);

      setUsers(
        res.data.data.map((e) => ({
          key: e.user_id,
          username: e.username,
          email: e.email,
          role: e.role,
          date_registered: moment(e.createAt).format("MM/DD/YY"),
        }))
      );
      setIsLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    const newUser = { ...values };

    try {
      await axios.put(`${userServiceUrl}/${selectedUser.user_id}`, newUser);
      message.success("User updated");

      await fetchUsers();
      handleCancel();
    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (user) => {
    try {
      await axios.delete(`${userServiceUrl}/${user.key}`);
      message.success("User deleted");
      setUsers((prev) => prev.filter((e) => e.key !== user.key));
    } catch (e) {
      message.error("Error Occurred, user deletion canceled");
      console.log(e.message);
    }
  };

  const onEditUser = async (user) => {
    const res = await axios.get(`${userServiceUrl}/${user.key}`);
    const userDetail = res.data.data[0];
    setSelectedUser(userDetail);
    form.setFieldsValue({
      username: userDetail.username,
      email: userDetail.email,
      role: userDetail.role,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Date Registered",
      dataIndex: "date_registered",
      key: "date_registered",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => onEditUser(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => deleteUser(record)}
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
      <EditUserModal
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
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>
        <Table className="w-full" columns={columns} dataSource={users} />
      </div>
    </div>
  );
}
