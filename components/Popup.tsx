import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//PROPS: children, xFunction
export default function Popup(props){
    return <div className="gob">
        <div className="popup">
            <button className="x-button" onClick={props.xFunction}><FontAwesomeIcon className="icon" icon={faTimes}></FontAwesomeIcon></button>
            {props.children}
        </div>
    </div>
}