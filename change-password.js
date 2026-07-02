import { auth } from "./firebase.js";

import {
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const btn = document.getElementById("changePasswordBtn");

btn.addEventListener("click", async () => {

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (newPassword === "" || confirmPassword === "") {

        alert("Please fill in all fields.");
        return;

    }

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }

    if (newPassword.length < 6) {

        alert("Password must be at least 6 characters.");
        return;

    }

    try {

        await updatePassword(auth.currentUser, newPassword);

        alert("✅ Password changed successfully!");

        window.location.href = "profile.html";

    } catch (error) {

        if (error.code === "auth/requires-recent-login") {

            alert("For security reasons, please log out and log in again before changing your password.");

        } else {

            alert(error.message);

        }

    }

});
