import { useEffect } from "react";
import { Button } from "@mui/joy";
// import { useRef } from "react";



interface PaymentSlots {
    token: string,
    count: number
}

const Payment = ({token, count}: PaymentSlots) => {

    // const initialized = useRef(false);

      useEffect(() => {
    // Define callbacks globalmente
    (window as any).onPaymentSuccess = function (res: any) {
      console.log("✅ Pago exitoso");
      console.log(res)
    };

    (window as any).onPaymentError = function (err: any) {
      console.error("❌ Error en el pago", err);
    };

    // Esperar al siguiente tick para asegurar que el botón esté en el DOM
    const timeout = setTimeout(() => {
      
    }, 0); // O puedes usar 100 si lo necesita

    return () => clearTimeout(timeout);
    }, [token]);

    return (
        <Button
            id="netpay-checkout"
            data-button-title="Continuar"
            data-street1="Filosofos 100"
            data-country="MX"
            data-city="Monterrey"
            data-postal-code="64700"
            data-state="NL"
            data-token={token}
            data-phone-number="8125877000"
            data-email="accept@netpay.com.mx"
            data-merchant-reference-code="folio-unico-214"
            data-onsuccess="onPaymentSuccess"
            data-onerror="onPaymentError"
            data-product-count={count}
            data-commerce-name="Nombre del comercio"
        >
            Cargando...
        </Button>
    );
};

export default Payment;
