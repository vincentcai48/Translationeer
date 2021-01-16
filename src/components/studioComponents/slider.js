// import React from "react";
// import { LangContext } from "../../services/context";

// class Slider extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       isMouseDown: false,
//       isMouseOver: false,
//       textEnd: 0,
//     };
//   }

//   componentDidMount() {
//     document.getElementById("left-studio").style.width =
//       this.context.textEnd + "px";

//     window.addEventListener("mousedown", () => {
//       this.setState({ isMouseDown: true });
//     });

//     window.addEventListener("mouseup", () => {
//       this.setState({ isMouseDown: false });
//     });

//     window.addEventListener("mousemove", (e) => {
//       var textEnd =
//         e.pageX - document.getElementById("studio-slider").clientWidth * 0.5;
//       // if (document.getElementById("studio-slider"))
//       //   this.setState({ textEnd: e.pageX });
//       // textEnd > window.innerWidth * 0.3 &&
//       // textEnd < window.innerWidth * 0.7
//       if (this.state.isMouseDown && this.state.isMouseOver) {
//         this.context.updateTextEnd(textEnd);
//         if (document.getElementById("left-studio")) {
//           console.log("Left Studio");
//           document.getElementById("left-studio").style.width =
//             this.context.textEnd + "px";
//         }
//         console.log(this.context.textEnd);
//       }
//     });
//   }

//   mouseIsOver = () => {
//     this.setState({ isMouseOver: true });
//   };

//   mouseIsOut = () => {
//     this.setState({ isMouseOver: false });
//   };

//   render() {
//     return (
//       <div
//         id="studio-slider"
//         onMouseOver={this.mouseIsOver}
//         onMouseOut={this.mouseIsOut}
//       >
//         {this.context.textEnd}
//       </div>
//     );
//   }
// }
// Slider.contextType = LangContext;

// export default Slider;
