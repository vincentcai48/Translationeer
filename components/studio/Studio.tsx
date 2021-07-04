import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useContext } from "react"
import { pAuth, pFirestore } from "../../services/config";
import PContext from "../../services/context";
import Loading from "../Loading";
import TextAreaNew from "../TextAreaNew";
import WordList from "../word/WordList";


export default function Studio({id}){
    const [studioLoading,setStudioLoading] = useState<boolean>(true);
    const {isAuth} = useContext(PContext);
    const [name,setName] = useState<string>();
    const [texts,setTexts] = useState<string[]>([]);
    const [translations,setTranslations] = useState<string[]>([])
    const [textsEditing,setTextsEditing] = useState<boolean[]>([]);
    const [breakoffText,setBreakoffText] = useState<string|null>(null);
    const [breakoffIndex,setBreakoffIndex] = useState<number>(-1);

    useEffect(()=>{
        if(isAuth) getDoc();
    },[isAuth])

    const getDoc = async () =>{
        try{
            let res = await pFirestore.collection('users').doc(pAuth.currentUser.uid).collection("documents").doc(id).get();
            let data = res.data();
            setName(data["name"]);
            setTexts(data["body"].map(e=>e.text));
            setTranslations(data["body"].map(e=>e.translation));
            setTextsEditing(data["body"].map(e=>false)); //all false
        }catch(e){
            console.error(e);
        }
        setStudioLoading(false);
    }

    const renderSections = () =>{
        var arr:any[] = [];
        for(let i = 0;i<texts.length;i++){
            arr.push(<div className="single-section">
            <div className="left">
                <WordList
                    text={texts[i]}
                    setText={(text)=>setText(text,i)}
                    number={i+1}
                    isEditing={textsEditing[i]}
                    setIsEditing={(b)=>setIsEditing(b,i)}
                ></WordList>
            </div>
            <div className="right">
                <TextAreaNew
                    val={translations[i]}
                    setFunc={(t)=>setTranslation(t,i)}
                    placeholder="Type translation..."
                ></TextAreaNew>
            </div>
        </div>)
        }
        return arr;
    }

    const setText = (text:string,index:number) =>{
        var arr = [...texts];
        arr[index] = text;
        setTexts(arr);
    }

    const setTranslation = (translation:string,index:number) =>{
        var arr = [...translations];
        arr[index] = translation;
        setTranslations(arr);
    }

    const setIsEditing = (isEditing:boolean,index:number) =>{
        var arr = [...textsEditing];
        arr[index] = isEditing;
        setTextsEditing(arr);
    }

    const onMouseUp = () =>{
        const selectedText:string = window.getSelection().toString().replaceAll(/(\r\n|\n|\r)/gm, "")
        .replaceAll(/[\s\u00A0]/gm, " ");
        if(selectedText!==breakoffText){
            if(!selectedText){
                setBreakoffText(null);
                setBreakoffIndex(-1);
            }else{
                setBreakoffText(selectedText)
                setBreakoffIndex(findBreakoffIndex(selectedText))
            }
        }

        
    }

    const findBreakoffIndex = (bText) =>{
        var index = -1;
        for(let i = 0;i<texts.length;i++){
            let thisText = texts[i].replace("\n"," ");
            if(thisText.includes(bText)) index = i;

            //check with spaces at end removed
            let b2Text = bText.replace(/[ |\n]*$/gi, "");
            if(thisText.includes(b2Text)) index = i;
        }
        return index;
    }

    if(studioLoading) return <div id="studio-loading">
        <Loading></Loading>
    </div>
    return <div id="studio">
        <section id="top" className="row">
            <FontAwesomeIcon className="icon" icon={faFileAlt}></FontAwesomeIcon>
            <h2>{name}</h2>
        </section>
        <section id="heading">
            <div></div>
            {breakoffText&&<div className="break0ff-text"><span>{breakoffText}</span><button>Break Off Text</button></div>
        </section>
        <section id="body">
            {renderSections()}
        </section>
    </div>
}