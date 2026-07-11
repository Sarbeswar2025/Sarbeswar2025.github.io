import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

console.log("DB:", db);
console.log("DB type:", typeof db);
/* =====================================================
   ADD DOCUMENT
===================================================== */

export async function addDocument(collectionName, data) {

    try {

        console.log("🚀 Firestore Start");

        const docRef = await addDoc(
            collection(db, collectionName),
            {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }
        );

        console.log("✅ Firestore Success :", docRef.id);

        return docRef;

    } catch (error) {

        console.error("❌ Firestore Add Error:", error);

        throw error;

    }

}

/* =====================================================
   GET ALL DOCUMENTS
===================================================== */

export async function getCollection(collectionName) {

    try {

        const q = query(
            collection(db, collectionName),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return data;

    } catch (error) {

        console.error("❌ Get Collection Error:", error);

        return [];

    }

}

/* =====================================================
   GET SINGLE DOCUMENT
===================================================== */

export async function getDocument(collectionName, id) {

    try {

        const snapshot = await getDoc(
            doc(db, collectionName, id)
        );

        if (!snapshot.exists()) {

            return null;

        }

        return {

            id: snapshot.id,
            ...snapshot.data()

        };

    } catch (error) {

        console.error("❌ Get Document Error:", error);

        return null;

    }

}

/* =====================================================
   UPDATE DOCUMENT
===================================================== */

export async function updateDocument(collectionName, id, data) {

    try {

        await updateDoc(
            doc(db, collectionName, id),
            {
                ...data,
                updatedAt: serverTimestamp()
            }
        );

        console.log("✅ Document Updated");

    } catch (error) {

        console.error("❌ Update Error:", error);

        throw error;

    }

}

/* =====================================================
   DELETE DOCUMENT
===================================================== */

export async function deleteDocument(collectionName, id) {

    try {

        await deleteDoc(
            doc(db, collectionName, id)
        );

        console.log("🗑️ Document Deleted");

    } catch (error) {

        console.error("❌ Delete Error:", error);

        throw error;

    }

}