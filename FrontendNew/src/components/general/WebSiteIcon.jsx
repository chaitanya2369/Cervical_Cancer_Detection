import React from "react";
import { Link } from "react-router-dom";

const WebSiteIcon = () => {
  return (
    <>
      <Link to="/">
        <div className="text-3xl font-bold text-black">
          Cervi<span className="text-teal-600">Scan</span>
        </div>
      </Link>
    </>
  );
};

export default WebSiteIcon;
