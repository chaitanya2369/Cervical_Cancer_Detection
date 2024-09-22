import React from "react";
import Header from "../../components/Header";
import DashboardHeader from "../../components/DashboardHeader";



const ViewPatient = () => {
  return(
    <>
      <DashboardHeader/>
      <div className="bg-slate-400 flex justify-between">
        <div className="w-1/3 p-4 border-x-2">
        <ul>
          <li className="my-1"> <b>Patient Id: </b>CC1250</li>
          <li className="my-1"> <b>Name: </b>Amal Devis</li>
          <li className="my-1"> <b>Age: </b>20</li>
          <li className="my-1"> <b>Contact: </b>+91 8125455369</li>
          <li className="my-1"> <b>Address:</b>Visakhapatnam, AndhraPradesh</li>
          
        </ul>
        </div>
        <div className="p-4 w-1/3 border-x-2">
        <ul>
          <li className="my-1"> <b>Consult Date: </b>Amal Devis</li>
          <li className="my-1"> <b>Vitals: </b></li>
          <li className="my-1 mx-3"> <b>B.P: </b>110/80mmHg</li>
          <li className="my-1 mx-3"> <b>Weight: </b>62Kgs</li>
          <li className="my-1 mx-3"> <b>SPo2: </b>99%RA</li>
        </ul>   

        </div>
        <div className="p-4 w-1/3 border-x-2">
        <ul>
          <li className="my-1"> <b>Doctor Name: </b>Dr. M.N.V.S Hari Vamsi</li>
          <li className="my-1"> <b>Doctor Id: </b>C550245</li>
          <li className="my-1"> <b>Specialisation: </b>Gynecologic Oncologist</li>
          <li className="my-1">Gynecology</li>
        </ul>

        </div>
      </div>
      <div className="p-5">
        <h1 className="font-semibold">Diagonsis Information: </h1>
        <div>
          <img src="./images/DICimage.png" alt="" />
        </div>
      </div>
    </>
  )
};

export default ViewPatient;
