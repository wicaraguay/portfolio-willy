import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { firebaseService } from '../services/firebaseService';
import { PortfolioData } from '../types';

export const useAdmin = () => {
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });

        const fetchData = async () => {
            try {
                const result = await firebaseService.fetchPortfolioData();
                setData(result);
                setLoading(false);
            } catch (err) {
                console.error('Error loading admin data:', err);
                showNotification('Failed to load data', 'error');
            }
        };

        fetchData();
        return () => unsubscribe();
    }, []);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const login = async (email: string, pass: string) => {
        setSaving(true);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            showNotification('¡Bienvenido de nuevo!', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al iniciar sesión', 'error');
        } finally {
            setSaving(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const saveSection = async (section: keyof PortfolioData) => {
        if (!data) return;
        setSaving(true);
        try {
            await firebaseService.saveSection(section, data[section]);
            showNotification(`${section.charAt(0).toUpperCase() + section.slice(1)} guardado correctamente`, 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al guardar datos', 'error');
        } finally {
            setSaving(false);
        }
    };

    const uploadImage = async (file: File, path: string, section: keyof PortfolioData, field: string, index?: number) => {
        setUploading(index !== undefined ? `${section}-${index}` : section);
        try {
            const url = await firebaseService.uploadImage(file, path);
            updateField(section, field, url, index);
            showNotification('Imagen subida correctamente', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al subir la imagen', 'error');
        } finally {
            setUploading(null);
        }
    };

    const uploadMultipleImages = async (files: FileList, path: string, section: keyof PortfolioData, field: string, index?: number) => {
        setUploading(index !== undefined ? `${section}-${index}-gallery` : `${section}-gallery`);
        try {
            const uploadPromises = Array.from(files).map(file => firebaseService.uploadImage(file, path));
            const urls = await Promise.all(uploadPromises);

            setData(prev => {
                if (!prev) return null;
                const newData = { ...prev } as any;
                if (Array.isArray(newData[section]) && index !== undefined) {
                    newData[section] = [...newData[section]];
                    const currentArray = newData[section][index][field] || [];
                    newData[section][index] = {
                        ...newData[section][index],
                        [field]: [...currentArray, ...urls]
                    };

                    if (section === 'projects') {
                        newData[section][index].updatedAt = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                    }
                }
                return newData as PortfolioData;
            });
            showNotification(`${urls.length} imágenes subidas correctamente`, 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al subir las imágenes', 'error');
        } finally {
            setUploading(null);
        }
    };

    const deleteImage = async (url: string, section: keyof PortfolioData, field: string, index?: number) => {
        if (!url) return;
        setSaving(true);
        try {
            await firebaseService.deleteImage(url);
            updateField(section, field, '', index);
            showNotification('Imagen eliminada correctamente', 'success');
        } catch (error) {
            console.error(error);
            updateField(section, field, '', index);
        } finally {
            setSaving(false);
        }
    };

    const updateField = (section: keyof PortfolioData, field: string, value: any, index?: number) => {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev } as any;
            if (Array.isArray(newData[section])) {
                newData[section] = [...newData[section]];
                if (index !== undefined) {
                    newData[section][index] = { ...newData[section][index], [field]: value };

                    // Automáticamente actualizar la fecha de modificación si editamos un proyecto
                    if (section === 'projects' && field !== 'updatedAt') {
                        newData[section][index].updatedAt = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                    }
                }
            } else {
                newData[section] = { ...newData[section], [field]: value };
            }
            return newData as PortfolioData;
        });
    };

    const addItem = (section: keyof PortfolioData, template: any) => {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev } as any;
            newData[section] = [...newData[section], template];
            return newData as PortfolioData;
        });
    };

    const removeItem = (section: keyof PortfolioData, index: number) => {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev } as any;
            newData[section] = newData[section].filter((_: any, i: number) => i !== index);
            return newData as PortfolioData;
        });
    };

    return {
        user,
        data,
        loading,
        authLoading,
        saving,
        uploading,
        notification,
        login,
        logout,
        saveSection,
        uploadImage,
        uploadMultipleImages,
        deleteImage,
        updateField,
        addItem,
        removeItem,
        showNotification
    };
};
