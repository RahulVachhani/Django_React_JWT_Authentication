import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant";
import { useState, useEffect ,useContext} from "react";



function ProtectedRoute({ children }) {
    const [isAuthorized, setAuthorized] = useState(null)
   
    useEffect(() => {
        console.log('mounting')
        auth().catch(() => setAuthorized(false))

        return ()=> {
            console.log('unmouting')
        }
    },[])

    const refreshToken = async () => {
        console.log("refreshing data ....")
        const refresh_token = localStorage.getItem(REFRESH_TOKEN)
        console.log('refresh ', refresh_token)
        try {
            const res = await api.post("api/token/refresh/", {
                refresh: refresh_token
            });
            console.log("re done",res.data)
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setAuthorized(true)
            }
            else {
                setAuthorized(false)
            }    

            console.log("refreshed data ....")
        } catch (error) {
            console.log(error)
            setAuthorized(false)
        }

    }



    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        console.log('token', token)
        if (!token) {
            setAuthorized(false)
            return
        }
        
        const decoded = jwtDecode(token)
        // console.log("decoded", decoded)
        const tokenExpiration = decoded.exp
        // console.log("tokenExpiration", tokenExpiration)
        const now = Date.now() / 1000
        // console.log("now",now)
        if (tokenExpiration < now) {
            console.log('call refresh by auth')
            await refreshToken()
        }
        else {
            setAuthorized(true)
        }
    }



    if (isAuthorized === null) {
        return <div>Loading...</div>
    }
    
    // console.log('PR end', "children",children)
    return isAuthorized ? children  : <Navigate to="/login" />

}


export default ProtectedRoute
