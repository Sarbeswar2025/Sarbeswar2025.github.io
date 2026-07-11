import { db } from "./firebase.js";

import {
    doc,
    updateDoc,
    increment,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


async function countVisitor() {

    const today = new Date().toDateString();

    const lastVisit = localStorage.getItem("visitDate");

    if (lastVisit === today) return;

    try {

        await updateDoc(
            doc(db, "analytics", "stats"),
            {
                totalVisitors: increment(1),
                todayVisitors: increment(1),
                lastUpdated: serverTimestamp()
            }
        );

        localStorage.setItem("visitDate", today);

        console.log("Visitor Counted");

    }

    catch(error){

        console.error(error);

    }

}

countVisitor();