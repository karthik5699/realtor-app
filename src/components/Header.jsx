import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pageState, setPageState] = useState("Sign in");
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                setPageState("Profile")
            } else{
                setPageState("Sign in")
            }
        })
    }, [auth])

    function pathMatchRoute(route) {
        if (route === location.pathname) {
            return true;
        }
    }
    return (
        <div className="bg-gray-800 border-b shadow-sm sticky top-0 z-40">
            <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
                <div>
                    <img src="https://teja8.kuikr.com/cfassets/images/cf_logo_new.webp" 
                         alt="logo" className="h-7 cursor-pointer" onClick={() => navigate("/")}/>
                </div>
                <div className="text-gray-400">
                    <ul className="flex space-x-10">
                        <li className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] border-b-transparent 
                                      ${pathMatchRoute("/") && "text-white border-b-red-600"}`} onClick={() => navigate("/")}>
                            Home
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] border-b-transparent 
                                      ${pathMatchRoute("/offers") && "text-white border-b-red-600"}`} onClick={() => navigate("/offers")}>
                            Offers
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] border-b-transparent 
                                      ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && 
                                      "text-white border-b-red-600"}`} 
                                      onClick={() => {
                                                        if(pageState==="Profile"){
                                                            navigate("/profile")
                                                        } else{
                                                            navigate("/sign-in")
                                                        }
                                        
                                        }
                                      }
                        >
                            {pageState}
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    )
}

export default Header