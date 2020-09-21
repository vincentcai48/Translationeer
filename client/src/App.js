import React from "react";
import QuickSearch from "./components/QuickSearch";
import { LangContext } from "./services/context";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home.js";
import Auth from "./components/Auth";
import { pAuth } from "./services/config";
import Header from "./components/Header";
import Studio from "./components/Studio";
import Footer from "./components/Footer";

class App extends React.Component {
  constructor() {
    super();

    this.updateApis = (apis) => {
      this.setState({ apis: apis });
    };

    this.updateLanguage = (language) => {
      this.setState({ language: language });
    };

    this.updateTextEnd = (textEnd) => {
      this.setState({ textEnd: textEnd });
    };

    this.updateIsAuth = (isAuth) => {
      this.setState({ isAuth: isAuth });
    };

    this.state = {
      apis: [
        {
          url: "search/{{keyword}}",
          name: "Whitaker's Words",
          cssSelector: "whitakers",
        },
      ],
      language: "Latin to English",
      textEnd: window.innerWidth / 2,
      isAuth: false,
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
      } else this.setState({ isAuth: false });
    });
  }

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
            </Switch>
            <Footer />
          </Router>
        </div>
      </LangContext.Provider>
    );
  }
}

export default App;
