import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { CartItem } from "../store/cartSlice";
import { getAccessToken, validateToken, removeTokens } from "../store/auth";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartItemCard from "./CartItemCard";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const path = location.pathname;

    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token && path.startsWith("/cart")) {
        navigate("/login");
        return;
      }

      const isValid = await validateToken();
      if (!isValid) {
        removeTokens();
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/rest/api/1/cart/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`
        },
        credentials: "include",
        body: JSON.stringify(
          cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        )
      });

      if (!response.ok) throw new Error("Error al procesar el carrito");

      const cart = await response.json();
      window.open(`/checkout?cart=${cart.cartId}`, "_blank");
    } catch (error) {
      console.error("Error al enviar el carrito:", error);
      alert("No se pudo procesar el carrito");
    }
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <div className="container mx-auto p-4 mt-16">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <ShoppingCartOutlinedIcon style={{ fontSize: 80 }} className="text-red-600" />
          <h2 className="mt-4 text-2xl font-semibold">Tu carrito está vacío</h2>
          <p className="text-lg">Agrega productos para verlos aquí.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItemCard id={item.id} quantity={item.quantity} key={item.id} />
            ))}
          </div>

          <div>

            <div className="mt-6 text-right">
              <span className="text-xl font-semibold text-gray-800">Total a pagar:
                  <span className="text-green-600"> {totalPrice.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })} MXN</span>
              </span>
           </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Vaciar carrito
              </button>

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Pagar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
