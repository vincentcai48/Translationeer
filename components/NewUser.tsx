import React, { useState } from "react";
import ReactMarkdown from 'react-markdown'
//import privacypolicy from "./legal/markdownfiles/privacypolicy.md";

//PROPS: Function() registerNewUser, Function() cancelFunction, Object() user, Array tc[] (for terms and conditions)
export default function NewUser(props) {
  const [showMessage, changeMessage] = useState(false);
  const [isChecked, toggleChecked] = useState(false);
  const [isTCShown, toggeTCShown] = useState(false);

  var privacypolicy = require("./legal/markdownfiles/privacypolicy.md").default;

  //var privacypolicy = require("./legal/markdownfiles/privacypolicy.md").default
  //var termsandconditions = require("./legal/markdownfiles/termsandconditions.md").default


  var submit = () => {
    if (isChecked) {
      props.registerNewUser(props.user);
    } else {
      changeMessage(true);
    }
  };

  return (
    <div id="newUser-container">
      <h1 id="h1-link" onClick={props.cancelFunction}>
        Translationeer
      </h1>
      <section>
        <h2>
          {props.user.displayName.split(" ")[0]}, Welcome to Translationeer!
        </h2>
        <p>
          <input
            type="checkbox"
            id="check-tc"
            onChange={() => {
              toggleChecked(!isChecked);
              changeMessage(false);
            }}
            checked={isChecked}
          ></input>{" "}
          I have read and accepted the Translationeer{" "}
          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "purple",
              textDecoration: "underline",
              padding: "0px",
            }}
            onClick={() => toggeTCShown(!isTCShown)}
          >
            term and conditions and privacy policy
          </button>
        </p>
        {isTCShown && (
          <div id="tcNewUser">
            <ReactMarkdown>{privacypolicy}</ReactMarkdown>
            <br></br>
            <hr></hr>
            {/* <ReactMarkdown>{termsandconditions}</ReactMarkdown> */}
          </div>
        )}
        {showMessage && (
          <p id="tc-message">
            You must agree to our terms and conditions and privacy policy
          </p>
        )}
        <button type="button" onClick={submit}>
          Create My Account
        </button>{" "}
        <button
          type="button"
          id="cancel-newUser"
          onClick={props.cancelFunction}
        >
          Cancel
        </button>
      </section>
    </div>
  );
  //{props.user.displayName.split(" ")[0]}
}
