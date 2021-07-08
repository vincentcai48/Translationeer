import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import SingleWord from "./SingleWord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextAreaNew from "../TextAreaNew";

//text: string (the text), setText: function (for editing it), number:number (the nth section)
//isEditing: show the editing textbox, setIsEditing: toggle isEditing
export default function WordList({ text, setText, number, isEditing, setIsEditing, setWord }) {
  const [editText, setEditText] = useState<string>(text);

  useEffect(()=>{
    setEditText(text);
  },[text])

  const renderText = () => {
    var i = 0;
    var res: any[] = [];
    text = String(text);
    var arr: string[] = text.split(" ");
    arr.forEach((l) => {
      var a: string[] = l.split("\n");
      a.forEach((w) => {
        res.push(<SingleWord  key={i} word={w} setWord={setWord}></SingleWord>);
        i++;
        res.push(<div className="break" key={i}></div>);
        i++;
      });
      res.pop();
    });
    return res;
  };

  var wordList: any[] = renderText();
  return (
    <div className="wordlist">
      {isEditing ? (
        <div className="edit-text">
          <div className="edit-text-ta-container">
            <TextAreaNew
                val={editText}
                setFunc={(t) => setEditText(t)}
                placeholder="Text Here"
            ></TextAreaNew>
          </div>
          <div className="row">
            <button
              className="sb mr15"
              onClick={() => {
                setText(editText);
                setIsEditing(false);
              }}
            >
              Done
            </button>
            <button
              className="tb"
              onClick={() => {
                setEditText(text);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="main-wordlist">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon className="icon" icon={faEdit}></FontAwesomeIcon>
          </button>
          <div className="inner-wordlist">{wordList}</div>
        </div>
      )}
    </div>
  );
}
