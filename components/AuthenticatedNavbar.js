// components/AuthenticatedNavbar.js
import Navbar from './Navbar';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseClient';
import { Button } from '@mui/material';

export default function AuthenticatedNavbar() {
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Navbar>
            <Button color="inherit" onClick={handleLogout}>
                Logout
            </Button>
        </Navbar>
    );
}
