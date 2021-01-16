import React from "react";
import { pAuth, googleAuthProvider, pFirestore } from "../services/config";
import { LangContext } from "../services/context";

class Auth extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuth: false,
    };
  }

  googleLogin = () => {
    pAuth
      .signInWithPopup(googleAuthProvider)
      .then((result) => {
        var token = result.credential.accessToken;
        var user = result.user;
        this.setState({ isAuth: true });
      })
      .catch((e) => {
        console.log("!!!------ERROR AUTHENTICATING------!!!");
        console.log(e);
      });
  };

  logout = () => {
    console.log("Logout");
    pAuth
      .signOut()
      .then(() => {
        console.log("Sign Out Successful");
        this.setState({ isAuth: true });
      })
      .catch((e) => console.log("Sign Out Error"));
  };

  // <form id="login-form">
  //         <input type="text" placeholder="Email" name="email"></input>
  //         <input type="password" placeholder="Password" name="password"></input>
  //       </form>

  render() {
    return (
      <div id="login-container">
        <h2>Login</h2>
        {!pAuth.currentUser && (
          <button
            type="button"
            id="google-auth-button"
            onClick={this.googleLogin}
          >
            <div className="large-google-logo"></div>
            Login With Google
          </button>
        )}

        {pAuth.currentUser && (
          <button type="button" onClick={this.logout}>
            Logout
          </button>
        )}
        <p>
          Connect Translationeer with your Google Account to unlock all features
          in Translationeer toolbox
        </p>
      </div>
    );
  }
}
Auth.contextType = LangContext;

export default Auth;
