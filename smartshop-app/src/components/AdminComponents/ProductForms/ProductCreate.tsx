import { Button, FormControl, FormLabel, Input } from '@mui/joy';

const handleAddProduct = (e: any) => {
    e.preventDefault();
    console.log("Add Product");
}

export const ProductCreate = () => {
    return (
        <div>
            <form onSubmit={handleAddProduct}>
                <FormControl required>
                    <FormLabel htmlFor='product-name'>Product name</FormLabel>
                    <Input type='text' placeholder='Product name' name='product-name' required />
                    

                    <FormLabel htmlFor='product-price'>Product price</FormLabel>
                    <Input type='number' placeholder='Product price' name='product-price' required />

                    <FormLabel htmlFor='product-description'>Product description</FormLabel>
                    <Input type='text' placeholder='Product description' name='product-description' required />

                    <FormLabel htmlFor='product-image'>Product image</FormLabel>
                    <Input type='file' placeholder='Product image' name='product-image' required />

                    

                    <Button type='submit' color='primary'>Add Product</Button>
                </FormControl>
            </form>
        </div>
    )
}