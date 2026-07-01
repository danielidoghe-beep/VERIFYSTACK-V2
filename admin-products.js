import { db } from "./firebase.js";

import {
    addDoc,
    collection
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const addProductBtn = document.getElementById("addProductBtn");

addProductBtn.addEventListener("click", async () => {

    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = Number(document.getElementById("price").value);
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const image = document.getElementById("image").value.trim();

    if (
        !title ||
        !description ||
        !price ||
        !email ||
        !password
    ) {
        alert("Please fill all fields.");
        return;
    }

    try {

        await addDoc(collection(db, "products"), {

            category: category,
            title: title,
            description: description,
            price: price,
            email: email,
            password: password,
            image: image,
            sold: false

        });

        alert("Product added successfully!");

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("image").value = "";

    } catch (error) {

        alert(error.message);

    }

});
