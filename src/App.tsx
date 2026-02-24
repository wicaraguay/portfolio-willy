import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Portfolio from './components/Portfolio';
import AdminPanel from './components/AdminPanel';
import { db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioWrapper />} />
        <Route path="/:section" element={<PortfolioWrapper />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

function PortfolioWrapper() {
  // Inicializamos el estado SIN ESPERAR a que reaccione React (De forma totalmente síncrona)
  const [data, setData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('portfolio_data_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // Si ya tenemos caché, ya NO cargamos ni mostramos pantallas negras
  const [loading, setLoading] = useState(() => !localStorage.getItem('portfolio_data_cache'));

  useEffect(() => {
    async function fetchData() {
      // Fetch fresh data from Firestore in the background
      try {
        const collections = ['profile', 'skills', 'projects', 'experience', 'stats', 'settings'];
        const results: any = {};

        const promises = collections.map(name => getDoc(doc(db, 'content', name)));
        const snapshots = await Promise.all(promises);

        snapshots.forEach((docSnap, index) => {
          if (docSnap.exists()) {
            const name = collections[index];
            const docData = docSnap.data();
            results[name] = (name === 'profile' || name === 'settings') ? docData : docData.data;
          }
        });

        // 3. Update state with fresh data and update cache for next time
        setData(results);
        localStorage.setItem('portfolio_data_cache', JSON.stringify(results));
      } catch (err) {
        console.error("Failed to fetch data from Firestore", err);
      } finally {
        setLoading(false); // Failsafe in case cache was empty
      }
    }

    fetchData();
  }, []);

  // Si está cargando LA PRIMERA VEZ, solo mostramos un fondo oscuro (0 delay)
  if (loading) {
    return <div className="min-h-screen bg-dark-900 w-full" />;
  }

  // Cuando ya hay data (Caché O Firebase), mostramos la web inmediatamente sin transiciones bloqueantes
  return (
    <div className="min-h-screen bg-dark-900 w-full">
      <Portfolio initialData={data} />
    </div>
  );
}
