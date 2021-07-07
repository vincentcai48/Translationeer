import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { pAuth, pFirestore } from "../services/config";
import Link from "next/link";
import Popup from "./Popup";
import { useRouter } from "next/router";
import Loading from "./Loading";
import dateString from "../services/dateString";

export default function Dashboard() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState<any>(-1);
  const [addDocPopup, setAddDocPopup] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>("");
  const [textInput, setTextInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
        .orderBy("time", "desc");
      if (lastDoc !== -1 && !isRefresh) query = query.startAfter(lastDoc);
      var res = await query.get();
      var arr = [];
      res.docs.forEach((doc) => {
        let data = doc.data();
        arr.push({
          name: data["name"],
          color: data["color"],
          time: data["time"],
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
    try {
      var res = await pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .add({
          name: nameInput,
          time: new Date().getTime(),
          texts: [textInput],
          translations: [""],
          settings: {
            
          }
        });
      setLoading(false);
      router.push(`/document/${res.id}`);
    } catch (e) {
      console.error(e);
      setAddDocPopup(false);
      setLoading(false);
    }
  };

  return (
    <div id="dashboard-container">
      <section id="top" className="center">
        <div>
          <h3 className="dash-h3">
            {pAuth.currentUser ? pAuth.currentUser.email : "Not Signed In"}
          </h3>
        </div>
      </section>
      <section id="dash-menu">
        <button onClick={() => setAddDocPopup(true)}>Add Document</button>
      </section>
      <section id="docs-list">
        <ul>
          {docs
            .sort((a, b) => b.time - a.time)
            .map((doc) => {
              if (!doc.id) return;
              return (
                <li key={doc.id}>
                  <Link href={`/document/${doc.id}`}>
                    <a className="single-doc row">
                      <div className="left">
                        <FontAwesomeIcon
                          className="doc-icon"
                          icon={faFileAlt}
                        ></FontAwesomeIcon>
                        <div className="doc-name">{doc.name}</div>
                      </div>
                      <div className="right">
                        <div className="time">
                          Edited {dateString(Number(doc.time))}
                        </div>
                      </div>
                      {/* <div className="open">Open Document</div> */}
                    </a>
                  </Link>
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
    </div>
  );
}
