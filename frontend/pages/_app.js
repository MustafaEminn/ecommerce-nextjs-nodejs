import "../styles/globals.scss";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
