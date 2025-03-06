import { Box, Typography, TabList, Tab, TabPanel, Tabs } from "@mui/joy";
import Sidebar from "./SideBar";
import ProductList from "./ProductList"; // Asumiendo que existe
import { ProductCreate } from "./ProductForms/ProductCreate";
import { ProductEdit } from "./ProductForms/ProductEdit";

export const ProductsAdmin = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full p-1">
                <Box>
                    <Typography level="h4" sx={{ textAlign: "center", my: 2 }}>Products</Typography>
                    <Box sx={{ marginBottom: 2, width: "100%" }}>
                        <Tabs aria-label="Product Tabs" defaultValue={0}>
                            <TabList>
                                <Tab>Edit</Tab>
                                <Tab>Create</Tab>
                                <Tab>List</Tab>
                            </TabList>
                            <TabPanel value={0}>
                                <ProductEdit />
                            </TabPanel>
                            <TabPanel value={1}>
                                <ProductCreate />
                            </TabPanel>
                            <TabPanel value={2}>
                                <ProductList />
                            </TabPanel>
                        </Tabs>
                    </Box>
                </Box>
            </div>
        </div>
    );
};
