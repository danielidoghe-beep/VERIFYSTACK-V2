import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ----------------------------
// LOGOUT
// ----------------------------

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}

// ----------------------------
// LOAD USER
// ----------------------------

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            document.getElementById("welcome").innerText =
                "Welcome back, " + data.fullname + " 👋";

            document.getElementById("balance").innerText =
                "₦" + Number(data.balance || 0).toLocaleString();

        }

    } catch (error) {

        console.log(error);

    }

    // ----------------------------
    // LOAD TRANSACTIONS
    // ----------------------------

    try {

        const transactionContainer =
            document.querySelector(".section");

        const q = query(
            collection(db, "transactions"),
            where("uid", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const snapshot = await getDocs(q);

        let html = "<h3>Recent Transactions</h3>";

        if (snapshot.empty) {

            html += `
            <div class="transaction-card">
            No transaction yet.
            </div>
            `;

        } else {

            snapshot.forEach((doc) => {

                const t = doc.data();

                html += `
                <div class="transaction-card">

                <strong>${t.type}</strong><br>

                ₦${Number(t.amount).toLocaleString()}

                </div>

                <br>
                `;

            });

        }

        transactionContainer.innerHTML = html;

    } catch (error) {

        console.log("Transactions:", error);

    }

});
