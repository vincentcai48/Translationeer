import { faCogs, faFileAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { pAuth, pFirestore } from "../services/config";
import Link from "next/link";
import Popup from "./Popup";
import { useRouter } from "next/router";
import Loading from "./Loading";
import dateString from "../services/dateString";
import deleteAccountFunc from "../services/deleteAccount";
import PContext from "../services/context";

export default function Dashboard() {
  const router = useRouter();
  const {defaultName} = useContext(PContext);
  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState<any>(-1);
  const [addDocPopup, setAddDocPopup] = useState<boolean>(false);
  const [docToDelete,setDocToDelete] = useState<string|null>(null);
  const [errorMessage,setErrorMessage] = useState<string|null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [textInput, setTextInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [accountPopup, setAccountPopup] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [deleteAccountInput, setDeleteAccountInput] = useState<string>("");

  useEffect(() => {
    getDocs(false);
  }, []);

  const getDocs = async (isRefresh: boolean): Promise<void> => {
    try {
      if (lastDoc == null && !isRefresh) return;
      var query = pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .limit(10)
        .orderBy("timestamp", "desc");
      if (lastDoc !== -1 && !isRefresh) query = query.startAfter(lastDoc);
      var res = await query.get();
      var arr = [];
      res.docs.forEach((doc) => {
        let data = doc.data();
        arr.push({
          name: data["name"],
          color: data["color"],
          timestamp: data["timestamp"],
          id: doc.id,
        });
      });
      setDocs([...docs, ...arr]);
      setLastDoc(res.docs[res.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  const createDocument = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      var res = await pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .add({
          name: nameInput || defaultName,
          timestamp: (new Date()).getTime(),
          texts: [textInput],
          translations: [""],
          settings: {
            fontSize: 22,
            copyDivide: " ",
            studioWidth: 50,
          },
        });
      setLoading(false);
      router.push(`/document/${res.id}`);
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message);
      setLoading(false);
    }
  };

  const deleteDocument = async () =>{
    if(!docToDelete) return;
    setLoading(true);
    try{
      //delete doc in firestore
      await pFirestore.collection('users').doc(pAuth.currentUser.uid).collection("documents").doc(docToDelete).delete();
      
      //delete doc from list
      var newArr = [...docs].filter(d=>d.id!=docToDelete);
      setDocs(newArr);

      //then close out of popup
      setDocToDelete(null);
    }catch(e){
      console.error(e);
    }
    setLoading(false);
  }

  const logout = async () => {
    try {
      await pAuth.signOut();
    } catch (e) {
      console.error(e);
    }
  };
  if(!pAuth.currentUser) return;
  return (
    <div id="dashboard-container">
      <section id="top" className="center">
        <div className="top-center">
          <h3 className="dash-h3">
            {pAuth.currentUser ? pAuth.currentUser.email : "Not Signed In"}
          </h3>
          <button
            className="account-settings tb"
            onClick={() => setAccountPopup(true)}
          >
            <FontAwesomeIcon className="sib" icon={faCogs}></FontAwesomeIcon>
          </button>
        </div>
      </section>
      <section id="dash-menu">
        <button onClick={() => setAddDocPopup(true)}>Add Document</button>
      </section>
      <section id="docs-list">
        {docs.length==0&&<div className="no-docs-container center">
          <div>No documents yet.</div>  
        </div>}
        <ul>
          {docs
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((doc) => {
              if (!doc.id) return;
              return (
                <li key={doc.id} className="row single-doc-container">
                  <Link href={`/document/${doc.id}`}>
                    <a className="single-doc row">
                      <div className="left">
                        <FontAwesomeIcon
                          className="doc-icon"
                          icon={faFileAlt}
                        ></FontAwesomeIcon>
                        <div className="doc-name">{doc.name}</div>
                      </div>
                      <div className="right row">
                        <div className="time">
                          Edited {dateString(Number(doc.timestamp))}
                        </div>
                      </div>
                      {/* <div className="open">Open Document</div> */}
                    </a>
                  </Link>
                  <div className="delete-area">
                  <button className="tb" onClick={()=>setDocToDelete(doc.id)}>
                          <FontAwesomeIcon className="sib" icon={faTrash}></FontAwesomeIcon>
                        </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </section>

      {addDocPopup && (
        <Popup xFunction={() => setAddDocPopup(false)}>
          <div className="add-doc-popup">
            <h4>Add A Document</h4>
            <input
              placeholder="Document Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            ></input>
            <textarea
              placeholder="What are you translating? Paste the text here"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            ></textarea>
            {loading && <Loading></Loading>}
            {errorMessage&&<p style={{color: "red"}}>{errorMessage}</p>}
            <div className="row">
              <button className="sb mr15" onClick={createDocument}>
                Create Document
              </button>
              <button className="tb" onClick={() => setAddDocPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Popup>
      )}

      {docToDelete!=null&&<Popup xFunction={()=>setDocToDelete(null)}>
        <div className="delete-doc-popup">
          <div className="row">
            <button onClick={deleteDocument} className="sb mr15">
              Delete Document
            </button>
            <button onClick={()=>setDocToDelete(null)} className="tb">Cancel</button>
          </div>
          {loading&&<p><Loading></Loading></p>}
        </div>
      </Popup>}

      {accountPopup && (
        <Popup xFunction={() => setAccountPopup(false)}>
          <div className="account-popup">
            <h4>Account</h4>
            <div className="row email">
              <label>Email: </label>
              <span>{pAuth.currentUser.email}</span>
            </div>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
            {deleteAccount ? (
              <div className="delete-account">
                <p>Type "confirm" to delete account</p>
                <input
                  placeholder="confirm"
                  value={deleteAccountInput}
                  onChange={(e) => setDeleteAccountInput(e.target.value)}
                ></input>
                <div className="row">
                  {deleteAccountInput === "confirm" && (
                    <button
                      className="sb mr15"
                      onClick={async () => {
                        var res: boolean = await deleteAccountFunc();
                        if (!res) setDeleteAccountInput("Error!");
                        else setDeleteAccount(false);
                      }}
                    >
                      Delete Account
                    </button>
                  )}
                  <button
                    className="tb"
                    onClick={() => {
                      setDeleteAccount(false);
                      setDeleteAccountInput("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="delete-account-button tb"
                onClick={() => setDeleteAccount(true)}
              >
                Delete Account
              </button>
            )}
          </div>
        </Popup>
      )}
    </div>
  );
}
