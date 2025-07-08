import { useState } from "react"
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import AdminHomePage from "../../pages/AdminHomePage";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative">
            {/* mobile Toggle Button */}
            <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
                <button onClick={toggleSidebar}>
                    <FaBars size={24} />
                </button>
                <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
            </div>

            {/* overlay for mobile sidebar */}
            {isSideBarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
                ></div>
            )}

            {/* sidebar */}
            <div
                className={`bg-gray-900 w64 min-h-screen text-white absolute md:relative transform ${
                    isSideBarOpen?"translate-x-0":"-translate-x-full"
                } transition-transform duration-300 md:translate-x-0 md:static md:block z-20 `}>
                {/* sidebar */}
                <AdminSidebar/>
            </div>
            {/* main content  */}
            <div className="flex-grow p-6 overflow-auto">
                <Outlet/>   
            </div>
        </div>
    )
}

export default AdminLayout