//Some similar logic as ProductsAdmin.tsx
//A component called VendorsAdmin is being created. This component will be used to display the vendors that are available in the store. The component will be used in the admin panel of the application. The component will be used to display the vendors that are available in the store
import { Box, Typography, TabList, Tab, TabPanel, Tabs } from '@mui/joy';
import Sidebar from './SideBar';
import VendorList from './VendorList';
import { VendorCreate } from './VendorForms/VendorCreate';
import { VendorEdit } from './VendorForms/VendorEdit';

export const VendorsAdmin = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full p-1">
                <Box>
                    <Typography level="h4" sx={{textAlign: "center", my: 2}}>Vendors</Typography>
                    <Box sx={{marginBottom: 2, width: '100%'}}>
                        <Tabs aria-label="Basic tabs" defaultValue={0}>
                            <TabList>
                                <Tab>Edit</Tab>
                                <Tab>Create</Tab>
                                <Tab>List</Tab>
                            </TabList>
                            <TabPanel value={0}>
                                <VendorEdit />
                            </TabPanel>
                            <TabPanel value={1}>
                                <VendorCreate />
                            </TabPanel>
                            <TabPanel value={2}>
                                <VendorList />
                            </TabPanel>
                        </Tabs>
                    </Box>
                </Box>
            </div>

        </div>
    );
}