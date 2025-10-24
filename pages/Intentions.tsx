
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Intention, IntentionType } from '../types';
import { exportToWord } from '../services/wordExporter';


const Intentions: React.FC = () => {
    const { intentions, addIntention } = useDatabase();
    const [intentionFor, setIntentionFor] = useState('');
    const [intentionType, setIntentionType] = useState<IntentionType>('Difuntos');
    const [time, setTime] = useState<'8:00 AM' | '7:00 PM'>('7:00 PM');
    const [payment, setPayment] = useState(0);
    const [message, setMessage] = useState('');
    
    const [viewTime, setViewTime] = useState<'8:00 AM' | '7:00 PM'>('7:00 PM');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!intentionFor || payment <= 0) {
            setMessage('Por favor, complete todos los campos.');
            return;
        }
        addIntention({ intentionFor, intentionType, time, payment });
        setMessage('Intención registrada con éxito.');
        setIntentionFor('');
        setPayment(0);
        
        // Auto-generate receipt text to copy
        const receiptText = `RECIBO DE INTENCIÓN\n--------------------\nParroquia San Isidro Labrador\n\nFecha: ${new Date().toLocaleDateString()}\nIntención para: ${intentionFor}\nTipo: ${intentionType}\nHorario: ${time}\nPago: $${payment.toFixed(2)}\n\nGracias por su cooperación.`;
        alert("Intención Registrada. Recibo generado:\n\n" + receiptText);

    };

    const intentionsForView = useMemo(() => {
        return intentions.filter(i => i.time === viewTime);
    }, [intentions, viewTime]);
    
    const handleExport = () => {
        let content = '<h3>Intenciones:</h3><ul>';
        intentionsForView.forEach(i => {
            content += `<li><strong>${i.intentionType}</strong> para <strong>${i.intentionFor}</strong> (Pago: $${i.payment.toFixed(2)})</li>`;
        });
        content += '</ul>';
        if(intentionsForView.length === 0) content = '<p>No hay intenciones registradas para este horario.</p>';
        
        exportToWord(`Intenciones de Misa - ${viewTime} - ${new Date().toLocaleDateString()}`, content);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Registro de Intenciones</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
                     <p className="text-sm text-gray-600">Máximo 20 intenciones por horario.</p>
                     <div>
                        <label htmlFor="intentionFor" className="block text-sm font-medium text-gray-700">Intención por:</label>
                        <input type="text" id="intentionFor" value={intentionFor} onChange={e => setIntentionFor(e.target.value)} placeholder="Ej. Familia Pérez, Difunto Juan..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="intentionType" className="block text-sm font-medium text-gray-700">Tipo de Intención:</label>
                        <select id="intentionType" value={intentionType} onChange={e => setIntentionType(e.target.value as IntentionType)} className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm">
                            <option>Difuntos</option>
                            <option>Acción de Gracias</option>
                            <option>Salud</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Horario:</label>
                        <div className="flex gap-4 mt-1">
                            <label><input type="radio" name="time" value="8:00 AM" checked={time === '8:00 AM'} onChange={() => setTime('8:00 AM')} /> 8:00 AM</label>
                            <label><input type="radio" name="time" value="7:00 PM" checked={time === '7:00 PM'} onChange={() => setTime('7:00 PM')} /> 7:00 PM</label>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="payment" className="block text-sm font-medium text-gray-700">Pago ($):</label>
                        <input type="number" id="payment" value={payment} onChange={e => setPayment(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    {message && <p className="text-green-600">{message}</p>}
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Registrar y Generar Recibo</button>
                </form>
            </div>
            
            {/* View Section */}
            <div>
                 <h1 className="text-3xl font-bold text-gray-800 mb-6">Consultar Intenciones</h1>
                 <div className="bg-white p-8 rounded-lg shadow-md">
                     <div className="flex justify-between items-center mb-4">
                         <div>
                            <p className="text-lg font-semibold">Horario de Misa:</p>
                             <div className="flex gap-4 mt-1">
                                <button onClick={() => setViewTime('8:00 AM')} className={`px-4 py-2 rounded-md ${viewTime === '8:00 AM' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>8:00 AM</button>
                                <button onClick={() => setViewTime('7:00 PM')} className={`px-4 py-2 rounded-md ${viewTime === '7:00 PM' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>7:00 PM</button>
                            </div>
                         </div>
                         <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                            <i className="fa-solid fa-file-word mr-2"></i>Exportar
                         </button>
                     </div>
                     <div className="mt-4 border-t pt-4 space-y-2 max-h-96 overflow-y-auto">
                        {intentionsForView.length > 0 ? (
                            intentionsForView.map(i => (
                                <div key={i.id} className="p-3 bg-gray-50 rounded-md flex justify-between">
                                    <div>
                                        <p className="font-semibold">{i.intentionFor}</p>
                                        <p className="text-sm text-gray-500">{i.intentionType}</p>
                                    </div>
                                    <p className="font-semibold text-green-700">${i.payment.toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No hay intenciones registradas para este horario.</p>
                        )}
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Intentions;
