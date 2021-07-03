import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import {
  UserOutlined,
  PictureOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { getData } from "../api/fetch";
import styles from "../styles/layout/layout.module.css";
import Logo from "../components/logo";
import { BASE } from "../constants/base";
import { PAGE } from "../constants/page";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const LayoutAdmin = ({ children, mainLoading = false }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const route = useHistory();

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
      route.push("/");
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
        <Layout className="layout">
          <Header>
            <div style={{ color: "whitesmoke" }} className="logo">
              {BASE.companyName}
            </div>
            <Menu theme="dark" mode="horizontal">
              <Menu.Item icon={<PictureOutlined />} key="1">
                <Link to={PAGE.products.href}>{PAGE.products.name}</Link>
              </Menu.Item>
              <Menu.Item icon={<UserOutlined />} key="2">
                <Link to={PAGE.members.href}>{PAGE.members.name}</Link>
              </Menu.Item>
              <Menu.Item icon={<BoxPlotOutlined />} key="3">
                <Link to={PAGE.orders.href + "/1"}>{PAGE.orders.name}</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: "0 0", minHeight: "82vh" }}>
            <div className="site-layout-content">{children}</div>
          </Content>
          <Footer style={{ textAlign: "center" }}>{BASE.companyName}</Footer>
        </Layout>
      )}
    </>
  );
};
export default LayoutAdmin;
