import React, { useEffect, useState } from "react";
import QuickSearch from "./QuickSearch";
import Link from "next/link";
import { parser } from "../services/react-custom-markdown/mdparser";
//import Image from "next/image";
import { LangContext } from "../services/context";

function Home(props) {
  const [isSearched, setIsSearched] = useState(false);
  const [query, setQuery] = useState("");

  const submit = () => setIsSearched(true);
  const unSearch = () => setIsSearched(false);

  const keyUp = (e) => {
    if (e.keyCode == 13) submit();
  };

  useEffect(() => {}, []);

  return isSearched ? (
    <QuickSearch query={query || "No Text Supplied"} unSearch={unSearch} />
  ) : (
    <div id="home">
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
            Translationeer is the premier online tool for translation, with its
            resources designed for making translations easy.
          </p>
          <div id="jumbotron-quickSearch">
            <input
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type something ..."
              onKeyUp={keyUp}
            ></input>
            <button type="button" onClick={submit}>
              Translate<span>{""}</span>
            </button>
          </div>
        </div>
      </div>
      <section id="home-sec1">
        {/* <h2>What is Translationeer?{process.env.FIREBASE_API_KEY}</h2>
        <p>
          Translationeer is a platform for language students to access all
          necessary translation resources in one place. Use our canvas-style
          translation suite with tons of interactive elements on the screen for
          an immersive experience. We offer many languages and translation
          services that you can toggle on and off to personalize your
          translation experience. Create an account for free by just logging in
          with your Google Account, and unlock the power of the Translationeer
          Studio, where you can custom split and merge your document into
          understandable pieces, all while using our interactive canvas. Get
          started Now!
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
        </div> */}
      </section>

      <section id="home-sec2">
        <h3>Experience.</h3>
        <div className="split-grid">
          <div className="left-grid ">
            <div className="home-pic"></div>
          </div>

          <div className="right-grid center-child">
            <div>
              <p>
                Translationeer is a platform for language students to access all
                necessary translation resources in one place. Use our
                canvas-style translation suite with tons of interactive elements
                on the screen for an immersive experience. We offer many
                languages and translation services that you can toggle on and
                off to personalize your translation experience. Create an
                account for free by just logging in with your Google Account,
                and unlock the power of the Translationeer Studio, where you can
                custom split and merge your document into understandable pieces,
                all while using our interactive canvas. Get started Now!
              </p>
              <div className="home-buttons">
                <Link href="/studiodefault">
                  <a className="arrow-button home-link blue">
                    Go to Studio<span>{">>>"}</span>
                  </a>
                </Link>
                <Link href="/howto">
                  <a className="arrow-button home-link green">
                    How To<span>{">>>"}</span>
                  </a>
                </Link>
                <Link href="/dashboard">
                  <a className="arrow-button home-link purple">
                    Dashboard<span>{">>>"}</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="home-sec3"></section>
      <section id="home-sec4"></section>
      <section id="home-sec5">
        <div className="split-grid">
          <div className="left-grid">
            <a
              href="https://github.com/Translationeer/Translationeer"
              className="github-link"
              target="_blank"
            >
              <div className="github-link"></div>
            </a>
          </div>
          <div className="right-grid">
            {/* <label>(Click the icon)</label> */}
            <div>
              <h4>We're Open Source!</h4>
              <p>Find us on GitHub. Feel free to contribute!</p>
            </div>
          </div>
        </div>
      </section>
      <section id="home-sec6"></section>
      <section id="home-sec7"></section>
    </div>
  );
}
Home.contextType = LangContext;

export default Home;
