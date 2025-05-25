import { Button, FormControl, FormLabel, Input, Select, Option } from '@mui/joy';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../../store/auth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { updateVendor, setVendors } from "../../../store/store";
import { Vendor } from '../../../store/store';
import { useNavigate } from 'react-router-dom';


export const VendorEdit = () => {

    const navigate = useNavigate()

    useEffect(() => {
        console.log(getAccessToken())
        if (getAccessToken() === null) {
            if (!(location.href.includes("login") || location.href.includes("signup"))) {
                navigate("/login")
            }
        }

    }, [getAccessToken()])

    const vendors = useSelector((state: RootState) => state.vendors);
    const dispatch = useDispatch();

    const [vendorList, setVendorList] = useState<Vendor[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const [vendorName, setVendorName] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorPhone, setVendorPhone] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorCity, setVendorCity] = useState('');
    const [vendorState, setVendorState] = useState('');
    const [vendorZipCode, setVendorZipCode] = useState('');
    const [vendorPostalCode, setVendorPostalCode] = useState('');
    const [vendorWebsite, setVendorWebsite] = useState('');
    const [vendorWebsiteUrl, setVendorWebsiteUrl] = useState('');
    const [vendorFaxUrl, setVendorFaxUrl] = useState('');

    // Cargar proveedores al iniciar
    useEffect(() => {
        async function fetchVendors() {
            try {
                const response = await axios.get<Vendor[]>('http://localhost:8080/rest/api/1/vendor/all', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + getAccessToken()
                    }
                });

                if (response.status === 200) {


                    dispatch(setVendors(response.data));
                    setVendorList(response.data);
                } else {
                    console.error('Error al obtener los proveedores');
                }
            } catch (error) {
                console.error("Error al obtener los proveedores:", error);
            }
        }
        fetchVendors();
    }, [dispatch]);

    useEffect(() => {
        console.log(vendors.length);
    }, [vendors]);

    // Actualizar los inputs cuando se seleccione un proveedor
    useEffect(() => {
        if (selectedVendor) {
            setVendorName(selectedVendor.vendorName || '');
            setVendorEmail(selectedVendor.vendorEmail || '');
            setVendorPhone(selectedVendor.vendorPhone || '');
            setVendorAddress(selectedVendor.vendorAddress || '');
            setVendorCity(selectedVendor.vendorCity || '');
            setVendorState(selectedVendor.vendorState || '');
            setVendorZipCode(selectedVendor.vendorZipCode || '');
            setVendorPostalCode(selectedVendor.vendorPostalCode || '');
            setVendorWebsite(selectedVendor.vendorWebsite || '');
            setVendorWebsiteUrl(selectedVendor.vendorWebsiteUrl || '');
            setVendorFaxUrl(selectedVendor.vendorFaxUrl || '');
        }
    }, [selectedVendor]);

    // Manejar la edición y actualización del proveedor
    const handleEditVendor = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedVendor) return;

        const updatedVendor: Vendor = {
            ...selectedVendor,
            vendorName,
            vendorEmail,
            vendorPhone,
            vendorAddress,
            vendorCity,
            vendorState,
            vendorZipCode,
            vendorPostalCode,
            vendorWebsite,
            vendorWebsiteUrl,
            vendorFaxUrl,
        };

        try {
            const response = await axios.put(`http://localhost:8080/rest/api/1/vendor/${selectedVendor.vendorId}`, updatedVendor, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + getAccessToken()
                }
            });

            if (response.status === 200) {
                dispatch(updateVendor(updatedVendor));
                alert("Proveedor actualizado con éxito");
            } else {
                console.error("Error al actualizar el proveedor");
            }
        } catch (error) {
            console.error("Error al actualizar el proveedor:", error);
        }
    };

    return (
        <div>
            <FormLabel>Vendor List</FormLabel>
            <Select name='vendor' onChange={(event, value) => {
                event
                const vendor = vendorList.find(v => v.vendorId === value);
                setSelectedVendor(vendor || null);
            }}>
                {vendorList.map(vendor => (
                    <Option key={vendor.vendorId} value={vendor.vendorId}>{vendor.vendorName}</Option>
                ))}
            </Select>

            <form onSubmit={handleEditVendor}>
                <FormControl required sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div>
                        <FormLabel htmlFor='vendor-name'>Vendor Name</FormLabel>
                        <Input type='text' placeholder='Vendor Name' name='vendor-name' required
                            value={vendorName} onChange={e => setVendorName(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-email'>Vendor Email</FormLabel>
                        <Input type='email' placeholder='Vendor Email' name='vendor-email' required
                            value={vendorEmail} onChange={e => setVendorEmail(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-phone'>Vendor Phone</FormLabel>
                        <Input type='tel' placeholder='Vendor Phone' name='vendor-phone' required
                            value={vendorPhone} onChange={e => setVendorPhone(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-address'>Vendor Address</FormLabel>
                        <Input type='text' placeholder='Vendor Address' name='vendor-address' required
                            value={vendorAddress} onChange={e => setVendorAddress(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-city'>Vendor City</FormLabel>
                        <Input type='text' placeholder='Vendor City' name='vendor-city' required
                            value={vendorCity} onChange={e => setVendorCity(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-state'>Vendor State</FormLabel>
                        <Input type='text' placeholder='Vendor State' name='vendor-state' required
                            value={vendorState} onChange={e => setVendorState(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-zip-code'>Vendor Zip Code</FormLabel>
                        <Input type='number' placeholder='Vendor Zip Code' name='vendor-zip-code' required
                            value={vendorZipCode} onChange={e => setVendorZipCode(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-postal-code'>Vendor Postal Code</FormLabel>
                        <Input type='number' placeholder='Vendor Postal Code' name='vendor-postal-code' required
                            value={vendorPostalCode} onChange={e => setVendorPostalCode(e.target.value)} />
                    </div>

                    <div>
                        <FormLabel htmlFor='vendor-website'>Vendor Website</FormLabel>
                        <Input type='url' placeholder='Vendor Website' name='vendor-website' required
                            value={vendorWebsite} onChange={e => setVendorWebsite(e.target.value)} />
                    </div>
                </FormControl>

                <Button type='submit' color='primary'>Update Vendor</Button>
            </form>
        </div>
    );
};
