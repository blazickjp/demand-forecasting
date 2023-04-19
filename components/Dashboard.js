import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box
} from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';



const Dashboard = () => {
    const { user, auth } = useAuth();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const drawerItems = [
        { text: 'Item 1', href: '/dashboard/item1' },
        { text: 'Item 2', href: '/dashboard/item2' },
        // Add more items as needed
    ];

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                <List>
                    {drawerItems.map((item) => (
                        <Link href={item.href} key={item.text} passHref>
                            <ListItem button component="a">
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
                <Divider />
            </Drawer>
            <main>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {/* Add the welcome message below */}
                    {user && (
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome, {user.displayName}!
                        </Typography>
                    )}
                    {/* ... rest of the JSX ... */}
                </Box>
                {/* Add your main content here */}
            </main>
        </div>
    );
};

export default Dashboard;
