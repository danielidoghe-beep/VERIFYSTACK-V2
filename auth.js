import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

// REGISTER

if(registerBtn){

registerBtn.addEventListener("click", async()=>{

const fullname=document.getElementById("fullname").value.trim();
const email=document.getElementById("email").value.trim();
const password=document.getElementById("password").value;
const confirm=document.getElementById("confirmPassword").value;

if(fullname===""||email===""||password===""||confirm===""){
alert("Please fill all fields");
return;
}

if(password!==confirm){
alert("Passwords do not match");
return;
}

try{

const user=await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",user.user.uid),{

fullname:fullname,

email:email,

balance:0,

createdAt:serverTimestamp()

});

alert("Account created successfully!");

window.location.href="login.html";

}catch(error){

alert(error.message);

}

});

}

// LOGIN

if(loginBtn){

loginBtn.addEventListener("click",async()=>{

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

if(email===""||password===""){
alert("Enter email and password");
return;
}

try{

await signInWithEmailAndPassword(auth,email,password);

alert("Login successful");

window.location.href="dashboard.html";

}catch(error){

alert(error.message);

}

});

}
