import React, { useContext, useEffect, useRef, useState } from "react";
import { DefinitionContext, LangContext } from "../services/context";
import { validate } from "../services/validate";
import InnerDefinition from "./InnerDefinition";
import Loading from "./Loading";

//PROPS: String word, Array[Object()] apis, Function crossOut

//Each api object: {String url, String name, String cssSelector}. ALL of them MUST be unique.

var x, y;
var rect;

// function dragElement(elmnt) {
//   var pos1 = 0,
//     pos2 = 0,
//     pos3 = 0,
//     pos4 = 0;
//   elmnt.onmousedown = dragMouseDown;

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     const docContainer = document.querySelector("#docContainer");
//     const docContainerBottom =
//       docContainer.offsetTop + docContainer.offsetHeight;
//     //+/- 40 because of the 20px translate y
//     // if (elmnt.offsetTop - pos2 + elmnt.offsetHeight + 40 > docContainerBottom) {
//     //   elmnt.style.top = docContainerBottom - elmnt.offsetHeight - 40 + "px";
//     // } else if (elmnt.offsetTop - pos2 < docContainer.offsetTop) {
//     //   elmnt.style.top = docContainer.offsetTop;
//     // } else {
//     //   elmnt.style.top = elmnt.offsetTop - pos2 + "px";
//     // }

//     if (
//       elmnt.offsetTop - pos2 + elmnt.offsetHeight >
//       document.querySelector("body").offsetHeight
//     ) {
//       const lowerBound =
//         document.querySelector("body").offsetHeight - elmnt.offsetHeight;

//       elmnt.style.top = lowerBound + "px";
//     } else {
//       elmnt.style.top = elmnt.offsetTop - pos2 + "px";
//     }
//     elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
//   }

//   function closeDragElement() {
//     // stop moving when mouse button is released:
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }

var isOutOfViewport = function (elem, textEnd) {
  // Get element's bounding
  var bounding = elem.getBoundingClientRect();

  // Check if it's out of the viewport on each side
  var out = {};
  out.top = bounding.top < 0;
  out.left = bounding.left < 0;
  out.bottom =
    bounding.bottom >
    (window.innerHeight || document.documentElement.clientHeight);
  out.right =
    bounding.right > (textEnd || document.documentElement.clientWidth);
  out.any = out.top || out.left || out.bottom || out.right;
  out.all = out.top && out.left && out.bottom && out.right;

  return out;
};

function Definition(props) {
  const context = useContext(LangContext);
  const ref = useRef(null);

  const [apis, setApis] = useState(props.apis);
  const [isEditing, setIsEditing] = useState(false);
  const [inputWord, setInputWord] = useState("");
  const [word, setWord] = useState("");
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [styles, setStyles] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    //Step 1: get the definition (which sets the location of the definition box)
    newDefinition();
    //IMPORTANT TO PREVENT GLITCHES
    //An Extra check, just in case the mouse comes up and its not on the element
    window.addEventListener("mouseup", dragEnd);
  }, []);

  //When the props change, set a new word.
  useEffect(() => {
    newDefinition();
  }, [props.word]);

  const newDefinition = () => {
    setWord(props.word);
    setInputWord(props.word);
    if (ref && ref.current) {
      //Step 1: assign new styles, top and right, for positioning
      var newStyles = { ...styles }; //styles for the ref element
      newStyles.top = context.mouseY + 20 + "px";
      newStyles.left =
        Math.max(context.mouseX - ref.current.offsetWidth * 0.5, 0) + "px"; //check to not flow out leftwards.

      //Then set those styles.
      setStyles(newStyles);
    }
  };

  const crossOut = () => {
    props.crossOut();
  };

  const dragStart = (e) => {
    setDiffX(
      e.screenX -
        (e.currentTarget.getBoundingClientRect().left + window.scrollX)
    );
    setDiffY(
      e.screenY - (e.currentTarget.getBoundingClientRect().top + window.scrollY)
    );
    setIsDragging(true);
  };

  const dragging = (e) => {
    if (isDragging && !isEditing) {
      var x = e.screenX - diffX;
      var y = e.screenY - diffY;
      setStyles({
        top: y,
        left: x,
      });
    }
  };

  const dragEnd = (e) => {
    setIsDragging(false);
  };

  // getDefinition = async (api) => {
  //   const xVar = x;
  //   const yVar = y;
  //   console.log("X:", xVar, "Y:", yVar);
  //   var word = props.word;
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
  //     props.word +
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
  //   console.log(isOut, context.textEnd);
  //   console.log("TextEnd: ", context.textEnd);
  //   //Remember that in the CSS, after you set "left", you also translateX(-50%), so you must offset by 50% of the width.
  //   if (isOut.left)
  //     justCreatedEl.style.left = justCreatedEl.clientWidth * 0.5 + 20 + "px";
  //   console.log(justCreatedEl.style.left);
  //   if (isOut.right)
  //     justCreatedEl.style.left =
  //       context.textEnd - justCreatedEl.clientWidth * 0.5 - 20 + "px";
  // };

  const changeSearch = () => {
    setWord(inputWord);
    setIsEditing(false);
  };

  return (
    <div
      id="definition-container"
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={dragEnd}
      style={styles}
      ref={ref}
    >
      <div id="definition-title">
        {isEditing ? (
          <input
            className="edit-searchWord"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            name="inputWord"
            placeholder="Enter Query"
            autoComplete="off"
          ></input>
        ) : (
          word
        )}
        {!isEditing ? (
          <button
            className="fas fa-pen"
            onClick={() => setIsEditing(true)}
          ></button>
        ) : (
          <button className="submit-newWord" onClick={changeSearch}>
            <i className="fas fa-search"></i>
          </button>
        )}
        <button type="button" className="x-out" onClick={crossOut}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      {context.apis
        .filter((e) => e.enabled)
        .map((e) => (
          <InnerDefinition word={word} api={e} />
        ))}
    </div>
  );
}

export default Definition;
