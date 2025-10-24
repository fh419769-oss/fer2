
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Celebration } from '../types';
import { exportToWord } from '../services/wordExporter';

const Reports: React.FC = () => {
    const { celebrations } = useDatabase();
    const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

    const filteredData = useMemo(() => {
        const now = new Date();
        if (reportType === 'weekly') {
            const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            return celebrations.filter(c => new Date(c.date) >= lastWeek && new Date(c.date) <= now);
        } else { // monthly
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return celebrations.filter(c => new Date(c.date) >= lastMonth && new Date(c.date) <= now);
        }
    }, [celebrations, reportType]);
    
    const reportTotals = useMemo(() => {
        const totalPayments = filteredData.reduce((sum, c) => {
            return sum + c.payments.reduce((paySum, p) => paySum + p.amount, 0);
        }, 0);
        
        const totalCost = filteredData.reduce((sum, c) => sum + c.totalCost, 0);
        
        return { totalPayments, totalCost, discrepancy: totalCost - totalPayments };
    }, [filteredData]);

    const handleExport = () => {
        const title = `Reporte ${reportType === 'weekly' ? 'Semanal' : 'Mensual'}`;
        
        let content = `
            <h2>Resumen Financiero</h2>
            <p><strong>Total Ingresado:</strong> $${reportTotals.totalPayments.toFixed(2)}</p>
            <p><strong>Costo Total de Celebraciones:</strong> $${reportTotals.totalCost.toFixed(2)}</p>
            <p><strong>Monto Pendiente de Cobro:</strong> $${reportTotals.discrepancy.toFixed(2)}</p>
            <p style="color: red;">${reportTotals.discrepancy > 0 ? "Nota: Hay un desfalco/monto pendiente de $"+reportTotals.discrepancy.toFixed(2) : ""}</p>
            
            <h2>Detalle de Celebraciones</h2>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Celebración</th>
                        <th>Solicitante</th>
                        <th>Costo Total</th>
                        <th>Total Pagado</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        filteredData.forEach(c => {
            const totalPaid = c.payments.reduce((sum,p) => sum + p.amount, 0);
            content += `
                <tr>
                    <td>${c.date}</td>
                    <td>${c.celebrationType}</td>
                    <td>${c.requesterName}</td>
                    <td>$${c.totalCost.toFixed(2)}</td>
                    <td>$${totalPaid.toFixed(2)}</td>
                    <td>${c.status}</td>
                </tr>
            `;
        });

        content += '</tbody></table>';

        exportToWord(title, content);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Reportes Financieros</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Generar Reporte</h2>
                        <div className="flex gap-4 mt-2">
                           <button onClick={() => setReportType('weekly')} className={`px-4 py-2 rounded-md ${reportType === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Semanal</button>
                           <button onClick={() => setReportType('monthly')} className={`px-4 py-2 rounded-md ${reportType === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Mensual</button>
                        </div>
                    </div>
                     <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                        <i className="fa-solid fa-file-word mr-2"></i>Exportar a Word
                     </button>
                </div>
                
                <h3 className="text-lg font-bold mb-4">Reporte {reportType === 'weekly' ? 'Semanal' : 'Mensual'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">Total Ingresado</p>
                        <p className="text-2xl font-bold text-green-800">${reportTotals.totalPayments.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">Costo Total de Celebraciones</p>
                        <p className="text-2xl font-bold text-blue-800">${reportTotals.totalCost.toFixed(2)}</p>
                    </div>
                     <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-700">Desfalco / Pendiente</p>
                        <p className="text-2xl font-bold text-red-800">${reportTotals.discrepancy.toFixed(2)}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                             <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Celebración</th>
                                <th scope="col" className="px-6 py-3">Costo Total</th>
                                <th scope="col" className="px-6 py-3">Total Pagado</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(c => {
                                 const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
                                 return (
                                     <tr key={c.folio} className="bg-white border-b">
                                        <td className="px-6 py-4">{c.date}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{c.celebrationType}</td>
                                        <td className="px-6 py-4">${c.totalCost.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-green-600 font-semibold">${totalPaid.toFixed(2)}</td>
                                        <td className="px-6 py-4">{c.status}</td>
                                    </tr>
                                 );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Reports;
