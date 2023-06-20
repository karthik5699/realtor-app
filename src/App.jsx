import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";


function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="offers" element={<Offers />} />
      </Routes>
     </Router>
    </>
  )
}

export default App
