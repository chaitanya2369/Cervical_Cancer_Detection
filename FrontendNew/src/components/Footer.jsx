export default function Footer() {
    return (
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Cervical Cancer Detection</h3>
            <p>AI-powered early cervical cancer detection for accurate and timely diagnosis.</p>
            <p className="mt-4">cervicalcancerdetection@gmail.com</p>
            <p>+91 9876252841</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white">FB</a>
              <a href="#" className="text-white">IG</a>
              <a href="#" className="text-white">X</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Blogs</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Terms of Use</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Customer Support</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            {/* Add a form or contact details if needed */}
          </div>
        </div>
        <div className="text-center mt-8">
          <p>© All Rights Reserved | Cervical Cancer Detection | Terms & Conditions | Privacy Policy</p>
        </div>
      </footer>
    );
  }