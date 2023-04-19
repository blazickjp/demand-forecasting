// pages/dashboard.js
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import Dashboard from '../components/Dashboard';
import { useEffect } from 'react';


export default function DashboardPage() {
    const user = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return <Dashboard />;
}
