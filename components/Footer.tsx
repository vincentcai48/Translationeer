import Link from "next/link";

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div>&copy; Copyright Translationeer 2021</div>
        <ul className="legal-list">
          <li>
            <Link href="/legal/privacypolicy">
              <a className="link">Privacy Policy</a>
            </Link>
          </li>
          <li>
            <Link href="/legal/termsandconditions">
              <a className="link">Terms And Conditions</a>
            </Link>
          </li>
          <li>
            <Link href="/legal/disclaimers">
              <a className="link">Disclaimers</a>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
