import React, { useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import TrainModel from "./TrainModel"; // Importing TrainModel component

const TrainerHome = () => {
  const [view, setView] = useState("overview"); // To switch between different views like Overview, Image Management
  const [activeImageType, setActiveImageType] = useState('DIC');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const images = {
    DIC: ["DIC12345678.png", "DIC98765432.png", "IMG250835889.png", "IMG250835890.png"],
    AF: ["AF12345678.png", "AF98765432.png", "IMG250835879.png"]
  };

  const handleCheckboxChange = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(item => item !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSelectAll = () => {
    const currentImages = images[activeImageType];
    if (selectedImages.length === currentImages.length) {
      setSelectedImages([]); 
    } else {
      setSelectedImages(currentImages);
    }
  };

  const handleDownloadImages = () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image to download.");
    } else {
      setIsDownloading(true);
      selectedImages.forEach(image => {
        const link = document.createElement('a');
        link.href = `/path-to-images/${image}`;
        link.download = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      setIsDownloading(false);
      setSelectedImages([]); 
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-1">
          <aside className="w-64 bg-white shadow-md">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${view === "overview" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                    onClick={() => setView("overview")}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${view === "image-management" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                    onClick={() => setView("image-management")}
                  >
                    Image Management
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${view === "train-model" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                    onClick={() => setView("train-model")}
                  >
                    Train Model
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            {view === "overview" && (
              <div>
                <h1>Overview</h1>
                <p>Trainer's overview content...</p>
              </div>
            )}

            {view === "image-management" && (
              <div>
                <h1 className="text-xl font-semibold mb-4">{activeImageType} Images</h1>
                <div className="flex space-x-4 p-4">
                  {['DIC', 'AF'].map(type => (
                    <button
                      key={type}
                      className={`${activeImageType === type ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveImageType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded mb-4 hover:bg-gray-400"
                  onClick={handleSelectAll}
                >
                  {selectedImages.length === images[activeImageType].length ? 'Deselect All' : 'Select All'}
                </button>
                <div className="grid grid-cols-4 gap-4">
                  {images[activeImageType].map((image, index) => (
                    <div key={index} className="bg-slate-500 border p-4 rounded-3xl shadow relative">
                      <input
                        type="checkbox"
                        className="absolute w-4 h-4 top-8 left-4"
                        checked={selectedImages.includes(image)}
                        onChange={() => handleCheckboxChange(image)}
                      />
                      <div className="flex">
                        <img src="/images/pnglogo.png" className="w-12 h-12 mx-5" alt={image} />
                        <p className="mt-2 text-center" title={image}>{image.length > 15 ? `${image.substring(0, 15)}...` : image}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  onClick={handleDownloadImages}
                >
                  {isDownloading ? (
                    <span className="loader"></span>
                  ) : (
                    "Download Images"
                  )}
                </button>
              </div>
            )}

            {view === "train-model" && (
              <TrainModel /> 
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default TrainerHome;
