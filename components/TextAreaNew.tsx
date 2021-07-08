export default function TextAreaNew({val,setFunc,placeholder}){
    return <div className="ta-wrapper">
        <textarea 
            className="ta-main"
            value={val}
            onChange={(e)=>setFunc(e.target.value)}
            placeholder={placeholder}
        ></textarea>
        {/* Make sure line breaks are counted for in height by a <div> that has at least one character "|" so it's not height 0px */}
        <div className="ta-copy">{val.split("\n").map(e=><div key={Math.random()*10000}>{e||"|"}</div>)}</div>
    </div>
}