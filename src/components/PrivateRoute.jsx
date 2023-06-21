import { Navigate, Outlet } from "react-router";
import useAuthStatus from "../hooks/useAuthStatus";

const PrivateRoute = () => {
    const {loggedIn, status} = useAuthStatus();
    if(status){
        return <h3>Loading...</h3>
    }
    return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute