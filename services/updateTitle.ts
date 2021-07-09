import { useContext } from "react";
import PContext from "./context";

export default function updateTitle(str:string):void{
    useContext(PContext).setTitle(str);
}