import React from "react";
import Auth from "../Auth";
import {pAuth } from "../../services/config";
import phoneJumbotronImage from "../../images/studio-background2.jpg";
import {Link} from "react-router-dom"

class StudioDefault extends React.Component {
  render() {
    return (
      <div id="studio-default-container">
        <div id="black-background"></div>
        <section id="studioDefault-jumbotronSection">
          <img src={phoneJumbotronImage} id="studio-jumbotron"></img>
    <div id="studio-jumbotron-text"><h2>Try Studio</h2><p>The best way to translate on the web.</p><Link to="/docs" className="arrow-button studio-jumbotron-button">Learn How <span>{">>>"}</span></Link></div>
        </section>
        <section className="studioDefault-section">
          <h2>Powerful.</h2>
          <p>Make the most of all the tools on the Translationeer platform. Fully integrated with all the Translationeer tools, including Translationeer Interactive Canvas and on the spot definition lookups</p>
        </section>
        <section className="studioDefault-section">
          <h2>Flexible.</h2>
          <p>Clearly organize your translation by splitting and merging sections of each document to create a translation that makes sense to you. Structure the studio the way you want, for an immersive and customized experience</p>
        </section>
        
        {pAuth.currentUser?<section className="studioDefault-section">
          <h2>Use Studio Now:</h2>
         
    <Link to="/dashboard" className="arrow-button studioDefault-to-dashboard">Go to Dashboard<span>{">>>"}</span></Link>
          </section>:<section className="studioDefault-section"><h2>Get Started</h2><p>Login With Google to go use the Translationeer Studio</p><Auth style={{color: "black"}}/></section>}
      </div>
    );
  }
}

export default StudioDefault;
