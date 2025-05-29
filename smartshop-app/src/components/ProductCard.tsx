import { Typography, Card } from "@mui/joy"
import { useNavigate } from "react-router-dom"

interface ProductCardProps {
  id: string
  name?: string
  price?: number
  description?: string
  imageUrl?: string
}

export const ProductCard = (ProductCardProps: ProductCardProps) => {

  const navigate = useNavigate()


  return <Card
    variant="outlined"
    className="w-72 h-[28rem] bg-white shadow-lg hover:cursor-pointer flex flex-col justify-between p-4"
    onClick={() => navigate(`/producto/${encodeURIComponent(ProductCardProps.id)}`)}
    key={ProductCardProps.id}
    >
      <img
        src={ProductCardProps.imageUrl}
        alt="Product"
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="flex flex-col flex-grow">
        <Typography level="h3" className="font-bold">
          {ProductCardProps.name || "Product Name"}
        </Typography>

        <Typography level="body-md" className="text-gray-600 mb-4 line-clamp-3">
          {ProductCardProps.description?.substring(0,15)+"..." || "Product Description"}
        </Typography>
        <Typography level="body-md" className="text-gray-600 mb-4 line-clamp-3">
          <strong>SKU: </strong>{ProductCardProps.id || "Product SKU"}
        </Typography>
        <div className="mt-auto">
          <Typography level="body-md" className="font-bold text-xl text-blue-600">
            {ProductCardProps.price?.toLocaleString("es-MX", {style:"currency", currency:"MXN"})}
          </Typography>
        </div>
      </div>
    </Card>
}