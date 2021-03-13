import React from "react";

function Loading(props) {
  if (props.type == "studio") {
    return (
      <div className="studio-loader">
        <h5>Loading Studio</h5>
        <div class="loader"></div>
      </div>
    );
  }
  return <div class="loader"></div>;
}

export default Loading;
