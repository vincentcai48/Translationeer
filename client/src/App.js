import React from "react";
import QuickSearch from "./components/QuickSearch";
import { LangContext } from "./services/context";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home.js";
import Auth from "./components/Auth";
import { fbFieldValue, pAuth, pFirestore } from "./services/config";
import Header from "./components/Header";
import Studio from "./components/Studio";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import Docs from "./components/Docs";

class App extends React.Component {
  constructor() {
    super();

    this.updateApis = (apis) => {
      this.setState({ apis: apis });
    };

    this.updateLanguage = async (language) => {
      if (!this.state.allApis) await this.getAllApisFromDB();
      console.log(language);
      var arr = []; //array of api objects
      pFirestore
        .collection("languages")
        .doc(language)
        .get()
        .then((doc) => {
          console.log(this.state.allApis);
          doc.data().apis.forEach((e) => {
            var currentApi = this.state.allApis[e];
            if (currentApi) {
              console.log(currentApi.enabled);
              if (!currentApi.enabled) currentApi.enabled = false; //for the case that "enabled" is not set, default to disabled
              arr.push(this.state.allApis[e]);
            }
          });
          this.setState({ language: language, apis: arr });
          if (pAuth.currentUser) {
            pFirestore
              .collection("users")
              .doc(pAuth.currentUser.uid)
              .update({ defaultLanguage: language });
          }
        });
    };

    this.updateTextEnd = (textEnd) => {
      this.setState({ textEnd: textEnd });
    };

    this.updateIsAuth = (isAuth) => {
      this.setState({ isAuth: isAuth });
    };

    this.state = {
      allApis: [],
      apis: [], //these are the current apis for the selected language
      languageOptions: [],
      language: "", //important to NOT initially set a language, so it will set the language WITH all the Apis
      defaultText: "No Translation Here",
      textEnd: "50", //this is actually set in line 82 of studioHeader
      isMobile: window.outerWidth < 600,
      isAuth: false,
      isJustCreatedUser: false,
      updateApis: this.updateApis,
      updateLanguage: this.updateLanguage,
      updateTextEnd: this.updateTextEnd,
      updateIsAuth: this.updateIsAuth,
    };
  }
  // <Router>
  //           <Switch>
  //             <Router path="/" exact component={<Home />} />
  //             <Router path="/quicktranslate" component={<QuickSearch />} />
  //           </Switch>
  //         </Router>

  componentDidMount() {
    pAuth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isAuth: true });
        const thisUserRef = pFirestore.collection("users").doc(user.uid);
        thisUserRef.get().then((doc) => {
          console.log("GOTDOC", doc.exists);
          //THIS IS JUST TO ADD STARTING DOCUMENT IF USER IS NEW
          if (!doc.exists) {
            console.log("ADDING!!");
            thisUserRef
              .set({
                defaultLanguage: "Latin to English",
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                imageURL: user.photoURL,
                email: user.email,
              })
              .then(() => {
                // thisUserRef
                //   .collection("documents")
                //   .add({
                //     name: "Starter Document",
                //     body: [
                //       {
                //         text:
                //           "Welcome to Translationeer! Your original text appears on this side",
                //         translation: "Your translation appears on this side.",
                //       },
                //     ],
                //     color: "var(--pc)",
                //     timestamp: fbFieldValue.serverTimestamp(),
                //   })
                //   .then(() => {
                //     this.updateLanguage("Latin to English");
                //     this.setState({ isJustCreatedUser: true });
                //   });
              });
          } else {
            if (doc.data().defaultLanguage) {
              this.updateLanguage(doc.data().defaultLanguage);
            }
          }
        });
      } else this.setState({ isAuth: false });
    });
    this.getAllApisFromDB(); //this calls the getAllLanguagesFromDB() in the callback, because you need all the apis before you set apis from a language
  }

  getAllLanguagesFromDB = () => {
    pFirestore
      .collection("languages")
      .get()
      .then((docs) => {
        var arr = [];
        docs.forEach((doc) => {
          arr.push(doc.id);
        });
        this.setState({ languageOptions: arr });
        if (this.state.language.length < 1) {
          this.updateLanguage(arr[1]); //the 2nd element is Latin to English
        }
      });
  };

  getAllApisFromDB = async () => {
    pFirestore
      .collection("apis")
      .doc("allApis")
      .get()
      .then((doc) => {
        this.setState({ allApis: doc.data()["allApis"] });
        this.getAllLanguagesFromDB();
      });
  };

  initialSetLanguage = () => {};

  render() {
    return (
      <LangContext.Provider value={this.state}>
        <div className="App">
          <Router>
            <Header></Header>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/quicktranslate">
                <QuickSearch />
              </Route>
              <Route path="/studio">
                <Studio />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/account">
                <Account />
              </Route>
              <Route path="/docs">
                <Docs />
              </Route>
            </Switch>
            <Footer />
          </Router>
        </div>
      </LangContext.Provider>
    );
  }
}

export default App;
