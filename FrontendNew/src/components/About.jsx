import React from 'react';

const HospitalInfo = () => {
  return (
    <div className="bg-gradient-to-r from-light-blue-50 to-white min-h-[400px] flex items-center justify-center m-5 py-14 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full">
        
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-gray-500 text-2xl font-bold uppercase tracking-wide">About Us</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
            Welcome To Kims Icon <br /> Multi-Speciality Hospital
          </h1>
          <p className="mt-4 text-gray-600 text-sm">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Necessitatibus, tenetur quis beatae incidunt doloremque corrupti
          </p>
          <ul className="mt-6 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-3 h-3 bg-teal-400 rounded-full mr-2"></span>
              15+ years of Experience
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-teal-400 rounded-full mr-2"></span>
              24/7 Hour Medical Service
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-teal-400 rounded-full mr-2"></span>
              A Multispeciality hospital
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-teal-400 rounded-full mr-2"></span>
              A team of professionals
            </li>
          </ul>
          <button className="mt-8 px-6 py-3 bg-teal-400 text-white font-semibold rounded-lg hover:bg-teal-500 transition duration-300">
            Book An Appointment
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
          <div className="relative w-64 h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-blue-200 rounded-lg transform -rotate-3"></div>
            <img
              src="/images/about-image.png"
              alt="Doctor"
              className="pt-4 pb-1 relative z-10 w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalInfo;