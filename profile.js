import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    // Load user information
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

        const data = userSnap.data();

        document.getElementById("profileName").innerText = data.fullname;

        document.getElementById("profileEmail").innerText = data.email;

        document.getElementById("profileBalance").innerText =
            "₦" + Number(data.balance || 0).toLocaleString();

    }

    // Load orders
    const q = query(
        collection(db, "orders"),
        where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    document.getElementById("totalOrders").innerText = snapshot.size;

    let totalSpent = 0;

    snapshot.forEach((doc) => {

        const order = doc.data();

        totalSpent += Number(order.price || 0);

    });

    document.getElementById("totalSpent").innerText =
        "₦" + totalSpent.toLocaleString();

});
