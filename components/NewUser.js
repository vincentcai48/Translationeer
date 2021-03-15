import React, { useState } from "react";
import { pFirestore } from "../services/config";
import { parser } from "../services/react-custom-markdown/mdparser";
import ReactHtmlParser from "react-html-parser";

//PROPS: Function() registerNewUser, Function() cancelFunction, Object() user, Array tc[] (for terms and conditions)
function NewUser(props) {
  const [showMessage, changeMessage] = useState(false);
  const [isChecked, toggleChecked] = useState(false);
  const [isTCShown, toggeTCShown] = useState(false);

  var privacypolicy = parser(
    require("./legal/markdownfiles/privacypolicy.md").default
  );
  var termsandconditions = parser(
    require("./legal/markdownfiles/termsandconditions.md").default
  );

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
            {/* {props.tc.map((e) => {
              return (
                <p>
                  <br></br>
                  {e}
                  <br></br>
                </p>
              );
            })} */}
            {ReactHtmlParser(privacypolicy)}
            <br></br>
            <hr></hr>
            {ReactHtmlParser(termsandconditions)}
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

export default NewUser;
