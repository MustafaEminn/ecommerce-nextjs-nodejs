import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Input, Modal, message, Button, Form } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "suneditor/dist/css/suneditor.min.css";
import "./Product.css";
import LayoutAdmin from "./Layout";
import { getData, putData } from "../api/fetch";
import "./Category.css";
import { arr_diff } from "../utils/arrDiff";
import slugify from "slugify";

const Category = () => {
  const [fieldsData, setFieldsData] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editingSubIndex, setEditingSubIndex] = useState(0);
  const [form] = Form.useForm();
  const [formSub] = Form.useForm();

  const getCategories = async () => {
    await getData("/api/category/getCategories")
      .then((res) => {
        setFieldsData(res.data.categories);
        const categoriesValues = Object.keys(res.data.categories);
        setCategories(categoriesValues);
      })
      .catch(() => {
        message.error("Lütfen internetinizi kontrol edin.");
      });
  };
  const setCategoriesData = async () => {
    await putData("/api/category/setCategories", { categories: fieldsData })
      .then((res) => {
        message.success("Kaydedildi.");
      })
      .catch(() => {
        message.error("Lütfen internetinizi kontrol edin.");
      });
  };

  useEffect(() => {
    (async () => {
      await getCategories();
      setPageLoading(false);
    })();
  }, []);

  const onFinish = async (e) => {
    await setCategoriesData();
  };

  const onCategoriesChangeLocal = () => {
    const value = form.getFieldsValue();
    const newCategory = arr_diff(categories, value.categories);
    if (newCategory[0]) {
      let newFields = { ...fieldsData };
      newFields[newCategory[0]] = {};
      setFieldsData(newFields);
      let newCategories = [...categories, newCategory[0]];
      setCategories(newCategories);
    }
  };

  const onCategoriesSubChangeLocal = () => {
    const value = formSub.getFieldsValue();
    const newCategory = arr_diff(subCategories, value.subCategories);
    if (newCategory[0]) {
      let newFields = { ...fieldsData };
      let newSubFields = { ...fieldsData[categories[editingSubIndex]] };
      newSubFields[newCategory[0]] = { slug: slugify(newCategory[0]) };
      newFields[categories[editingSubIndex]] = newSubFields;
      setFieldsData(newFields);
      let newSubCategories = [...subCategories, newCategory[0]];
      setSubCategories(newSubCategories);
    }
  };

  const onModalCancel = () => {
    setSubCategories([]);
    setModalVisible(false);
    formSub.resetFields();
  };

  const onModalOpen = (index) => {
    const subData = fieldsData[categories[index]];
    setModalVisible(true);
    setEditingSubIndex(index);
    const subCategoryData = Object.keys(subData);
    setSubCategories(subCategoryData);
    formSub.setFieldsValue({ subCategories: subCategoryData });
  };
  //That useEffect hook fix modal sync problem

  return (
    <LayoutAdmin mainLoading={pageLoading}>
      <Form form={form} name="dynamic_form_item" onFinish={onFinish}>
        <Form.List
          name="categories"
          initialValue={categories}
          rules={[
            {
              validator: async (_, categories) => {
                if (!categories || categories.length < 1) {
                  return Promise.reject(
                    new Error("En az 1 kategori olmak zorunda")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item required={false} key={field.key}>
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message:
                          "Lütfen kategori adı girin veya bu kategoriyi silin.",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      onBlur={onCategoriesChangeLocal}
                      placeholder="Kategori adı"
                      style={{ width: "60%" }}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                  <Button
                    type="primary"
                    onClick={() => {
                      onModalOpen(index);
                    }}
                  >
                    Alt Kategoriler
                  </Button>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  Kategori Ekle
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Kaydet
          </Button>
        </Form.Item>
      </Form>

      {/* MODAL BEGIN */}
      <Modal
        visible={modalVisible}
        title={"Alt Kategoriler"}
        footer={null}
        onCancel={onModalCancel}
        destroyOnClose
      >
        <Form form={formSub} name="dynamic_form_item">
          <Form.List name="subCategories" initialValue={subCategories}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Lütfen kategori adı girin veya bu kategoriyi silin.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        onBlur={onCategoriesSubChangeLocal}
                        placeholder="Kategori adı"
                        style={{ width: "60%" }}
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "60%" }}
                    icon={<PlusOutlined />}
                  >
                    Kategori Ekle
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      {/* MODAL END */}
    </LayoutAdmin>
  );
};
export default Category;
