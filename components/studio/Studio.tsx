import {
  faArrowsAltV,
  faCheckCircle,
  faCircleNotch,
  faCog,
  faExclamationTriangle,
  faFileAlt,
  faPen,
  faPlus,
  faPlusCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useContext, useRef } from "react";
import { fbFieldValue, pAuth, pFirestore } from "../../services/config";
import PContext from "../../services/context";
import Loading from "../Loading";
import TextAreaNew from "../TextAreaNew";
import Definition from "../word/Definition";
import WordList from "../word/WordList";
import Popup from "../Popup";

interface Settings {
  copyDivide?: string;
  fontSize?: number;
}

export default function Studio({ id, isTest }) {
  //THIS is the DEFINTIIVE list of possible settings
  const defaultSettings = {
    copyDivide: " ",
    fontSize: 22,
    studioWidth: 50,
  };

  const [studioLoading, setStudioLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);
  const { isAuth, defaultName } = useContext(PContext);
  const [name, setName] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>(name);
  const [editName, setEditName] = useState<boolean>(false);
  const [texts, setTexts] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [textsEditing, setTextsEditing] = useState<boolean[]>([]);
  const [breakoffText, setBreakoffText] = useState<string | null>(null);
  const [breakoffIndex, setBreakoffIndex] = useState<number>(-1);
  const [word, setWord] = useState<string | null>(null);
  const [settings, setSettings] = useState<object>({});
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copyMessage, setCopyMessage] = useState<string>("Copy");

  //For auto-save
  const saves = useRef(-3); //-3 to start, set three values at start, 0 for each new save batch;
  //Three refs so it can change while setTimeout runs
  const nameRef = useRef(name);
  const textsRef = useRef(texts);
  const translationsRef = useRef(translations);
  const settingsRef = useRef(settings);
  const saveInterval = 10; //in secs

  //Just for template dev.
  const allTemplates = useRef([]);
  const templateNum = useRef(0);

  //set to save templates or not (if doing tmeplate dev)
  const saveTemplates:boolean = false; //Make sure to also allow write in firestore rules
  const setIndex:number|null = null;//if you want to set an index for template, not random.

  useEffect(() => {
    if (isAuth) getDoc();
    if (isTest) getTemplate(id);
  }, [isAuth,id]);

  const autoSave = () => {
    if((isTest||!isAuth)&&!saveTemplates) return;
    setSaving(true);
    //Then check if beginning of a save batch;
    if (saves.current == 0) {
      setTimeout(() => {
        saves.current = 0;
        save();
      }, saveInterval * 1000);
    }

    //First set Refs
    nameRef.current = name;
    textsRef.current = texts;
    translationsRef.current = translations;
    settingsRef.current = settings;

    saves.current = saves.current + 1;
  };

  //auto save on change
  useEffect(autoSave, [name, texts, translations, settings]);

  const getDoc = async (): Promise<void> => {
    try {
      let query = pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(id);

      let res = await query.get();
      let data = res.data();
      setName(data["name"]);
      //Handle version 1:
      if (data["body"]) {
        setTexts(data["body"].map((e) => e.text));
        setTranslations(data["body"].map((e) => e.translation));
        setTextsEditing(data["body"].map(() => false)); //all false
        await query.update({
          body: fbFieldValue.delete(),
          texts: data["body"].map((e) => e.text),
          translations: data["body"].map((e) => e.translation),
        });
      } else {
        setTexts(data["texts"]);
        setTranslations(data["translations"]);
        setTextsEditing(data["texts"].map(() => false)); //all false
      }
      //Set settings, to either saved value or the default
      var newSettings = data["settings"] || defaultSettings;
      Object.keys(defaultSettings).forEach((setting) => {
        if (!newSettings[setting])
          newSettings[setting] = defaultSettings[setting];
      });
      setSettings(newSettings);
    } catch (e) {
      console.error(e);
    }
    setStudioLoading(false);
  };

  const getTemplate = async (tid):Promise<void> =>{
    try{
      const language:string = "latin"; //hard code this in for now.
      var res = (await pFirestore.collection("templates").doc(language).get()).data();
      var text:string, name:string;
      if(!res[tid]||tid=="blank") {
        text = "";
        name = "Test Document";
      }else{
        var index:number = setIndex?setIndex:Math.floor(Math.random()*res[tid].length);
        allTemplates.current = res[tid];
        templateNum.current = index;
        var doc = res[tid][index];
        text = doc["text"];
        name = doc["name"];
      }
      setName(name);
      setTexts([text]);
      setTranslations(['']);
      setSettings(defaultSettings);
    }catch(e){
      console.error(e);
    }
    setStudioLoading(false);
  }

  const renderSections = (): any[] => {
    if (!texts) return;
    var arr: any[] = [];
    for (let i = 0; i < texts.length; i++) {
      arr.push(
        <div
          className={`single-section${i != texts.length - 1 ? "" : " last"}`}
        >
          <div className="left">
            <div className="options">
              <button
                className="sb add"
                onClick={() => addSection("", texts.length - 1)}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faPlus}
                ></FontAwesomeIcon>
              </button>
            </div>
            <WordList
              text={texts[i]}
              setText={(text) => setText(text, i)}
              number={i + 1}
              isEditing={textsEditing[i]}
              setIsEditing={(b) => setIsEditing(b, i)}
              setWord={(w) => setWord(w)}
            ></WordList>
          </div>
          {i != texts.length - 1 ? (
            <button className="merge" onClick={() => mergeDown(i)}>
              <FontAwesomeIcon
                className="icon"
                icon={faArrowsAltV}
              ></FontAwesomeIcon>
            </button>
          ) : (
            <button
              className="sb add"
              onClick={() => addSection("", texts.length - 1)}
            >
              <FontAwesomeIcon className="icon" icon={faPlus}></FontAwesomeIcon>
            </button>
          )}
          <div className="right">
            <TextAreaNew
              val={translations[i]}
              setFunc={(t) => setTranslation(t, i)}
              placeholder="Type translation..."
            ></TextAreaNew>
          </div>
        </div>
      );
    }
    arr.push(
      <div className="single-section background">
        <div className="left"></div>
        <div className="right"></div>
      </div>
    );
    return arr;
  };

  const setText = (text: string, index: number): void => {
    var arr = [...texts];
    arr[index] = text;
    setTexts(arr);
  };

  const setTranslation = (translation: string, index: number): void => {
    var arr = [...translations];
    arr[index] = translation;
    setTranslations(arr);
  };

  //on change settings
  const settingsChange = () => {
    let root = document.documentElement;

    //Go through each setting

    //fontSize
    let fontSize = settings["fontSize"] || defaultSettings.fontSize;
    root.style.setProperty("--studio-font-size", fontSize + "px");

    //studioWidth
    let studioWidth = settings["studioWidth"] || defaultSettings.studioWidth;
    root.style.setProperty("--studio-width", studioWidth + "%");
  };

  //set all settings in css variables when settings are changed.
  useEffect(settingsChange, [settings]);

  const setIsEditing = (isEditing: boolean, index: number): void => {
    var arr = [...textsEditing];
    arr[index] = isEditing;
    setTextsEditing(arr);
  };

  const onMouseUp = (): void => {
    const selectedText: string = window
      .getSelection()
      .toString()
      .replaceAll(/(\r\n|\n|\r)/gm, "")
      .replaceAll(/[\s\u00A0]/gm, " ");
    if (selectedText !== breakoffText) {
      if (!selectedText) {
        setBreakoffText(null);
        setBreakoffIndex(-1);
      } else {
        let index = findBreakoffIndex(selectedText, texts);
        setBreakoffIndex(index);
        if (index > -1) setBreakoffText(selectedText);
      }
    }
  };

  const findBreakoffIndex = (bText: string, texts: any[]): number => {
    var index = -1;
    for (let i = 0; i < texts.length; i++) {
      let thisText = texts[i].replace(/\n|\r/g, " ");
      if (thisText.includes(bText)) index = i;

      //check with spaces at end removed
      let b2Text = bText.replace(/[ |\n]*$/gi, "");
      if (thisText.includes(b2Text)) index = i;
    }
    if (index >= 0 && textsEditing[index]) return -1; //unable to break off if is editing section
    return index;
  };

  const breakoff = () => {
    const textWithLB = texts[breakoffIndex];
    let textNoLB = "";

    //Step 1: split doc by linebreak, into an array.
    let linebrakeDivides = textWithLB.split(/\n|\r/g);

    //Step 2: make an array of linebreak indices, and fill out a No-linebreak-text (textNoLB)
    var linebreakIndices = []; //indices with a linebreak BEFORE
    var indexCount = 0;

    linebrakeDivides.forEach((a) => {
      indexCount += a.length + 1; //because of the space
      textNoLB += a + " ";
      linebreakIndices.push(indexCount);
    });
    linebreakIndices.sort();

    //Step 3: find start and end index in the no linebreak text
    var startingIndex = textNoLB.indexOf(breakoffText);
    var endingIndex = startingIndex + breakoffText.length;

    //NOT needed because a "\n" is one character, and when you select a linebreak, the space " " is one character, so the lengths will be the same
    //Step 4: then modify these start and end indices based on how many linebreaks come before it.
    var countBeforeStart = 0; //# of linebreaks before starting index
    var countBeforeEnd = 0; //and before ending index
    linebreakIndices.forEach((i) => {
      //use less than or equal to because the linebreak indices are where a linebreak comes BEFORE THAT INDEX
      if (i <= startingIndex) countBeforeStart++;
      if (i <= endingIndex) countBeforeEnd++;
    });

    // const linebreakCodeLength = 1; //linebreak \n is one char long
    // //IMPORTANT: Minus one because in the text, a linebreak is represented by a space " " character, so it only adds more characters if the sequence is more than 1 character long.

    // startingIndex += countBeforeStart * linebreakCodeLength;
    // endingIndex += countBeforeEnd * linebreakCodeLength;

    //Step 5: Proceed by splitting the section up, now that you have the starting and ending indices, taking linebreak escape sequences into account.
    //NOTE: still put into one large array so you can easily delete generate sections.
    var newArr = [
      {
        text: textWithLB.substring(0, startingIndex),
        translation: "",
      },
      {
        text: textWithLB.substring(startingIndex, endingIndex),
        translation: "",
      },
      {
        text: textWithLB.substring(endingIndex),
        translation: "",
      },
    ];

    //Step 6: Handling "Degenerate" sections (aka. if it is just a space or two) Instead of deleting entire sections if they are just a space, merge them into another section

    //Case 1: the middle section is degenerate (merge into last)
    if (isDegenerate(newArr[1].text)) {
      var holdText = newArr[1].text;
      newArr[newArr.length - 1].text =
        holdText + newArr[newArr.length - 1].text;
      newArr.splice(1, 1);
    }

    //Case 2: the first section is degenerate (merge into second)
    if (isDegenerate(newArr[0].text)) {
      var holdText = newArr[0].text;
      newArr[1].text = holdText + newArr[1].text;
      newArr.splice(0, 1);
    }

    //Case 3: the last section is degenerate AND there is still a section to merge into
    if (isDegenerate(newArr[newArr.length - 1].text) && newArr.length >= 2) {
      var holdText = newArr[newArr.length - 1].text;
      newArr[newArr.length - 2].text =
        holdText + newArr[newArr.length - 2].text;
      newArr.pop();
    }

    //Step 7: add original translation to FIRST section.
    newArr[0].translation = translations[breakoffIndex];

    //Step 8: put this new data into state
    var newTexts = [...texts];
    var newTranslations = [...translations];
    //the splice method modifies by reference, important.
    newTexts.splice(breakoffIndex, 1, ...newArr.map((s) => s.text));
    newTranslations.splice(
      breakoffIndex,
      1,
      ...newArr.map((s) => s.translation)
    );
    setTexts(newTexts);
    setTranslations(newTranslations);
    setBreakoffText(null);
    setBreakoffIndex(-1);
    clearSelection();
  };

  const clearSelection = () => {
    if (window && window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  };

  const isDegenerate = (str: string): boolean => {
    if (str.length < 1) return true;
    for (var i = 0; i < str.length; i++) {
      if (str.substring(i, i + 1) !== " ") return false;
    }
    return true;
  };

  const mergeDown = (index: number) => {
    if (index < 0 || index >= texts.length - 1) return;
    var newTexts = [...texts];
    var newTranslations = [...translations];

    newTexts.splice(index, 2, texts[index] + texts[index + 1]);
    newTranslations.splice(
      index,
      2,
      translations[index] + translations[index + 1]
    );

    setTexts(newTexts);
    setTranslations(newTranslations);
  };

  const addSection = (text: string, after: number) => {
    var newTexts = [...texts];
    var newTranslations = [...translations];

    newTexts.splice(after + 1, 0, text);
    newTranslations.splice(after + 1, 0, "");

    setTexts(newTexts);
    setTranslations(newTranslations);
    setIsEditing(true, after + 1); //edit this new section's text
  };

  const save = async () => {
    setSaving(true);
    try {
      if(isTest){
        if(!saveTemplates) return;
        const language = "latin";
        var newArr = [...allTemplates.current];
        newArr[templateNum.current] = {
          name: nameRef.current,
          text: textsRef.current.reduce((a,n)=> a + " "+n),
        }
        await pFirestore.collection("templates").doc(language).update({
          [id]: newArr,
        })
      }else{
        await pFirestore
          .collection("users")
          .doc(pAuth.currentUser.uid)
          .collection("documents")
          .doc(id)
          .update({
            name: nameRef.current,
            texts: textsRef.current,
            translations: translationsRef.current,
            settings: settingsRef.current,
            timestamp: new Date().getTime(),
          });
      }
      setSaveError(false);
    } catch (e) {
      console.error(e);
      setSaveError(true);
    }
    setSaving(false);
  };

  const truncateText = (t: string, n: number): string => {
    if (t.length > n) return t.substring(0, n) + "...";
    return t;
  };

  const copyTranslation = async () => {
    try {
      var t = "";
      translations.forEach((e) => {
        t += e + (settings["copyDivide"] || " ");
      });
      await navigator.clipboard.writeText(t);
      setCopyMessage("Copied!");
    } catch (e) {
      setCopyMessage("Error!");
    }
  };

  const changeSettings = (property: string, value: any) => {
    let newSettings = { ...settings };
    newSettings[property] = value;
    setSettings(newSettings);
  };

  if (studioLoading)
    return (
      <div id="studio-loading">
        <Loading></Loading>
      </div>
    );
  return (
    <div id="studio">
      <section id="top" className="row">
        <FontAwesomeIcon className="icon" icon={faFileAlt}></FontAwesomeIcon>
        <h2>
          {!editName ? (
            <div className="name">
              {name}
              <FontAwesomeIcon
                icon={faPen}
                className="sib tb ml15"
                onClick={() => {
                  setEditName(true);
                  setNameInput(name);
                }}
              ></FontAwesomeIcon>
            </div>
          ) : (
            <div className="name-edit">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Name"
              ></input>
              <button
                className="tb ml10 mr10"
                onClick={() => {
                  setName(nameInput || defaultName);
                  setEditName(false);
                }}
              >
                <FontAwesomeIcon
                  className="sib"
                  icon={faCheckCircle}
                ></FontAwesomeIcon>
              </button>
              {/* <button className="tb" onClick={()=>setEditName(false)}>Cancel</button> */}
            </div>
          )}
        </h2>
      </section>
      <section id="heading">
        <div id="first-row">
          <div className="left">
            <div className="save-area">
              {saving ? (
                <FontAwesomeIcon
                  className="icon-spin"
                  icon={faCircleNotch}
                ></FontAwesomeIcon>
              ) : saveError ? (
                <FontAwesomeIcon
                  className="icon-x"
                  icon={faTimesCircle}
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  className="icon-check"
                  icon={faCheckCircle}
                ></FontAwesomeIcon>
              )}
            </div>
          </div>
          <div className="middle center">{isTest&&<div className="test-warning center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="sir mr5"></FontAwesomeIcon>
              WARNING: In test mode, changes will NOT be saved. Create an account to save documents.
          </div>}</div>
          <div className="right">
            <button
              className="settings-button tb"
              onClick={() => setShowSettings(true)}
            >
              <FontAwesomeIcon className="siw" icon={faCog}></FontAwesomeIcon>
            </button>
            <button
              className="copy-translation tb"
              onClick={copyTranslation}
              onMouseLeave={() => setCopyMessage("Copy")}
            >
              {copyMessage}
            </button>
          </div>
        </div>
        {breakoffText && breakoffIndex > -1 && (
          <div className="breakoff-text">
            <span>{truncateText(breakoffText, 20)}</span>
            <button onClick={breakoff}>Break Off Text</button>
          </div>
        )}
      </section>
      <section id="body" onMouseUp={onMouseUp}>
        {renderSections()}
      </section>

      {word && (
        <Definition
          word={word}
          setWord={setWord}
          exitFunc={() => setWord(null)}
        ></Definition>
      )}

      {showSettings && (
        <Popup xFunction={() => setShowSettings(false)}>
          <div className="settings-popup">
            <h4>Settings</h4>
            <ul className="settings-list">
              <h6>Display Settings</h6>
              <li key="fontSize">
                <label>Font Size</label>
                <select
                  value={settings["fontSize"]}
                  onChange={(e) =>
                    changeSettings("fontSize", Number(e.target.value))
                  }
                >
                  <option value={16}>Small</option>
                  <option value={22}>Medium</option>
                  <option value={28}>Large</option>
                </select>
              </li>
              <li key="studioWidth">
                <label>Text-Translation Ratio</label>
                <select
                  value={settings["studioWidth"]}
                  onChange={(e) =>
                    changeSettings("studioWidth", Number(e.target.value))
                  }
                >
                  <option value={30}>30-70</option>
                  <option value={40}>40-60</option>
                  <option value={50}>50-50</option>
                  <option value={60}>60-40</option>
                  <option value={70}>70-30</option>
                </select>
              </li>
              <h6>Copy Settings</h6>
              <li key="copyDivide">
                <label>Between each section:</label>
                <select
                  value={settings["copyDivide"]}
                  onChange={(e) => changeSettings("copyDivide", e.target.value)}
                >
                  <option value=" ">Space</option>
                  <option value={"\n"}>New Line</option>
                  <option value={"\n\n"}>Line Between</option>
                </select>
              </li>
            </ul>
          </div>
        </Popup>
      )}
    </div>
  );
}
