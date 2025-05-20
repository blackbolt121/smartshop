import { useEffect, useState } from "react";
import { Typography, Skeleton, Input, IconButton} from "@mui/joy";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { getAccessToken } from "../store/auth";
import { FaTrashCan } from "react-icons/fa6";

interface CartItemCardProps {
  id: string; // corresponde a codigo
  quantity: number;
}

interface ProductoResponse {
  codigo: string;
  nombreLargo: string;
  precio: number;
  moneda: string;
  fotografia: string;
}

const CartItemCard = ({ id, quantity }: CartItemCardProps) => {
  const dispatch = useDispatch();
  const [producto, setProducto] = useState<ProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/rest/api/1/urrea/producto/${id}`, {
        headers: {
            "Authorization": `Bearer ${getAccessToken()}`
        }
    })
      .then((res) => res.json())
      .then((data: ProductoResponse) => {
        console.log(data)
        setProducto(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching producto:", err);
        setLoading(false);
      });
  }, [id]);

  const handleRemove = () => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  if (loading) {
    return (
      <div className="p-4 border-b flex gap-4 items-center">
        <Skeleton variant="rectangular" width={80} height={80} />
        <div className="flex-1">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="p-4 border-b text-red-500">
        Error cargando producto con código: {id}
      </div>
    );
  }

  return (
    <div className="flex gap-8 items-center border-b border-gray-200 p-4">
      <img
        src={producto.fotografia}
        alt={producto.nombreLargo}
        className="w-20 h-20 object-contain rounded"
      />
      <div className="flex-1">
        <Typography level="h4">{producto.nombreLargo}</Typography>
        <Typography level="body-lg" sx={{fontWeight: "bold", color: "black"}}>
          {producto.precio.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
          })}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Input 
            type="number"
            sx={{
                min: 0
            }}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
        />
        <IconButton
          color="danger"
          variant="outlined"
          onClick={handleRemove}
          size="sm"
        >
            <FaTrashCan />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItemCard;
