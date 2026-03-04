import { db, storage } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { PortfolioData } from '../types';
import { compressImage } from '../utils/image';

const COLLECTIONS = ['profile', 'skills', 'projects', 'experience', 'stats', 'settings'];

export const firebaseService = {
    async fetchPortfolioData(): Promise<PortfolioData> {
        const results: any = {};
        const promises = COLLECTIONS.map(name => getDoc(doc(db, 'content', name)));
        const snapshots = await Promise.all(promises);

        snapshots.forEach((docSnap, index) => {
            const name = COLLECTIONS[index];
            if (docSnap.exists()) {
                const docData = docSnap.data();
                results[name] = (name === 'profile' || name === 'settings') ? docData : (docData.data || []);
            } else {
                // Default fallback if document doesn't exist
                if (name === 'profile' || name === 'settings') {
                    results[name] = {};
                } else {
                    results[name] = [];
                }
            }
        });

        return results as PortfolioData;
    },

    async saveSection(section: string, data: any): Promise<void> {
        const docRef = doc(db, 'content', section);
        const payload = (section === 'profile' || section === 'settings') ? data : { data };
        await setDoc(docRef, payload);
    },

    async uploadImage(file: File, path: string): Promise<string> {
        // Compress and convert to WebP
        const compressedBlob = await compressImage(file);
        const finalFile = compressedBlob instanceof File
            ? compressedBlob
            : new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });

        const storageRef = ref(storage, `${path}/${Date.now()}-${finalFile.name}`);
        const snapshot = await uploadBytes(storageRef, finalFile);
        return await getDownloadURL(snapshot.ref);
    },

    async deleteImage(url: string): Promise<void> {
        if (!url) return;
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
    }
};
