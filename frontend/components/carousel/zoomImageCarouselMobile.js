import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/dist/client/image";
import styles from "../../styles/components/carousel/zoomImageCarouselM.module.scss";
import { srcLoader } from "../../utils/srcLoader";
import { API } from "../../constants";
import SwiperCore, { Navigation } from "swiper/core";
import MainColorButton from "../buttons/mainColorButton";
import CloseIcon from "../../public/icons/close";

function ZoomImageCarouselMobile({
  photos = [],
  className,
  visible = false,
  onClose = () => void 0,
}) {
  SwiperCore.use([Navigation]);

  return (
    <div
      visible={visible ? "visible" : "hidden"}
      className={className}
      id={styles.container}
    >
      <div className={styles.buttonContainer}>
        <MainColorButton
          onClick={onClose}
          width="50px"
          height="50px"
          icon={<CloseIcon />}
        />
      </div>
      <Swiper
        spaceBetween={25}
        slidesPerView={1}
        className={styles.swiperContainer}
        navigation={true}
        loop={true}
        slidesPerGroup={1}
      >
        {photos.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <Image
                src={`${API.imgUrl}${item}`}
                className={styles.swiperImg}
                layout="fill"
                loader={srcLoader}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default ZoomImageCarouselMobile;
