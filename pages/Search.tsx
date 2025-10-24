
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Celebration } from '../types';

const CelebrationCard: React.FC<{ celebration: Celebration; onAddPayment: (folio: string, amount: number) => void }> = ({ celebration, onAddPayment }) => {
    const [paymentAmount, setPaymentAmount] = useState(0);
    const totalPaid = useMemo(() => celebration.payments.reduce((sum, p) => sum + p.amount, 0), [celebration.payments]);
    const remaining = celebration.totalCost - totalPaid;

    const handleAddPayment = () => {
        if (paymentAmount > 0 && paymentAmount <= remaining) {
            onAddPayment(celebration.folio, paymentAmount);
            setPaymentAmount(0);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{celebration.celebrationType}</h3>
                    <p className="text-gray-500">Solicitante: {celebration.requesterName}</p>
                    <p className="text-sm text-gray-500">Folio: {celebration.folio}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${celebration.status === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{celebration.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <p><i className="fa-solid fa-calendar-alt mr-2 text-gray-400"></i>{new Date(celebration.date).toLocaleDateString()}</p>
                <p><i className="fa-solid fa-clock mr-2 text-gray-400"></i>{celebration.time}</p>
                <p><i className="fa-solid fa-map-marker-alt mr-2 text-gray-400"></i>{celebration.location}</p>
            </div>
            <div className="mt-4 border-t pt-4">
                <div className="flex justify-between">
                    <span>Costo Total:</span>
                    <span className="font-bold">${celebration.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                    <span>Total Pagado:</span>
                    <span className="font-bold">${totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                    <span>Resta:</span>
                    <span className="font-bold">${remaining.toFixed(2)}</span>
                </div>
            </div>
            {celebration.status === 'Pendiente' && (
                <div className="mt-4 border-t pt-4 space-y-2">
                    <p className="text-sm font-medium">Abonar al recibo:</p>
                    <div className="flex gap-2">
                        <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)} max={remaining} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        <button onClick={handleAddPayment} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Abonar</button>
                    </div>
                </div>
            )}
             {celebration.status === 'Pagado' && (
                 <p className="mt-4 text-center font-bold text-green-600 bg-green-50 p-3 rounded-md">
                    <i className="fa-solid fa-check-circle mr-2"></i>ESTE RECIBO ESTÁ LIQUIDADO
                </p>
             )}
        </div>
    );
};


const Search: React.FC = () => {
    const { celebrations, addPayment, getCelebrationByFolio } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'folio' | 'nombre' | 'celebracion' | 'dia'>('folio');
    const [filteredCelebrations, setFilteredCelebrations] = useState<Celebration[]>([]);
    const [message, setMessage] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        
        if (!searchTerm) {
            setFilteredCelebrations([]);
            return;
        }
        
        if(searchType === 'folio') {
            const result = getCelebrationByFolio(searchTerm);
            if (result) {
                setFilteredCelebrations([result]);
                if (result.status === 'Pagado') {
                    setMessage(`El folio ${searchTerm} ya está liquidado.`);
                }
            } else {
                setFilteredCelebrations([]);
                setMessage('No se encontró ninguna celebración con ese folio.');
            }
            return;
        }

        const results = celebrations.filter(c => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            switch (searchType) {
                case 'nombre':
                    return c.requesterName.toLowerCase().includes(lowerSearchTerm);
                case 'celebracion':
                    return c.celebrationType.toLowerCase().includes(lowerSearchTerm);
                case 'dia':
                    return c.date === searchTerm;
                default:
                    return false;
            }
        });
        setFilteredCelebrations(results);
        if (results.length === 0) {
            setMessage('No se encontraron resultados para su búsqueda.');
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Consultar Registros</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <select value={searchType} onChange={e => setSearchType(e.target.value as any)} className="px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="folio">Por Folio</option>
                        <option value="nombre">Por Nombre</option>
                        <option value="celebracion">Por Celebración</option>
                        <option value="dia">Por Día</option>
                    </select>
                    <input
                        type={searchType === 'dia' ? 'date' : 'text'}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={`Buscar por ${searchType}...`}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                        <i className="fa-solid fa-search mr-2"></i>Buscar
                    </button>
                </form>
            </div>
            
            {message && <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">{message}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCelebrations.map(c => (
                    <CelebrationCard key={c.folio} celebration={c} onAddPayment={addPayment} />
                ))}
            </div>
        </div>
    );
};

export default Search;
