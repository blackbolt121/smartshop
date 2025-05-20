import { useEffect, useState } from "react";
import { Product, Vendor } from "../../store/store";
import axios from "axios";
import { getAccessToken } from "../../store/auth";
import { ProductoHorizontal } from "./ProductoHorizontal";
import { Input, Select, Option, FormLabel } from "@mui/joy";
import { useSearchParams } from "react-router-dom";
import { MdSell } from "react-icons/md";
import Pagination from '@mui/material/Pagination';

interface AllProductRequest {
    content: Product[],
    pageable: {
        "pageNumber": number,
        "pageSize": number,
        "sort": {
            "empty": boolean,
            "sorted": boolean,
            "unsorted": boolean
        },
        "offset": number,
        "paged": boolean,
        "unpaged": boolean
    },
    "last": boolean,
    "totalPages": number,
    "totalElements": number,
    "first": boolean,
    "size": number,
    "number": number,
    "sort": {
        "empty": boolean,
        "sorted": boolean,
        "unsorted": boolean
    },
    "numberOfElements": number,
    "empty": boolean
}

export const Tienda = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const initialFilters = {
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        brand: searchParams.get("brand") || "",
    };


    const initialPage = parseInt(searchParams.get("page") || "1");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([])
    const [filters, setFilters] = useState(initialFilters);

    const [vendors, setVendors] = useState<Vendor[]>([])

    const [total, setTotal] = useState<number>(0)
    const [numPages, setNumPages] = useState<number>(1)
    const [page, setPage] = useState<number>(initialPage)

    async function loadCategories() {
        try {
            const response = await axios.get<string[]>(
                `http://localhost:8080/rest/api/1/producto/categorias`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
    
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Error fetching categories", error);
        }
    }
    async function loadVendors() {
        try {
            const response = await axios.get<Vendor[]>(
                `http://localhost:8080/rest/api/1/vendor/all`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
    
            if (response.status === 200) {
                setVendors(response.data);
            }
        } catch (error) {
            console.log("Error fetching categories", error);
        }
    }
    async function loadProducts() {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("page", (page - 1).toString());

            if (filters.category) queryParams.append("categories", filters.category);
            if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
            if (filters.maxPrice && parseInt(filters.maxPrice) > parseInt(filters.minPrice)) queryParams.append("maxPrice", filters.maxPrice);
            if (filters.brand) queryParams.append("brand", filters.brand);

            const url = `http://localhost:8080/rest/api/1/producto/all?${queryParams.toString()}`;
            console.log(url)

            const productRequest = await axios.get<AllProductRequest>(url, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (productRequest.status !== 200) {
                console.log("Error fetching products");
                return;
            }

            setProducts(productRequest.data.content);
            setTotal(productRequest.data.totalElements);
            setNumPages(productRequest.data.totalPages);
        } catch (error) {
            console.log("Error fetching products", error);
        }
    }
    useEffect(() => {
    setFilters({
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        brand: searchParams.get("brand") || "",
    });

    setPage(parseInt(searchParams.get("page") || "1"));
}, []);
    useEffect(() => {
        const newParams: any = {
            page: page.toString(),
        };
        if (filters.category) newParams.category = filters.category;
        if (filters.minPrice) newParams.minPrice = filters.minPrice;
        if (filters.maxPrice) newParams.maxPrice = filters.maxPrice;
        if (filters.brand) newParams.brand = filters.brand;

        setSearchParams(newParams);
    }, [filters, page]);

    useEffect(() => {
        loadCategories().then()
        loadVendors().then()
        loadProducts().then()
    }, [searchParams]);

    useEffect(()=>{

    }, [products])

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPage(1); // reiniciar a la primera página si se cambia un filtro
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoriaMarca = (name: string, value: string) => {
        setPage(1); // reiniciar a la primera página si se cambia un filtro
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="flex justify-center flex-col">
                <br />
                <div className="flex justify-between items-center my-4 border-b border-gray-200 p-4">
                    <h1 className="text-3xl font-semibold text-gray-800 inline-flex items-center justify-center">
                        <MdSell className="text-amber-300"></MdSell>Todos los productos ({total})
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
                                onChange={(e, value) => {
                                    e;
                                    if(categories.length != 0 && value != null){
                                        console.log(categories.length)
                                        console.log(categories)
                                        console.log(filters.category, value)
                                        handleCategoriaMarca("category", value || "");
                                    }
                                    
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <Option value="">Todas</Option>
                                {categories.map((cat) => (
                                    <Option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="mb-4">
                            <FormLabel>Precio</FormLabel>
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                />
                                <Input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <FormLabel>Marca</FormLabel>
                            <Select
                                name="brand"
                                value={filters.brand}
                                onChange={(e, value) => {
                                    if(vendors.length != 0 && value != null){
                                        handleCategoriaMarca("brand", value || "")
                                    }
                                }}
                            >
                                <Option value="">Todas</Option>
                                {vendors.filter(x => x.vendorName !== "").sort((a, b)=> b.vendorName.localeCompare(a.vendorName)).map(vendorName => (
                                    <Option key={vendorName.vendorId} value={vendorName.vendorId}>{vendorName.vendorName}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="w-full p-0.5 grid grid-cols-2 mx-auto gap-2 mr-6">
                        {products? products.map((product) => (
                            <ProductoHorizontal key={product.id} {...product} />
                        )) : <></>}
                    </div>
                </div>
            </div>

            <div className="my-10">
                <Pagination
                    variant="outlined"
                    shape="rounded"
                    size="large"
                    count={numPages}
                    page={page}
                    onChange={(e, page) => setPage(page)}
                    sx={{ display: "flex", justifyContent: "center" }}
                    color="primary"
                />
            </div>
        </>
    );
};

