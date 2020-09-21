import React from "react";
import { LangContext } from "../../services/context";

//PROPS: Number section, Function setTranslation, String originalTranslation, Number startingX

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  document.querySelector(
    "#" + elmnt.id + " .editDragSection"
  ).onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    const docContainer = document.querySelector("#studio-container");
    const docContainerBottom =
      docContainer.offsetTop + docContainer.offsetHeight;
    console.log(docContainer.offsetTop);
    console.log(docContainer.offsetHeight);
    console.log(docContainerBottom);
    //+/- 40 because of the 20px translate y
    // if (elmnt.offsetTop - pos2 + elmnt.offsetHeight + 40 > docContainerBottom) {
    //   elmnt.style.top = docContainerBottom - elmnt.offsetHeight - 40 + "px";
    // } else if (elmnt.offsetTop - pos2 < docContainer.offsetTop) {
    //   elmnt.style.top = docContainer.offsetTop;
    // } else {
    //   elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    // }

    if (
      elmnt.offsetTop - pos2 + elmnt.offsetHeight >
      document.querySelector("body").offsetHeight
    ) {
      console.log(elmnt.offsetTop - pos2);
      const lowerBound =
        document.querySelector("body").offsetHeight - elmnt.offsetHeight;
      console.log("Lower Bounds", lowerBound);
      elmnt.style.top = lowerBound + "px";
      console.log("Then set to: ", elmnt.style.top);
    } else {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    }
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

class editTranslation extends React.Component {
  constructor(props) {
    super();
    this.state = {
      translation: "",
    };
  }

  saveText = () => {
    this.props.setTranslation(this.props.section, this.state.translation);
  };

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    var thisElement = document.querySelector(
      "#edit-translation-container textarea"
    );
    if (document.querySelector("#edit-translation-container textarea")) {
      console.log("Orginal Translation: ", this.props.originalTranslation);
      document.querySelector(
        "#edit-translation-container textarea"
      ).value = this.props.originalTranslation;
      dragElement(document.querySelector("#edit-translation-container"));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.originalTranslation !== prevProps.originalTranslation) {
      if (document.querySelector("#edit-translation-container textarea")) {
        console.log("Orginal Translation: ", this.props.originalTranslation);
        document.querySelector(
          "#edit-translation-container textarea"
        ).value = this.props.originalTranslation;
      }
    }
  }

  // componentDidUpdate() {
  //   var thisElement = document.querySelector(
  //     "#edit-translation-container textarea"
  //   );
  //   if (document.querySelector("#edit-translation-container textarea")) {
  //     console.log("Orginal Translation: ", this.props.originalTranslation);
  //     document.querySelector(
  //       "#edit-translation-container textarea"
  //     ).value = this.props.originalTranslation;
  //   }
  // }

  render() {
    var xValue = Number(this.context.textEnd) + 10;
    return (
      <div
        id="edit-translation-container"
        style={{
          top: this.props.startingY + "px",
          left: xValue + "px",
        }}
      >
        <div className="editDragSection">
          <h4>Edit Section {this.props.section + 1}</h4>
        </div>
        <textarea
          rows="3"
          cols="50"
          onChange={this.changeState}
          name="translation"
        ></textarea>
        <div></div>
        <button onClick={this.saveText}>Save Changes</button>
      </div>
    );
  }
}

editTranslation.contextType = LangContext;

export default editTranslation;
