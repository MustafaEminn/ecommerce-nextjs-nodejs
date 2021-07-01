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
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { checkErrorIsAuth } from "../API";
import { useHistory } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css";
import "./Product.css";
import LayoutAdmin from "./Layout";
import Search from "antd/lib/input/Search";
import { deleteData, getData, putData } from "../api/fetch";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchMember, setSearchMember] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressModalRow, setAddressModalRow] = useState({
    Name: "",
    Surname: "",
    Address: "",
    District: "",
    City: "",
    Neighborhood: "",
  });
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [countMembers, setCountMembers] = useState(10);
  const route = useHistory();
  const [form] = Form.useForm();

  const getMembers = async () => {
    await getData("/api/member/getMembersTop/" + countMembers)
      .then((res) => {
        setMembers(res.data.members);
      })
      .catch(() => {
        message.error("Lütfen internetinizi kontrol edin.");
      });
  };

  const deleteProduct = async (id) => {
    message.loading("Üye siliniyor...");

    deleteData("/api/member/deleteMember/" + id)
      .then(() => {
        message.destroy();
        message.success("Ürün silindi.");
        const filter = members.filter((p) => p.id !== id);
        setMembers(filter);
      })
      .catch((err) => {
        message.destroy();
        if (checkErrorIsAuth(err)) {
          return route.push("/");
        } else {
          message.error("Ürün silinemedi lütfen tekrar deneyiniz.");
        }
      });
  };

  const closeModal = () => {
    setVisibleEdit(false);
    form.resetFields();
  };

  const editPost = (row) => {
    form.setFieldsValue(row);
    setVisibleEdit(true);
    setEditRow(row);
  };

  const memberUpdateClick = () => {
    const errors = form.getFieldsError();
    var formHasError = false;
    errors.map((item) => {
      return item.errors[0] ? (formHasError = true) : void 0;
    });

    if (!formHasError) {
      setLoading(true);
      message.loading("Üye düzenleniyor...", 999);
      var datas = form.getFieldsValue();
      datas["id"] = editRow.id;
      putData("/api/member/updateMember", datas)
        .then(() => {
          message.destroy();
          message.success("Güncellendi.");
          setLoading(false);
          closeModal();
          getMembers();
        })
        .catch(() => {
          message.destroy();
          setLoading(false);
          message.error("Tekrar deneyin.");
        });
    } else {
      message.error("Lütfen gerekli alanları doldurunuz.");
    }
  };

  const onAddressModalCancel = () => {
    setAddressModalVisible(false);
  };

  const copyId = (index) => {
    const memberIdElem = document.getElementById("memberIdCopyElem" + index);
    var r = document.createRange();
    r.selectNode(memberIdElem);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand("copy");
    message.success("Kopyalandı");
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (title, row, index) => {
        return (
          <div
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
          </div>
        );
      },
    },
    {
      title: "Ad Soyad",
      dataIndex: "name",
      key: "id",
      render: (title, row) => {
        return (
          <p className="titlesTable">
            {row.Name} {row.Surname}
          </p>
        );
      },
    },
    {
      title: "İletişim",
      dataIndex: "PhoneNumber",
      key: "id",
      render: (title, row) => {
        return (
          <p className="titlesTable">
            {row.PhoneNumber}
            <br /> {row.Email}
          </p>
        );
      },
    },
    {
      title: "Adres",
      key: "id",
      render: (title, row) => {
        return (
          <>
            {row.City !== "undefined" ? (
              <Button
                onClick={() => {
                  setAddressModalRow(row);
                  setAddressModalVisible(true);
                }}
                type="primary"
                icon={<EyeOutlined />}
              />
            ) : (
              "-"
            )}
          </>
        );
      },
    },

    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
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
      title: "İşlemler",
      key: "id",
      render: (row, _, index) => {
        return (
          <>
            <Tooltip title="Düzenle">
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
                  editPost(row);
                }}
              />
            </Tooltip>
            <Tooltip title="Sil">
              <Button
                size="small"
                primary
                icon={<DeleteOutlined color="white" />}
                style={{
                  marginRight: "7px",
                  borderColor: "#ff4d4f",
                  color: "#ff4d4f",
                }}
                onClick={() => deleteProduct(row.id)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  // OPTIMIZE LAG PROBLEM
  const TableMembers = useMemo(
    () => (
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={searchMember[0] ? searchMember : members}
      />
    ),
    [members, searchMember]
  );
  const onSearchID = async (e) => {
    if (e.length >= 32) {
      message.loading("Aranıyor...", 999);
      await getData("/api/member/getMemberById/" + e)
        .then((res) => {
          message.destroy();
          message.success("Üye bulundu.");
          setSearchMember(res.data.member);
        })
        .catch((err) => {
          if (err.response?.data.code === 1) {
            message.destroy();
            message.error("Üye aranırken hata oluştu.");
          } else {
            message.destroy();
            message.error("Bu ID'ye sahip üye bulunamadı.");
          }
        });
    } else if (e.length === 0 && searchMember[0]) {
      setSearchMember([]);
    } else {
      message.error("ID en az 32 haneli olmalıdır.");
    }
  };

  const onSearchName = async (e) => {
    if (e.length >= 2) {
      message.loading("Aranıyor...", 999);
      await getData("/api/member/getMemberByName/" + e)
        .then((res) => {
          console.log(res.data);
          message.destroy();
          message.success("Üye bulundu.");
          setSearchMember(res.data.member);
        })
        .catch((err) => {
          if (err.response?.data.code === 1) {
            message.destroy();
            message.error("Üye aranırken hata oluştu.");
          } else {
            message.destroy();
            message.error("Bu isime sahip üye bulunamadı.");
          }
        });
    } else if (e.length === 0 && searchMember[0]) {
      setSearchMember([]);
    } else {
      message.error("Ad soyad en az 2 haneli olmalıdır.");
    }
  };
  const onSearchEmail = async (e) => {
    if (e.length >= 5) {
      message.loading("Aranıyor...", 999);
      await getData("/api/member/getMemberByEmail/" + e)
        .then((res) => {
          console.log(res.data);
          message.destroy();
          message.success("Üye bulundu.");
          setSearchMember(res.data.member);
        })
        .catch((err) => {
          if (err.response?.data.code === 1) {
            message.destroy();
            message.error("Üye aranırken hata oluştu.");
          } else {
            message.destroy();
            message.error("Bu isime sahip üye bulunamadı.");
          }
        });
    } else if (e.length === 0 && searchMember[0]) {
      setSearchMember([]);
    } else {
      message.error("Email en az 5 haneli olmalıdır.");
    }
  };

  useEffect(() => {
    getMembers();
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
          <Search
            placeholder="Ad soyad ara..."
            allowClear
            enterButton
            onSearch={onSearchName}
            style={{ margin: "15px", width: "200px" }}
          />
          <Search
            placeholder="Email ara..."
            allowClear
            enterButton
            onSearch={onSearchEmail}
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
          Davetiye Sayısı:
          <InputNumber
            defaultValue={10}
            style={{ margin: "15px", height: "32px" }}
            placeholder="Sayı yazınız"
            onChange={(e) => {
              setCountMembers(e);
            }}
          />
          <Button
            onClick={() => {
              getMembers();
            }}
            style={{ margin: "15px" }}
            type="primary"
          >
            Tamam
          </Button>
        </div>
      </div>

      {TableMembers}

      {/* EDIT POST MODAL BEGIN */}
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        visible={visibleEdit}
        title="Ürün Düzenle"
        onCancel={closeModal}
        width="90%"
        footer={[
          <Button onClick={closeModal}>Kapat</Button>,

          <Button type="primary" loading={loading} onClick={memberUpdateClick}>
            Düzenlemeyi Kaydet
          </Button>,
        ]}
      >
        <Form onFinish={memberUpdateClick} form={form} layout="vertical">
          <Form.Item
            rules={[{ required: true, message: "Bu alan boş bırakılamaz." }]}
            name="Name"
            label="Ad"
          >
            <Input name="name" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan boş bırakılamaz." }]}
            name="Surname"
            label="Soyad"
          >
            <Input name="surname" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan boş bırakılamaz." }]}
            name="Email"
            label="Email"
          >
            <Input name="email" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu alan boş bırakılamaz." }]}
            name="PhoneNumber"
            label="Telefon Numarası"
          >
            <Input name="phoneNumber" />
          </Form.Item>
          <Form.Item name="City" label="Şehir">
            <Input name="city" />
          </Form.Item>
          <Form.Item name="District" label="İlçe">
            <Input name="district" />
          </Form.Item>
          <Form.Item name="Neighborhood" label="Mahalle">
            <Input name="neighborhood" />
          </Form.Item>
          <Form.Item name="Address" label="Adres">
            <Input name="address" />
          </Form.Item>
        </Form>
      </Modal>
      {/* EDIT POST MODAL END */}
      {/* ADDRESS MODAL BEGIN */}
      <Modal
        visible={addressModalVisible}
        title={
          addressModalRow.Name +
          " " +
          addressModalRow.Surname +
          " " +
          "Adres Bilgisi"
        }
        footer={null}
        onCancel={onAddressModalCancel}
      >
        {addressModalRow.Address} {addressModalRow.Neighborhood}{" "}
        {addressModalRow.District}/{addressModalRow.City}
      </Modal>
      {/* ADDRESS MODAL END */}
    </LayoutAdmin>
  );
};
export default Members;
