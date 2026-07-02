import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    alert("Logged out successfully!");

    window.location.href = "login.html";

});
