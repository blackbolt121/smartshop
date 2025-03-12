import Sidebar from "./AdminComponents/SideBar"
import { getAccessToken } from "../store/auth"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
//A component that will be used to display the admin page
export const Admin = () => {

    const navigate = useNavigate()
    
    useEffect(() => {
            console.log(getAccessToken())
            if(getAccessToken() === null){
              if(!(location.href.includes("login") || location.href.includes("signup"))){
                navigate("/login")
              }
            }
        
          }, [getAccessToken()])
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-1 flex-col justify-center items-center">
                <h1 className="text-2xl font-bold">Welcome to admin dashboard</h1> 
            </div>

        </div>
    )
}