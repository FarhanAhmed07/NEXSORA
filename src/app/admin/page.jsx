import AdminDashboard from './dashboard';
export const metadata = { title: 'Admin Dashboard', alternates: { canonical: '/admin' }, robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };
export default function AdminPage(){return <AdminDashboard/>;}