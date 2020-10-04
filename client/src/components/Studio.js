import React from "react";
import { pAuth, pFirestore, fbFieldValue } from "../services/config";
import Auth from "./Auth";
import { LangContext } from "../services/context";
import Slider from "./studioComponents/slider";
import LeftStudio from "./studioComponents/leftStudio";
import RightStudio from "./studioComponents/rightStudio";
import EditTranslation from "./studioComponents/editTranslation";
import StudioHeader from "./studioComponents/studioHeader";
import Loading from "./Loading";
import DocumentsList from "./DocumentsList";
import StudioDefault from "./studioComponents/studioDefault";
import { Redirect, browserHistory, Link } from "react-router-dom";

var x, y;
var rect;
window.addEventListener("mousemove", (e) => {
  // e = Mouse click event.
  if (document.querySelector("body") && !rect) {
    rect = document.querySelector("body").getBoundingClientRect();
  }
  if (rect) {
    x = e.pageX - rect.left; //x position within the element.
    y = e.pageY - rect.top; //y position within the element.
  }
});

function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

class Studio extends React.Component {
  constructor() {
    super();
    this.state = {
      documents: [],
      currentDoc: null,
      currentSection: -1,
      loading: false,
    };
  }

  componentWillMount() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("document")) {
      this.setCurrentDoc(urlParams.get("document"));
    }
  }

  componentDidMount() {
    pAuth.onAuthStateChanged((user) => {
      if (user) {
        pFirestore
          .collection("users")
          .doc(pAuth.currentUser.uid)
          .collection("documents")
          .onSnapshot((docs) => {
            var arr = [];

            docs.forEach((d) => {
              console.log(d.data());
              arr.push({ ...d.data(), uid: d.id });
            });

            this.setState({ documents: arr });

            //checking if there is url param. if so, then automatically open a specific document.
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("document")) {
              this.setCurrentDoc(urlParams.get("document"));
            }
          });
      }
    });
  }

  setCurrentDoc = (name) => {
    var rightDoc = null;
    this.state.documents.forEach((doc) => {
      if (doc.name == name) {
        rightDoc = doc;
      }
    });

    this.setState({
      currentDoc: rightDoc,
    });
  };

  promptEdit = (section) => {
    this.setState({ currentSection: section });
  };

  changeTranslation = (section, translation) => {
    // var docs = this.state.documents;
    // docs[section].translation = translation;
    console.log("DOC BEFORE TRANSLATION", this.state.currentDoc);
    var thisDoc = this.state.currentDoc;
    thisDoc.body[section].translation = translation;
    console.log("DOC with NEW TRANSLATION:", thisDoc);
    this.setState({ currentSection: -1, currentDoc: thisDoc });
    this.saveAll();
  };

  breakOffText = (text, section) => {
    if (this.state.currentDoc.body[section].text.indexOf(text) > -1) {
      const sectionObj = this.state.currentDoc.body[section];

      const startingIndex = this.state.currentDoc.body[section].text.indexOf(
        text
      );

      const endingIndex = startingIndex + text.length;

      var newArr = [
        {
          text: sectionObj.text.substr(0, startingIndex),
          translation: this.context.defaultText,
        },
        {
          text: text,
          translation: sectionObj.translation,
        },
        {
          text: sectionObj.text.substr(endingIndex),
          translation: this.context.defaultText,
        },
      ];
      newArr = newArr.filter((e) => {
        if (e.text.length < 2) return false;
        var newEl = e.text;
        newEl
          .replaceAll("\t", "")
          .replaceAll(" ", "")
          .replaceAll("")
          .replaceAll(/(\r\n|\n|\r)/gm, "")
          .replaceAll(/[\s\u00A0]/gm, "");
        if (newEl.length < 2) return false;
        return true;
      });
      var newDoc = this.state.currentDoc;

      //the splice method modifies by reference, important. Do NOT try newDoc.body = newDoc.body.splice(...);
      newDoc.body.splice(section, 1, ...newArr);

      this.setState({ currentDoc: newDoc });
      clearSelection();
      this.saveAll();
    }
  };

  addSection = (insertAt, text) => {
    if (this.state.currentDoc) {
      var newDoc = this.state.currentDoc;
      newDoc.body.splice(insertAt, 0, {
        text: text,
        translation: this.context.defaultText,
      });
      this.setState({ currentDoc: newDoc });
      this.saveAll();
    }
  };

  deleteSection = (section) => {
    if (this.state.currentDoc) {
      var newDoc = this.state.currentDoc;
      newDoc.body.splice(section, 1);
      this.setState({ currentDoc: newDoc });
      this.saveAll();
    }
  };

  mergeUp = (section) => {
    if (section < 1 || section >= this.state.currentDoc.body.length) {
      return;
    }
    var thisSection = this.state.currentDoc.body[section];
    var prevSection = this.state.currentDoc.body[section - 1];
    var mergedSection = {
      text: prevSection.text + "" + thisSection.text,
      translation: prevSection.translation + " " + thisSection.translation,
    };
    var newDoc = this.state.currentDoc;
    newDoc.body.splice(section - 1, 2, mergedSection);
    this.setState({ currentDoc: newDoc });
    this.saveAll();
  };

  mergeDown = (section) => {
    if (section < 0 || section >= this.state.currentDoc.body.length - 1) {
      return;
    }
    var thisSection = this.state.currentDoc.body[section];
    var nextSection = this.state.currentDoc.body[section + 1];
    var mergedSection = {
      text: thisSection.text + "" + nextSection.text,
      translation: thisSection.translation + " " + nextSection.translation,
    };
    var newDoc = this.state.currentDoc;
    newDoc.body.splice(section, 2, mergedSection);
    this.setState({ currentDoc: newDoc });
    this.saveAll();
  };

  saveAll = async () => {
    this.setState({ loading: true });
    var thisDoc = this.state.currentDoc;
    thisDoc.timestamp = fbFieldValue.serverTimestamp();
    var docid = this.state.currentDoc.uid;

    if (pAuth.currentUser) {
      await pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(docid)
        .update(thisDoc);
    }
    this.setState({ loading: false });
  };

  /**These three functions to save doc settings, add a new doc, and delete a doc. are just copy and pasted from the dashbaord, and do the exact same thing. */
  saveDocSettings = (name, newName, newColor) => {
    //get the right doc based on name,
    var rightDoc = {};
    this.state.documents.forEach((doc) => {
      if (doc.name == name) {
        rightDoc = doc;
      }
    });
    //Make sure name is unique, otherwise just use the original name.
    // var isUnique = true;
    this.state.documents.forEach((doc) => {
      if (doc.name == newName) {
        newName = name;
        // var d = new Date();
        // var uniqueName = newName + " " + d.getTime();
        // isUnique = false;
        // this.saveDocSettings(name, uniqueName, newColor);
      }
    });
    // if (!isUnique) return;

    //then set the new properties
    rightDoc.name = newName;
    rightDoc.color = newColor;
    rightDoc.timestamp = fbFieldValue.serverTimestamp();

    var docid = rightDoc.uid;
    if (pAuth.currentUser) {
      pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(docid)
        .update(rightDoc);
    }
  };

  addDoc = (name, color, text) => {
    console.log("ADDING DOCS!!!!");
    pFirestore
      .collection("users")
      .doc(pAuth.currentUser.uid)
      .collection("documents")
      .add({
        name: name,
        color: color,
        body: [{ text: text, translation: this.context.defaultText }],
        timestamp: fbFieldValue.serverTimestamp(),
      })
      .then(() => {
        this.openInStudio();
      });
  };

  deleteDoc = (name) => {
    //get the right doc based on name,
    var rightDoc = {};
    this.state.documents.forEach((doc) => {
      if (doc.name == name) {
        rightDoc = doc;
      }
    });
    //then do the delete. Note: don't worry about the uid not being there, although it is not created in addDoc(), it will be added in this.state.documents in componentDidMount().
    if (pAuth.currentUser) {
      pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(rightDoc.uid)
        .delete()
        .then(() => {
          console.log("Deleted");
        })
        .catch((e) => console.log("error deleting", e));
    }
  };

  openInStudio = (name) => {
    var url = "/studio?document=" + name;
    window.location = url;
  };

  copyTranslation = () => {
    if (this.state.currentDoc && this.state.currentDoc.body) {
      var finalTranslation = "";
      this.state.currentDoc.body.forEach((e) => {
        finalTranslation += e.translation + " ";
      });
      navigator.clipboard.writeText(finalTranslation).then(
        () => {
          alert("Successfully Copied Translation to Clipboard");
        },
        () => {
          alert("Error Copying Translation");
        }
      );
    }
  };

  render() {
    var currentDocBody = this.state.currentDoc
      ? this.state.currentDoc.body
      : [];
    return pAuth.currentUser ? (
      <div id="studio">
        <h1
          id="studio-h1"
          style={
            !this.state.currentDoc
              ? {
                  backgroundColor: "var(--scd)",
                  fontSize: "50px",
                  boxShadow: "0px 3px 5px #121212",
                }
              : {}
          }
        >
          {this.state.currentDoc && (
            <i
              className="fas fa-file-alt doc-icon"
              style={{
                color: this.state.currentDoc.color || "var(--pc)",
              }}
            ></i>
          )}
          {this.state.currentDoc ? this.state.currentDoc.name : "Studio"}
          {!this.state.currentDoc && (
            <div>
              <p>
                All of Translationeer's powerful learning tools in one place
              </p>
              <Link to="/docs" className="studio-manual-link arrow-button">
                Learn how to use Translationeer Studio<span>{">>>"}</span>
              </Link>
            </div>
          )}
        </h1>

        {this.state.loading ? (
          <div className="grayed-out-background">
            <div id="saving-loader">
              <Loading />
              <div>Saving Changes</div>
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.currentDoc && (
          <StudioHeader
            backToDocsFunction={() => (window.location = "/studio")}
            document={this.state.currentDoc || {}}
            breakOffFunction={this.breakOffText}
            copyTranslation={this.copyTranslation}
          />
        )}
        <div id="studio-container">
          {this.state.currentDoc ? (
            <div id="studio-grid">
              <LeftStudio
                queryArray={
                  this.state.currentDoc ? this.state.currentDoc.body : []
                }
                promptEdit={this.promptEdit}
                mergeUp={this.mergeUp}
                mergeDown={this.mergeDown}
                deleteSection={this.deleteSection}
                addSection={this.addSection}
              />
              <RightStudio
                translations={currentDocBody}
                currentSection={this.state.currentSection}
              />
            </div>
          ) : (
            <div>
              <h3 className="choose-doc">
                Choose a Document to Open in Translationeer Studio:{" "}
              </h3>
              <DocumentsList
                documents={this.state.documents}
                addDoc={this.addDoc}
                saveDocSettings={this.saveDocSettings}
                openInStudio={this.openInStudio}
                deleteDoc={this.deleteDoc}
              />
            </div>
          )}
          {this.state.currentSection > -1 ? (
            <div id="translation-container">
              <EditTranslation
                startingY={y - 50}
                section={this.state.currentSection}
                setTranslation={this.changeTranslation}
                cancelEdit={() => this.setState({ currentSection: -1 })}
                originalTranslation={
                  this.state.currentDoc.body[this.state.currentSection]
                    ? this.state.currentDoc.body[this.state.currentSection]
                        .translation
                    : ""
                }
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    ) : (
      <StudioDefault />
    );
  }
}
Studio.contextType = LangContext;

export default Studio;

/**<ul>
              {this.state.documents.map((e) => (
                <li>
                  <button
                    type="button"
                    onClick={this.setCurrentDoc}
                    name={e.name}
                  >
                    {e.name}
                  </button>
                </li>
              ))}
            </ul>


            {this.state.currentSection > -1 && (
          <h2>Section{this.state.currentSection + 1}</h2>
        )}
            
            */
