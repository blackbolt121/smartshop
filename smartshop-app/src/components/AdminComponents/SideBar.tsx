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
      className="h-screen bg-slate-800 text-white"
    >
      <List sx={{ color: 'white' }}>
        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/admin/vendors"
            sx={{ color: 'white', '&:hover': { color: 'black' } }} // Apply MUI styling
          >
            <ListItemContent>Vendors</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/admin/products" 
            sx={{ color: 'white', '&:hover': { color: 'black' } }} // Consistent hover effect
          >
            <ListItemContent>Products</ListItemContent>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
