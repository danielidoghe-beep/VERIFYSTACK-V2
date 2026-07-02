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

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {

        const data = userDoc.data();

        document.getElementById("welcome").innerText =
            "Welcome back, " + data.fullname + " 👋";

        document.getElementById("balance").innerText =
    "₦" + Number(data.balance || 0).toLocaleString();
const q = query(
    collection(db, "transactions"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(5)
);

const snapshot = await getDocs(q);

let html = "";

snapshot.forEach((transaction) => {

    const t = transaction.data();

    html += `
<div class="transaction-card">

<strong>${t.type}</strong><br>

₦${Number(t.amount).toLocaleString()}

</div>
<br>
`;

});

if (html === "") {

    html = `
<div class="transaction-card">

No transaction yet.

</div>
`;

}

document.getElementById("recentTransactions").innerHTML = html;
await loadAnnouncements();   
    }
});
    async function loadAnnouncements() {

    try {

        const snapshot = await getDocs(collection(db, "announcements"));

        let html = "";

        if (snapshot.empty) {

            html = `
            <div class="transaction-card">
                No announcements yet.
            </div>
            `;

        } else {

            snapshot.forEach((doc) => {

                const announcement = doc.data();

                html += `
                <div class="transaction-card">
                    <strong>📢 ${announcement.title}</strong>
                    <p>${announcement.message}</p>
                </div>
                <br>
                `;

            });

        }

        document.getElementById("announcementContainer").innerHTML = html;

    } catch (error) {

        alert("Announcement Error:\n\n" + error.message);
        console.error(error);

    }

}
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "login.html";

    });

}
