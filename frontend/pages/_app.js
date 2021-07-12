import "../styles/globals.scss";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import { RecoilRoot } from "recoil";
import OrientationDetector from "../components/orientationDetector/orientationDetector";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <OrientationDetector>
        <Component {...pageProps} />
      </OrientationDetector>
    </RecoilRoot>
  );
}

export default MyApp;
