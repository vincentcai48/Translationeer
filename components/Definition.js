import React, { useContext, useEffect, useRef, useState } from "react";
import { DefinitionContext, LangContext } from "../services/context";
import { validate } from "../services/validate";
import InnerDefinition from "./InnerDefinition";
import Loading from "./Loading";

//PROPS: String word, Array[Object()] apis, Function crossOut

//Each api object: {String url, String name, String cssSelector}. ALL of them MUST be unique.

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
