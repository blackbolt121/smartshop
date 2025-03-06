import { useState, useEffect } from "react";
import { Box, Button, Input, Typography, FormLabel, Select, Option } from "@mui/joy";
import axios from "axios";
import { getAccessToken } from "../../../store/auth";
import { Vendor } from "../../../store/store";
import { useNavigate } from "react-router-dom";
export const ProductEdit = () => {


    const navigate = useNavigate()

    useEffect(() => {
        console.log(getAccessToken())
        if (getAccessToken() === null) {
            if (!(location.href.includes("login") || location.href.includes("signup"))) {
                navigate("/login")
            }
        }

    }, [getAccessToken()])
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [product, setProduct] = useState({
        id: "", name: "", description: "", price: "", vendor: {
            vendorId: "",
            vendorName: "",
            vendorEmail: "",
            vendorPhone: "",
            vendorAddress: "",
            vendorCity: "",
            vendorState: "",
            vendorZipCode: "",
            vendorPostalCode: "",
            vendorWebsite: "",
            vendorWebsiteUrl: "",
            vendorFaxUrl: ""
        }
    });
    const [vendors, setVendors] = useState<Vendor[]>([]);

    // Cargar lista de productos disponibles
    useEffect(() => {
        axios.get("http://localhost:8080/rest/api/1/producto/all", {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + getAccessToken()
            }
        }).then(response => {

            console.log(response.status)
            console.log(response.data)

            setProducts(response.data)
        })
            .catch(error => console.error("Error fetching products:", error));
    }, []);
    // Obtener la lista de vendors al cargar el componente
    useEffect(() => {
        axios.get("http://localhost:8080/rest/api/1/vendor/all",
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getAccessToken()
                }
            }
        )
            .then(response => {
                console.log("Vendors: ", response.data)
                setVendors(response.data)
            })
            .catch(error => console.error("Error fetching vendors:", error));
    }, []);

    // Cargar datos del producto seleccionado
    useEffect(() => {
        if (selectedProductId) {
            axios.get(`http://localhost:8080/rest/api/1/producto/${selectedProductId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getAccessToken()
                }
            })
                .then(response => {

                    console.log(response.data)

                    setProduct(response.data)
                })
                .catch(error => console.error("Error fetching product details:", error));
        }
    }, [selectedProductId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/rest/api/1/producto/${product.id}`, product, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getAccessToken()
                }
            });
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div>
            <Typography level="h4" sx={{ mb: 2 }}>Edit Product</Typography>

            <FormLabel>Select Product</FormLabel>
            <Select value={selectedProductId} onChange={(e: any, value: any) => {


                console.log(value)
                setSelectedProductId(value)
            }}>
                {products && products.map((prod: any) => (
                    <Option key={prod.id} value={prod.id}>{prod.name}</Option>
                ))}
            </Select>

            {selectedProductId && (
                <>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" value={product.name} onChange={handleChange} />

                    <FormLabel>Description</FormLabel>
                    <Input name="description" value={product.description} onChange={handleChange} />

                    <FormLabel>Price</FormLabel>
                    <Input name="price" type="number" value={product.price} onChange={handleChange} />

                    <FormLabel>Vendor</FormLabel>
                    <Select name="vendor" value={product.vendor} onChange={(e, value) => {
                        if (value) setProduct({ ...product, "vendor": value });
                    }}>
                        {vendors && vendors.map((vendor: Vendor) => (
                            <Option key={vendor.vendorId} value={vendor} defaultChecked>{vendor.vendorName}</Option>
                        ))}
                    </Select>

                    <Button onClick={handleSubmit} sx={{ mt: 2 }}>Save Changes</Button>
                </>
            )}
        </div>
    );
};
