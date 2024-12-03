import React, { useState } from "react";

const TrainModel = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...fileNames]);
  };
  const handleCheckboxChange = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(item => item !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.length === uploadedImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(uploadedImages);
    }
  };

  const handleRemoveImages = () => {
    const remainingImages = uploadedImages.filter(img => !selectedImages.includes(img));
    setUploadedImages(remainingImages);
    setSelectedImages([]);
  };

  const handleModelSelect = (e) => {
    setSelectedModel(e.target.value);
  };
  const handleTrainModel = () => {
    if (uploadedImages.length === 0 || !selectedModel) {
      alert("Please upload images and select a model.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      alert(`Model ${selectedModel} trained with ${uploadedImages.length} images.`);
      setLoading(false);
      setUploadedImages([]);
      setSelectedModel("");
    }, 2000);
  };

  return (
    <>
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Train Model</h2>
        <div className="mb-6">
          <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg flex justify-center items-center">
            <label className="w-full flex flex-col items-center justify-center">
              <div className="text-center">
                <p className="font-semibold mb-2">Drag and drop images here</p>
                <p className="text-gray-500">or click to browse images</p>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Select Model:</label>
          <select
            value={selectedModel}
            onChange={handleModelSelect}
            className="border border-gray-300 p-2 rounded-lg w-full"
          >
            <option value="">-- Select Model --</option>
            <option value="DIC">DIC</option>
            <option value="AF">AF</option>
            <option value="Fusion">Fusion</option>
          </select>
        </div>

        {uploadedImages.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mb-4 hover:bg-gray-400"
                onClick={handleSelectAll}
              >
                {selectedImages.length === uploadedImages.length ? "Deselect All" : "Select All"}
              </button>
              
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-700"
                onClick={handleRemoveImages}
                disabled={selectedImages.length === 0} 
              >
                Remove Selected
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative bg-gray-100 p-4 border rounded shadow">
                  <input
                    type="checkbox"
                    className="absolute w-4 h-4 top-2 left-2"
                    checked={selectedImages.includes(image)}
                    onChange={() => handleCheckboxChange(image)}
                  />
                  <div className="flex items-center justify-center">
                    <img
                      src={image}
                      alt={`uploaded-${index}`}
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleTrainModel}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Training...
              </div>
            ) : (
              "Train Model"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default TrainModel;
