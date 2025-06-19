import axios from "axios";
import { useEffect } from "react";


const Logout = () => {
 
    useEffect(()=> {
        axios.get("/admin/rest/logout", {
            withCredentials: true
        }).then((data)=>{
            console.log(data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    return <>
        <div>
            Loggin out...∫
        </div>
    </>
}

export default Logout;