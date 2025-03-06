import { Typography, Card } from "@mui/joy"
import template from "../assets/smartshop.jpg"
import { useNavigate } from "react-router-dom"

interface ProductCardProps {
    id: number
    name?: string
    price?: number
    description?: string
}

export const ProductCard = (ProductCardProps: ProductCardProps) => {

    const navigate = useNavigate()


    return <Card variant="outlined" className="w-80 max-w-xs p-4 bg-white shadow-lg hover:cursor-pointer" onClick={(e)=>{
      navigate(`/producto/${ProductCardProps.id}`)
    }}>
    <img
      src={template}
      alt="Product"
      className="w-full h-48 object-cover rounded-md mb-4"
    />
    <Typography level="h3" className="font-bold">{ProductCardProps.name || "Product Name"}</Typography>
    <Typography level="body-md" className="text-gray-600 mb-4">
        {ProductCardProps.description || "Product Description"}
    </Typography>
    <Typography level="body-md" className="font-bold text-xl text-blue-600">${ProductCardProps.price || "99.99"}</Typography>
  </Card>
}