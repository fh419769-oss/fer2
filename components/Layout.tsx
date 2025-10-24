
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';

interface LayoutProps {
    children: ReactNode;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
    iconClass: string;
    label: string;
    pageName: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}> = ({ iconClass, label, pageName, currentPage, setCurrentPage }) => (
    <li>
        <button
            onClick={() => setCurrentPage(pageName)}
            className={`flex items-center p-2 text-base font-normal rounded-lg w-full text-left
                ${currentPage === pageName ? 'bg-blue-700 text-white' : 'text-gray-900 hover:bg-gray-200'}`}
        >
            <i className={`w-6 h-6 ${iconClass} transition duration-75`}></i>
            <span className="ml-3">{label}</span>
        </button>
    </li>
);

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
    const { logout, user } = useAuth();

    const navItems = [
        { icon: 'fa-solid fa-tachometer-alt', label: 'Dashboard', page: 'dashboard' as Page },
        { icon: 'fa-solid fa-plus-circle', label: 'Nuevo Registro', page: 'registrations' as Page },
        { icon: 'fa-solid fa-search', label: 'Consultar', page: 'search' as Page },
        { icon: 'fa-solid fa-pray', label: 'Intenciones', page: 'intentions' as Page },
        { icon: 'fa-solid fa-calendar-check', label: 'Ver Celebraciones', page: 'all-celebrations' as Page },
        { icon: 'fa-solid fa-file-invoice', label: 'Reportes', page: 'reports' as Page },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64" aria-label="Sidebar">
                <div className="overflow-y-auto py-4 px-3 bg-white rounded-r-lg shadow-lg h-full flex flex-col">
                    <div className="flex items-center pl-2.5 mb-5 border-b pb-4">
                        <i className="fa-solid fa-church text-3xl text-blue-600"></i>
                        <span className="self-center text-xl font-semibold whitespace-nowrap ml-3">San Isidro Labrador</span>
                    </div>
                    <ul className="space-y-2 flex-grow">
                        {navItems.map(item => (
                            <NavItem
                                key={item.page}
                                iconClass={item.icon}
                                label={item.label}
                                pageName={item.page}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        ))}
                    </ul>
                     <div className="border-t pt-4">
                        <div className="flex items-center p-2">
                           <i className="fa-solid fa-user-circle text-2xl text-gray-500"></i>
                           <span className="ml-3 font-medium">{user?.username}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-red-100 w-full"
                        >
                            <i className="fa-solid fa-sign-out-alt w-6 h-6 text-red-500"></i>
                            <span className="ml-3">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
