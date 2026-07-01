import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const depositBtn = document.getElementById("submitDepositBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

});

depositBtn.addEventListener("click", async () => {

    const amount = document.getElementById("depositAmount").value;

    const method = document.getElementById("paymentMethod").value;
const proofLink = document.getElementById("proofLink").value.trim();
    if (amount === "" || method === "" || proofLink === "") {
    alert("Please fill all fields.");
    return;
}

    try {

        await addDoc(collection(db, "deposits"), {

    uid: currentUser.uid,
    email: currentUser.email,
    amount: Number(amount),
    paymentMethod: method,
    proofLink: proofLink,
    status: "Pending",
    createdAt: serverTimestamp()

});

        alert("Deposit request submitted successfully!");

        document.getElementById("depositAmount").value = "";
        document.getElementById("paymentMethod").value = "";
document.getElementById("proofLink").value = "";
    } catch (error) {

        alert(error.message);

    }

});
const copyBtn = document.getElementById("copyAccountBtn");

copyBtn.addEventListener("click", () => {

    navigator.clipboard.writeText("8135834452");

    alert("Account number copied!");

});
