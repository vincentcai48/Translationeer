import React, { useState } from "react";
import { pFirestore } from "../services/config";

function Docs() {
  const [sections, changeSections] = useState([]);

  async function renderSections() {
    var docs = await pFirestore.collection("documentation").get();
    var arr = [];
    docs.forEach((doc) => {
      arr.push(
        <section className="doc-section">
          <h2>{doc.id}</h2>

          <div>
            {doc.data()["subsections"].map((subsection) => {
              return (
                <div>
                  <h3>{subsection.title}</h3>
                  <p>{subsection.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      );
    });
    changeSections(arr);
  }

  renderSections();

  return (
    <div id="how-to-container">
      <h1>Translationeer How To Guide</h1>
      <p id="h1-subtext">
        Here is the guide on how to use the Translationeer Platform{" "}
      </p>
      <hr></hr>
      {sections}
    </div>
  );
}

export default Docs;
