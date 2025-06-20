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

      let cartId = localStorage.getItem("cartId")

      let flag = false
      
      console.log(cartId)
      if (cartId === null) {
        console.log(`Cart id is null`)
        flag = true
      }
      else {
        console.log('Validando orden de pedido')
        let createCart = await fetch(`http://localhost:8080/rest/api/1/cart/order/${cartId}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${getAccessToken()}`
            }
          }
        )


        let data = await createCart.json()

        let ordenPago = data.ordenPago

        console.log(ordenPago)
        console.log(flag)

        flag = !(ordenPago === null)
        //Si existe una orden de pago registrada se limpia el carrito
        if (flag) {
          dispatch(clearCart())
        }

      }
      console.log(`The flag is ${flag}`)
      if (flag) {
        console.log(`Creating cart ${flag}`)
        const response = await fetch("http://localhost:8080/rest/api/1/cart/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(
            cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
          )
        });
        if (!response.ok) throw new Error("Error al procesar el carrito");
        const cart = await response.json();
        cartId = cart.cartId;
        localStorage.setItem("cartId", String(cartId))
      } else {
        console.log("Actualizando carrito")
        const response = await fetch(`http://localhost:8080/rest/api/1/cart/order/${cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(
            cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
          )
        });
        console.log(response)
      }
      console.log(cartId)
      //window.location.href = `http://localhost:8080/checkout?cart=${cartId}`

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


  async function validateCart() {

    let cartId = localStorage.getItem("cartId")

    let flag = false

    if (cartId != null) {
      let createCart = await fetch(`http://localhost:8080/rest/api/1/cart/order/${cartId}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          }
        }
      )


      let data = await createCart.json()

      let ordenPago = data.ordenPago

      flag = !(ordenPago === null)

      console.log(flag)
      console.log(ordenPago)
      if (flag) {
        dispatch(clearCart())
        localStorage.removeItem("cartId")
      }
      
    }
  }

  useEffect(() => {
    console.log(localStorage.getItem("cartId"))
    validateCart().then()
  }, [])

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

          <div className="my-4">
            <div className="text-right">
              <span className="text-xl text-gray-800">Subtotal:
                <span className="font-semibold text-gray-800"> {(totalPrice).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })} MXN</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl text-gray-800">IVA:
                <span className="font-bold text-gray-800"> {(totalPrice * 0.16).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })} MXN</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-xl text-gray-800">Envio:
                <span className="font-bold text-gray-800"> {(500).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })} MXN</span>
              </span>
            </div>


            <div className="text-right">
              <span className="text-xl font-semibold text-gray-800">Total a pagar:
                <span className="text-green-600"> {(totalPrice * 1.16 + 500).toLocaleString("es-MX", {
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
