
import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';

const Registrations: React.FC = () => {
    const { addCelebration } = useDatabase();
    const [folio, setFolio] = useState('');
    const [requesterName, setRequesterName] = useState('');
    const [celebrationType, setCelebrationType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('Templo Principal');
    const [totalCost, setTotalCost] = useState(0);
    const [initialPayment, setInitialPayment] = useState(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!folio || !requesterName || !celebrationType || !date || !time || totalCost <= 0) {
            setMessage({ type: 'error', text: 'Por favor, complete todos los campos obligatorios.' });
            return;
        }

        const result = addCelebration({
            folio,
            requesterName,
            celebrationType,
            date,
            time,
            location,
            totalCost,
            payments: initialPayment > 0 ? [{ amount: initialPayment, date: new Date().toISOString() }] : [],
        });
        
        if(result.startsWith("Error")) {
            setMessage({ type: 'error', text: result });
        } else {
            setMessage({ type: 'success', text: result });
            // Reset form
            setFolio('');
            setRequesterName('');
            setCelebrationType('');
            setDate('');
            setTime('');
            setLocation('Templo Principal');
            setTotalCost(0);
            setInitialPayment(0);
        }
    };
    
    const remaining = totalCost - initialPayment;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Registro de Celebraciones</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="folio" className="block text-sm font-medium text-gray-700">Número de Recibo (Folio) *</label>
                        <input type="text" id="folio" value={folio} onChange={e => setFolio(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700">Nombre del Solicitante *</label>
                        <input type="text" id="requesterName" value={requesterName} onChange={e => setRequesterName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="celebrationType" className="block text-sm font-medium text-gray-700">Celebración *</label>
                        <input type="text" id="celebrationType" value={celebrationType} onChange={e => setCelebrationType(e.target.value)} required placeholder="Ej. Boda, Bautizo, XV Años" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lugar</label>
                        <select id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>Templo Principal</option>
                            <option>Capilla de Guadalupe</option>
                            <option>Salón Parroquial</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Día de la Celebración *</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora *</label>
                        <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700">Costo Total ($) *</label>
                        <input type="number" id="totalCost" value={totalCost} onChange={e => setTotalCost(parseFloat(e.target.value) || 0)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="initialPayment" className="block text-sm font-medium text-gray-700">Deja a cuenta ($)</label>
                        <input type="number" id="initialPayment" value={initialPayment} onChange={e => setInitialPayment(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-gray-600">Resta por pagar:</p>
                    <p className="text-2xl font-bold text-red-600">${remaining.toFixed(2)}</p>
                </div>
                
                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i className="fa-solid fa-save mr-2"></i>Guardar Registro
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Registrations;
