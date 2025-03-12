import { useEffect, useState } from "react";
import { Product } from "../../store/store";
import axios from "axios";
import { getAccessToken } from "../../store/auth";
import { ProductoHorizontal } from "./ProductoHorizontal";
import { Input, Select, Option, FormLabel } from "@mui/joy";
import { MdSell } from "react-icons/md";

export const Tienda = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        brand: "",
    });

    useEffect(() => {
        async function loadProducts() {
            try {
                let productRequest = await axios.get<Product[]>(
                    "http://localhost:8080/rest/api/1/producto/all",
                    {
                        headers: {
                            Authorization: `Bearer ${getAccessToken()}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                if (productRequest.status !== 200) {
                    console.log("Error fetching products");
                    return;
                }
                console.log(productRequest.data);
                setProducts(productRequest.data);
                setFilteredProducts(productRequest.data);
                console.log("Products loaded");
            } catch (error) {
                console.log("Error fetching products");
                console.log(error);
                return;
            }
        }

        loadProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, products]);

    const applyFilters = () => {
        let filtered = products;

        if (filters.category) {
            filtered = filtered.filter((product) => product.vendor.vendorName === filters.category);
        }

        if (filters.minPrice) {
            filtered = filtered.filter((product) => product.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter((product) => product.price <= parseFloat(filters.maxPrice));
        }

        if (filters.brand) {
            filtered = filtered.filter((product) => product.vendor.vendorName === filters.brand);
        }

        setFilteredProducts(filtered);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleCategoriaMarca = (name:string, value: string) => {
        setFilters({ ...filters, [name]: value });
    }

    return (
        <div className="flex justify-center flex-col">
            <br />
            <div className="flex justify-between items-center my-4 border-b border-gray-200 p-4">
                <h1 className="text-3xl font-semibold text-gray-800 inline-flex items-center justify-center">
                    <MdSell className="text-amber-300"></MdSell>Todos los productos ({products.length})
                </h1>
                <div className="flex space-x-4">
                    <Select defaultValue={"price-desc"}>
                        <Option label="Precio (Ascendente)" value="price-asc">
                            Precio (Ascendente)
                        </Option>
                        <Option label="Precio (Descendente)" value="price-desc">
                            Precio (Descendente)
                        </Option>
                        <Option label="Popularidad" value="popularity">
                            Popularidad
                        </Option>
                    </Select>
                    <Input type="text" placeholder="Buscar producto" />
                </div>
            </div>
            <br />
            <div className="flex">
                <div className="min-w-50 p-4">
                    <h2 className="text-lg font-semibold mb-4">Filtros</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <Select
                            name="category"
                            value={filters.category}
                            onChange={(e, value)=> {
                                handleCategoriaMarca("category", value || "")
                            }}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <Option value="">Todas</Option>
                            <Option value="electronics">Electrónica</Option>
                            <Option value="clothing">Ropa</Option>
                            <Option value="books">Libros</Option>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700">Precio</FormLabel>
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder="Min"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <Input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="Max"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700">Marca</FormLabel>
                        <Select
                            name="brand"
                            value={filters.brand}
                            onChange={(e, value)=>{
                                handleCategoriaMarca("brand", value || "")
                            }}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <Option value="">Todas</Option>
                            <Option value="brand1">Marca 1</Option>
                            <Option value="brand2">Marca 2</Option>
                            <Option value="brand3">Marca 3</Option>
                        </Select>
                    </div>
                </div>
                <div className="w-full p-0.5 flex flex-col mx-auto gap-2 mr-6">
                    {filteredProducts.map((product) => {
                        return <ProductoHorizontal key={product.id} {...product} />;
                    })}
                </div>
            </div>
        </div>
    );
};

