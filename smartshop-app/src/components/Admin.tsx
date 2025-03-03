import Sidebar from "./AdminComponents/SideBar"

//A component that will be used to display the admin page
export const Admin = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-1 flex-col justify-center items-center">
                <h1 className="text-2xl font-bold">Welcome to admin dashboard</h1> 
            </div>

        </div>
    )
}