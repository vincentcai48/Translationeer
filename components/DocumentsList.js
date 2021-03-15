import React from "react";
import { pAuth } from "../services/config";
import { LangContext } from "../services/context";
import Link from "next/link";
import convertColor from "../services/convertcolor";

/*PROPS: 
-Array[] documents, this is all the data from firestore of some user's documents
-Function(docName,newName,newColor) saveDocSettings, to save edits to the document settings.
-Function(name,color,text) addDoc, to add a document with a name, color, and initial text
-Function(name) deleteDoc, to delete a document.
-Function(name) openInStudio, what to do when opened in studio.
*/
class DocumentsList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      originalName: "",
      newName: "",
      color: "",
      showEditPopup: false,
      showAddPopup: false,
      showDeletePopup: false,
      textBody: "",
      inputDivideByLB: false,
      currentDocId: "", //the ID of the doc being shown in the edit doc popup
    };
  }

  openInStudio = (e) => {
    if (e.target.name == undefined)
      return this.openInStudio({ target: e.target.parentElement });
    this.props.openInStudio(e.target.name, pAuth.currentUser.uid); // the uid of the document is e.target.name
  };

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  changeCheckboxState = (e) => {
    const { name, checked } = e.target;
    this.setState({ [name]: checked });
  };

  //note here that the "name" property on e.target is the whole document OBJECT, so there is another "name" property on that, hence name.name
  editPopup = (name, color, uid) => {
    this.setState({
      showEditPopup: true,
      originalName: name,
      currentDocId: uid,
      newName: name,
      color: color || "var(--pc)",
    });
  };

  addDocPopup = () => {
    this.setState({
      showAddPopup: true,
      newName: "",
      color: "var(--pc)",
    });
  };

  saveDocSettingsProxy = (defaultName) => {
    var name = this.state.newName;
    if (this.state.newName.length < 1) name = defaultName;

    this.props.saveDocSettings(this.state.originalName, name, this.state.color);
    this.setState({ showEditPopup: false });
  };

  addDocProxy = () => {
    this.setState({ showAddPopup: false });
    var d = new Date();
    var name = this.state.newName;

    if (name.length < 1 || name.length == undefined)
      name = "Untitled " + (d.getTime() % 10000);

    this.props.addDoc(
      name,
      this.state.color,
      this.state.textBody,
      this.state.inputDivideByLB
    );
  };

  deleteDocProxy = (docID) => {
    this.props.deleteDoc(docID, pAuth.currentUser.uid);
    this.setState({ showDeletePopup: false });
  };

  renderDocs = () => {
    var arr = [];
    const docs = this.props.documents;
    arr.push(
      <button
        type="button"
        className="add-doc-button"
        onClick={this.addDocPopup}
      >
        <div className="inside-text-container">
          <i className="fas fa-plus-circle"></i>
          <h5>Add A Document</h5>
        </div>
      </button>
    );
    for (var i = 0; i < docs.length; i++) {
      const e = docs[i];
      const color = convertColor(e.color);
      arr.push(
        <div className="single-doc" style={{ backgroundColor: color }}>
          <h6>{e.name}</h6>
          {e.body.length > 0 && (
            <p className="doc-excerpt">
              {e.body[0].text.length < 30
                ? e.body[0].text
                : e.body[0].text.substr(0, 30) + "..."}
            </p>
          )}
          <p className="lastModified">
            {e.timestamp &&
              e.timestamp.toDate &&
              "Last Modified: " + e.timestamp.toDate().toLocaleString()}
          </p>
          <div className="document-buttons">
            <Link
              href={`/studio?document=${e.uid}&user=${pAuth.currentUser.uid}`}
            >
              <a className="open-in-studio">
                Open In Studio <span>{">>>"}</span>
              </a>
            </Link>
            <button
              type="button"
              className="edit-document"
              onClick={() => this.editPopup(e.name, e.color, e.uid)}
              name={e.name}
              originalColor={e.color ? e.color : "var(--pc)"}
            >
              Edit
            </button>
            <button
              className="delete-document fas fa-trash"
              onClick={() =>
                this.setState({
                  originalName: e.name,
                  showDeletePopup: true,
                  currentDocId: e.uid,
                })
              }
              name={e.name}
            ></button>
          </div>
        </div>
      );
    }
    arr.push(
      <button className="paginate-button" onClick={this.props.getMoreDocs}>
        <i className="fas fa-plus-circle"></i>More Documents
      </button>
    );
    return arr;
  };

  render() {
    var d = new Date();
    const defaultName = "Untitled" + d.getTime();
    return (
      <div>
        {/* List of Documents */}
        <div id="documents-list">{this.renderDocs()}</div>

        {/* Edit Documents Popup */}
        {this.state.showEditPopup && (
          <div className="grayed-out-background">
            <div id="edit-document-popup">
              <h5 className="add-h5">Edit Document</h5>
              <input
                type="text"
                className="edit-document-title"
                placeholder={defaultName}
                onChange={this.changeState}
                name="newName"
                value={this.state.newName}
              ></input>
              <select
                name="color"
                className="choose-color"
                onChange={this.changeState}
                value={this.state.color}
              >
                <option value="var(--pc)">Blue (default)</option>
                <option value="var(--dc-purple)">Purple</option>
                <option value="var(--dc-red)">Red</option>
                <option value="var(--dc-orange)">Orange</option>
                <option value="var(--dc-green)">Green</option>
                <option value="var(--dc-pink)">Pink</option>
              </select>
              <br></br>
              <br></br>
              <button
                type="button"
                className="submit-doc-changes confirm-button"
                onClick={() => this.saveDocSettingsProxy(defaultName)}
              >
                Save
              </button>
              <button
                type="button"
                className="cancel cancel-button"
                onClick={() => this.setState({ showEditPopup: false })}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Document Popup */}
        {this.state.showAddPopup && (
          <div className="grayed-out-background">
            <div id="addDoc-popup-container">
              <h5 className="add-h5">Add A Document</h5>
              <input
                type="text"
                className="add-document-title"
                placeholder="Document Title"
                onChange={this.changeState}
                name="newName"
                value={this.state.newName}
              ></input>
              <select
                name="color"
                className="choose-color"
                onChange={this.changeState}
                value={this.state.color}
              >
                <option value="var(--pc)">Blue (default)</option>
                <option value="#84378B">Purple</option>
                <option value="#FF5252">Red</option>
                <option value="#ECA047">Orange</option>
                <option value="#48F598">Green</option>
                <option value="#FFB4E5">Pink</option>
              </select>
              <textarea
                className="addDoc-textBody"
                placeholder="Document Text Body"
                onChange={this.changeState}
                name="textBody"
                value={this.state.textBody}
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  height: "20vh",
                  maxHeight: "50vh",
                }}
              ></textarea>
              <div className="predivide-linebreak">
                <input
                  type="checkbox"
                  checked={this.state.inputDivideByLB}
                  onChange={this.changeCheckboxState}
                  name="inputDivideByLB"
                ></input>
                <label>Pre-divide sections by line break</label>
              </div>
              <button
                type="button"
                className="submit-doc-changes confirm-button"
                onClick={() => this.addDocProxy(defaultName)}
                placeholder="Text Content Here"
              >
                Create
              </button>
              <button
                type="button"
                className="cancel cancel-button"
                onClick={() => this.setState({ showAddPopup: false })}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Document Popup */}
        {this.state.showDeletePopup && (
          <div className="grayed-out-background">
            <div id="delete-doc-popup">
              <h5>
                Are you sure you want to delete "{this.state.originalName}"?
                This action cannot be undone.
              </h5>
              <button
                className="confirm-button"
                onClick={() => this.deleteDocProxy(this.state.currentDocId)}
              >
                Yes, delete
              </button>
              <button
                className="cancel-button"
                onClick={() => this.setState({ showDeletePopup: false })}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
DocumentsList.contextType = LangContext;

export default DocumentsList;
