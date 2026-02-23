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

        // Fetch all collections in parallel
        const promises = collections.map(name => getDoc(doc(db, 'content', name)));
        const snapshots = await Promise.all(promises);

        snapshots.forEach((docSnap, index) => {
          if (docSnap.exists()) {
            const name = collections[index];
            const docData = docSnap.data();
            results[name] = (name === 'profile' || name === 'settings') ? docData : docData.data;
          }
        });

        setData(results);
      } catch (err) {
        console.error("Failed to fetch data from Firestore", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-dark-900 flex items-center justify-center text-orange-400 absolute inset-0 z-[100]"
        >
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="font-mono">Loading System...</div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="min-h-screen bg-dark-900 w-full"
        >
          {/* If API fails or returns empty, Portfolio component will use its default mock data */}
          {/* But we can pass the fetched data as props if available */}
          <Portfolio initialData={data} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
