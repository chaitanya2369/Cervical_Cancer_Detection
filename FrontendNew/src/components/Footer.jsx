import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-teal-400 text-sm uppercase tracking-wide">Contact Us</h3>
          <h2 className="text-xl font-semibold">Cervical Cancer Detection</h2>
          <p className="text-gray-300 text-sm">
            AI-powered early cervical cancer detection for accurate and timely diagnosis. Contact us for inquiries and collaborations.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✉️</span>
              </span>
              <a href="mailto:cervicalcancerdetection@gmail.com" className="text-gray-300 hover:text-teal-400 transition duration-300">
                cervicalcancerdetection@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📞</span>
              </span>
              <p className="text-gray-300">+91 9872582641</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300">
              <span className="text-2xl">🇫</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300">
              <span className="text-2xl">📸</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300">
              <span className="text-2xl">𝕏</span>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-4">
          <h3 className="text-teal-400 text-sm uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-2">
            {['Home', 'About Us', 'Blogs', 'Contact Us'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300 text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services Section */}
        <div className="space-y-4">
          <h3 className="text-teal-400 text-sm uppercase tracking-wide">Our Services</h3>
          <ul className="space-y-2">
            {['Terms of Use', 'Privacy Policy', 'Contact Support', 'Careers'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300 text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
        <p>
          All Rights Reserved © Cervical Cancer Detection |{' '}
          <a href="#" className="hover:text-teal-400 transition duration-300">Terms & Conditions</a> |{' '}
          <a href="#" className="hover:text-teal-400 transition duration-300">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;