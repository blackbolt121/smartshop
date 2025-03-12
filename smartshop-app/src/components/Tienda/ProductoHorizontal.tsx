import { Product } from "../../store/store"
import { Typography } from "@mui/joy"
import template from "../../assets/smartshop.jpg"
import { useNavigate } from "react-router-dom"

export const ProductoHorizontal = (producto: Product) => {

    const navigate = useNavigate()

    return (
        <div className="flex flex-row bg-white p-4 rounded-lg shadow-md gap-1 hover:cursor-pointer" onClick={()=>{
            navigate(`/producto/${producto.id}`)
        }}>
            <div className="flex justify-center items-center">
                <img src={template} alt={producto.name} className="w-24 h-24" />
            </div>
            <div className="flex flex-col ml-4">
                <Typography sx={{fontWeight: "bold"}} level="body-lg">{producto.vendor.vendorName}</Typography>
                <Typography level="h2">{producto.name}</Typography>
                <Typography level="body-lg">{producto.description}</Typography>
                <Typography level="body-lg">$ {producto.price}</Typography>
            </div>
        </div>
    )
}
