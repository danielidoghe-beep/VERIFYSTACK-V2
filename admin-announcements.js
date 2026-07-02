import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const publishBtn = document.getElementById("publishBtn");

publishBtn.addEventListener("click", async () => {

    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();

    if (title === "" || message === "") {

        alert("Please fill in all fields.");
        return;

    }

    try {

        await addDoc(collection(db, "announcements"), {

            title,
            message,
            createdAt: serverTimestamp()

        });

        alert("✅ Announcement Published!");

        document.getElementById("title").value = "";
        document.getElementById("message").value = "";

    } catch (error) {

        alert(error.message);

    }

});
