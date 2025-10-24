
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Registrations from './pages/Registrations';
import Search from './pages/Search';
import Intentions from './pages/Intentions';
import Reports from './pages/Reports';
import AllCelebrations from './pages/AllCelebrations';
import { Page } from './types';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    if (!user) {
        return <LoginPage />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'registrations':
                return <Registrations />;
            case 'search':
                return <Search />;
            case 'intentions':
                return <Intentions />;
            case 'reports':
                return <Reports />;
            case 'all-celebrations':
                return <AllCelebrations />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <DatabaseProvider>
            <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
                {renderPage()}
            </Layout>
        </DatabaseProvider>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
