import React, { useState, useEffect, useRef, useMemo } from "react";
import "antd/dist/antd.css";
import {
  Table,
  Input,
  Modal,
  message,
  Tooltip,
  Button,
  Form,
  Upload,
  Checkbox,
  InputNumber,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { API_URL } from "../API";
import axios from "axios";
import { useHistory } from "react-router-dom";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./Post.css";
import LayoutAdmin from "./Layout";
import Search from "antd/lib/input/Search";
import { postData } from "../api/fetch";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [publicBool, setPublicBool] = useState(true);
  const [image, setImage] = useState();
  const [imagePost, setImagePost] = useState();
  const [editorValue, setEditorValue] = useState();
  const [title, setTitle] = useState();
  const [countPosts, setCountPosts] = useState(10);
  const [link, setLink] = useState("");
  const [editDataIndex, setEditDataIndex] = useState();
  const route = useHistory();
  const editorRef = useRef();

  const deletePost = async (id) => {
    try {
      message.loading("Haber siliniyor");
      var url = new URL(`${API_URL}/Blog/DeletePost`),
        params = { id: id };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      let res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let req = await res;
      message.destroy();
      if (req.status === 200) {
        const filter = posts.filter((p) => p.id !== id);
        setPosts(filter);
        message.success("Haber silindi");
      } else if (req.status === 401) {
        route.push("/");
      }
    } catch (error) {
      console.log(error);
      message.destroy();
      message.error("Haber silinemedi tekrar deneyiniz.");
    }
  };

  const getPosts = async () => {
    postData("/api/product/getProductsTop", { count: countPosts })
      .then((res) => {
        setPosts(res.data.products);
      })
      .catch(() => {
        message.error("Lütfen internetinizi kontrol edin.");
      });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const haberAddClick = async () => {
    if (title && editorValue && imagePost) {
      try {
        let data = {
          title: title,
          text: editorValue,
          img: imagePost,
          link: link,
          isActive: publicBool,
        };
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/Blog/AddPost`,
          JSON.stringify(data),
          {
            headers: {
              Accept: "*/*",
              "Content-type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 200) {
          setEditorValue("");
          setTitle("");
          setImage(null);
          setVisibleAdd(false);
          setLoading(false);
          getPosts();
          message.success("Haber eklendi.");
        }
      } catch (error) {
        message.error("Hata oluştu. Lütfen tekrar deneyin.");
        setLoading(false);
      }
    } else {
      message.error(
        "Lütfen başlık eklediğinize ve fotoğraf yüklediğinize emin olun."
      );
      setLoading(false);
    }
  };

  const editPost = (dataIndex) => {
    setVisibleEdit(true);
    setEditDataIndex(dataIndex);
    setImage(posts[dataIndex].img);
    setLink(posts[dataIndex].link);
    setTitle(posts[dataIndex].title);
    setEditorValue(posts[dataIndex].text);
    setPublicBool(posts[dataIndex].isActive);
  };

  const updateHaberClick = async () => {
    if (title && editorValue && image) {
      try {
        let id = posts[editDataIndex].id;
        let dataAPI = {
          id: id,
          title: title,
          text: editorValue,
          img: image,
          link: link,
          isActive: publicBool,
        };
        setLoading(true);
        const res = await axios.put(
          `${API_URL}/Blog/UpdatePost`,
          JSON.stringify(dataAPI),
          {
            headers: {
              Accept: "*/*",
              "Content-type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 200) {
          setEditorValue("");
          setTitle("");
          setImage(null);
          setVisibleEdit(false);
          setLoading(false);
          getPosts();
          message.success("Haber düzenlendi.");
        }
      } catch (error) {
        setLoading(false);
        message.error("Hata oluştu. Lütfen tekrar deneyin.");
      }
    } else {
      message.error(
        "Lütfen başlık eklediğinize ve fotoğraf yüklediğinize emin olun."
      );
    }
  };

  const onImageChange = async (file) => {
    try {
      let img = await toBase64(file);
      setImage(img);
      setImagePost(img.split(",")[1]);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setVisibleAdd(false);
    setVisibleEdit(false);
    setImage(null);
    setLink("");
    setTitle("");
    setEditorValue("");
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Yükle</div>
    </div>
  );
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <p
          className="titlesTable"
          style={{ maxHeight: "85px", overflow: "hidden" }}
        >
          {title}
        </p>
      ),
    },
    {
      title: "Durumu",
      dataIndex: "isActive",
      key: "isActive",
      render: (boolean) => (
        <p style={{ maxHeight: "85px", overflow: "hidden" }}>
          {boolean ? (
            <Tag color="green">Aktif</Tag>
          ) : (
            <Tag color="red">Pasif</Tag>
          )}
        </p>
      ),
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
        return (
          <p style={{ maxHeight: "85px", overflow: "hidden" }}>{dateFormat}</p>
        );
      },
    },
    {
      title: "İşlemler",
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
                  editPost(index);
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
                onClick={() => deletePost(row.id)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  // OPTIMIZE LAG PROBLEM
  const TablePosts = useMemo(
    () => <Table pagination={false} columns={columns} dataSource={posts} />,
    [posts]
  );
  const onSearch = () => {
    var input, filter, i, txtValue, titles;
    input = document.querySelector(".ant-input");
    filter = input.value.toLowerCase();
    titles = document.querySelectorAll(".titlesTable");
    console.log(input, filter, titles);
    for (i = 0; i < titles.length; i++) {
      txtValue = titles[i].textContent || titles[i].innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
        console.log(txtValue);
        titles[i].parentElement.parentElement.style.display = "";
      } else {
        titles[i].parentElement.parentElement.style.display = "none";
      }
    }
  };

  useEffect(() => {
    getPosts();
    setPageLoading(false);
  }, []);

  return (
    <LayoutAdmin mainLoading={pageLoading}>
      <div className="headerAdminPost">
        <Button
          onClick={() => {
            setVisibleAdd(true);
          }}
          style={{ margin: "15px" }}
          type="primary"
        >
          Davetiye Ekle
        </Button>
        <div>
          Davetiye Sayısı:
          <InputNumber
            defaultValue={10}
            style={{ margin: "15px" }}
            placeholder="Sayı yazınız"
            onChange={(e) => {
              setCountPosts(e);
            }}
          />
          <Button
            onClick={() => {
              getPosts();
            }}
            style={{ margin: "15px" }}
            type="primary"
          >
            Tamam
          </Button>
        </div>
      </div>
      <Search
        placeholder="Davetiye ara..."
        allowClear
        enterButton
        onChange={onSearch}
        style={{ margin: "15px", width: "200px" }}
      />
      {TablePosts}
      {/* ADD POST MODAL BEGIN */}
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        visible={visibleAdd}
        title="Haber Ekle"
        onCancel={closeModal}
        width="90%"
        footer={[
          <Button onClick={closeModal}>Kapat</Button>,
          <Button type="primary" loading={loading} onClick={haberAddClick}>
            Davetiyeyi Ekle
          </Button>,
        ]}
      >
        <Form>
          <Form.Item name="title" label="Haber Başlığı">
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item name="link" label="İlan.gov.tr linki">
            <Input
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Haber Fotoğrafı" rules={[{ required: true }]}>
            <Upload
              name="photo"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={(e) => {
                onImageChange(e.file.originFileObj);
              }}
              multiple={false}
            >
              {image ? (
                <img src={image} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Halka Açık">
            <Checkbox
              defaultChecked={true}
              onChange={(e) => {
                setPublicBool(e.target.checked);
              }}
            />
          </Form.Item>
        </Form>
        <SunEditor
          ref={editorRef}
          setContents={editorValue}
          setOptions={{
            height: 400,
            buttonList: buttonList.complex,
          }}
          onChange={(e) => {
            setEditorValue(e);
          }}
          width="100%"
        />
      </Modal>
      {/* ADD POST MODAL END */}
    </LayoutAdmin>
  );
};
export default Post;
