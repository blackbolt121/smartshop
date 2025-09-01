import {useEffect, useState, useMemo} from 'react';
import PaymentSummary from './PaymentSummary';
import PedidosProductList from "./PedidosProductList.tsx";
import OrderStatus from './OrderStatus';
import {Product} from "../../../store/store.ts";
import {Link, useParams} from "react-router-dom";
import {getAccessToken} from "../../../store/auth.ts";
import PedidosBadge from "../PedidosBadge.tsx";


// --- DATOS DE EJEMPLO ---
// En una aplicación real, estos datos vendrían de una API.

interface PedidoDetail {
    id: {
        pedidoId: string,
        productoId: string
    },
    producto: Product,
    quantity: number,
    static_price: number
}

interface Pedido {
    id: number,
    guia: string,
    pedidoStatus: string,
    pedidoDetails: PedidoDetail[]
    total: number;
    createdAt: string,
    updatedAt: string,
    fecha_envio?: string
}

const apiUrl = import.meta.env.VITE_API_URL;

const translateStatus = (status: string) => {
    switch (status) {
        case "EN_PROCESO":
            return "En proceso";
        case "ENVIADO":
            return "Enviado";
        case "ENTREGADO":
            return "Entregado";
        case "CANCELADO":
            return "Cancelado"
        default:
            return "En proceso"
    }
}

function calcularIVA(precioConIVA: number, tasa: number = 0.16): number {
    return precioConIVA * (tasa / (1 + tasa));
}

function calcularPrecioSinIVA(precioConIVA: number): number {
    return precioConIVA / (1.16);
}

interface FechaEntregaComponentProps {
    fechaEntrega?: string
}


const FechaEntregaComponent  = ({fechaEntrega} :FechaEntregaComponentProps)=> {

    return <div className="mt-2 flex items-center">
        <span>Fecha programada de entrega <span className="bg-gray-200 px-2 py-1 rounded-2xl">{`${fechaEntrega? fechaEntrega.split("T")[0]:"Por definir"}`}</span></span>
    </div>
}

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function PedidosPage() {

    const { id } = useParams();

    const [order, setOrder] = useState<Pedido>();

    useEffect(() => {
        fetch(`${apiUrl}/rest/api/1/pedidos/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`,
            }
        })
            .then(res => res.json())
            .then(res => setOrder(res))
            .catch(err => console.error(err));

    }, [id]);


    const precioSinIva = useMemo(()=>{
        return (order)? order.pedidoDetails.reduce((previousValue: number, currentValue: PedidoDetail)=> previousValue + calcularPrecioSinIVA(currentValue.static_price), 0) : 0.0
    }, [order])

    const iva = useMemo(()=> {
        return order? order.pedidoDetails.reduce((previousValue: number, currentValue: PedidoDetail)=> previousValue + calcularIVA(currentValue.static_price), 0) : 0.0;
    }, [order]);

    const subtotal = useMemo(()=> {
        return precioSinIva + iva
    }, [precioSinIva, iva]);

    const shipping = useMemo(()=> {
        return subtotal >= 2000.0 ? 0.0 : 220
    }, [subtotal])

    const total = useMemo(()=>{
        return subtotal + shipping;
    }, [subtotal, shipping])

    // useEffect(() => {
    //     //console.log(order)
    // }, [order]);

    return  (!order)?   <div>Cargando pedido...</div> :
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="mb-8">
                    <Link to={"/pedidos"} className="text-blue-600 hover:text-blue-800 font-medium">&larr; Volver al Historial de Pedidos</Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                        Detalles del Pedido <span className="text-red-600">{`MX-${order.id}`}</span>
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Realizado el {order.createdAt} &bull; <PedidosBadge key={order.id} estado={translateStatus(order.pedidoStatus)}/>
                        {order.fecha_envio? <FechaEntregaComponent fechaEntrega={order.fecha_envio?order.fecha_envio : ""}/>:null}
                        {/*<span className="font-semibold text-blue-600">{translateStatus(order.pedidoStatus)}</span>*/}
                        <br/>
                        <strong>*Todos los pedidos tienen un tiempo de entrega de 1 a 5 dias hábiles.</strong>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        <PedidosProductList products={order.pedidoDetails} />
                        <PaymentSummary summary={{
                            shipping: shipping,
                            tax: iva,
                            subtotal: precioSinIva,
                            total: total
                        }} />
                    </div>

                    {/* Columna Lateral */}
                    <div className="space-y-8">
                        <OrderStatus status={translateStatus(order.pedidoStatus)} trackingNumber={order.guia} />
                        {/*<AdditionalDetails shippingAddress={order.shippingAddress} paymentMethod={order.paymentMethod} />*/}
                    </div>
                </div>
            </main>
        </div>
}
