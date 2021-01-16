import React from "react";
import { DefinitionContext, LangContext } from "../services/context";
import { validate } from "../services/validate";
import InnerDefinition from "./InnerDefinition";
import Loading from "./Loading";

//PROPS: String word, Array[Object()] apis, Function crossOut

//Each api object: {String url, String name, String cssSelector}. ALL of them MUST be unique.

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

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

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
    const docContainer = document.querySelector("#docContainer");
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

var isOutOfViewport = function (elem, textEnd) {
  // Get element's bounding
  var bounding = elem.getBoundingClientRect();
  console.log(bounding);

  // Check if it's out of the viewport on each side
  var out = {};
  out.top = bounding.top < 0;
  out.left = bounding.left < 0;
  out.bottom =
    bounding.bottom >
    (window.innerHeight || document.documentElement.clientHeight);
  out.right =
    bounding.right > (textEnd || document.documentElement.clientWidth);
  console.log(bounding.right);
  console.log(window.innerWidth);
  out.any = out.top || out.left || out.bottom || out.right;
  out.all = out.top && out.left && out.bottom && out.right;

  return out;
};

class Definition extends React.Component {
  constructor(props) {
    super();
    this.state = {
      apis: props.apis,
    };
  }

  componentDidMount() {
    if (document.getElementById("definition-container")) {
      console.log(document.getElementById("definition-container"));
      const defElement = document.getElementById("definition-container");
      dragElement(defElement);
      this.newDefinition();
    }
  }

  newDefinition = () => {
    console.log(this.context.apis);
    const xVar = x;
    const yVar = y;
    if (document.getElementById("definition-container")) {
      console.log(document.getElementById("definition-container"));
      const defElement = document.getElementById("definition-container");
      defElement.style.top = yVar + 20 + "px";
      defElement.style.left = xVar - defElement.offsetWidth * 0.5 + "px";
      const lowerBound =
        document.querySelector("body").offsetHeight - defElement.offsetHeight;
      if (defElement.offsetTop > lowerBound) {
        defElement.style.top = lowerBound + "px";
        console.log("Then set to: ", defElement.style.top);
      }
      var isOut = isOutOfViewport(defElement, this.context.textEnd);
      if (isOut.left) defElement.style.left = "0px";
      console.log(isOut);
    }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.word != this.props.word) this.newDefinition();
  }

  crossOut = () => {
    this.props.crossOut();
  };

  // getDefinition = async (api) => {
  //   const xVar = x;
  //   const yVar = y;
  //   console.log("X:", xVar, "Y:", yVar);
  //   var word = this.props.word;
  //   console.log(word);
  //   word = validate.replaceChars(word);
  //   const url = api.url.replace("{{keyword}}", word);
  //   console.log(url);
  //   const a = await fetch(url);
  //   const b = await a.text();
  //   var classNames = "definition " + api.cssSelector;
  //   const containerElement = document.getElementById("definition-container");
  //   const html =
  //     "<div draggable='true' class='" +
  //     classNames +
  //     "'><h4>" +
  //     this.props.word +
  //     "</h4><h5>" +
  //     api.name +
  //     "</h5><p>" +
  //     b +
  //     "</p></div>";
  //   containerElement.style.top = yVar + "px";
  //   containerElement.style.left = xVar + "px";
  //   //Avoid Duplicates
  //   if (
  //     document
  //       .getElementById("definition-container")
  //       .innerHTML.indexOf(classNames) == -1
  //   )
  //     document.getElementById("definition-container").innerHTML += html;
  //   //Add Draggable functionality.
  //   const justCreatedEl = document.querySelector(
  //     "#definition-container ." + api.cssSelector
  //   );
  //   justCreatedEl.style.top = yVar;
  //   justCreatedEl.style.left = xVar;
  //   console.log(justCreatedEl);
  //   dragElement(document.getElementById("definition-container"));
  //   //Put into viewport, if outside
  //   var isOut = isOutOfViewport(justCreatedEl);
  //   console.log("Testing isOUT");
  //   console.log(isOut, this.context.textEnd);
  //   console.log("TextEnd: ", this.context.textEnd);
  //   //Remember that in the CSS, after you set "left", you also translateX(-50%), so you must offset by 50% of the width.
  //   if (isOut.left)
  //     justCreatedEl.style.left = justCreatedEl.clientWidth * 0.5 + 20 + "px";
  //   console.log(justCreatedEl.style.left);
  //   if (isOut.right)
  //     justCreatedEl.style.left =
  //       this.context.textEnd - justCreatedEl.clientWidth * 0.5 - 20 + "px";
  // };

  render() {
    return (
      <div id="definition-container">
        <div id="definition-title">
          {this.props.word}
          <button type="button" onClick={this.crossOut}>
            X
          </button>
        </div>
        {this.context.apis
          .filter((e) => e.enabled)
          .map((e) => (
            <InnerDefinition word={this.props.word} api={e} />
          ))}
      </div>
    );
  }
}
Definition.contextType = LangContext;

export default Definition;
