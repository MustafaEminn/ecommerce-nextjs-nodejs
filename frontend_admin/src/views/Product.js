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
import { useHistory } from "react-router-dom";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./Product.css";
import LayoutAdmin from "./Layout";
import Search from "antd/lib/input/Search";
import {
  deleteData,
  getData,
  postData,
  postFormData,
  putData,
} from "../api/fetch";
import { PAGE } from "../constants/page";

const Product = () => {
  const [posts, setPosts] = useState([]);
  const [searchPost, setSearchPost] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [visibleAdd, setVisibleAdd] = useState("");
  const [price, setPrice] = useState(1);
  const [sellCount, setSellCount] = useState(1);
  const [deletedPhotosNames, setDeletedPhotosNames] = useState([]);
  const [previewImage, setPreviewImage] = useState(false);
  const [previewVisible, setPreviewVisible] = useState("");
  const [previewTitle, setPreviewTitle] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [publicBool, setPublicBool] = useState(true);
  const [editorValue, setEditorValue] = useState();
  const [title, setTitle] = useState();
  const [countPosts, setCountPosts] = useState(10);
  const [editDataIndex, setEditDataIndex] = useState();
  const route = useHistory();
  const editorRef = useRef();

  const getPosts = async () => {
    await postData("/api/product/getProductsTopForAdmin", { count: countPosts })
      .then((res) => {
        setPosts(res.data.products);
      })
      .catch(() => {
        message.error("Lütfen internetinizi kontrol edin.");
      });
  };

  const deleteProduct = async (id, index) => {
    message.loading("Ürün siliniyor");
    let photos = JSON.parse(posts[index].photos || []);

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

    const deleteImg = async (item, index) => {
      await deleteData("/api/img/" + item)
        .then(() => {
          return index === photos.length - 1 ? deleteProductRun() : void 0;
        })
        .catch((err) => {
          console.log(err);
          return index === photos.length - 1 ? deleteProductRun() : void 0;
        });
    };

    Promise.all(
      photos.map(async (item, index) => {
        await deleteImg(item, index);
      })
    );
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
    setDeletedPhotosNames([]);
    setTitle("");
    setEditorValue("");
    setSellCount(0);
    setPrice(0);
  };

  const productAddClick = async () => {
    if (title && editorValue && fileList[0]) {
      setLoading(true);
      var uploadedPhotosNames = [];

      const postProduct = () => {
        if (uploadedPhotosNames.length === fileList.length) {
          let productData = {
            title: title,
            details: editorValue,
            photos: uploadedPhotosNames,
            isActive: publicBool,
            price: price,
            sellCount: sellCount,
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
        }
      };
      const photoNamesPush = (imageName) => {
        uploadedPhotosNames.push(imageName);
      };

      const addImage = async (item, index) => {
        const productPhoto = new FormData();

        await productPhoto.append(
          "productPhoto",
          new File([item.originFileObj], item.name)
        );
        await postFormData("/api/img/imageAdd", productPhoto)
          .then(async (res) => {
            photoNamesPush(res.data.imageName);
            postProduct();
          })
          .catch((err) => {
            if (checkErrorIsAuth(err)) {
              return route.push(PAGE.home.href);
            } else {
              message.error("Bir fotoğraf yüklenemedi.");
            }
          });
      };

      for await (const fileListItem of fileList.map((item, index) => {
        addImage(item, index);
      })) {
      }
    } else {
      message.error(
        "Lütfen başlık eklediğinize ve fotoğraf yüklediğinize emin olun."
      );
      setLoading(false);
    }
  };

  const editPost = async (dataIndex) => {
    let newFileList = [];
    const setDatas = () => {
      if (newFileList.length === photos.length) {
        setFileList(newFileList);
        setEditDataIndex(dataIndex);
        setTitle(posts[dataIndex].title);
        setEditorValue(posts[dataIndex].details);
        setPublicBool(posts[dataIndex].isActive);
        setPrice(posts[dataIndex].price);
        setSellCount(posts[dataIndex].sellCount);
        setVisibleEdit(true);
      }
    };
    const photos = JSON.parse(posts[dataIndex].photos);
    if (photos[0]) {
      const fileListPush = (file) => {
        newFileList.push(file);
      };
      const toBlob = async (item, index) => {
        const response = await getData(`/api/img/${item}`, {
          responseType: "blob",
        });
        // here image is url/location of image
        const blob = await response.data;

        var file = new File([blob], item, { type: blob.type });
        file["thumbUrl"] = `${API_URL}/api/img/${item}`;

        fileListPush(file);

        setDatas();
      };
      for await (const itemPhoto of photos.map((item, index) => {
        toBlob(item, index);
      })) {
      }
    } else {
      setDatas();
    }
  };

  const productUpdateClick = async () => {
    if (title && editorValue && fileList[0] && price) {
      setLoading(true);

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
      var uploadedPhotosNames = [];

      const updateRun = async () => {
        if (uploadedPhotosNames.length === updatePhotoList.length) {
          let alreadyUploadedPhotosNames = fileListFiltered.map((item) => {
            return item.name;
          });
          let productData = {
            title: title,
            details: editorValue,
            photos: [...alreadyUploadedPhotosNames, ...uploadedPhotosNames],
            isActive: publicBool,
            id: posts[editDataIndex].id,
            sellCount: sellCount,
            price: price,
          };

          await putData("/api/product/updateProduct", productData)
            .then(() => {
              setLoading(false);
              getPosts();
              closeModal();
            })
            .catch(() => {
              setLoading(false);
              message.error(
                "Ürün düzenlenirken hata oluştu lütfen tekrar deneyin."
              );
            });
        }
      };

      const photosNamesPush = async (name) => {
        await uploadedPhotosNames.push(name);
      };

      const updatePhoto = async (item, index) => {
        const productPhoto = new FormData();

        await productPhoto.append(
          "productPhoto",
          new File([item.originFileObj], item.name)
        );
        return await postFormData("/api/img/imageAdd", productPhoto)
          .then((res) => {
            photosNamesPush(res.data.imageName);

            updateRun();
          })
          .catch((err) => {
            if (checkErrorIsAuth(err)) {
              return route.push(PAGE.home.href);
            } else {
              message.error("Bir fotoğraf yüklenemedi.");
            }
          });
      };

      const updateNewPhotosRun = async () => {
        if (updatePhotoList[0]) {
          for await (const itemUpdatePhotoList of updatePhotoList.map((e, i) =>
            updatePhoto(e, i)
          ))
            console.log(itemUpdatePhotoList);
        } else {
          updateRun();
        }
      };
      let deletingPhotosHasError = false;
      const deleteImage = async (item, index) => {
        await deleteData("/api/img/" + item)
          .then(() => {
            return index === deletedPhotosNames.length - 1
              ? updateNewPhotosRun()
              : void 0;
          })
          .catch(() => {
            console.log("smakfmksaf");
            deletingPhotosHasError = true;
            onError();
            setLoading(false);
          });
      };

      if (deletedPhotosNames[0]) {
        for await (const itemDeletedPhotosNames of deletedPhotosNames.map(
          (e, i) => {
            if (!deletingPhotosHasError) {
              deleteImage(e, i);
            } else {
              setLoading(false);
            }
          }
        )) {
          console.log(itemDeletedPhotosNames);
        }
      } else {
        updateNewPhotosRun();
      }
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
    console.log(files);
    if (files.file.status === "removed") {
      if (files.file?.thumbUrl?.indexOf("api/img/") !== -1) {
        const fileName = files.file.thumbUrl.split("img/")[1];
        let newDeletedPhotosNames = [...deletedPhotosNames, fileName];
        setDeletedPhotosNames(newDeletedPhotosNames);
      }
    }

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
      title: "Fiyat",
      dataIndex: "price",
      key: "id",
      render: (item) => (
        <p
          className="titlesTable"
          style={{ maxHeight: "85px", overflow: "hidden" }}
        >
          {item}
        </p>
      ),
    },
    {
      title: "Satılmış",
      dataIndex: "sellCount",
      key: "id",
      render: (item) => (
        <p
          className="titlesTable"
          style={{ maxHeight: "85px", overflow: "hidden" }}
        >
          {item}
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
    () => (
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={searchPost[0] ? searchPost : posts}
      />
    ),
    [posts, searchPost]
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
  const onSearchID = async (e) => {
    if (e.length >= 10) {
      message.loading("Aranıyor...", 999);
      await getData("/api/product/getProductById/" + e)
        .then((res) => {
          message.destroy();
          message.success("Ürün bulundu.");
          setSearchPost(res.data.product);
        })
        .catch((err) => {
          if (err.response.data.code === 1) {
            message.destroy();
            message.error("Ürün aranırken hata oluştu.");
          } else {
            message.destroy();
            message.error("Bu ID'ye sahip ürün bulunamadı.");
          }
        });
    } else if (e.length === 0 && searchPost[0]) {
      setSearchPost([]);
    } else {
      message.error("ID en az 10 haneli olmalıdır.");
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
        <div style={{ display: "flex", alignItems: "center" }}>
          Davetiye Sayısı:
          <InputNumber
            defaultValue={10}
            style={{ margin: "15px", height: "32px" }}
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
        placeholder="Başlık ara..."
        allowClear
        enterButton
        onChange={onSearch}
        style={{ margin: "15px", width: "200px" }}
      />
      <Search
        placeholder="ID ara..."
        allowClear
        enterButton
        onSearch={onSearchID}
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
          <Form.Item name="price" label="Fiyat">
            <Input
              onChange={(e) => {
                setPrice(e.target.value);
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
              defaultChecked={publicBool}
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
              defaultChecked={publicBool}
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
