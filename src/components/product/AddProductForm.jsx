import axios from "axios";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
const { TextArea } = Input;
import { categoryServiceUrl } from "../../config/config";

export default function AddProductForm({
  fileList,
  setFileList,
  onSubmit,
  formButton,
  form,
}) {
  const [productCategory, setProductCategory] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(categoryServiceUrl);
      setProductCategory(res.data.data);
    })();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
        <Form.Item label="Name" name="name">
          <Input placeholder="Input product name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea placeholder="Input product description" rows={4} />
        </Form.Item>
        <Form.Item label="Category" name="category_id">
          <Select placeholder="Select product category">
            {productCategory.map((e) => (
              <Select.Option
                key={e.category_id + e.name}
                value={e.p_category_id}
              >
                {e.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Price" name="price">
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            prefix="Rp"
            placeholder="Input product price"
            className="w-3/5"
          />
        </Form.Item>
        <Form.Item label="Stock" name="stock">
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder="Input product stock"
            className="w-3/5"
          />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList">
          <ImageUploader fileList={fileList} setFileList={setFileList} />
        </Form.Item>

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
