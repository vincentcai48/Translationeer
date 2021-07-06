import "../../styles/definitionbox.scss";

import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import axios from "axios"
import Loading from '../Loading';
import { validate } from '../../services/validate';


export default function InnerDefinition({cssSelector,name,word,url}){
    const [loading,setIsLoading] = useState<boolean>(true);
    const [content,setContent] = useState<string>("");

    useEffect(()=>{
        getDefinition();
    },[word,url])

    const getDefinition = async () =>{
        setIsLoading(true);
        try{
            var res = await axios.get(`${url}`,{
                params:{
                    word: validate.replaceChars(word)
                }
            }) 
            console.log(res.data)
            setContent(res.data)
        }catch(e){
            console.error(e);
        }
        setIsLoading(false);
    }


    return <div className={`definition ${cssSelector}`}>
        <h4 className="api-name">{name}</h4>
        <div>
            {loading?<Loading></Loading>:<div>{parse(content)}</div>}
        </div>
        
    </div>
}