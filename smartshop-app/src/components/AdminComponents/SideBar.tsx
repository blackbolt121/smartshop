import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemContent } from '@mui/joy';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: 'gray.800',
        color: 'white',
      }}
      className="h-dvh bg-blue-400"
    >
      <List>
        <ListItem>
          <ListItemButton component={Link} to="/admin/vendors">
            <ListItemContent>Vendors</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/admin/products">
            <ListItemContent>Products</ListItemContent>
          </ListItemButton>
        </ListItem>
        {/* Agrega más opciones según sea necesario */}
      </List>
    </Box>
  );
}

export default Sidebar;
