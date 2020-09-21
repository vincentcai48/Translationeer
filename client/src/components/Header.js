import React from "react";
import { Link } from "react-router-dom";
import { pAuth } from "../services/config";
import { LangContext } from "../services/context";

class Header extends React.Component {
  constructor() {
    super();
  }

  logout = () => {
    pAuth
      .signOut()
      .then(console.log("Logout Success"))
      .catch((e) => console.log("Logout Error", e));
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
        <div className="header-item">
          <Link to="/studio" className="header-item-link">
            Studio
          </Link>
        </div>
        <div id="auth-area">
          {this.context.isAuth && pAuth.currentUser ? (
            <div id="header-user-info">
              {pAuth.currentUser && (
                <button type="button" id="header-logout" onClick={this.logout}>
                  Logout
                </button>
              )}
              <div class="user-displayName">
                <img
                  id="header-profile-picture"
                  src={pAuth.currentUser.photoURL}
                ></img>

                {pAuth.currentUser.displayName}
              </div>
            </div>
          ) : (
            <Link to="/studio" id="header-login-button">
              <div id="google-logo"></div>
              <div>Google Login</div>
            </Link>
          )}
        </div>
      </header>
    );
  }
}
Header.contextType = LangContext;

export default Header;
