import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Switch, Route, withRouter, useHistory } from "react-router-dom";
import Post from "./Post";
import { getData } from "../api/fetch";
import styles from "../styles/layout/layout.module.css";
import Logo from "../components/logo";
import { BASE } from "../constants/base";

const { Header, Sider, Content } = Layout;

const LayoutAdmin = ({ children, mainLoading = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const route = useHistory();
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getData("/api/auth/checkAuth")
        .then(() => {
          setPageLoading(false);
        })
        .catch(() => {
          route.push("/");
        });
    } else {
      setPageLoading(false);
    }
  }, []);
  return (
    <>
      {pageLoading || mainLoading ? (
        <div className={styles.logoContainer}>
          <Logo className={styles.logo} />
          <div className={styles.loader}></div>
        </div>
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="9" style={{ minHeight: "53px" }}>
                <a style={{ color: "whitesmoke", fontSize: "180%" }}>
                  {BASE.companyName}
                </a>
              </Menu.Item>
              <Menu.Item key="1" icon={<UserOutlined />}>
                Davetiyeler
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="site-layout-background"
            >
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: toggle,
                }
              )}
              <div
                style={{
                  display: "inline-block",
                  fontWeight: "bold",
                  color: "#939393",
                  cursor: "pointer",
                }}
                onClick={() => {
                  localStorage.removeItem("token");
                  route.push("/");
                }}
              >
                Çıkış <LogoutOutlined />
              </div>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};
export default LayoutAdmin;
