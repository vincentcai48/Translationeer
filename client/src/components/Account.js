import React from "react";
import { pAuth, pFirestore } from "../services/config";
import Auth from "./Auth";
import { Link } from "react-router-dom";

class Account extends React.Component {
  logout = () => {
    pAuth
      .signOut()
      .then(console.log("Logout Success"))
      .catch((e) => console.log("Logout Error", e));
  };

  render() {
    return (
      <div>
        {pAuth.currentUser ? (
          <div id="account-container">
            <h2>Account</h2>
            <img src={pAuth.currentUser.photoURL} alt="Profile Photo" />
            <h3>{pAuth.currentUser.displayName}</h3>
            <h4>Email: {pAuth.currentUser.email}</h4>
            <section>
              This account on Translationeer is authorized through Google. Login
              and create Translationeer Accounts by using a Google Account
            </section>
            <Link to="/dashboard" className="go-to-dashboard">
              Go To My Dashboard
            </Link>
            <button onClick={this.logout}>Logout</button>
          </div>
        ) : (
          <Auth />
        )}
      </div>
    );
  }
}

export default Account;
