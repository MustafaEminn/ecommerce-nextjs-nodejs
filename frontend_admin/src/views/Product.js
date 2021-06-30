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
import { API_URL, checkErrorIsAuth } from "../API";
import axios from "axios";
import { useHistory } from "react-router-dom";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./Product.css";
import LayoutAdmin from "./Layout";
import Search from "antd/lib/input/Search";
import { deleteData, postData, postFormData } from "../api/fetch";
import { PAGE } from "../constants/page";
import fs from "fs";
import { arr_diff } from "../utils/arrDiff";

const Product = () => {
  const [posts, setPosts] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [visibleAdd, setVisibleAdd] = useState("");
  const [previewImage, setPreviewImage] = useState(false);
  const [previewVisible, setPreviewVisible] = useState("");
  const [previewTitle, setPreviewTitle] = useState(false);
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

  const getPosts = async () => {
    postData("/api/product/getProductsTop", { count: countPosts })
      .then((res) => {
        setPosts(res.data.products);
      })
      .catch(() => {
        message.error("Lütfen internetinizi kontrol edin.");
      });
  };

  const deleteProduct = async (id, index) => {
    message.loading("Haber siliniyor");
    let photos = JSON.parse(posts[index].photos);

    const deleteProductRun = () => {
      deleteData("/api/product/deleteProduct/" + id)
        .then(() => {
          message.destroy();
          message.success("Ürün silindi.");
          const filter = posts.filter((p) => p.id !== id);
          setPosts(filter);
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

    photos.map((item, index) => {
      deleteData("/api/img/" + item).then(() => {
        return index === photos.length - 1 ? deleteProductRun() : void 0;
      });
    });
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const closeModal = () => {
    setVisibleAdd(false);
    setVisibleEdit(false);
    setFileList([]);
    setLink("");
    setTitle("");
    setEditorValue("");
  };

  const productAddClick = async () => {
    if (title && editorValue && fileList[0]) {
      setLoading(true);
      let uploadedPhotosNames = [];
      console.log(fileList);

      const postProduct = () => {
        let productData = {
          title: title,
          details: editorValue,
          photos: uploadedPhotosNames,
          isActive: publicBool,
        };

        postData("/api/product/addProduct", productData)
          .then(() => {
            setLoading(false);
            getPosts();
            closeModal();
          })
          .catch(() => {
            setLoading(false);
            message.error(
              "Ürün yüklenirken hata oluştu lütfen tekrar deneyin."
            );
          });
      };

      await fileList.map((item, index) => {
        const productPhoto = new FormData();

        productPhoto.append(
          "productPhoto",
          new File([item.originFileObj], item.name)
        );
        postFormData("/api/img/imageAdd", productPhoto)
          .then((res) => {
            uploadedPhotosNames.push(res.data.imageName);
            index == fileList.length - 1 ? postProduct() : void 0;
          })
          .catch((err) => {
            if (checkErrorIsAuth(err)) {
              return route.push(PAGE.home.href);
            } else {
              message.error("Bir fotoğraf yüklenemedi.");
            }
          });
      });
    } else {
      message.error(
        "Lütfen başlık eklediğinize ve fotoğraf yüklediğinize emin olun."
      );
      setLoading(false);
    }
  };

  const editPost = (dataIndex) => {
    let newFileList = [];
    const setDatas = () => {
      setFileList(newFileList);
      setEditDataIndex(dataIndex);
      setTitle(posts[dataIndex].title);
      setEditorValue(posts[dataIndex].details);
      setPublicBool(posts[dataIndex].isActive);
      setVisibleEdit(true);
    };
    const photos = JSON.parse(posts[dataIndex].photos);
    if (photos[0]) {
      photos.map(async (item, index) => {
        const response = await fetch(`${API_URL}/api/img/${item}`);
        // here image is url/location of image
        const blob = await response.blob();

        var file = new File([blob], item, { type: blob.type });
        file["thumbUrl"] = `${API_URL}/api/img/${item}`;
        newFileList.push(file);
        return index === photos.length - 1 ? setDatas() : void 0;
      });
    } else {
      setDatas();
    }
  };

  const productUpdateClick = async () => {
    if (title && editorValue && fileList[0]) {
      setLoading(true);
      function arr_diff_name(a1, a2) {
        var a = [],
          diff = [];

        for (var i = 0; i < a1.length - 1; i++) {
          a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length - 1; i++) {
          if (a[a2[i].name]) {
            delete a[a2[i].name];
          } else {
            a[a2[i].name] = true;
          }
        }

        for (var k in a) {
          diff.push(k);
        }

        return diff;
      }

      const onError = () => {
        setLoading(false);
        return message.error("Lütfen tekrar deneyiniz.");
      };

      let fileListFiltered = fileList.filter((item) => {
        return item.uid.indexOf("rc") === -1;
      });
      let updatePhotoList = fileList.filter((item) => {
        return item.uid.indexOf("rc") !== -1;
      });

      const oldPhotos = JSON.parse(posts[editDataIndex].photos);
      const deletedImageList = arr_diff_name(oldPhotos, fileListFiltered);
      const uploadedPhotosNames = fileListFiltered.map((item) => {
        return item.name;
      });
      const uploadedPhotos = arr_diff(uploadedPhotosNames, deletedImageList);
      console.log(fileListFiltered);
      console.log(uploadedPhotos);
      const updateProductRun = () => {
        console.log(uploadedPhotos);
      };

      // deletedImageList.map((item, index) => {
      //   return deleteData("/api/img/" + item)
      //     .then(() => {
      //       updatePhotoList.map((item2) => {
      //         const productPhoto = new FormData();

      //         productPhoto.append(
      //           "productPhoto",
      //           new File([item2.originFileObj], item2.name)
      //         );
      //         return postFormData("/api/img/imageAdd", productPhoto)
      //           .then((res) => {
      //             uploadedPhotosNames.push(res.data.imageName);
      //             index == updatePhotoList.length - 1
      //               ? updateProductRun()
      //               : void 0;
      //           })
      //           .catch((err) => {
      //             if (checkErrorIsAuth(err)) {
      //               return route.push(PAGE.home.href);
      //             } else {
      //               message.error("Bir fotoğraf yüklenemedi.");
      //             }
      //           });
      //       });
      //     })
      //     .catch(() => {
      //       onError();
      //     });
      // });
      setLoading(false);

      // let productData = {
      //   title: title,
      //   details: editorValue,
      //   photos: uploadedPhotosNames,
      //   isActive: publicBool,
      // };

      // postData("/api/product/addProduct", productData)
      //   .then(() => {
      //     setLoading(false);
      //     closeModal();
      //   })
      //   .catch(() => {
      //     setLoading(false);
      //     message.error("Ürün yüklenirken hata oluştu lütfen tekrar deneyin.");
      //   });
    } else {
      message.error(
        "Lütfen başlık eklediğinize ve fotoğraf yüklediğinize emin olun."
      );
      setLoading(false);
    }
  };

  const onImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onImagePreviewCancel = () => {
    setPreviewVisible(false);
  };

  const onImageChange = (files) => {
    setFileList(files.fileList);
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
                onClick={() => deleteProduct(row.id, index)}
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

    for (i = 0; i < titles.length; i++) {
      txtValue = titles[i].textContent || titles[i].innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
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
        title="Ürün Ekle"
        onCancel={closeModal}
        width="90%"
        footer={[
          <Button onClick={closeModal}>Kapat</Button>,
          <Button type="primary" loading={loading} onClick={productAddClick}>
            Davetiyeyi Ekle
          </Button>,
        ]}
      >
        <Form encType="multipart/form-data" id="imageUploadForm">
          <Form.Item name="title" label="Ürün Başlığı">
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item label="Ürün Fotoğrafları" rules={[{ required: true }]}>
            <Upload
              accept="images/*"
              name="productPhoto"
              listType="picture-card"
              fileList={fileList}
              onPreview={onImagePreview}
              onChange={onImageChange}
              multiple
              maxCount={10}
              id="imageUploadInput"
            >
              {fileList.length >= 10 ? null : uploadButton}
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
          <Button type="primary" loading={loading} onClick={productUpdateClick}>
            Düzenlemeyi Kaydet
          </Button>,
        ]}
      >
        <Form encType="multipart/form-data" id="imageUploadForm">
          <Form.Item name="title" label="Ürün Başlığı">
            <Input
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item label="Ürün Fotoğrafları" rules={[{ required: true }]}>
            <Upload
              accept="images/*"
              name="productPhoto"
              listType="picture-card"
              fileList={fileList}
              onPreview={onImagePreview}
              onChange={onImageChange}
              multiple
              maxCount={10}
              id="imageUploadInput"
            >
              {fileList.length >= 10 ? null : uploadButton}
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
          defaultValue={editorValue}
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
      {/* EDIT POST MODAL END */}
      {/* PREVIEW IMAGE MODAL BEGIN */}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={onImagePreviewCancel}
      >
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      {/* PREVIEW IMAGE MODAL END */}
    </LayoutAdmin>
  );
};
export default Product;