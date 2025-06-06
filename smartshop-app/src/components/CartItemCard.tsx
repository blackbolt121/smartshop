import { useEffect, useState } from "react";
import { Typography, Skeleton, Input, IconButton } from "@mui/joy";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { getAccessToken } from "../store/auth";
import { FaTrashCan } from "react-icons/fa6";

interface CartItemCardProps {
  id: string;
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
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data: ProductoResponse) => {
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
    if (!isNaN(qty) && qty >= 0) {
      dispatch(updateQuantity({ id, quantity: qty }));
    }
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
    <div className="flex flex-col md:flex-row justify-between items-center border border-gray-200 rounded-xl p-4 shadow-sm gap-4 bg-white hover:shadow-md transition">
      {/* Imagen */}
      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden border p-1 border-gray-200">
        <img
          src={producto.fotografia}
          alt={`Imagen de ${producto.nombreLargo}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Detalles */}
      <div className="flex-1 w-full md:px-4">
        <Typography level="h4" className="text-gray-800 font-semibold">
          {producto.nombreLargo}
        </Typography>
        <Typography level="body-md" className="text-green-700 font-bold mt-1">
          {producto.precio.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
          })}
        </Typography>
        <Typography level="body-sm" className="text-gray-500">
          Código: {producto.codigo}
        </Typography>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        <Input
          type="number"
          size="sm"
          variant="soft"
          value={quantity}
          sx={{ width: 80, color: "black", display: "flex", justifyContent: "center" }}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
        />
        <IconButton
          color="danger"
          variant="soft"
          onClick={handleRemove}
          size="sm"
          title="Eliminar del carrito"
        >
          <FaTrashCan />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItemCard;
