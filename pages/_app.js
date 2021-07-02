import '../styles/basics.scss'
import '../styles/original.scss'
import '../styles/newstyles.scss'

import Layout from "../components/root/Layout";
import PContext from "../services/context";
import { useEffect, useState } from "react";
import { pFirestore, pAuth, fbFieldValue } from "../services/config";
import NewUser from "../components/NewUser";

function App({ Component, pageProps }) {
  const [tc, setTc] = useState([]);
  const [newUser, setNewUser] = useState(null); //not in context, and only for use when creating a new user, set this to the new user object
  const [allApis, setAllApis] = useState(null);
  const [apis, setApis] = useState([]); //these are the current apis for the selected language
  const [languageOptions, setLanguageOptions] = useState([]);
  const [language, setLanguage] = useState(""); //important to NOT initially set a language, so it will set the language WITH all the Apis
  const [defaultText, setDefaultText] = useState("");
  const linebreakCode = "&$linebreak&";
  const [textEnd, setTextEnd] = useState("50"); //this is actually set in line 82 of studioHeader
  const [isMobile, setIsMobile] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isJustCreatedUser, setIsJustCreatedUser] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  //For <CustomHead/>
  const [title, setTitle] = useState("Translationeer");

  useEffect(() => {
    componentDidMount();
  }, []);

  const componentDidMount = async () => {
    await getAllApisFromDB();
    await getAllLanguagesFromDB();
    var tcRes = await pFirestore
      .collection("settings")
      .doc("termsandconditions")
      .get();

    var newTCArr = [];
    tcRes.data()["paragraphs"].forEach((element) => {
      newTCArr.push(element);
    });
    setTc(newTCArr);

    pAuth.onAuthStateChanged(async (user) => {
      console.log(user);
      if (user) {
        setIsAuth(true);
        const thisUserRef = pFirestore.collection("users").doc(user.uid);
        try {
          var doc = await thisUserRef.get();
          //THIS IS JUST TO ADD STARTING DOCUMENT IF USER IS NEW
          if (!doc.exists) {
            setNewUser(user);
          } else {
            console.log(doc.data().defaultLanguage);
            if (doc.data().defaultLanguage) {
              updateLanguage(doc.data().defaultLanguage);
            }
          }
        } catch (e) {
          console.error(e);
        }
      } else setIsAuth(false);
    });
    getAllApisFromDB();
  };

  //NOTE: different from setLanguage, this gets all apis, doesn't just set state.
  const updateLanguage = async (languageParam) => {
    var thisAllApis = [];
    if (!allApis || allApis.length == 0) {
      thisAllApis = await getAllApisFromDB();
    } else thisAllApis = allApis;
    var arr = []; //array of api objects
    var doc = await pFirestore.collection("languages").doc(languageParam).get();
    doc.data().apis.forEach((e) => {
      var currentApi = thisAllApis[e];
      if (currentApi) {
        if (!currentApi.enabled) currentApi.enabled = false; //for the case that "enabled" is not set, default to disabled
        arr.push(currentApi);
      }
    });
    setLanguage(languageParam);
    setApis(arr);
    if (pAuth.currentUser) {
      try {
        await pFirestore
          .collection("users")
          .doc(pAuth.currentUser.uid)
          .update({ defaultLanguage: languageParam });
      } catch (e) {
        //this probably just means a new user, so the doc won't exist
      }
    }
  };

  const registerNewUser = async (user) => {
    const thisUserRef = pFirestore.collection("users").doc(user.uid);
    try {
      await thisUserRef.set({
        defaultLanguage: "Latin to English",
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        imageURL: user.photoURL,
        email: user.email,
        timeCreated: fbFieldValue.serverTimestamp(),
      });
      setNewUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const cancelNewUser = async () => {
    try {
      await pAuth.currentUser.delete();
      setNewUser(null);
    } catch (e) {
      await pAuth.signOut();
      setNewUser(null);
      console.error(e);
    }
  };

  const getAllLanguagesFromDB = async () => {
    try {
      var docs = await pFirestore.collection("languages").get();
      var arr = [];
      docs.forEach((doc) => arr.push(doc.id));
      setLanguageOptions(arr);
      if (language.length < 1) {
        updateLanguage(arr[1]); //the 2nd element is Latin to English
      }
    } catch (e) {
      console.error(e);
    }
  };

  //returns allApis[], in addition to setting the state.
  const getAllApisFromDB = async () => {
    try {
      var doc = await pFirestore.collection("apis").doc("allApis").get();
      setAllApis(doc.data()["allApis"]);
      return doc.data()["allApis"];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const updateMouseCoords = (e) => {
    setMouseX(e.pageX);
    setMouseY(e.pageY);
  };

  const contextValue = {
    tc: tc,
    newUser: newUser,
    allApis: allApis,
    apis: apis,
    languageOptions: languageOptions,
    language: language,
    defaultText: defaultText,
    linebreakCode: linebreakCode,
    textEnd: textEnd,
    isMobile: isMobile,
    isAuth: isAuth,
    isJustCreatedUser: isJustCreatedUser,
    title: title,
    setTitle: setTitle,
    setApis: setApis,
    updateLanguage: updateLanguage,
    updateTextEnd: setTextEnd,
    updateIsAuth: setIsAuth,
    mouseX: mouseX,
    mouseY: mouseY,
  };

  if (newUser) {
    return (
      <NewUser
        registerNewUser={registerNewUser}
        user={newUser}
        cancelFunction={cancelNewUser}
        tc={tc}
      />
    );
  }
  return (
    <PContext.Provider value={contextValue}>
      <Layout>
        <div onMouseMove={updateMouseCoords}>
          <Component {...pageProps} />
        </div>
      </Layout>
    </PContext.Provider>
  );
}

export default App;


// function MyApp({ Component, pageProps }) {
//   return <div>
//     <CustomHead></CustomHead>
//     <Header></Header>
//     <Component {...pageProps} />
//   </div>
// }

// export default MyApp
