import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc,
updateDoc,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const ADMIN_EMAIL = "danielidoghe@gmail.com";

const investmentsList = document.getElementById("investmentsList");

onAuthStateChanged(auth, async (user) => {

if(!user){

window.location.href="login.html";
return;

}

if(user.email!==ADMIN_EMAIL){

alert("Access Denied");

window.location.href="dashboard.html";
return;

}

loadInvestments();

});

async function loadInvestments(){

const q=query(

collection(db,"investments"),

where("status","==","Active")

);

const snapshot=await getDocs(q);

let html="";

snapshot.forEach((investment)=>{

const data=investment.data();

const profitAmount=(data.amount*data.profit)/100;

html+=`

<div class="transaction-card" style="margin-bottom:20px;">

<strong>${data.email}</strong><br>

Plan: ${data.plan}<br>

Amount: ₦${Number(data.amount).toLocaleString()}<br>

Profit: ₦${profitAmount.toLocaleString()}<br>

Duration: ${data.duration} Days<br><br>

<button
class="action-btn completeBtn"
data-id="${investment.id}">

Complete Investment

</button>

</div>

`;

});

if(html===""){

html="<p>No Active Investments</p>";

}

investmentsList.innerHTML=html;

}

document.addEventListener("click",async(e)=>{

if(!e.target.classList.contains("completeBtn")) return;

const investmentId=e.target.dataset.id;

const investmentRef=doc(db,"investments",investmentId);

const investmentSnap=await getDoc(investmentRef);

if(!investmentSnap.exists()) return;

const investment=investmentSnap.data();

const userRef=doc(db,"users",investment.uid);

const userSnap=await getDoc(userRef);

const userData=userSnap.data();

const profit=(investment.amount*investment.profit)/100;

const newBalance=Number(userData.balance)+investment.amount+profit;

await updateDoc(userRef,{

balance:newBalance

});

await updateDoc(investmentRef,{

status:"Completed"

});

await addDoc(collection(db,"transactions"),{

uid:investment.uid,

email:investment.email,

type:"Investment Profit",

amount:investment.amount+profit,

createdAt:serverTimestamp()

});

alert("Investment completed successfully!");

loadInvestments();

});
