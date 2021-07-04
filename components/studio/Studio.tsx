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
    const [name,setName] = useState<string>("");
    const [texts,setTexts] = useState<string[]>([]);
    const [translations,setTranslations] = useState<string[]>([])
    const [textsEditing,setTextsEditing] = useState<boolean[]>([]);
    const [breakoffText,setBreakoffText] = useState<string|null>(null);
    const [breakoffIndex,setBreakoffIndex] = useState<number>(-1);

    useEffect(()=>{
        if(isAuth) getDoc();
    },[isAuth])

    const getDoc = async ():Promise<void> =>{
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

    const renderSections = ():any[] =>{
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

    const setText = (text:string,index:number):void =>{
        var arr = [...texts];
        arr[index] = text;
        setTexts(arr);
    }

    const setTranslation = (translation:string,index:number):void =>{
        var arr = [...translations];
        arr[index] = translation;
        setTranslations(arr);
    }

    const setIsEditing = (isEditing:boolean,index:number):void =>{
        var arr = [...textsEditing];
        arr[index] = isEditing;
        setTextsEditing(arr);
    }

    const onMouseUp = ():void =>{
        const selectedText:string = window.getSelection().toString().replaceAll(/(\r\n|\n|\r)/gm, "")
        .replaceAll(/[\s\u00A0]/gm, " ");
        if(selectedText!==breakoffText){
            if(!selectedText){
                setBreakoffText(null);
                setBreakoffIndex(-1);
            }else{
            
                let index = (findBreakoffIndex(selectedText,texts))
                setBreakoffIndex(index);
                if(index>-1) setBreakoffText(selectedText)
            }
        }

        
    }

    const findBreakoffIndex = (bText:string,texts:any[]):number =>{
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

    const breakoff = () => {
        
    }


    const truncateText = (t:string,n:number) =>{
        if(t.length>n) return t.substring(0,n) + "..."
        return t;
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
            {breakoffText&&breakoffIndex>-1&&<div className="breakoff-text"><span>{truncateText(breakoffText,20)}</span><button onClick={breakoff}>Break Off Text</button></div>}
        </section>
        <section id="body" onMouseUp={onMouseUp}>
            {renderSections()}
        </section>
    </div>
}