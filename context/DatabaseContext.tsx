
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Celebration, Intention } from '../types';

interface DatabaseContextType {
    celebrations: Celebration[];
    intentions: Intention[];
    addCelebration: (celebration: Omit<Celebration, 'status'>) => string;
    addPayment: (folio: string, amount: number) => boolean;
    getCelebrationByFolio: (folio: string) => Celebration | undefined;
    addIntention: (intention: Omit<Intention, 'id' | 'date'>) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const initialCelebrations: Celebration[] = [
    {
      folio: '2024-001',
      requesterName: 'Familia Pérez',
      celebrationType: 'Bautizo',
      date: '2024-08-15',
      time: '12:00',
      location: 'Templo Principal',
      totalCost: 500,
      payments: [{ amount: 500, date: new Date().toISOString() }],
      status: 'Pagado',
    },
    {
      folio: '2024-002',
      requesterName: 'Juan Rodríguez',
      celebrationType: 'Misa de XV Años',
      date: '2024-09-01',
      time: '13:00',
      location: 'Capilla de Guadalupe',
      totalCost: 1200,
      payments: [{ amount: 600, date: new Date().toISOString() }],
      status: 'Pendiente',
    }
];

const initialIntentions: Intention[] = [
    {
      id: '1',
      intentionFor: 'Difunto Juan Pérez',
      intentionType: 'Difuntos',
      time: '7:00 PM',
      payment: 50,
      date: new Date().toISOString()
    }
];


export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [celebrations, setCelebrations] = useLocalStorage<Celebration[]>('parish-celebrations-db', initialCelebrations);
    const [intentions, setIntentions] = useLocalStorage<Intention[]>('parish-intentions-db', initialIntentions);

    const addCelebration = (celebrationData: Omit<Celebration, 'status'>): string => {
        const existing = celebrations.find(c => c.folio === celebrationData.folio);
        if (existing) {
            return "Error: El número de folio ya existe.";
        }
        
        const paidAmount = celebrationData.payments.reduce((sum, p) => sum + p.amount, 0);
        const newCelebration: Celebration = {
            ...celebrationData,
            status: paidAmount >= celebrationData.totalCost ? 'Pagado' : 'Pendiente',
        };
        setCelebrations([...celebrations, newCelebration]);
        return "Celebración registrada con éxito."
    };
    
    const addPayment = (folio: string, amount: number): boolean => {
        const updatedCelebrations = celebrations.map(c => {
            if (c.folio === folio) {
                const newPayments = [...c.payments, { amount, date: new Date().toISOString() }];
                const totalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
                return {
                    ...c,
                    payments: newPayments,
                    status: totalPaid >= c.totalCost ? 'Pagado' : 'Pendiente'
                };
            }
            return c;
        });
        setCelebrations(updatedCelebrations);
        return true;
    };

    const getCelebrationByFolio = (folio: string): Celebration | undefined => {
        return celebrations.find(c => c.folio === folio);
    };

    const addIntention = (intentionData: Omit<Intention, 'id' | 'date'>) => {
        const newIntention: Intention = {
            ...intentionData,
            id: new Date().getTime().toString(),
            date: new Date().toISOString(),
        };
        setIntentions([...intentions, newIntention]);
    };

    return (
        <DatabaseContext.Provider value={{ celebrations, intentions, addCelebration, addPayment, getCelebrationByFolio, addIntention }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (context === undefined) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
};
