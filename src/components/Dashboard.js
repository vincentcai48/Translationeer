import React from "react";
import { pFirestore, pAuth, fbFieldValue } from "../services/config";
import { LangContext } from "../services/context";
import DocumentsList from "./DocumentsList";
import { Redirect, Link } from "react-router-dom";
import Auth from "./Auth";

class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isAuth: false,
      selection: 0, //a number for what to view, 0: documents
      documents: [], //all the documents that user has. Same as in the "Studio.js" component
      redirect: false,
      limit: 15, //the amount of documents you can get at one time
      lastDoc: {},
      isLoading: false,
      isNeedRefresh: false,
    };
  }

  componentDidMount() {
    pAuth.onAuthStateChanged((user) => {
      this.setState({ isAuth: true });
      if (user) {
        pFirestore
          .collection("users")
          .doc(pAuth.currentUser.uid)
          .collection("documents")
          .orderBy("timestamp", "desc")
          .limit(this.state.limit)
          .get()
          .then((res) => {
            var arr = [];
            res.forEach((d) => {
              arr.push({ ...d.data(), uid: d.id });
            });
            this.setState({
              documents: arr,
              lastDoc: res.docs[res.docs.length - 1],
            });
          });
      } else {
        this.setState({ isAuth: false });
      }
    });
  }

  //Firebase Pagination
  getMoreDocs = async () => {
    this.setState({ isLoading: true });
    if (!this.state.lastDoc) return;
    var query = pFirestore
      .collection("users")
      .doc(pAuth.currentUser.uid)
      .collection("documents")
      .orderBy("timestamp", "desc")
      .startAfter(this.state.lastDoc)
      .limit(this.state.limit);
    try {
      var res = await query.get();
      var arr = [];
      res.forEach((d) => arr.push({ ...d.data(), uid: d.id }));
      this.setState((p) => {
        return {
          documents: [...p.documents, ...arr],
          lastDoc: res.docs[res.docs.length - 1],
          isLoading: false,
        };
      });
    } catch (e) {
      console.error(e);
    }
  };

  componentDidUpdate() {
    if (this.context.isJustCreatedUser) {
      pAuth.onAuthStateChanged((user) => {
        this.setState({ isAuth: true });
        if (user) {
          pFirestore
            .collection("users")
            .doc(pAuth.currentUser.uid)
            .collection("documents")
            .orderBy("timestamp", "desc")
            .limit(this.state.limit)
            .get()
            .then((docs) => {
              var arr = [];
              docs.forEach((d) => {
                arr.push({ ...d.data(), uid: d.id });
              });
              console.log(arr);
              this.setState({ documents: arr });
            });
        } else {
          this.setState({ isAuth: false });
        }
      });
    }
  }

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
    console.log(newColor);
    rightDoc.name = newName;
    rightDoc.color = newColor;
    rightDoc.timestamp = fbFieldValue.serverTimestamp();
    console.log(rightDoc.timestamp);
    console.log(typeof rightDoc.timestamp);
    var docid = rightDoc.uid;
    console.log("Going Into Firestore:", rightDoc);
    if (pAuth.currentUser) {
      pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(docid)
        .update(rightDoc)
        .then(() => {
          this.setState({ isNeedRefresh: true });
        })
        .catch((e) => console.error(e));
    }
  };

  addDoc = (name, color, text, divideByLB) => {
    console.log("ADDING DOCS!!!!");
    var body = {};
    if (divideByLB) {
      var bodyDividedByLineBreak = text.split("\n").map((t) => {
        return {
          text: t,
          translation: this.context.defaultText,
        };
      });
      bodyDividedByLineBreak = bodyDividedByLineBreak.filter((e) => {
        return e.text != "";
      });
      body = bodyDividedByLineBreak;
    } else {
      body = [
        {
          text: text.replaceAll("\n", this.context.linebreakCode),
          translation: this.context.defaultText,
        },
      ];
    }
    pFirestore
      .collection("users")
      .doc(pAuth.currentUser.uid)
      .collection("documents")
      .add({
        name: name,
        color: color,
        body: body,
        timestamp: fbFieldValue.serverTimestamp(),
      })
      .then(() => {
        this.setState({ isNeedRefresh: true });
        this.openInStudio(name);
      })
      .catch((e) => console.error(e));
  };

  deleteDoc = (name) => {
    //get the right doc based on name,
    console.log(name);
    var rightDoc = null;
    this.state.documents.forEach((doc) => {
      if (doc.name == name) {
        rightDoc = doc;
      }
    });
    console.log(rightDoc);
    if (rightDoc == null) return;
    //then do the delete. Note: don't worry about the uid not being there, although it is not created in addDoc(), it will be added in this.state.documents in componentDidMount().
    if (pAuth.currentUser) {
      pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(rightDoc.uid)
        .delete()
        .then(() => {
          this.setState({ isNeedRefresh: true });
        })
        .catch((e) => console.error(e));
    }
  };

  openInStudio = (name) => {
    var url = "/studio?document=" + name;
    this.setState({ redirect: url });
  };

  changeIsNeedRefresh = (value) => {
    this.setState({ isNeedRefresh: value });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    return this.state.isAuth ? (
      <div id="dashboard-container">
        <div id="dashboard-background"></div>
        <div id="dashboard-title">
          <h2>Dashboard</h2>
        </div>
        <div id="dashboard-options">
          <button
            onClick={() => this.setState({ selection: 0 })}
            className={
              this.state.selection == 0
                ? "dashboard-option selected"
                : "dashboard-option"
            }
          >
            Documents
          </button>
          <Link
            to="/studiodefault"
            className={
              this.state.selection == 3
                ? "dashboard-option selected"
                : "dashboard-option"
            }
          >
            Studio
          </Link>
          <Link
            to="/account"
            className={
              this.state.selection == 4
                ? "dashboard-option selected"
                : "dashboard-option"
            }
          >
            Account
          </Link>
        </div>
        <div id="dashboard-mainContent">
          <div id="dashboard-documents">
            <DocumentsList
              documents={this.state.documents}
              changeIsNeedRefresh={this.changeIsNeedRefresh}
              getMoreDocs={this.getMoreDocs}
              saveDocSettings={this.saveDocSettings}
              addDoc={this.addDoc}
              openInStudio={this.openInStudio}
              deleteDoc={this.deleteDoc}
            />
          </div>
        </div>
        {this.state.isNeedRefresh && (
          <div className="brp">Reload Dashboard to See Changes</div>
        )}
      </div>
    ) : (
      <Auth />
    );
  }
}
Dashboard.contextType = LangContext;

export default Dashboard;
