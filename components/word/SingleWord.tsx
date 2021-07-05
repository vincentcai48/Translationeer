export default function SingleWord({ word, setWord }) {
  return (
    <div>
      <span className="single-word" onClick={()=>setWord(word)}>
        {word}&nbsp;
      </span>
    </div>
  );
}
