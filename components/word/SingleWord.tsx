export default function SingleWord({word,setWord}){
    return <span className="single-word" onClick={setWord}>{word}&nbsp;</span>
}