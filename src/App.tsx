import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import AdminPanel from './components/AdminPanel';
import { db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioWrapper />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

function PortfolioWrapper() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const collections = ['profile', 'skills', 'projects', 'experience', 'stats', 'settings'];
        const results: any = {};

        for (const name of collections) {
          const docRef = doc(db, 'content', name);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            results[name] = (name === 'profile' || name === 'settings') ? docData : docData.data;
          }
        }

        setData(results);
      } catch (err) {
        console.error("Failed to fetch data from Firestore", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-orange-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="font-mono">Loading System...</div>
        </div>
      </div>
    );
  }

  // If API fails or returns empty, Portfolio component will use its default mock data
  // But we can pass the fetched data as props if available
  return <Portfolio initialData={data} />;
}
