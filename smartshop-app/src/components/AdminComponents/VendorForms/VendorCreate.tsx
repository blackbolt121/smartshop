import { Button, FormControl, FormLabel, Input } from '@mui/joy';
import axios from 'axios';
import React from 'react';
import { getAccessToken } from '../../../store/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const handleAddVendor = async (e: any) => {
    e.preventDefault();

    console.log('Add Vendor');

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const vendorData = {
        vendorName: formData.get('vendor-name') as string,
        vendorEmail: formData.get('vendor-email') as string,
        vendorPhone: formData.get('vendor-phone') as string,
        vendorAddress: formData.get('vendor-address') as string,
        vendorCity: formData.get('vendor-city') as string,
        vendorState: formData.get('vendor-state') as string,
        vendorZipCode: formData.get('vendor-zip-code') as string,
        vendorPostalCode: formData.get('vendor-postal-code') as string,
        vendorWebsite: formData.get('vendor-website') as string,
        vendorWebsiteUrl: formData.get('vendor-website-url') as string,
        vendorFaxUrl: formData.get('vendor-fax-url') as string,
    };

    // Hacer una solicitud POST a la API
    console.log(vendorData)
    console.log({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getAccessToken(),
    })
    try {
        const response = await axios.post('http://localhost:8080/rest/api/1/vendor', vendorData, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getAccessToken(),
            }
        });

        console.log(vendorData)
        // Comprobar si la respuesta fue exitosa
        if (!(response.status === 201)) {
            throw new Error('Error al crear el proveedor');
        }

        console.log('Vendor creado con éxito:', vendorData);

        form.reset();
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
}

export const VendorCreate = () => {

    const navigate = useNavigate()

    useEffect(() => {
        console.log(getAccessToken())
        if (getAccessToken() === null) {
            if (!(location.href.includes("login") || location.href.includes("signup"))) {
                navigate("/login")
            }
        }

    }, [getAccessToken()])

    return (
        <div>
            <form onSubmit={handleAddVendor}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <div>
                        <FormLabel required htmlFor='vendor-name'>Vendor Name</FormLabel>
                        <Input type='text' placeholder='Vendor Name' name='vendor-name' required />
                    </div>

                    <div>
                        <FormLabel required htmlFor='vendor-email'>Vendor Email</FormLabel>
                        <Input type='email' placeholder='Vendor Email' name='vendor-email' required />
                    </div>

                    <div>
                        <FormLabel required htmlFor='vendor-phone'>Vendor Phone</FormLabel>
                        <Input type='tel' placeholder='Vendor Phone' name='vendor-phone' required />
                    </div>

                    <div>
                        <FormLabel required htmlFor='vendor-address'>Vendor Address</FormLabel>
                        <Input type='text' placeholder='Vendor Address' name='vendor-address' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-city'>Vendor City</FormLabel>
                        <Input type='text' placeholder='Vendor City' name='vendor-city' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-state'>Vendor State</FormLabel>
                        <Input type='text' placeholder='Vendor State' name='vendor-state' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-zip-code'>Vendor Zip Code</FormLabel>
                        <Input type='number' placeholder='Vendor Zip Code' name='vendor-zip-code' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-postal-code'>Vendor Postal Code</FormLabel>
                        <Input type='number' placeholder='Vendor Postal Code' name='vendor-postal-code' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-website'>Vendor Website</FormLabel>
                        <Input type='url' placeholder='Vendor Website' name='vendor-website' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-website-url'>Vendor Website URL</FormLabel>
                        <Input type='url' placeholder='Vendor Website URL' name='vendor-website-url' required />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-fax-url'>Vendor Fax URL</FormLabel>
                        <Input type='url' placeholder='Vendor Fax URL' name='vendor-fax-url' required />
                    </div>
                </FormControl>
                <Button type='submit' color='primary'>Add Vendor</Button>
            </form>
        </div>
    );
}
