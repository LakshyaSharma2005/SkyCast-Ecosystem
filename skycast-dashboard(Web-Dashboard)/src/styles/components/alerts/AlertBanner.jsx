import React from "react";

const AlertBanner = ({ show, icon = "⚠", message, style = {} }) => (
  <div className={`alert-banner ${show ? "show" : ""}`} style={style}>
    <div className="alert-icon">{icon}</div>
    <div className="alert-text">{message}</div>
  </div>
);

export default AlertBanner;