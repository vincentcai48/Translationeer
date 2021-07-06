import { faEdit, faPen, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import PContext from "../../services/context";
import { validate } from "../../services/validate";
import Loading from "../Loading";
import InnerDefinition from "./InnerDefinition";

//PROPS: String word, Array[Object()] apis, Function crossOut

//Each api object: {String url, String name, String cssSelector}. ALL of them MUST be unique.

function Definition({word,setWord,exitFunc}) {
  const context = useContext(PContext);
  const ref = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [inputWord, setInputWord] = useState("");
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [styles, setStyles] = useState({});
  const [isDragging, setIsDragging] = useState(false);


  useEffect(() => {
    //Step 1: set the location of the definition box
    rePosition();

    //IMPORTANT TO PREVENT GLITCHES
    //An Extra check, just in case the mouse comes up and its not on the element
    window.addEventListener("mouseup", dragEnd);
  }, []);

  useEffect(()=>{
      if(word!==inputWord) rePosition();
  },[word])

  const rePosition = () => {
    if (ref && ref.current) {
      //Step 1: assign new styles, top and right, for positioning
      var newStyles = { ...styles }; //styles for the ref element
      newStyles["top"] = context.mouseY + 20 + "px";
      newStyles["left"] =
        Math.max(context.mouseX - ref.current.offsetWidth * 0.5, 0) + "px"; //check to not flow out leftwards.

      //Then set those styles.
      setStyles(newStyles);
    }
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

  const renderDefinitions = ():any[] =>{
      var arr = [];
      context.apis.filter(api=>api.enabled).forEach(api=>{
          arr.push(<InnerDefinition
            word={word}
            url={api.url}
            name={api.name}
            cssSelector={api.cssSelector}
          ></InnerDefinition>)
      })
      console.log(arr,context.apis);
      return arr;
  }

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
          String(word)
        )}
        {!isEditing ? (
          <button
            onClick={() => {
                setInputWord(word)
                setIsEditing(true)}
            }
            className="tb ml15 center"
          >
              <FontAwesomeIcon className="siw" icon={faPen}></FontAwesomeIcon>
          </button>
        ) : (
          <button className="submit-newWord center" onClick={changeSearch}>
            <FontAwesomeIcon className="sib" icon={faSearch}></FontAwesomeIcon>
          </button>
        )}
        <button type="button" className="x-out center" onClick={exitFunc}>
          <FontAwesomeIcon className="sir" icon={faTimes}></FontAwesomeIcon>
        </button>
      </div>
      <ul className="definitions-list">
            {renderDefinitions()}
      </ul>
    </div>
  );
}

export default Definition;
