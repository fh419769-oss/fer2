
import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { exportToWord } from '../services/wordExporter';

const AllCelebrations: React.FC = () => {
    const { celebrations } = useDatabase();
    
    const handleExport = () => {
        const title = "Listado de Todas las Celebraciones";
        let content = `
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Celebración</th>
                        <th>Fecha y Hora</th>
                        <th>Lugar</th>
                        <th>Estado de Pago</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        celebrations.forEach(c => {
            content += `
                <tr>
                    <td>${c.folio}</td>
                    <td>${c.celebrationType}</td>
                    <td>${c.date} a las ${c.time}</td>
                    <td>${c.location}</td>
                    <td>${c.status}</td>
                </tr>
            `;
        });
        
        content += '</tbody></table>';
        exportToWord(title, content);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Todas las Celebraciones Registradas</h1>
                <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                    <i className="fa-solid fa-file-word mr-2"></i>Exportar a Word
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Folio</th>
                                <th scope="col" className="px-6 py-3">Celebración</th>
                                <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                                <th scope="col" className="px-6 py-3">Lugar</th>
                                <th scope="col" className="px-6 py-3">Solicitante</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {celebrations.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(c => (
                                <tr key={c.folio} className="bg-white border-b">
                                    <td className="px-6 py-4 font-mono text-gray-700">{c.folio}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.celebrationType}</td>
                                    <td className="px-6 py-4">{new Date(c.date).toLocaleDateString()} - {c.time}</td>
                                    <td className="px-6 py-4">{c.location}</td>
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

export default AllCelebrations;
