import React from "react";
import { LangContext } from "../../services/context";
import Definition from "../Definition";
import DocContainer from "../DocContainer";
import WordList from "../WordList";

/*PROPS:
  -Array[Object()] queryArray. This is the body of a document. 
  -Function promptEdit(), opens editor on the right side.
  -Function mergeUp()
  -Function mergeDown()
  -Function addSection()
  -Function deleteSection()
*/

class LeftStudio extends React.Component {
  constructor(props) {
    super();
    this.state = {
      currentWord: null,
      sections: [],
      arrayOfSections: [],
      isDeletingSection: -1,
      isAddingSection: false,
      addText: "",
      addAfter: 0, //this is the number section, NOT array index. if it is 0, it means insert before all else. (can be seen as "insert in this index")
    };
  }

  promptEditProxy = (e) => {
    this.props.promptEdit(Number(e.target.name));
  };

  mergeUpProxy = (e) => {
    this.props.mergeUp(Number(e.target.name));
  };

  mergeDownProxy = (e) => {
    this.props.mergeDown(Number(e.target.name));
  };

  warnDelete = (e) => {
    this.setState({ isDeletingSection: Number(e.target.name) });
  };

  deleteSectionProxy = (section) => {
    this.setState({ isDeletingSection: -1 });
    this.props.deleteSection(section);
  };

  addSectionProxy = (insertAt, text) => {
    this.setState({ isAddingSection: false });
    this.props.addSection(insertAt, text);
  };

  componentDidMount() {
    document.getElementById("left-studio").style.width =
      this.context.textEnd + "%";
    if (!this.props.queryArray) return;
    this.setState({ arrayOfSections: [...this.props.queryArray] });
  }
  componentWillUpdate(prevProps) {
    console.log(this.context.textEnd);
    console.log(prevProps.queryArray);
    console.log(this.state.arrayOfSections);
    if (!this.props.queryArray) return;
    if (prevProps.queryArray !== this.state.arrayOfSections) {
      this.setState({ arrayOfSections: prevProps.queryArray });
      console.log("WORKING!!!");
    }
  }

  componentDidUpdate() {
    document.getElementById("left-studio").style.width =
      this.context.textEnd + "%";
    console.log(this.context.textEnd);
    console.log(document.getElementById("left-studio").style.width);
    console.log(document.getElementById("right-studio").style.width);
  }

  setWord = (word) => {
    this.setState({ currentWord: word });
  };

  crossOut = () => {
    this.setState({ currentWord: null });
  };

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  renderSections = () => {
    var arr = [];
    if (!this.props.queryArray) return;
    for (var i = 0; i < this.props.queryArray.length; i++) {
      var num = i;
      arr.push(
        <div className="single-section-wordList">
          <div className="single-section-button-list">
            <div class="left-section-name">{i + 1}</div>
            <button
              type="button"
              className="arrow-button translate"
              onClick={this.promptEditProxy}
              name={num}
            >
              Translate {">>>"}
            </button>
            <span className="grid-space"></span>
            <button
              type="button"
              className="fas fa-caret-square-up"
              onClick={this.mergeUpProxy}
              name={num}
            >
              <span className="tooltip">Merge Up</span>
            </button>
            <button
              type="button"
              className="fas fa-caret-square-down"
              onClick={this.mergeDownProxy}
              name={num}
            >
              <span className="tooltip">Merge Down</span>
            </button>
            <button
              type="button"
              className="fas fa-trash"
              onClick={this.warnDelete}
              name={num}
            >
              <span className="tooltip">Delete</span>
            </button>
          </div>
          <WordList
            query={this.props.queryArray[i].text}
            setWord={this.setWord}
          />
          <hr></hr>
        </div>
      );
    }
    console.log(arr);
    // this.setState({ sections: arr });
    return arr;
  };

  render() {
    const arr = this.props.queryArray ? this.renderSections() : [];
    return (
      <div id="left-studio">
        <div id="docContainer">
          {arr}
          <button
            type="button"
            onClick={() =>
              this.setState({
                isAddingSection: true,
                addAfter: this.state.arrayOfSections.length,
              })
            }
            className="add-a-section"
          >
            <div>+</div>
            <p>Add A Section</p>
          </button>
          {this.state.currentWord && (
            <Definition
              crossOut={this.crossOut}
              word={this.state.currentWord}
              apis={this.context.apis}
            />
          )}
        </div>
        {this.state.isDeletingSection > -1 && (
          <div className="grayed-out-background">
            <div id="delete-warning">
              <h5>
                Are You Sure You Want to Delete Section{" "}
                {this.state.isDeletingSection + 1}? <br></br>This will delete
                both text and translation, and cannot be undone.
              </h5>
              <button
                onClick={() =>
                  this.deleteSectionProxy(this.state.isDeletingSection)
                }
                className="confirm-button"
              >
                Confirm
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => this.setState({ isDeletingSection: -1 })}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {this.state.isAddingSection && (
          <div className="grayed-out-background">
            <div id="add-section-container">
              <h5 className="add-h5">Add a Section</h5>
              <div id="add-section-after">
                Add After Section{" "}
                <input
                  type="number"
                  name="addAfter"
                  className="addAfter"
                  onChange={this.changeState}
                  min="0"
                  max={this.state.arrayOfSections.length}
                  value={this.state.addAfter}
                ></input>
              </div>
              <textarea
                id="add-section-textarea"
                style={{
                  width: "100%",
                  minWidth: "100%",
                  maxWidth: "100%",
                  maxHeight: "50vh",
                }}
                onChange={this.changeState}
                name="addText"
              ></textarea>
              <button
                onClick={() =>
                  this.addSectionProxy(this.state.addAfter, this.state.addText)
                }
                className="confirm-button"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => this.setState({ isAddingSection: false })}
                className="cancel-button"
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
LeftStudio.contextType = LangContext;

export default LeftStudio;
