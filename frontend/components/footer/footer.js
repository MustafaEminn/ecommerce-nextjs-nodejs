import styles from "../../styles/components/footer/footer.module.scss";
import LogoWhite from "../logo/logoWhite";
import Spacer from "../Spacer/spacer";
import TelephoneIcon from "../../public/icons/telephone";
import WhatsappIcon from "../../public/icons/whatsapp";
import InstagramIcon from "../../public/icons/instagram";
import { BASE, PAGE, SOCIAL } from "../../constants";
import Link from "next/dist/client/link";

function FooterComp() {
  return (
    <div className={styles.containerBG}>
      <div className={styles.container} style={{ width: BASE.widthNavbar }}>
        <span className={styles.logo}>
          <Link href={PAGE.login.href}>
            <a>
              <LogoWhite fontSize="40px" />
            </a>
          </Link>
        </span>
        <div className={styles.contact}>
          <span className={styles.phone}>
            <TelephoneIcon width="18px" height="18px" /> <p>+0 222 222 22 22</p>
          </span>
          <span className={styles.whatsapp}>
            <WhatsappIcon width="18px" height="18px" /> <p>+90 555 555 55 55</p>
          </span>
          <span className={styles.instagram}>
            <a href={SOCIAL.instagram.href} target="_blank">
              <InstagramIcon width="18px" height="18px" />
              <p>{SOCIAL.instagram.username}</p>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default FooterComp;
