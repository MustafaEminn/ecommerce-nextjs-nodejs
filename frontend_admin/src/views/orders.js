import React, { useState, useEffect, useMemo } from "react";
import "antd/dist/antd.css";
import {
  Table,
  Input,
  Modal,
  message,
  Tooltip,
  Button,
  Form,
  Select,
  Tag,
} from "antd";
import {
  EditOutlined,
  CopyOutlined,
  EyeOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { API_URL, checkErrorIsAuth } from "../API";
import { useHistory } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css";
import "./Product.css";
import LayoutAdmin from "./Layout";
import Search from "antd/lib/input/Search";
import { deleteData, getData, putData } from "../api/fetch";
import { BASE } from "../constants/base";
import { dateFormat } from "../utils/dateFormat";
import { cityDistrict } from "../constants/cityDistrict";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [countOfPages, setCountOfPages] = useState(1);
  const [searchMember, setSearchOrder] = useState([]);
  const [buyerModalVisible, setBuyerModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productModalData, setProductModalData] = useState({});
  const [buyerModalData, setBuyerModalData] = useState({});
  const [editRow, setEditRow] = useState({});
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(1);
  const [page, setPage] = useState(window.location.pathname.split("/")[2] || 1);
  const route = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;

  const getOrders = async (pageParam = page) => {
    setTableLoading(true);
    await getData("/api/order/getOrders/" + pageParam)
      .then((res) => {
        setOrders(res.data.orders);
        setCountOfPages(res.data.countOfPages);
        window.history.replaceState(
          null,
          BASE.companyName,
          "/siparisler/" + pageParam
        );
        setTableLoading(false);
      })
      .catch(() => {
        message.error("L??tfen internetinizi kontrol edin.");
        setTableLoading(false);
      });
  };

  const onCloseEditModal = () => {
    setEditVisible(false);
    form.resetFields();
  };

  const editOrder = (row) => {
    var data = row;
    data["orderShippingAddress"] = JSON.parse(data.orderShippingAddress);
    data["orderBillingAddress"] = JSON.parse(data.orderBillingAddress);
    form.setFieldsValue({
      orderStatus: data.orderStatus.replace(" ", ""),
      shippingCompany: data.shippingCompany,
      shippingTrackId: data.shippingTrackId,
      orderShippingAddress: data.orderShippingAddress.address,
      orderShippingAddressContactName: data.orderShippingAddress.contactName,
      orderShippingAddressCity: data.orderShippingAddress.city,
      orderBillingAddress: data.orderBillingAddress.address,
      orderBillingAddressContactName: data.orderBillingAddress.contactName,
      orderBillingAddressCity: data.orderBillingAddress.city,
      price: data.price,
    });
    setEditRow(data);
    setEditVisible(true);
    setOrderStatus(Number(data.orderStatus));
  };

  const onOrderUpdate = () => {
    const errors = form.getFieldsError();
    var formHasError = false;
    errors.map((item) => {
      return item.errors[0] ? (formHasError = true) : void 0;
    });

    if (!formHasError) {
      setLoading(true);
      message.loading("Sipari?? d??zenleniyor...", 999);
      var fields = form.getFieldsValue();
      var datas = { ...editRow, ...fields };
      datas["id"] = editRow.id;

      if (!datas["shippingBeginAt"] && datas["orderStatus"] === "3") {
        datas["shippingBeginAt"] = new Date(Date.now()).toISOString();
      }

      if (!datas["shippingEndAt"] && datas["orderStatus"] === "4") {
        datas["shippingEndAt"] = new Date(Date.now()).toISOString();
      }

      datas["orderShippingAddress"] = JSON.stringify({
        contactName: datas["orderShippingAddressContactName"],
        city: datas["orderShippingAddressCity"],
        country: "Turkey",
        address: datas["orderShippingAddress"],
      });

      datas["orderBillingAddress"] = JSON.stringify({
        contactName: datas["orderBillingAddressContactName"],
        city: datas["orderBillingAddressCity"],
        country: "Turkey",
        address: datas["orderBillingAddress"],
      });

      putData("/api/order/updateOrder", datas)
        .then(() => {
          message.destroy();
          message.success("G??ncellendi.");
          setLoading(false);
          onCloseEditModal();
          getOrders();
        })
        .catch(() => {
          message.destroy();
          setLoading(false);
          message.error("Tekrar deneyin.");
        });
    } else {
      message.error("L??tfen gerekli alanlar?? doldurunuz.");
    }
  };

  const onModalCancel = () => {
    setBuyerModalVisible(false);
    setProductModalVisible(false);
  };

  const onOpenProductModal = (productId) => {
    getData("/api/product/getProductById/" + productId)
      .then((res) => {
        const data = res.data.product[0];
        data["photos"] = JSON.parse(data["photos"]);
        setProductModalData(data);
        setProductModalVisible(true);
      })
      .catch((err) => {
        if (err?.response?.data?.code === 2) {
          message.error("Bu ??r??n bulunam??yor.");
        } else {
          message.error("Tekrar deneyin.");
        }
      });
  };

  const onOpenBuyerModal = (buyerId) => {
    getData("/api/member/getMemberById/" + buyerId)
      .then((res) => {
        setBuyerModalData(res.data.member[0]);
        setBuyerModalVisible(true);
      })
      .catch((err) => {
        message.error("Tekrar deneyin.");
      });
  };

  const copyId = (index) => {
    const memberIdElem = document.getElementById("memberIdCopyElem" + index);
    var r = document.createRange();
    r.selectNode(memberIdElem);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand("copy");
    message.success("Kopyaland??");
  };

  const StatusItem = ({ status }) => {
    var renderItem;
    switch (status) {
      case "1":
        renderItem = <Tag color="volcano">Onay Bekliyor</Tag>;
        break;
      case "2":
        renderItem = <Tag color="green">Onayland??</Tag>;
        break;
      case "3":
        renderItem = <Tag color="magenta">Kargo verildi</Tag>;
        break;
      case "4":
        renderItem = <Tag color="blue">Kargo teslim edildi</Tag>;
        break;
      case "100":
        renderItem = <Tag color="red">Onaylanmad??</Tag>;
        break;
      case "101":
        renderItem = <Tag color="cyan">Sipari?? iptal edildi</Tag>;
        break;
      default:
        renderItem = <p>-</p>;
    }
    return <>{renderItem}</>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (title, row, index) => {
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              id={"memberIdCopyElem" + index}
            >
              {row.id}
            </p>
            <Button
              onClick={() => {
                copyId(index);
              }}
              type="primary"
              icon={<CopyOutlined />}
            />
          </span>
        );
      },
    },
    {
      title: "Al??c??",
      dataIndex: "buyerId",
      key: "id",
      render: (buyerId, row) => {
        return (
          <Button
            onClick={() => {
              onOpenBuyerModal(buyerId);
            }}
            type="primary"
            icon={<UserOutlined />}
          />
        );
      },
    },
    {
      title: "??r??n",
      dataIndex: "productId",
      key: "id",
      render: (productId, row) => {
        return (
          <Button
            onClick={() => {
              onOpenProductModal(productId);
            }}
            type="primary"
            icon={<EyeOutlined />}
          />
        );
      },
    },
    {
      title: "??r??n Adresi",
      dataIndex: "orderShippingAddress",
      key: "id",
      render: (item, row) => {
        const parsed = JSON.parse(item);
        return (
          <p className="titlesTable">
            {parsed.contactName + " " + parsed.city + " " + parsed.address}
          </p>
        );
      },
    },
    {
      title: "Fatura Adresi",
      dataIndex: "orderBillingAddress",
      key: "id",
      render: (billing, row) => {
        const parsed = JSON.parse(billing);
        return (
          <p className="titlesTable">
            {" "}
            {parsed.contactName + " " + parsed.city + " " + parsed.address}
          </p>
        );
      },
    },
    {
      title: "Durum",
      dataIndex: "orderStatus",
      key: "id",
      render: (item, row) => {
        return <StatusItem status={item} />;
      },
    },

    {
      title: "Kargo Verilme Tarihi",
      dataIndex: "shippingBeginAt",
      key: "shippingBeginAt",
      render: (date) => {
        let dateFormat = new Date(date).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        let date2000 = new Date("2000").toISOString();
        return <p>{date2000 < dateFormat ? dateFormat : "-"}</p>;
      },
    },

    {
      title: "Kargo Teslim Tarihi",
      dataIndex: "shippingEndAt",
      key: "shippingEndAt",
      render: (date) => {
        let dateFormat = new Date(date).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        let date2000 = new Date("2000").toISOString();
        return <p>{date2000 < dateFormat ? dateFormat : "-"}</p>;
      },
    },
    {
      title: "Al???? Fiyat??",
      dataIndex: "price",
      key: "id",
    },
    {
      title: "Tarih",
      dataIndex: "buyAt",
      key: "buyAt",
      render: (date) => {
        let dateFormat = new Date(date).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return <p>{dateFormat}</p>;
      },
    },
    {
      title: "D??zenle",
      key: "id",
      render: (row, _, index) => {
        return (
          <>
            <Tooltip title="D??zenle">
              <Button
                size="small"
                primary
                icon={<EditOutlined />}
                style={{
                  marginRight: "7px",
                  borderColor: "#1890ff",
                  color: "#1890ff",
                }}
                onClick={() => {
                  editOrder(row);
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  // OPTIMIZE LAG PROBLEM
  const TableOrders = useMemo(
    () => (
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={searchMember[0] ? searchMember : orders}
      />
    ),
    [orders, searchMember]
  );
  const onSearchID = async (e) => {
    if (e.length >= 12) {
      message.loading("Aran??yor...", 999);
      await getData("/api/order/getOrderById/" + e)
        .then((res) => {
          message.destroy();
          message.success("Sipari?? bulundu.");
          setSearchOrder(res.data.order);
        })
        .catch((err) => {
          if (err.response?.data.code === 1) {
            message.destroy();
            message.error("Sipari?? aran??rken hata olu??tu.");
          } else {
            message.destroy();
            message.error("Bu ID'ye sahip sipari?? bulunamad??.");
          }
        });
    } else if (e.length === 0 && searchMember[0]) {
      setSearchOrder([]);
    } else {
      message.error("ID en az 12 haneli olmal??d??r.");
    }
  };

  const onPageBack = () => {
    setPage(page - 1);
    getOrders(page - 1);
  };
  const onPageNext = () => {
    setPage(+page + 1);
    getOrders(+page + 1);
  };

  useEffect(() => {
    getOrders();
    setPageLoading(false);
  }, []);

  return (
    <LayoutAdmin mainLoading={pageLoading}>
      <div className="headerAdminPost">
        <div>
          <Search
            placeholder="ID ara..."
            allowClear
            enterButton
            onSearch={onSearchID}
            style={{ margin: "15px", width: "200px" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
        >
          <Button
            disabled={page == 1}
            type="primary"
            icon={<LeftOutlined />}
            onClick={onPageBack}
          />
          <span
            style={{ marginRight: "8px", marginLeft: "8px", fontSize: "18px" }}
          >
            {page}/{countOfPages}
          </span>
          <Button
            type="primary"
            disabled={countOfPages == page.toString()}
            icon={<RightOutlined />}
            onClick={onPageNext}
          />
        </div>
      </div>
      {tableLoading ? (
        <div className="loaderContainer">
          <div className="loader" />
        </div>
      ) : (
        TableOrders
      )}
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            alignSelf: "flex-end",
          }}
        >
          <Button
            disabled={page == 1}
            type="primary"
            icon={<LeftOutlined />}
            onClick={onPageBack}
          />
          <span
            style={{ marginRight: "8px", marginLeft: "8px", fontSize: "18px" }}
          >
            {page}/{countOfPages}
          </span>
          <Button
            type="primary"
            disabled={countOfPages == page.toString()}
            icon={<RightOutlined />}
            onClick={onPageNext}
          />
        </div>
      </div>

      {/* ORDER EDIT MODAL BEGIN */}
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        visible={editVisible}
        title="??r??n D??zenle"
        onCancel={onCloseEditModal}
        width="90%"
        footer={[
          <Button onClick={onCloseEditModal}>Kapat</Button>,

          <Button type="primary" loading={loading} onClick={onOrderUpdate}>
            D??zenlemeyi Kaydet
          </Button>,
        ]}
      >
        <Form onFinish={onOrderUpdate} form={form} layout="vertical">
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderStatus"
            label="??r??n Durumu"
          >
            <Select
              onChange={(e) => {
                setOrderStatus(Number(e));
              }}
              defaultValue="1"
            >
              <Option value="1">Onaylanmay?? bekliyor</Option>
              <Option value="2">Onayland??</Option>
              <Option value="3">Kargoland??</Option>
              <Option value="4">Teslim Edildi</Option>
              <Option value="100">Reddedildi</Option>
            </Select>
          </Form.Item>
          {orderStatus === 3 || orderStatus === 4 ? (
            <>
              <Form.Item
                rules={[
                  { required: true, message: "Bu alan bo?? b??rak??lamaz." },
                ]}
                name="shippingCompany"
                label="Kargo ??irketi"
              >
                <Select defaultValue="0">
                  <Option value="0">Kargoya verilmedi</Option>
                  <Option value="1">Aras</Option>
                  <Option value="2">Yurti??i</Option>
                  <Option value="3">S??rat</Option>
                  <Option value="4">PTT</Option>
                  <Option value="5">Mng</Option>
                  <Option value="6">UPS</Option>
                </Select>
              </Form.Item>
              <Form.Item
                rules={[
                  { required: true, message: "Bu alan bo?? b??rak??lamaz." },
                ]}
                name="shippingTrackId"
                label="Kargo Takip Kodu"
              >
                <Input />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="price"
            label="Al???? Fiyat??"
          >
            <Input name="price" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderShippingAddressContactName"
            label="??r??n Kargo Adresi (Al??c?? Ad Soyad)"
          >
            <Input name="contactName" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderShippingAddressCity"
            label="??r??n Kargo Adresi (??ehir)"
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="??ehir se??iniz..."
              optionFilterProp="children"
            >
              {cityDistrict.map((item) => {
                return <Option value={item["il_adi"]}>{item["il_adi"]}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderShippingAddress"
            label="??r??n Kargo Adresi (Adres)"
          >
            <Input.TextArea rows={4} name="address" />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderBillingAddressContactName"
            label="Fatura Adresi (Al??c?? Ad Soyad)"
          >
            <Input name="contactName" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderBillingAddressCity"
            label="Fatura Adresi (??ehir)"
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="??ehir se??iniz..."
              optionFilterProp="children"
            >
              {cityDistrict.map((item) => {
                return <Option value={item["il_adi"]}>{item["il_adi"]}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan bo?? b??rak??lamaz." }]}
            name="orderBillingAddress"
            label="Fatura Adresi (Adres)"
          >
            <Input.TextArea rows={4} name="address" />
          </Form.Item>
        </Form>
      </Modal>
      {/* ORDER EDIT MODAL END */}
      {/* BUYER MODAL BEGIN */}
      <Modal
        visible={buyerModalVisible}
        title={
          buyerModalData.Name ||
          "" + " " + buyerModalData.Surname ||
          "" + " " + "Kullan??c?? Bilgisi"
        }
        footer={null}
        onCancel={onModalCancel}
      >
        <p>ID: {buyerModalData.id || ""}</p>
        <p>Ad: {buyerModalData.Name || ""}</p>
        <p>Soyad: {buyerModalData.Surname || ""}</p>
        <p>Telefon Numaras??: {buyerModalData.PhoneNumber || ""}</p>
        <p>Email: {buyerModalData.Email || ""}</p>
        <p>
          Cinsiyet:{" "}
          {buyerModalData.Gender === "male"
            ? "Erkek"
            : buyerModalData.Gender === "female"
            ? "Kad??n"
            : "Belirtilmemi??" || ""}
        </p>
        <p>??ye olma zaman??: {dateFormat(buyerModalData.createdAt) || ""}</p>
        <p>
          Adres: {buyerModalData.Address + " " || ""}
          {buyerModalData.Neighborhood + " " || ""}
          {buyerModalData.District || ""}/{buyerModalData.City || ""}
        </p>
      </Modal>
      {/* BUYER MODAL END */}
      {/* PRODUCT MODAL BEGIN */}
      <Modal
        visible={productModalVisible}
        title={productModalData.title || "" + " " + "??r??n Bilgisi"}
        footer={null}
        onCancel={onModalCancel}
      >
        <p>ID: {productModalData.id || ""}</p>
        <p>Davetiye Ad??: {productModalData.title || ""}</p>
        <p>
          ??r??n Olu??turulma Zaman??:{" "}
          {dateFormat(productModalData.createdAt) || ""}
        </p>
        <p>??r??n Foto??raf??:</p>
        <img
          width="100%"
          src={API_URL + "/api/img/" + productModalData.photos}
        />
      </Modal>
      {/* PRODUCT MODAL END */}
    </LayoutAdmin>
  );
};
export default Order;
