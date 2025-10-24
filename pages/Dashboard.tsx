
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

const StatCard: React.FC<{ icon: string; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full ${color}`}>
            <i className={`${icon} text-3xl text-white`}></i>
        </div>
        <div className="ml-4">
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { celebrations, intentions } = useDatabase();

    const pendingCelebrations = celebrations.filter(c => c.status === 'Pendiente').length;
    const today = new Date().toISOString().split('T')[0];
    const celebrationsToday = celebrations.filter(c => c.date === today).length;


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {user?.username}!</h1>
            <p className="text-gray-600">Resumen del sistema de la Parroquia San Isidro Labrador.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon="fa-solid fa-cross" title="Total de Celebraciones" value={celebrations.length} color="bg-blue-500" />
                <StatCard icon="fa-solid fa-pray" title="Total de Intenciones" value={intentions.length} color="bg-green-500" />
                <StatCard icon="fa-solid fa-hourglass-half" title="Celebraciones Pendientes" value={pendingCelebrations} color="bg-yellow-500" />
                <StatCard icon="fa-solid fa-calendar-day" title="Celebraciones Hoy" value={celebrationsToday} color="bg-purple-500" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Próximas Celebraciones</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                                <th scope="col" className="px-6 py-3">Celebración</th>
                                <th scope="col" className="px-6 py-3">Solicitante</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {celebrations
                                .filter(c => new Date(c.date) >= new Date())
                                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .slice(0, 5)
                                .map(c => (
                                <tr key={c.folio} className="bg-white border-b">
                                    <td className="px-6 py-4">{new Date(c.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} - {c.time}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.celebrationType}</td>
                                    <td className="px-6 py-4">{c.requesterName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            c.status === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
