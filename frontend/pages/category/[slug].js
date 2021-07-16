import LayoutMain from "../../components/Layout/layoutMain";
import Head from "next/dist/next-server/lib/head";
import styles from "../../styles/pages/category/category.module.scss";
import stylesM from "../../styles/pages/category/categoryM.module.scss";
import { useEffect, useState } from "react";
import { getData } from "../../api/fetch";
import { API, PAGE } from "../../constants";
import { useRouter } from "next/router";
import { addCart } from "../../utils/cartMethods";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartChangeTrigger,
  categoryChangeTrigger,
  isAuthed,
  isMobile,
} from "../../states/index.atom";
import slugify from "slugify";
import Link from "next/link";
import HorizontalMiddleCartBorderedButton from "../../components/buttons/cards/horizontalMiddleCartBorderedButton";
import ReactPaginate from "react-paginate";
import { getParameterByName } from "../../utils/getQuery";
import InvitationIcon from "../../public/icons/invitationIcon";
import LayoutMainMobile from "../../components/Layout/layoutMainM";
import Image from "next/dist/client/image";
import { srcLoader } from "../../utils/srcLoader";

function ProductsPage() {
  const [page, setPage] = useState(1);
  const [countOfPages, setCountOfPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(false);
  const isAuth = useRecoilValue(isAuthed);
  const isMobileDevice = useRecoilValue(isMobile);
  const categoryChange = useRecoilValue(categoryChangeTrigger);
  const [cartTrigger, setCartTrigger] = useRecoilState(cartChangeTrigger);
  const router = useRouter();

  const getCategory = () => {
    if (process.browser) {
      return window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 1
      ];
    }
  };

  const getProducts = async (number = getParameterByName("page"), query) => {
    const queryUrl = query ? `?${query}` : "";
    await getData(
      "/api/product/getProductsPageByPage/" +
        getCategory() +
        "/" +
        number +
        queryUrl
    )
      .then((res) => {
        if (!res.data.products[0] && Number(number) !== 1) {
          return (window.location.search = "?page=" + res.data.countOfPages);
        }
        setProducts(res.data.products);
        setCountOfPages(res.data.countOfPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    (async () => {
      setPage(Number(getParameterByName("page") - 1));
      await getProducts();
      setPageLoading(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setPage(Number(getParameterByName("page") - 1));
      await getProducts();
      setPageLoading(false);
    })();
  }, [categoryChange]);

  const onAddCart = (product, event) => {
    event.preventDefault();
    setCartTrigger(!cartTrigger);
    addCart({ productId: product.id, count: 50, checked: true }, isAuth);
  };

  const onPageChange = async (number) => {
    setLiveLoading(true);
    router.push({
      pathname: "/category/" + getCategory(),
      query: { page: number },
    });
    getProducts(number);
    setPage(number);
    setLiveLoading(false);
  };

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target.parentElement.classList.contains("pagination-page")) {
        onPageChange(e.target.textContent);
      }
    });
    window.addEventListener("click", (e) => {
      if (e.target.parentElement.classList.contains("pagination-page-mobile")) {
        onPageChange(e.target.textContent);
      }
    });
    return () => {
      window.removeEventListener("click", () => {});
    };
  }, []);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isMobileDevice ? (
        <LayoutMainMobile liveLoading={liveLoading} pageLoading={pageLoading}>
          <div className={stylesM.filterContainer}>
            <Link
              href={{
                pathname: PAGE.category.href + getCategory(),
                query: {
                  page: 1,
                  sort: "mostSelling",
                },
              }}
            >
              <a
                onClick={async () => {
                  setLiveLoading(true);
                  await getProducts(
                    getParameterByName("page"),
                    "sort=mostSelling"
                  );
                  setLiveLoading(false);
                }}
              >
                En Çok Satılanlar
              </a>
            </Link>
            <Link
              href={{
                pathname: PAGE.category.href + getCategory(),
                query: {
                  page: 1,
                  sort: "lowToHigh",
                },
              }}
            >
              <a
                onClick={async () => {
                  setLiveLoading(true);
                  await getProducts(
                    getParameterByName("page"),
                    "sort=lowToHigh"
                  );
                  setLiveLoading(false);
                }}
              >
                Artan Fiyat
              </a>
            </Link>
            <Link
              href={{
                pathname: PAGE.category.href + getCategory(),
                query: {
                  page: 1,
                  sort: "highToLow",
                },
              }}
            >
              <a
                onClick={async () => {
                  setLiveLoading(true);
                  await getProducts(
                    getParameterByName("page"),
                    "sort=highToLow"
                  );
                  setLiveLoading(false);
                }}
              >
                Azalan Fiyat
              </a>
            </Link>
          </div>
          {products.length > 0 ? (
            <>
              <div className={stylesM.container}>
                {products.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      href={"/product/" + slugify(item.title) + "-" + item.id}
                    >
                      <a>
                        <div className={stylesM.productContainer}>
                          <div className={stylesM.imgContainer}>
                            <Image
                              loading="lazy"
                              src={`${API.imgUrl}${item.photos[0]}`}
                              layout="fill"
                              loader={srcLoader}
                            />
                          </div>

                          <div className={stylesM.productDetails}>
                            <h1>{item.title}</h1>
                            <div>{item.price + 30} TL</div>
                            <HorizontalMiddleCartBorderedButton
                              onClick={(e) => {
                                onAddCart(item, e);
                              }}
                              width="100%"
                            />
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
              <ReactPaginate
                pageCount={countOfPages}
                initialPage={page}
                previousLabel={"Önceki"}
                nextLabel={"Sonraki"}
                containerClassName={"container-pagination-mobile"}
                activeClassName={"pagination-active-mobile"}
                pageClassName={"pagination-page-mobile"}
                marginPagesDisplayed={0}
              />
            </>
          ) : (
            <div className={stylesM.noProductContainer}>
              <InvitationIcon width="56px" height="56px" />
              <h1>Kategoriye ait ürün bulunamadı</h1>
            </div>
          )}
        </LayoutMainMobile>
      ) : (
        <LayoutMain liveLoading={liveLoading} pageLoading={pageLoading}>
          <div className={styles.filterContainer}>
            <Link
              href={{
                pathname: PAGE.category.href + getCategory(),
                query: {
                  page: 1,
                  sort: "mostSelling",
                },
              }}
            >
              <a
                onClick={async () => {
                  setLiveLoading(true);
                  await getProducts(
                    getParameterByName("page"),
                    "sort=mostSelling"
                  );
                  setLiveLoading(false);
                }}
              >
                En Çok Satılanlar
              </a>
            </Link>
            <Link
              href={{
                pathname: PAGE.category.href + getCategory(),
                query: {
                  page: 1,
                  sort: "lowToHigh",
                },
              }}
            >
              <a
                onClick={async () => {
                  setLiveLoading(true);
                  await getProducts(
                    getParameterByName("page"),
                    "sort=lowToHigh"
                  );
                  setLiveLoading(false);
                }}
              >
                Artan Fiyat
              </a>
            </Link>
            <Link
              href={{
                pathname: PAGE.category.href + getCategory(),
                query: {
                  page: 1,
                  sort: "highToLow",
                },
              }}
            >
              <a
                onClick={async () => {
                  setLiveLoading(true);
                  await getProducts(
                    getParameterByName("page"),
                    "sort=highToLow"
                  );
                  setLiveLoading(false);
                }}
              >
                Azalan Fiyat
              </a>
            </Link>
          </div>
          {products.length > 0 ? (
            <>
              <div className={styles.container}>
                {products.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      href={"/product/" + slugify(item.title) + "-" + item.id}
                    >
                      <a>
                        <div className={styles.productContainer}>
                          <div className={styles.imgContainer}>
                            <Image
                              loading="lazy"
                              src={`${API.imgUrl}${item.photos[0]}`}
                              layout="fill"
                              loader={srcLoader}
                            />
                          </div>

                          <div className={styles.productDetails}>
                            <h1>{item.title}</h1>
                            <div>{item.price + 30} TL</div>
                            <HorizontalMiddleCartBorderedButton
                              onClick={(e) => {
                                onAddCart(item, e);
                              }}
                              width="100%"
                            />
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
              <ReactPaginate
                pageCount={countOfPages}
                initialPage={page}
                previousLabel={"Önceki"}
                nextLabel={"Sonraki"}
                containerClassName={"container-pagination"}
                activeClassName={"pagination-active"}
                pageClassName={"pagination-page"}
              />
            </>
          ) : (
            <div className={styles.noProductContainer}>
              <InvitationIcon width="56px" height="56px" />
              <h1>Kategoriye ait ürün bulunamadı</h1>
            </div>
          )}
        </LayoutMain>
      )}
    </div>
  );
}

export default ProductsPage;
