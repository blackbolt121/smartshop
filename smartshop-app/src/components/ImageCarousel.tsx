import urrea from "../assets/urrea.jpg";
// import foy from "../assets/foy.png"
import surtex from "../assets/surtex.jpg"
// import prolock from "../assets/prolock.jpg"
import lock from "../assets/lock.jpg"
import axios from "axios";
import { Vendor } from "../store/store";
import { useEffect, useState } from "react";
import { getAccessToken } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/joy";
// import proforza from "../assets/proforza.jpg"
// import balta from "../assets/balta.jpg"



const images = [
    //austromex,
    // ax,
    // camca,
    // craftop,
    // fischer,
    // high_power,
    // ingusa,
    // ipesa,
    // itc,
    // licon,
    // montana,
    // munich,
    // oakland_tools,
    // santul,
    urrea,
    //urrea2,
    // arj,
    // azteca,
    // b2m,
    // brotimex,
    // foy,
    // group_cn,
    // kola_loca,
    // litelux,
    // palcove,
    surtex,
    //prolock,
    lock,
    // proforza,
    // balta
    // acuario,
    // amiber,
    // metalfu

];



interface VendorCarousel {
    name: string,
    id: string,
    image: string
}


const ImageCarousel = () => {

    images

    const navigate = useNavigate()

    const [vendor, setVendor] = useState<VendorCarousel[]>([])

    const fetchVendors = async () => {

        const request = await axios.get<Vendor[]>(`http://localhost:8080/rest/api/1/vendor/all`, {
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`
            }
        })


        const vendors = request.data

        console.log(vendors)

        const arr: string[] = ["Urrea", "Surtek", "Lock"]

        const vendorsArray = vendors.filter(vend => arr.includes(vend.vendorName)).map<VendorCarousel>(vend => {
            switch (vend.vendorName) {
                case "Urrea":
                    return {
                        "name": vend.vendorName,
                        "id": vend.vendorId,
                        "image": urrea
                    }
                case "Surtek":
                    return {
                        "name": vend.vendorName,
                        "id": vend.vendorId,
                        "image": surtex
                    }
                case "Lock":
                    return {
                        "name": vend.vendorName,
                        "id": vend.vendorId,
                        "image": lock
                    }
                default:
                    return {
                        "name": "Unkown",
                        "id": "",
                        "image": urrea
                    }

            }
        })

        setVendor(vendorsArray.sort((a, b)=> b.name.localeCompare(a.name)))
        console.log(`Vendor ${vendorsArray.length}`)
    }


    useEffect(()=>{
        fetchVendors().catch()
    }, [])

    useEffect(()=>{

    }, [vendor])

    return (
        <div className="overflow-hidden">
            <Typography sx={{ml: "1rem"}} level="h1">
                Proveedores
            </Typography>
            <div className="flex items-center justify-center gap-[10%]">
                {/* {images.map((img, index) => (
                    <img key={index} src={img} alt={`img-${index}`} className="w-40 h-auto rounded-md" />
                ))} */}

                {vendor.length > 0? vendor.map( x => <div onClick={()=>{
                    const urlParams = new URLSearchParams()
                    urlParams.set("brand", x.id)
                    navigate(`/tienda?${urlParams.toString()}`)
                }}><img key={x.id} src={x.image} alt={`img-${x.id}`} className="w-50 h-auto rounded-md hover:cursor-pointer" /></div>): <></>}

            </div>
        </div>
    );
};

export default ImageCarousel;
