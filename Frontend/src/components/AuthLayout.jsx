import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import CopyRight from "./CopyRight";

function AuthLayout() {
  return (
    <>
    <Header/>
    <div className="flex justify-around h-5/6 p-8 align-middle mt-8 mx-56" style={{backgroundColor:'#cbcece'}}>
      <div className="flex flex-col w-2/5 h-full">
        <div
          className="h-1/3 bg-gray-300 p-6"
          style={{ backgroundColor: "rgb(245 245 239)" }}
          >
          <h1 className="font-semibold text-[25px]">Early Detection, Better Prevention</h1>
          <p className=""> ~ Sign up for Cervical Cancer Screening</p>
          <p className="mt-10">
            Sign up today to be a part of this transformative journey toward better health for women everywhere.
          </p>
        </div>
        <div className="pb-6" style={{ backgroundColor: "#248791" }}>
          <img
            src="/images/authenticationpic.png"
            alt="Error loading the image"
            className=" object-top"
            />
        </div>
      </div>
      <div className="w-2/5">
        <Outlet/>
      </div>
    </div>
    <CopyRight/>
  </>
  );
}

export default AuthLayout;
