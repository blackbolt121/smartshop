// Componente para una tarjeta de pedido individual
import StatusBadge from "./PedidosBadge.tsx";
import {Product} from "../../store/store.ts";


interface CartItem{
    producto: Product;
    quantity: number;
}

export interface Pedido {
    id: string
    productos: CartItem[],
    fecha: string,
    estado: "Entregado" | "En proceso" | "Cancelado",
    total: number
}

export interface PedidosCardProps {
    pedido: Pedido,
    key: string
}
const PedidoCard = ({key, pedido} : PedidosCardProps) => {
    const fechaFormateada = new Date(pedido.fecha + 'T00:00:00').toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div key={key} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            {/* Cabecera de la tarjeta */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Pedido #{pedido.id}</h3>
                    <p className="text-sm text-gray-500">Realizado el: {fechaFormateada}</p>
                </div>
                <StatusBadge estado={pedido.estado} />
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="p-4">
                <div className="flex items-center gap-4">
                    {/* Imágenes de los productos */}
                    <div className="flex -space-x-4">
                        {pedido.productos.slice(0, 3).map(p => (
                            <img
                                key={p.producto.id}
                                src={p.producto.imageUrl}
                                alt={p.producto.name}
                                className="w-16 h-16 rounded-full border-2 border-white object-cover bg-gray-100"
                            />
                        ))}
                        {pedido.productos.length > 3 && (
                            <div className="w-16 h-16 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                +{pedido.productos.length - 3}
                            </div>
                        )}
                    </div>
                    {/* Resumen de productos */}
                    <div className="flex-grow">
                        <h4 className="font-semibold text-gray-700">Productos destacados:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            {pedido.productos.slice(0, 2).map(p => (
                                <li key={p.producto.id}>{p.producto.name} (x{p.quantity})</li>
                            ))}
                            {pedido.productos.length > 2 && <li>y más...</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Pie de la tarjeta */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="font-bold text-lg text-gray-900">
                    Total: ${pedido.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors">
                        Ver Detalles
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors">
                        Volver a Pedir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PedidoCard;