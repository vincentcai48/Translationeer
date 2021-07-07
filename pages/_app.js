import "../styles/basics.scss";
import "../styles/original.scss";
import "../styles/newstyles.scss";
import "../styles/definition.scss";

import Layout from "../components/root/Layout";
import PContext from "../services/context";
import { useEffect, useState, useRef } from "react";
import { pFirestore, pAuth, fbFieldValue } from "../services/config";
import NewUser from "../components/NewUser";

export default function App({ Component, pageProps }) {
  const [tc, setTc] = useState([]); //for "terms and conditions"
  const [newUser, setNewUser] = useState(null); //not in context, and only for use when creating a new user, set this to the new user object
  const [allApis, setAllApis] = useState(null);
  const [apis, setApis] = useState([]); //these are the current apis for the selected language
  const [languageOptions, setLanguageOptions] = useState([]);
  const languageMapping = useRef(null);
  const [language, setLanguage] = useState(null); //important to NOT initially set a language, so it will set the language WITH all the Apis
  const linebreakCode = "&$linebreak&";
  const batchSize = 10;
  const defaultName = "Untitled Document"
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

  //when languageMapping first loads (the languages mapped to their apis, so now you can get the apis)
  useEffect(() => {
    if (languageMapping.current) {
      console.log(language);
      if (language) updateLanguage(language);
      if (!language && languageOptions && languageOptions[1])
        updateLanguage(languageOptions[1]); //the 2nd element is Latin to English
    }
  }, [languageMapping.current]);

  const componentDidMount = async () => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  //NOTE: different from setLanguage, this gets all apis, doesn't just set state.
  const updateLanguage = async (languageParam) => {
    console.log(languageParam);
    console.log(languageMapping.current);
    if (!languageMapping.current) return;
    //Step 1: set the language
    setLanguage(languageParam);

    //Step 2: update the apis list for this language
    var thisAllApis = [];
    if (!allApis || allApis.length == 0) {
      thisAllApis = await getAllApisFromDB();
    } else thisAllApis = allApis;
    var arr = languageMapping.current[languageParam].map((i) => thisAllApis[i]); //array of api objects
    setApis(arr);

    //Step 3: save it to firestore as default language
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
      var doc = await pFirestore.collection("languages").doc("languages").get();
      var arr = Object.keys(doc.data());
      setLanguageOptions(arr);
      languageMapping.current = { ...doc.data() };
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
    tc,
    allApis,
    apis,
    languageOptions,
    language,
    linebreakCode,
    textEnd,
    isMobile,
    isAuth,
    isJustCreatedUser,
    title,
    setTitle,
    setApis,
    updateLanguage,
    setTextEnd,
    setIsAuth,
    mouseX,
    mouseY,
  };

  // const contextValue = {
  //   tc: tc,
  //   newUser: newUser,
  //   allApis: allApis,
  //   apis: apis,
  //   languageOptions: languageOptions,
  //   language: language,
  //   defaultText: defaultText,
  //   linebreakCode: linebreakCode,
  //   textEnd: textEnd,
  //   isMobile: isMobile,
  //   isAuth: isAuth,
  //   isJustCreatedUser: isJustCreatedUser,
  //   title: title,
  //   setTitle: setTitle,
  //   setApis: setApis,
  //   updateLanguage: updateLanguage,
  //   updateTextEnd: setTextEnd,
  //   updateIsAuth: setIsAuth,
  //   mouseX: mouseX,
  //   mouseY: mouseY,
  // };

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
