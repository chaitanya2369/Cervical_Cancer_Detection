import { Link } from "react-router-dom";

function Herosection(){
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col justify-self-center h-full bg-teal-200 bg-opacity-50 text-gray p-20 pb-0" >
        <h1 className="text-gray-700 text-5xl italic mb-4">"Empowering Early Detection for a Healthy Tommorow"</h1>
        <p className="text-black-500 italic text-xl w-1/2">Utilizing state-of-the-art imaging and AI technology, our application delivers rapid and accurate cervical cancer detection, empowering healthcare professionals to save lives through early diagnosis.</p>
        <Link to = '/signup'>
          <button className="mt-20 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 w-80 rounded">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Herosection