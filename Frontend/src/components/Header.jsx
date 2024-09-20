import { Link } from "react-router-dom";
function Header(){
    return (
        <header className="p-4 shadow-md"style={{backgroundColor:'rgb(109 202 196)'}}>
          <div className="flex justify-between ">
            <div>
              <Link to='/'>
                <img src="/images/logo.png" alt="Logo" className="h-12 w-auto"/>
              </Link>
            </div>
            <div>
                <h1 className="text-4xl font-bold">Cervical Cancer Detection</h1>
            </div>
            <div>
              <Link to = '/login'>
                <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">
                Login/SignUp
                </button>
                </Link>
            </div>
          </div>
        </header>
      );
}

export default Header