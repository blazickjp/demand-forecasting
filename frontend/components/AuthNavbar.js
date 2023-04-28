import AccountCircle from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import MenuIcon from '@mui/icons-material/Menu';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import React, { forwardRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Tooltip,
    Menu,
    MenuItem,
    Box,
    Paper,
    Button,
    Slide, ListItemIcon
} from '@mui/material';

const AuthNavbar = ({ onDrawerToggle }) => {
    const { user, auth } = useAuth();
    const router = useRouter();
    const [anchorMenu, setAnchorMenu] = React.useState(null);
    const [open, setOpen] = React.useState(false);


    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    const handleMenu = (event) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    const handleUpdateAccount = () => {
        // Add logic for updating account here
        handleCloseMenu();
    };

    const toggleDrawer = () => {
        setOpen(!open);
        onDrawerToggle(!open);
    };

    const drawerItems = [
        {
            text: 'Welcome',
            href: '/dashboard',
            icon: <AccountCircle />,
        },
        {
            text: 'Forecasting',
            href: '/dashboard/forecasting/overview',
            icon: <BarChartIcon />,
            subItems: [
                { text: 'Overview', href: '/dashboard/forecasting/overview' },
                // { text: 'How-to', href: '/dashboard/forecasting/how-to' },
                { text: 'Generate Forecast', href: '/dashboard/forecasting/generate' },
            ],
        },
        {
            text: 'Schedule Optimization',
            href: '/dashboard/schedule-optimization/overview',
            icon: <ScheduleIcon />,
            subItems: [
                { text: 'Overview', href: '/dashboard/schedule-optimization/overview' },
                // { text: 'How-To', href: '/dashboard/schedule-optimization/how-to' },
                { text: 'Run Optimization', href: '/dashboard/schedule-optimization/run' },
            ],
        },
        {
            text: 'Questions',
            href: '#hidden',
            icon: <QuestionAnswerIcon />,
        },
        // Add more items as needed
    ];

    const LinkButton = forwardRef(({ onClick, href, children }, ref) => {
        return (
            <Button
                component="a"
                href={href}
                onClick={onClick}
                ref={ref}
                sx={{ textTransform: 'none', textDecoration: 'none', color: 'black' }}
            >
                {children}
            </Button>
        );
    });
    LinkButton.displayName = 'LinkButton';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        DiY.AI
                    </Typography>
                    <Tooltip title={`Account: ${user?.displayName} (${user?.email})`} arrow>
                        <IconButton color="inherit" onClick={handleMenu}>
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorMenu}
                        keepMounted
                        open={Boolean(anchorMenu)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={handleUpdateAccount}>Update Account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Slide direction="right" in={open} mountOnEnter unmountOnExit>
                <Paper
                    sx={{
                        position: 'fixed',
                        top: '64px',
                        left: 0,
                        bottom: 0,
                        width: 250,
                        zIndex: 1200,
                    }}
                >
                    <List>
                        {drawerItems.map((item) => (
                            <>
                                <Link href={item.href} key={item.text} passHref>
                                    <ListItem component="div">
                                        <ListItemIcon sx={{ marginRight: 0 }}>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            sx={{ marginLeft: -4 }}
                                            primary={
                                                <LinkButton>
                                                    {item.text}
                                                </LinkButton>
                                            }
                                        />
                                    </ListItem>
                                </Link>
                                {item.subItems && item.subItems.map((subItem) => (
                                    <Link href={subItem.href} key={subItem.text} passHref>
                                        <ListItem component="div" sx={{ paddingLeft: 8 }}>
                                            <ListItemText
                                                primary={
                                                    <LinkButton>
                                                        {subItem.text}
                                                    </LinkButton>
                                                }
                                            />
                                        </ListItem>
                                    </Link>
                                ))}
                            </>
                        ))}
                    </List>
                    <Divider />
                </Paper>
            </Slide>
        </Box>
    );
};

export default AuthNavbar;
