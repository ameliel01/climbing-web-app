// frontend/src/components/Layout.jsx
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main role="main" className="p-4">
        <Outlet /> {/* ici s'affichent les pages */}
      </main>
    </>
  );
}
