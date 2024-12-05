import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant";
import "../styles/Form.css"
import Loading from "./Loading";



function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === 'login' ? 'Login' : 'Register'

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            const res = await api.post(route, { username, password })
            console.log(" Login Respose: ", res.data)
            if (method === "login" && res) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access_token)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token)
                navigate("/")
            }
            else {
                navigate("/login")
            }


        } catch (error) {
            alert(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input autoComplete="current-username" type="text" required className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />

            <input autoComplete="current-password" type="password" required className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />

            {loading && <Loading />}
            <button type="submit" className="form-button">{name}</button>

        </form>
    )

}

export default Form 