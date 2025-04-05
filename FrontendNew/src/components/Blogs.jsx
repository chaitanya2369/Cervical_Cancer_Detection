import React, { useState } from 'react';

const reviews = [
  {
    id: 1,
    name: 'Dr. K.A. Naidu',
    specialty: 'Gynecologist',
    image: '/images/review1.png',
    text: "Working here has been an incredibly fulfilling experience. The platform provides everything I need to efficiently manage patient records and appointments. The care team and support staff are top-notch!",
  },
  {
    id: 2,
    name: 'Dr. U.P. Dymecologist',
    specialty: 'Gynecologist',
    image: '/images/review2.png',
    text: "I’ve seen a remarkable improvement in my workflow since joining this system. It’s intuitive, reliable, and helps me focus more on patient care than paperwork. Truly a game-changer.",
  },
  {
    id: 3,
    name: 'Dr. M. Rajesh',
    specialty: 'Oncologist',
    image: '/images/review3.png',
    text: "What I appreciate most is the seamless communication between departments and the patient-centered approach. It allows me to collaborate better and deliver the best outcomes for my patients.",
  },
];

const DoctorReviews = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 2;

  const handleNext = () => {
    if (startIndex + visibleCards < reviews.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + visibleCards);

  return (
    <section className="bg-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-teal-600 text-sm font-semibold uppercase tracking-wide">Our Blogs</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Great Doctor Reviews</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Hear from our doctors about their experiences with our platform. Their insights help us grow stronger every day.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {visibleReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
              <div className="flex items-center mt-6">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="text-gray-800 font-semibold">{review.name}</p>
                  <p className="text-gray-500 text-sm">{review.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md text-lg transition ${
              startIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            &larr;
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + visibleCards >= reviews.length}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md text-lg transition ${
              startIndex + visibleCards >= reviews.length
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default DoctorReviews;
