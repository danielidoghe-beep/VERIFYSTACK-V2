import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
            "₦" + Number(data.balance).toLocaleString();

    }

});
