import React from "react";
import loader from "../assets/green-loader-icon.gif";

export default function Loader() {
  return (
    <div className="loader-container">
      <img src={loader}></img>
    </div>
  );
}