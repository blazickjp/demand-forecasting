import AccountCircle from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import MenuIcon from '@mui/icons-material/Menu';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
    const [open, setOpen] = React.useState(true);


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
            text: 'Study Plan',
            href: '#/dashboard/study-plan',
            icon: <ScheduleIcon />,
            // subItems: [
            //     { text: 'Overview', href: '/dashboard/schedule-optimization/overview' },
            //     // { text: 'How-To', href: '/dashboard/schedule-optimization/how-to' },
            //     { text: 'Run Optimization', href: '/dashboard/schedule-optimization/run' },
            // ],
        },
        {
            text: 'Practice Problems',
            href: '/dashboard/practice-problems',
            icon: <AssignmentIcon />,
        },
        {
            text: 'CFA Chat',
            href: '/qa',
            icon: <QuestionAnswerIcon />,
        },
        // Add more items as needed
    ];

    const LinkButton = forwardRef(({ onClick, href, children }, ref) => {
        return (
            <a href={href} onClick={onClick} ref={ref}>
                <Button
                    sx={{
                        textTransform: 'none',
                        textDecoration: 'none',
                        // color: (theme) => theme.palette.primary.main,
                    }}
                >
                    {children}
                </Button>
            </a>
        );
    });
    LinkButton.displayName = 'LinkButton';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" aria-label="menu" onClick={toggleDrawer} sx={{ color: 'white' }} >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        CFA Chat
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
            </AppBar >
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
                            <React.Fragment key={item.text}>
                                <ListItem component={Link} href={item.href}>
                                    <ListItemIcon sx={{ marginRight: 0 }}>{item.icon}</ListItemIcon>
                                    <ListItemText sx={{ marginLeft: -2, color: (theme) => theme.palette.primary.main }} primary={item.text} />
                                </ListItem>
                                {item.subItems &&
                                    item.subItems.map((subItem) => (
                                        <ListItem
                                            key={subItem.text}
                                            sx={{ paddingLeft: 8 }}
                                            component={Link}
                                            href={subItem.href}
                                        >
                                            <ListItemText primary={subItem.text} />
                                        </ListItem>
                                    ))}
                            </React.Fragment>
                        ))}
                    </List>

                    <Divider />
                </Paper>
            </Slide>
        </Box >
    );
};

export default AuthNavbar;
