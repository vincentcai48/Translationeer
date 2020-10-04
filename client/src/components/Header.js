import React from "react";
import { Link } from "react-router-dom";
import { pAuth, googleAuthProvider } from "../services/config";
import { LangContext } from "../services/context";

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

/**PROPS:
 * Array[Object()] apis. These are the apis from this.context, but use it in props, because they take time to update
 */
class Header extends React.Component {
  constructor(props) {
    super();
    this.state = {
      apiOptions: [],
    };
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.apis !== this.props.apis) {
  //     console.log(this.props.apis);
  //     console.log(this.props.apis.length);
  //     var arr = await this.props.apis;
  //     console.log(arr);
  //     arr.forEach((e) => console.log(e));
  //     this.setState({ apiOptions: this.props.apis });
  //   }
  // }

  googleLogin = () => {
    pAuth
      .signInWithPopup(googleAuthProvider)
      .then((result) => {})
      .catch((e) => {
        console.log("!!!------ERROR AUTHENTICATING------!!!");
        console.log(e);
      });
  };

  setLanguage = (e) => {
    this.context.updateLanguage(e.target.name);
  };

  toggleService = (e) => {
    const originalApis = this.context.apis;
    const apiName =
      e.target.tagName == "BUTTON"
        ? e.target.name
        : e.target.parentElement.name;
    console.log(originalApis);
    var index = 0;
    var rightIndex = 0;
    originalApis.forEach((element) => {
      if (element.name == apiName) {
        rightIndex = index;
      }
      index++;
    });
    originalApis[rightIndex].enabled = !originalApis[rightIndex].enabled;
    this.context.updateApis(originalApis);
  };

  renderLanguageOptions = () => {
    var arr = [];
    const allLanguages = this.context.languageOptions;
    for (var i = 0; i < allLanguages.length; i++) {
      const n = allLanguages[i];
      arr.push(
        <li>
          <button
            name={n}
            onClick={this.setLanguage}
            className={
              allLanguages[i] == this.context.language ? "selected" : ""
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
  renderServiceOptions = () => {
    var arr = [];
    var allServices = this.context.apis;
    console.log(allServices);
    for (var i = 0; i < allServices.length; i++) {
      arr.push(
        <li>
          <button
            onClick={this.toggleService}
            name={allServices[i].name}
            className={allServices[i].enabled ? "enabled" : ""}
          >
            <div>{allServices[i].name}</div>
            <span className="api-subtext"></span>
          </button>
        </li>
      );
    }
    console.log(arr);
    return arr;
  };

  render() {
    return (
      <header id="header">
        <h1>
          <Link to="/" id="h1-link">
            Translationeer
          </Link>
        </h1>
        <div className="header-space"></div>
        <div id="menu-icon" className="fa fa-bars" onClick={toggleMenu}></div>
        <div id="menu-background">
          <div id="menu-options">
            <div id="services-dropdown">
              <div id="services-header-text">
                Services
                <i style={{ marginLeft: "5px" }} class="fas fa-caret-down"></i>
              </div>
              <ul id="serviceList">{this.renderServiceOptions()}</ul>
            </div>
            <div id="language-dropdown">
              <div id="current-language">{this.context.language}</div>
              <ul id="languageList">{this.renderLanguageOptions()}</ul>
            </div>
            <div className="header-item">
              <Link to="/docs" className="header-item-link">
                How to
              </Link>
            </div>
            <div className="header-item">
              <Link to="/studio" className="header-item-link">
                Studio
              </Link>
            </div>
            <div id="auth-area">
              {this.context.isAuth && pAuth.currentUser ? (
                <div id="header-user-info">
                  <div className="header-item">
                    <Link to="/dashboard" className="header-item-link">
                      Dashboard
                    </Link>
                  </div>
                  <Link to="/account" className="user-displayName">
                    <img
                      id="header-profile-picture"
                      src={pAuth.currentUser.photoURL}
                    ></img>

                    {pAuth.currentUser.displayName.split(" ")[0]}
                  </Link>
                </div>
              ) : (
                <button onClick={this.googleLogin} id="header-login-button">
                  <div id="google-logo"></div>
                  <div>Google Login</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
Header.contextType = LangContext;

export default Header;

/**{pAuth.currentUser && (
                <button type="button" id="header-logout" onClick={this.logout}>
                  Logout
                </button>
              )} */
