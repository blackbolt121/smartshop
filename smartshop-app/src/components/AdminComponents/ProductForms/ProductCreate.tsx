import { useState, useEffect } from "react";
import { Box, Button, Input, Typography, FormLabel, Select, Option } from "@mui/joy";
import axios from "axios";
import { Vendor } from "../../../store/store";
import { getAccessToken } from "../../../store/auth";
import { useNavigate } from "react-router-dom";

export const ProductCreate = () => {
    const navigate = useNavigate()


    useEffect(() => {
        console.log(getAccessToken())
        if (getAccessToken() === null) {
            if (!(location.href.includes("login") || location.href.includes("signup"))) {
                navigate("/login")
            }
        }

    }, [getAccessToken()])
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [product, setProduct] = useState({ name: "", description: "", price: "", vendor: "" });

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
            .then(response => setVendors(response.data))
            .catch(error => console.error("Error fetching vendors:", error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!product.vendor) {
            alert("Please select a vendor.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/rest/api/1/producto", product, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getAccessToken()
                }
            });
            alert("Product created successfully!");
            setProduct({ name: "", description: "", price: "", vendor: "" }); // Reset form
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <div>
            <Typography level="h4" sx={{ mb: 2 }}>Create Product</Typography>

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
                {vendors.map((vendor: Vendor) => (
                    <Option key={vendor.vendorId} value={vendor}>{vendor.vendorName}</Option>
                ))}
            </Select>

            <Button onClick={handleSubmit} sx={{ mt: 2 }}>Create Product</Button>
        </div>
    );
};
