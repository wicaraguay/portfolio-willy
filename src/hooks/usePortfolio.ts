import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { PortfolioData } from '../types';

export const usePortfolio = (initialData?: PortfolioData) => {
    const [data, setData] = useState<PortfolioData | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setData(initialData);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await firebaseService.fetchPortfolioData();
                setData(result);
            } catch (err) {
                console.error('Error fetching portfolio data:', err);
                setError('Failed to load portfolio data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialData]);

    return { data, loading, error };
};
