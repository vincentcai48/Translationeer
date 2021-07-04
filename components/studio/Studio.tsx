import { faArrowsAltV, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useContext } from "react";
import { fbFieldValue, pAuth, pFirestore } from "../../services/config";
import PContext from "../../services/context";
import Loading from "../Loading";
import TextAreaNew from "../TextAreaNew";
import WordList from "../word/WordList";

export default function Studio({ id }) {
  const [studioLoading, setStudioLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSave, setLastSave] = useState<number>(0); //milliseconds time
  const { isAuth } = useContext(PContext);
  const [name, setName] = useState<string>("");
  const [texts, setTexts] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [textsEditing, setTextsEditing] = useState<boolean[]>([]);
  const [breakoffText, setBreakoffText] = useState<string | null>(null);
  const [breakoffIndex, setBreakoffIndex] = useState<number>(-1);

  useEffect(() => {
    if (isAuth) getDoc();
  }, [isAuth]);

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

      console.log(data["body"]);
      //Handle version 1:
      if (data["body"]) {
        console.log(data["body"]);
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
    } catch (e) {
      console.error(e);
    }
    setStudioLoading(false);
  };

  const renderSections = (): any[] => {
    var arr: any[] = [];
    for (let i = 0; i < texts.length; i++) {
      arr.push(
        <div className="single-section">
          <div className="left">
            <WordList
              text={texts[i]}
              setText={(text) => setText(text, i)}
              number={i + 1}
              isEditing={textsEditing[i]}
              setIsEditing={(b) => setIsEditing(b, i)}
            ></WordList>
          </div>
          {i != texts.length - 1 && (
            <button className="merge" onClick={() => mergeDown(i)}>
              <FontAwesomeIcon
                className="icon"
                icon={faArrowsAltV}
              ></FontAwesomeIcon>
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
      console.log(bText, thisText);
      if (thisText.includes(bText)) index = i;

      //check with spaces at end removed
      let b2Text = bText.replace(/[ |\n]*$/gi, "");
      if (thisText.includes(b2Text)) index = i;
    }
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

  const save = async () => {
    setSaving(true);
    try {
      var body = [];
      var res = await pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .collection("documents")
        .doc(id)
        .update({
          name: name,
          texts: texts,
          translations: translations,
        });
    } catch (e) {}
    setSaving(false);
  };

  const truncateText = (t: string, n: number): string => {
    if (t.length > n) return t.substring(0, n) + "...";
    return t;
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
        <h2>{name}</h2>
      </section>
      <section id="heading">
        <div></div>
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
    </div>
  );
}
