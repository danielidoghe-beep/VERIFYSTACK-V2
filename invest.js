import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

});

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("investBtn")) return;

    if (!currentUser) {
        alert("Please login again.");
        return;
    }

    const plan = e.target.dataset.plan;
    const amount = Number(e.target.dataset.amount);
    const profit = Number(e.target.dataset.profit);
    const days = Number(e.target.dataset.days);

    try {

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User not found.");
            return;
        }

        const userData = userSnap.data();
        const balance = Number(userData.balance || 0);

        if (balance < amount) {
            alert("Insufficient balance. Please deposit funds.");
            return;
        }

        await updateDoc(userRef, {
            balance: balance - amount
        });

        await addDoc(collection(db, "investments"), {

            uid: currentUser.uid,
            email: currentUser.email,
            plan: plan,
            amount: amount,
            profit: profit,
            duration: days,
            status: "Active",
            createdAt: serverTimestamp()

        });

        await addDoc(collection(db, "transactions"), {

            uid: currentUser.uid,
            email: currentUser.email,
            type: "Investment",
            amount: amount,
            plan: plan,
            createdAt: serverTimestamp()

        });

        alert("Investment successful!");

        window.location.href = "dashboard.html";

    } catch (error) {

        alert(error.message);

    }

});
