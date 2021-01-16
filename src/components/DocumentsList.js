import React from "react";
import { LangContext } from "../services/context";

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
    };
  }

  componentDidUpdate() {
    console.log(this.props.documents);
  }
  componentDidMount() {
    console.log(this.props.documents);
  }

  openInStudio = (e) => {
    if (e.target.name == undefined)
      return this.openInStudio({ target: e.target.parentElement });
    this.props.openInStudio(e.target.name);
  };

  changeState = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  //note here that the "name" property on e.target is the whole document OBJECT, so there is another "name" property on that, hence name.name
  editPopup = (name, color) => {
    console.log(name, color);
    this.setState({
      showEditPopup: true,
      originalName: name,
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
    console.log(this.state.color);
    this.props.saveDocSettings(this.state.originalName, name, this.state.color);
    this.setState({ showEditPopup: false });
  };

  addDocProxy = () => {
    this.setState({ showAddPopup: false });
    var d = new Date();
    var name = this.state.newName;

    if (name.length < 1 || name.length == undefined)
      name = "Untitled" + d.getTime();
    console.log("NAME",name);
    this.props.addDoc(name, this.state.color, this.state.textBody);
  };

  deleteDocProxy = (name) => {
    this.props.deleteDoc(name);
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
          <div>
            <span>+</span>
          </div>
          <h5>Add A Document</h5>
        </div>
      </button>
    );
    for (var i = 0; i < docs.length; i++) {
      const e = docs[i];
      arr.push(
        <div
          className="single-doc"
          style={{ backgroundColor: e.color ? e.color : "var(--pc)" }}
        >
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
            <button
              type="button"
              className="open-in-studio"
              onClick={this.openInStudio}
              name={e.name}
            >
              Open In Studio <span>{">>>"}</span>
            </button>
            <button
              type="button"
              className="edit-document"
              onClick={() => this.editPopup(e.name, e.color)}
              name={e.name}
              originalColor={e.color ? e.color : "var(--pc)"}
            >
              Edit
            </button>
            <button
              className="delete-document fas fa-trash"
              onClick={() =>
                this.setState({ originalName: e.name, showDeletePopup: true })
              }
              name={e.name}
            ></button>
          </div>
        </div>
      );
    }
    return arr;
  };

  render() {
    var d = new Date();
    const defaultName = "Untitled" + d.getTime();
    return (
      <div>
        <div id="documents-list">{this.renderDocs()}</div>
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
                <option value="#84378B">Purple</option>
                <option value="#FF5252">Red</option>
                <option value="#ECA047">Orange</option>
                <option value="#48F598">Green</option>
                <option value="#FFB4E5">Pink</option>
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
        {this.state.showDeletePopup && (
          <div className="grayed-out-background">
            <div id="delete-doc-popup">
              <h5>
                Are you sure you want to delete "{this.state.originalName}"?
                This action cannot be undone.
              </h5>
              <button
                className="confirm-button"
                onClick={() => this.deleteDocProxy(this.state.originalName)}
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
