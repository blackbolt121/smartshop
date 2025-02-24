import { useState } from "react";
import { Button, Typography, Sheet, IconButton } from "@mui/joy";
import { Menu, Close } from "@mui/icons-material";
import { Link, redirect, useNavigate } from "react-router-dom";
import logo from "../assets/smarshop.png"
import { getAccessToken } from "../store/auth";
import axios from "axios";



const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-500 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} width={100} />
          <Typography level="h4" sx={{ fontWeight: "bold", color: "white" }}>
            Smartshop
          </Typography>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white md:items-center md:justify-center">
          <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-indigo-200 transition-colors">Contact</Link>
          <Button variant="outlined" sx={{ color: "white" }} className="text-white hover:bg-white hover:text-black" onClick={async () => {
            if (getAccessToken()) {
              localStorage.removeItem("access_token")
              localStorage.removeItem("refresh_token")
              let request = await axios.post("http://localhost:4000/auth/logout")
              console.log(getAccessToken())
              navigate("/logout")
            }else {
              navigate("/login")
            }
            
          }}>
            {getAccessToken() ? "Log Out" : "Log In"}
          </Button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <IconButton onClick={toggleMenu} color="neutral">
            {isMobileMenuOpen ? <Close /> : <Menu />}
          </IconButton>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <Sheet className="bg-indigo-600 p-4 absolute top-0 left-0 right-0 z-10 md:hidden">
          <div className="flex flex-col space-y-4 text-white">
            <Link to={"/"} className="hover:text-indigo-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-indigo-200 transition-colors">Contact</Link>
            <Button variant="outlined" sx={{ color: "white" }} className="text-white hover:bg-white hover:text-black" onClick={async () => {
              if (getAccessToken()) {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                let request = await axios.post("http://localhost:4000/auth/logout")
                navigate("/logout")
              }else {
                navigate("/login")
              }
            }}>
              {getAccessToken() ? "Log Out" : "Log In"}
            </Button>
          </div>
        </Sheet>
      )}
    </nav>
  );
};

export default Navbar;
