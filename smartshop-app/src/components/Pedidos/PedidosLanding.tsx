import {useState, useMemo} from "react";
import {Search, ChevronDown} from 'lucide-react'
import {Pedido} from "./PedidosCard.tsx";
import PedidoCard from "./PedidosCard.tsx";
import {Package} from "lucide-react"


const mockPedidos : Pedido[] = [
    {
        id: 'MX-789012',
        fecha: '2024-06-15',
        estado: 'Entregado',
        total: 2450.50,
        productos: [
            {"producto": {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 1},
            {"producto": {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 2},
        ],
    },
    {
        id: 'MX-654321',
        fecha: '2024-06-28',
        estado: 'En proceso',
        total: 899.00,
        productos: [
            { producto: {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 1 },
        ],
    },
    {
        id: 'MX-345678',
        fecha: '2024-05-20',
        estado: 'Entregado',
        total: 4200.00,
        productos: [
            {producto: {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 1},
            {producto: {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 2},
            {producto: {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 3},
        ],
    },
    {
        id: 'MX-987654',
        fecha: '2024-04-10',
        estado: 'Cancelado',
        total: 150.00,
        productos: [
            {producto: {
                    "id": "b4127c4d-00c2-4ff4-9f09-6fba550995db",
                    "name": "Jgo 13 llaves comb mm",
                    "sku": "1200DHM",
                    "description": "Juego de 13 llaves combinadas métricas 6 puntas Urrea",
                    "price": 1602,
                    "imageUrl": "https://medios.urrea.com/catalogo/Urrea/hd/1200DHM.jpg",
                    "vendor": {
                        "vendorId": "dc1b23d5-0cf8-4c35-9b86-180365f37382",
                        "vendorName": "Urrea",
                        "vendorEmail": "",
                        "vendorPhone": "",
                        "vendorAddress": "",
                        "vendorCity": "",
                        "vendorState": '',
                        "vendorZipCode": "",
                        "vendorPostalCode": "",
                        "vendorWebsite": "",
                        "vendorWebsiteUrl": "",
                        "vendorFaxUrl": ""
                    },
                    "category": "Llaves"
                }, quantity: 1},
        ],
    },
];

function PedidosLanding() {


    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    // Lógica para filtrar los pedidos
    const pedidosFiltrados = useMemo(() => {
        return mockPedidos.filter(pedido => {
            const searchMatch = searchTerm === '' ||
                pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pedido.productos.some(p => p.producto.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const statusMatch = statusFilter === 'Todos' || pedido.estado === statusFilter;

            return searchMatch && statusMatch;
        });
    }, [searchTerm, statusFilter]);

    return (
        // Este contenedor simula el área de contenido principal de tu página
        <div className="bg-gray-50 min-h-screen font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Título de la sección */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Historial de Pedidos</h1>
                    <div className="mt-2 h-1.5 w-24 bg-red-600 rounded-full"></div>
                </div>

                {/* Barra de filtros y búsqueda */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-1/2 lg:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por ID de pedido o producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div className="relative w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none w-full md:w-48 bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        >
                            <option>Todos</option>
                            <option>Entregado</option>
                            <option>En proceso</option>
                            <option>Cancelado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>

                {/* Lista de pedidos */}
                <div className="space-y-6">
                    {pedidosFiltrados.length > 0 ? (
                        pedidosFiltrados.map(pedido => (
                            <PedidoCard key={pedido.id} pedido={pedido} />
                        ))
                    ) : (
                        <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <Package size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">No se encontraron pedidos</h3>
                            <p className="mt-2 text-gray-500">Prueba a cambiar los filtros o el término de búsqueda.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default PedidosLanding;