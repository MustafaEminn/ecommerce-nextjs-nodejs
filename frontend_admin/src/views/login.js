import React, { useState, useEffect } from "react";
import { message, Form, Input, Button } from "antd";
import { Redirect, useHistory } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import { API_URL } from "../API";
import styles from "./login.module.css";
import { getData, postData } from "../api/fetch";
import { PAGE } from "../constants/page";

const Login = () => {
  const [form] = useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const route = useHistory();

  const checkAuth = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      getData("/api/auth/checkAuth")
        .then((response) => {
          return route.push(PAGE.products.href);
        })
        .catch((err) => {
          return setPageLoading(false);
        });
    } else {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const onFinish = async () => {
    let data = form.getFieldsValue();
    setLoading(true);

    postData(`/api/auth/login`, {
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        setLoading(false);
        const content = res.data;
        localStorage.setItem("token", content.token);
        route.push(PAGE.products.href);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.data.code === 1) {
          message.error("Email veya şifre yanlış.");
        }
      });
  };
  if (pageLoading) {
    return <></>;
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.login}>
          <Form
            onFinish={onFinish}
            form={form}
            name="basic"
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Lütfen email giriniz." }]}
            >
              <Input type="email" name="email" />
            </Form.Item>

            <Form.Item
              label="Şifre"
              name="password"
              rules={[{ required: true, message: "Lütfen şifrenizi giriniz." }]}
            >
              <Input.Password name="email" type="password" />
            </Form.Item>

            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Giriş Yap
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
};
export default Login;
