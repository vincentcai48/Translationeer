import React from "react";
import { pAuth, pFirestore } from "../services/config";
import Auth from "./Auth";
import { LangContext } from "../services/context";
import Slider from "./studioComponents/slider";
import LeftStudio from "./studioComponents/leftStudio";
import RightStudio from "./studioComponents/rightStudio";
import EditTranslation from "./studioComponents/editTranslation";
import StudioHeader from "./studioComponents/studioHeader";
import Loading from "./Loading";

var x, y;
var rect;
window.addEventListener("mousemove", (e) => {
  // e = Mouse click event.
  if (document.querySelector("#studio-container") && !rect) {
    rect = document.querySelector("#studio-container").getBoundingClientRect();
  }
  if (rect) {
    x = e.pageX - rect.left; //x position within the element.
    y = e.pageY + 200 - rect.top; //y position within the element.
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

  componentDidMount() {
    pAuth.onAuthStateChanged((user) => {
      if (user) {
        pFirestore
          .collection("users")
          .doc(pAuth.currentUser.uid)
          .collection("documents")
          .get()
          .then((docs) => {
            var arr = [];
            console.log("DOCS", docs);
            docs.forEach((d) => {
              console.log(d.data());
              arr.push({ ...d.data(), uid: d.id });
            });
            console.log(arr);
            this.setState({ documents: arr });
          });
      }
    });
  }

  setCurrentDoc = (e) => {
    const name = e.target.name;
    var rightDoc = {};
    this.state.documents.forEach((doc) => {
      if (doc.name == name) {
        rightDoc = doc;
      }
    });
    console.log("RIGHTDOC:", rightDoc);
    this.setState({
      currentDoc: rightDoc,
    });
  };

  promptEdit = (section) => {
    console.log(section);
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
    console.log("CALLED FUNCTION", this.state.currentDoc);
    console.log(this.state.currentDoc.body[section].text.indexOf(text));
    if (this.state.currentDoc.body[section].text.indexOf(text) > -1) {
      const sectionObj = this.state.currentDoc.body[section];
      console.log(sectionObj);
      const startingIndex = this.state.currentDoc.body[section].text.indexOf(
        text
      );
      console.log("starting index", startingIndex);
      const endingIndex = startingIndex + text.length;
      console.log("endingIndex", endingIndex);
      var newArr = [
        {
          text: sectionObj.text.substr(0, startingIndex),
          translation: "No Translation Here",
        },
        {
          text: text,
          translation: sectionObj.translation,
        },
        {
          text: sectionObj.text.substr(endingIndex),
          translation: "No Translation Here",
        },
      ];
      newArr = newArr.filter((e) => e.text.length > 1);
      console.log(newArr);
      var newDoc = this.state.currentDoc;
      console.log(newDoc);
      console.log("SECTION", section);
      console.log("ARRAY", newDoc.body);
      //the splice method modifies by reference, important. Do NOT try newDoc.body = newDoc.body.splice(...);
      newDoc.body.splice(section, 1, ...newArr);
      console.log(newDoc);
      console.log("NEWDOC:", newDoc);
      this.setState({ currentDoc: newDoc });
      clearSelection();
      this.saveAll();
    }
  };

  saveAll = async () => {
    this.setState({ loading: true });
    var thisDoc = this.state.currentDoc;
    var docid = this.state.currentDoc.uid;
    console.log("INTO FIRESTORE", thisDoc);
    console.log(docid);
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

  render() {
    var currentDocBody = this.state.currentDoc
      ? this.state.currentDoc.body
      : [];
    return this.context.isAuth ? (
      <div id="studio">
        <h1>Studio</h1>
        {this.state.loading ? (
          <div id="saving-loader">
            <Loading />
            <div>Saving Changes</div>
          </div>
        ) : (
          ""
        )}
        {this.state.currentDoc && this.state.currentDoc.body.length}
        {this.state.currentSection > -1 && (
          <h2>Section{this.state.currentSection + 1}</h2>
        )}
        {this.state.currentDoc && (
          <div>
            <StudioHeader
              backToDocsFunction={() => this.setState({ currentDoc: null })}
              document={this.state.currentDoc || {}}
              breakOffFunction={this.breakOffText}
            />
          </div>
        )}
        <div id="studio-container">
          {this.state.currentDoc ? (
            <div id="studio-grid">
              <LeftStudio
                queryArray={
                  this.state.currentDoc ? this.state.currentDoc.body : []
                }
                promptEdit={this.promptEdit}
              />
              <RightStudio translations={currentDocBody} />
            </div>
          ) : (
            <ul>
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
          )}
          {this.state.currentSection > -1 ? (
            <div id="translation-container">
              <EditTranslation
                startingY={y}
                section={this.state.currentSection}
                setTranslation={this.changeTranslation}
                originalTranslation={
                  this.state.currentDoc.body[this.state.currentSection]
                    .translation
                }
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    ) : (
      <Auth />
    );
  }
}
Studio.contextType = LangContext;

export default Studio;
