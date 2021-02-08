import React from "react";
import { LangContext } from "../services/context";
import SingleWord from "./SingleWord";

//PROPS: Function setWord, String query
class WordList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      query: props.query,
      allWords: [],
    };
  }

  componentDidMount() {
    this.setAllWords();

    // this.setState({
    //   allWords: this.state.query.split(/ |\n/).map((e) => {
    //     if(e==this.context.linebreakCode) return <br></br>
    //     return <SingleWord word={e} setWord={this.props.setWord} />;
    //   }),
    // });
  }

  componentDidUpdate(prevProps) {
    //console.log(prevProps.query)
    //console.log(this.props.query)
    // console.log(this.props.query, prevProps.query)
    if (this.props.query != prevProps.query) {
      this.setAllWords();
    }
  }

  //IMPORTANT METHOD THAT TAKES CARE OF LINEBREAKS.
  //Uses this.state.query to generate the list of words/linebreaks
  setAllWords = () => {
    var allWords = [];
    //console.log(this.state.query)
    this.props.query.split(/ |\n/).forEach((e) => {
      // console.log(this.context.linebreakCode);
      // if(e.includes(this.context.linebreakCode)){
      //   var splitByLinebreak = e.split(this.context.linebreakCode);
      //   splitByLinebreak.forEach(e2=>{
      //     //<SingleWord word={e2} setWord={this.props.setWord} />
      //   allWords.push(<SingleWord word={e2} setWord={this.props.setWord} />);
      //     allWords.push(<div className="flex-break"></div>);
      //   })
      //   allWords.pop(); //because the last break is unnessary, only want breaks between words. Don't worry about the linebreak being last, the .split() method will have an empty string.
      // }else{
      //   //<SingleWord word={e} setWord={this.props.setWord} />
      // allWords.push(<SingleWord word={e} setWord={this.props.setWord} />)
      // }
      // if(allWords[allWords.length-1]=="") allWords.pop();
      var arr = e.split(this.context.linebreakCode);
      console.log(arr);
      arr.forEach((w) => {
        allWords.push(<SingleWord word={w} setWord={this.props.setWord} />);
        allWords.push(<div className="break"></div>);
      });
      allWords.pop();
    });

    this.setState({ allWords: allWords });
    //console.log("NEWWORDS:",this.state.allWords);
  };

  render() {
    return <div id="alltext-container">{this.state.allWords}</div>;
  }
}
WordList.contextType = LangContext;

export default WordList;
