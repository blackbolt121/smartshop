//A component called ProductsAdmin is being created. This component will be used to display the products that are available in the store. The component will be used in the admin panel of the application. The component will be used to display the products that are available in the store

import { Box, Typography } from '@mui/material';
import Sidebar from './SideBar';
import ProductList from './ProductList';
import { Button, FormControl, FormLabel, Input } from '@mui/joy';



export const ProductsAdmin = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="p-1">
                <Box>
                    <Typography variant="h4">Products</Typography>
                    <Box sx={{marginBottom: 2}}>
                        
                    </Box>
                    <Box>
                        <ProductList />
                    </Box>
                </Box>
            </div>

        </div>
    );
}