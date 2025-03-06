import { Typography, IconButton } from '@mui/joy';
import {Link} from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/coaim-transparent.png"

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="">
        <div className='flex flex-row justify-around'>
            <div>
                <Link to="/" className="mb-4">
                    <img
                        src={logo}
                        alt="Logo de la tienda"
                        className="h-16"
                    />
                </Link>
            </div>
            
            <div className="flex gap-2   space-x-4 mb-4 ">
                <IconButton href="https://www.facebook.com/profile.php?id=100094409316272&mibextid=ZbWKwL" target="_blank" color="primary">
                    <FaFacebook className='text-2xl text-white'/>
                </IconButton>
                <IconButton href="https://twitter.com/i/flow/login?redirect_after_login=%2FCoaimB" target="_blank" color="primary">
                    <FaXTwitter className='text-white text-2xl'/>
                </IconButton>
                <IconButton href="https://www.instagram.com/coaimindustria/?igshid=MzRlODBiNWFlZA%3D%3D" target="_blank" color="primary">
                    <FaInstagram className='text-2xl text-white'/>
                </IconButton>
            </div>

        </div>

        <div className='grid grid-cols-4 text-white items-baseline mt-4'>
            <Typography level="body-sm" className="text-left mb-1" sx={{color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center"}}>
                Fraccionamiento Lomas de Balvanera 5A, Balvanera, 76908 El Pueblito, Qro
                <Link to="mailto:suferredlbajio@gmail.com" className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    suferredlbajio@gmail.com
                </Link>
                <Link to="tel:4421955434" className="flex items-center">
                    <FaPhone className="mr-2" />
                    TEL: 442 195 54 34 EXT:1500
                </Link>
                <Link to="https://wa.me/4776769031" target="_blank" className="flex items-center">
                    <FaWhatsapp className="mr-2 text-green-500" />
                    WhatsApp
                </Link>
            </Typography>

            <Typography level="body-sm" className="text-left mb-1" sx={{color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center"}}>
                Prolongación Independencia #84 En Santa Rosa Jauregui
                <Link to="mailto:ventascoaimsa@gmail.com" className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    ventascoaimsa@gmail.com
                </Link>
                <Link to="https://wa.me/4461390550" target="_blank" className="flex items-center">
                    <FaWhatsapp className="mr-2 text-green-500" />
                    WhatsApp
                </Link>
            </Typography>

            <Typography level="body-sm" className="text-left mb-1" sx={{color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center"}}>
                Blvd Fco Villa 1104 Entre Fco Marin y Rio Mayo,Col. Santo Domingo. C.P. 7557   Leon, Gto 
                <Link to="https://wa.me/4432540653" target="_blank" className="flex items-center">
                    <FaWhatsapp className="mr-2 text-green-500" />
                    WhatsApp
                </Link>
            </Typography>

            <Typography level="body-sm" className="text-left mb-1" sx={{color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center"}}>
                Manuel Muñiz No. 377 A Col. Juarez, Morelia, Morelia, Michoacán de Ocampo C.P. 58010 
                <Link to="https://wa.me/4461390547" target="_blank" className="flex items-center">
                    <FaWhatsapp className="mr-2 text-green-500" />
                    WhatsApp
                </Link>
            </Typography>
        </div>

        <div className="flex flex-col items-center space-y-2">
          
          
          

          

          

          

          
        </div>
      </div>
    </footer>
  );
};