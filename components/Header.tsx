import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { pAuth, googleAuthProvider } from "../services/config";
import PContext from "../services/context";
import {
  faBars,
  faCaretDown,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  const context = useContext(PContext);
  const [showMenu, setShowMenu] = useState<boolean>(true);

  useEffect(()=>{
    setShowMenu(!(window.outerWidth<=992));
  },[])

  const renderLanguageOptions = () => {
    var arr = [];
    const allLanguages = context.languageOptions;
    for (let i = 0; i < allLanguages.length; i++) {
      const n = allLanguages[i];
      arr.push(
        <li key={i}>
          <button
            name={n}
            onClick={setLanguage}
            className={allLanguages[i] == context.language ? "selected" : ""}
          >
            {allLanguages[i]}
          </button>
        </li>
      );
    }
    return arr;
  };

  //this methods depends on this.state.apiOptions
  const renderServiceOptions = () => {
    var arr = [];
    var allServices = context.apis;
    for (let i = 0; i < allServices.length; i++) {
      arr.push(
        <li key={i}>
          <button
            onClick={toggleService}
            name={allServices[i].name}
            className={allServices[i].enabled ? "enabled" : ""}
          >
            <div>{allServices[i].name}</div>
            <span className="api-subtext"></span>
          </button>
        </li>
      );
    }
    return arr;
  };

  const toggleService = (e) => {
    var originalApis = [...context.apis];
    const apiName =
      e.target.tagName == "BUTTON"
        ? e.target.name
        : e.target.parentElement.name;
    var index = 0;
    var rightIndex = 0;
    originalApis.forEach((element) => {
      if (element.name == apiName) {
        rightIndex = index;
      }
      index++;
    });
    originalApis[rightIndex].enabled = !originalApis[rightIndex].enabled;
    context.setApis(originalApis);
  };

  const googleLogin = () => {
    pAuth
      .signInWithPopup(googleAuthProvider)
      .then((result) => {})
      .catch((e) => {
        console.error(e);
      });
  };

  const setLanguage = (e) => {
    context.updateLanguage(e.target.name);
  };

  return (
    <header id="header">
      <h1>
        <Link href="/">
          <a id="h1-link">Translationeer</a>
        </Link>
      </h1>
      <div className="header-space"></div>
      <div id="menu-icon" onClick={() => setShowMenu(!showMenu)}>
        <FontAwesomeIcon className="sib mr15" icon={faBars}></FontAwesomeIcon>
      </div>
      {showMenu && (
        <div id="menu-options">
          <div id="services-dropdown">
            <div id="services-header-text">
              Translators
              <FontAwesomeIcon
                className="sib ml5"
                icon={faCaretDown}
              ></FontAwesomeIcon>
            </div>
            <ul id="serviceList">{renderServiceOptions()}</ul>
          </div>
          <div id="language-dropdown">
            <div id="current-language">{context.language}</div>
            <ul id="languageList">{renderLanguageOptions()}</ul>
          </div>
          <div className="header-item">
            <Link href="/documentation/howto">
              <a className="header-item-link">How to</a>
            </Link>
          </div>
          <div className="header-item">
            <Link href="/documentation">
              <a className="header-item-link">Documentation</a>
            </Link>
          </div>
          <div id="auth-area">
            {context.isAuth && pAuth.currentUser && (
              <div id="header-user-info">
                {/* <div className="header-item">
                    <Link href="/">
                      <a className="header-item-link">Dashboard</a>
                    </Link>
                  </div> */}
                <Link href="/">
                  <a className="account-box">
                    <FontAwesomeIcon
                      className="auth-icon"
                      icon={faUserCircle}
                    ></FontAwesomeIcon>
                    <div className="tooltip">{pAuth.currentUser.email}</div>
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
