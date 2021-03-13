import React, { useContext, useEffect, useState } from "react";
import { pFirestore, pAuth, fbFieldValue } from "../services/config";
import { LangContext } from "../services/context";
import DocumentsList from "./DocumentsList";
import Link from "next/link";
import { useRouter } from "next/router";
import Auth from "./Auth";

function Dashboard(props) {
  const context = useContext(LangContext);
  const router = useRouter();

  const [isAuth, setIsAuth] = useState(false);
  const [selection, setSelection] = useState(0); //a number for what to view, 0: documents
  const [documents, setDocuments] = useState([]); //all the documents that user has. Same as in the "Studio.js" component
  const [redirect, setRedirect] = useState(false);
  const [limit, setLimit] = useState(10); //the amount of documents you can get at one time
  const [lastDoc, setLastDoc] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isNeedRefresh, setIsNeedRefresh] = useState(false);

  useEffect(() => {
    componentDidMount();
  }, []);

  const componentDidMount = () => {
    pAuth.onAuthStateChanged((user) => {
      setIsAuth(true);
      if (user) {
        getNewDocs();
      } else {
        setIsAuth(false);
      }
    });
  };

  //Used on the first time, or when refreshed
  const getNewDocs = () => {
    pFirestore
      .collection("users")
      .doc(pAuth.currentUser.uid)
      .collection("documents")
      .orderBy("timestamp", "desc")
      .limit(limit)
      .get()
      .then((res) => {
        var arr = [];
        res.forEach((d) => {
          arr.push({ ...d.data(), uid: d.id });
        });
        setDocuments(arr);
        setLastDoc(res.docs[res.docs.length - 1]);
        setIsNeedRefresh(false);
      });
  };

  //Firebase Pagination
  const getMoreDocs = async () => {
    setIsLoading(true);
    if (!lastDoc) return;
    var query = pFirestore
      .collection("users")
      .doc(pAuth.currentUser.uid)
      .collection("documents")
      .orderBy("timestamp", "desc")
      .startAfter(lastDoc)
      .limit(limit);
    try {
      var res = await query.get();
      var arr = [];
      res.forEach((d) => arr.push({ ...d.data(), uid: d.id }));
      setDocuments([...documents, ...arr]);
      setLastDoc(res.docs[res.docs.length - 1]);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    componentDidUpdate();
  }, [context.isJustCreatedUser]);

  const componentDidUpdate = () => {
    if (context.isJustCreatedUser) {
      pAuth.onAuthStateChanged((user) => {
        setIsAuth(true);
        if (user) {
          pFirestore
            .collection("users")
            .doc(pAuth.currentUser.uid)
            .collection("documents")
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get()
            .then((docs) => {
              var arr = [];
              docs.forEach((d) => {
                arr.push({ ...d.data(), uid: d.id });
              });

              setDocuments(arr);
            });
        } else {
          setIsAuth(false);
        }
      });
    }
  };

  const saveDocSettings = (name, newName, newColor) => {
    //get the right doc based on name,
    var rightDoc = {};
    documents.forEach((doc) => {
      if (doc.name == name) {
        /*IMPORTANT: This line changes whether the doc gets updated by value or reference, if you set it directly equal, it will still update realtime, even without a live snapshot from firestore. However, if you make a clone with this spread syntax, it will not update. This behavior is more "consistent", but less "live"*/
        rightDoc = { ...doc };
      }
    });
    //Make sure name is unique, otherwise just use the original name.
    // var isUnique = true;
    documents.forEach((doc) => {
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
        .update(rightDoc)
        .then(() => {
          setIsNeedRefresh(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const addDoc = (name, color, text, divideByLB) => {
    var body = {};
    if (divideByLB) {
      var bodyDividedByLineBreak = text.split("\n").map((t) => {
        return {
          text: t,
          translation: context.defaultText,
        };
      });
      bodyDividedByLineBreak = bodyDividedByLineBreak.filter((e) => {
        return e.text != "";
      });
      body = bodyDividedByLineBreak;
    } else {
      body = [
        {
          text: text.replaceAll("\n", context.linebreakCode),
          translation: context.defaultText,
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
      .then((doc) => {
        setIsNeedRefresh(true);
        router.push(`/studio?document=${doc.id}&user=${pAuth.currentUser.uid}`);
      })
      .catch((e) => console.error(e));
  };

  const deleteDoc = (docId, userId) => {
    //get the right doc based on name,
    if (!docId || !userId) return;
    //then do the delete. Note: don't worry about the uid not being there, although it is not created in addDoc(), it will be added in documents in componentDidMount().
    if (pAuth.currentUser) {
      pFirestore
        .collection("users")
        .doc(userId)
        .collection("documents")
        .doc(docId)
        .delete()
        .then(() => {
          setIsNeedRefresh(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const openInStudio = (docID, userID) => {
    var url = "/studio?document=" + docID + "&user=" + userID;
    setRedirect(url);
  };

  return isAuth ? (
    <div id="dashboard-container">
      <div id="dashboard-background"></div>
      <div id="dashboard-title">
        <h2>Dashboard</h2>
      </div>
      <div id="dashboard-options">
        <button
          onClick={() => this.setState({ selection: 0 })}
          className={
            selection == 0 ? "dashboard-option selected" : "dashboard-option"
          }
        >
          Documents
        </button>
        <Link href="/studiodefault">
          <a
            className={
              selection == 3 ? "dashboard-option selected" : "dashboard-option"
            }
          >
            Studio
          </a>
        </Link>
        <Link href="/account">
          <a
            className={
              selection == 4 ? "dashboard-option selected" : "dashboard-option"
            }
          >
            Account
          </a>
        </Link>
      </div>
      <div id="dashboard-mainContent">
        <div id="dashboard-documents">
          <DocumentsList
            documents={documents}
            changeIsNeedRefresh={setIsNeedRefresh}
            getMoreDocs={getMoreDocs}
            saveDocSettings={saveDocSettings}
            addDoc={addDoc}
            deleteDoc={deleteDoc}
          />
        </div>
      </div>
      {isNeedRefresh && (
        <div className="brp">
          Reload Dashboard to See Changes
          <button onClick={getNewDocs} className="fas fa-redo-alt"></button>
        </div>
      )}
    </div>
  ) : (
    <Auth />
  );
}

export default Dashboard;
