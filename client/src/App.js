import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [definition, setDefinition] = useState("");

  function getDefinition(keywordParam) {
    console.log(keyword);
    console.log(keywordParam);
    console.log("getting definition");
    fetch("/search/" + keywordParam)
      .then((res) => res.text())
      .then((data) => {
        console.log("data is: ", data);
        console.log(typeof data);
        const newData = data.replace("m", "l");
        console.log(newData);
        setDefinition(newData);
        document.getElementById("content").innerHTML = data;
      });
  }

  return (
    <div className="App">
      <h1>Whitaker's words Quick Lookup</h1>
      <form>
        <input
          type="text"
          placeholder="keyword"
          onChange={(e) => {
            setKeyword(e.target.value);
            console.log(e);
            console.log(e.target.value);
          }}
        ></input>
        <button type="button" onClick={() => getDefinition(keyword)}>
          Submit
        </button>
      </form>
      <div>{definition}</div>
      <div id="content"></div>
    </div>
  );
}

export default App;
