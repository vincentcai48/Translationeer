import React from "react";
import QuickSearch from "./QuickSearch";
import Link from "next/link";
import { parser } from "../services/react-custom-markdown/mdparser";
import Image from "next/image";
import { LangContext } from "../services/context";

class Home extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isSearched: false,
      query: "",
    };
  }

  changeState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  submit = () => {
    this.setState({ isSearched: true });
  };

  unSearch = () => {
    this.setState({ isSearched: false });
  };

  render() {
    return this.state.isSearched ? (
      <QuickSearch
        query={this.state.query || "No Text Supplied"}
        unSearch={this.unSearch}
      />
    ) : (
      <div>
        <div id="jumbotron">
          {/* <div className="jImage-container">
            <Image
              src={
                this.context.isMobile
                  ? "/images/phone-jumbotron.PNG"
                  : "/images/jumbotron.png"
              }
              layout="fill"
            />
          </div> */}
          <div id="jumbotron-text">
            <h2>A Better Way to Translate</h2>
            <p>
              Translationeer is the premier online tool for translation, with
              its resources designed for making translations easy.
            </p>
            <div id="jumbotron-quickSearch">
              <input
                type="text"
                onChange={this.changeState}
                name="query"
                placeholder="Type something ..."
              ></input>
              <button type="button" onClick={this.submit}>
                Translate<span>{""}</span>
              </button>
            </div>
          </div>
        </div>
        <section id="home-sec1">
          <h2>What is Translationeer?{process.env.FIREBASE_API_KEY}</h2>
          <p>
            Translationeer is a platform for language students to access all
            necessary translation resources in one place. Use our canvas-style
            translation suite with tons of interactive elements on the screen
            for an immersive experience. We offer many languages and translation
            services that you can toggle on and off to personalize your
            translation experience. Create an account for free by just logging
            in with your Google Account, and unlock the power of the
            Translationeer Studio, where you can custom split and merge your
            document into understandable pieces, all while using our interactive
            canvas. Get started Now!
          </p>
          <div id="home-sec1-links">
            <Link href="/studiodefault">
              <span className="arrow-button home-link">
                Go to Studio<span>{">>>"}</span>
              </span>
            </Link>
            <Link href="/howto">
              <span className="arrow-button home-link">
                How To Guide<span>{">>>"}</span>
              </span>
            </Link>
          </div>
        </section>
      </div>
    );
  }
}
Home.contextType = LangContext;

export default Home;
