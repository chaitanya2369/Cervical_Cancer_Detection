import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';


function Footer(){
    return (
      <footer className=" text-black pt-8" style={{backgroundColor:'#42C7C7'}}>
        <div className="max-w-screen-xl mx-auto flex justify-around gap-8">
          <div className="p-8 px-20 w-1/3 flex flex-col items-start border-solid"style={{borderRight:'1px solid black'}}>
            <h3 className="font-bold mb-4">More CCD sites</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
            </ul>
          </div>
          <div className="p-8 px-20 w-1/3 flex flex-col items-start" style={{borderRight:'1px solid black'}}>
            <h3 className="font-bold mb-4">About CCD</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
              <li><a href="#" className="hover:underline">contact us</a></li>
            </ul>
          </div>
          <div className=" p-8 px-20 w-1/3 flex flex-col items-start">
            <h3 className="font-bold mb-4">Get in Touch</h3>
            <p className='my-2'>Email: <a href="mailto:project@gmail.com" className="hover:underline">project@gmail.com</a></p>
            <p>Contact: <a href="tel:+917896542230" className="hover:underline">+91 7896542230</a></p>
            <h2 className='my-2 font-bold'>Follow Us On: </h2>
            <div className="flex space-x-4 my-4">
                <a href="#" className="hover:scale-110 transform transition">
                    <FaFacebook className="w-6 h-6 text-blue-700"/>
                </a>
                <a href="#" className="hover:scale-110 transform transition">
                    <FaInstagram className="w-6 h-6 text-pink-500"/>
                </a>
                <a href="#" className="hover:scale-110 transform transition">
                    <FaTwitter className="w-6 h-6 text-blue-500"/>
                </a>
                <a href="#" className="hover:scale-110 transform transition">
                    <FaYoutube className="w-6 h-6 text-red-500"/>
                </a>
            </div>
          </div>
        </div>
        
      </footer>
    );
  };
  
  export default Footer;