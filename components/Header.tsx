
import {useContext} from "react";
import Link from "next/link";
import { pAuth, googleAuthProvider } from "../services/config";
import PContext from "../services/context"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function toggleMenu(e) {
    const menuBackgroundDOM = document.getElementById("menu-background");
    if (menuBackgroundDOM.style.display !== "none") {
      menuBackgroundDOM.style.display = "none";
      e.target.classList = "fa fa-bars";
    } else {
      menuBackgroundDOM.style.display = "block";
      e.target.classList = "fas fa-times";
    }
}


export default function Header(){
    const context = useContext(PContext);

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
                className={
                  allLanguages[i] == context.language ? "selected" : ""
                }
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
    

    return <header id="header">
        <h1>
          <Link href="/">
            <a id="h1-link">Translationeer</a>
          </Link>
        </h1>
        <div className="header-space"></div>
        <div id="menu-icon" className="fa fa-bars" onClick={toggleMenu}></div>
        <div id="menu-background">
          <div id="menu-options">
            <div id="services-dropdown">
              <div id="services-header-text">
                Translators
                <FontAwesomeIcon className="sib ml5" icon={faCaretDown}></FontAwesomeIcon>
              </div>
              <ul id="serviceList">{renderServiceOptions()}</ul>
            </div>
            <div id="language-dropdown">
              <div id="current-language">{context.language}</div>
              <ul id="languageList">{renderLanguageOptions()}</ul>
            </div>
            <div className="header-item">
              <Link href="/howto">
                <a className="header-item-link">How to</a>
              </Link>
            </div>
            <div className="header-item">
              <Link href="/studiodefault">
                <a className="header-item-link">Studio</a>
              </Link>
            </div>
            <div id="auth-area">
              {context.isAuth && pAuth.currentUser ? (
                <div id="header-user-info">
                  <div className="header-item">
                    <Link href="/dashboard">
                      <a className="header-item-link">Dashboard</a>
                    </Link>
                  </div>
                </div>
              ) : (
                <button onClick={googleLogin} id="header-login-button">
                  <div id="google-logo"></div>
                  <div>Google Login</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
}