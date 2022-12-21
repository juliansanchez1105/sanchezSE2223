// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBeRyOHg3_kQuXe3ew27VDn7zEo5pzSr8",
  authDomain: "researchwebsitefb.firebaseapp.com",
  projectId: "researchwebsitefb",
  storageBucket: "researchwebsitefb.appspot.com",
  messagingSenderId: "788856312627",
  appId: "1:788856312627:web:71eedeffbdc87aa27fa446"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//Initialize Authentication
const auth = getAuth();

//Return an instance of the app's FRD
const db = getDatabase(app);


// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function(){
    //Get user's email and password for the sign-in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    //Attempt to sign the user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //Create a user and store the user ID
        const user = userCredential.user;

        //Log sign-in date in the DB
        //'update' will only add the last_login info and won't overwrite anything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate,
        }).then(() => {
            //User signed in
            alert('User signed in successfully!');

            //Get snapshot of all user info, pass it to the login() function, and store it in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if(snapshot.exists()){
                    stayLoggedIn(snapshot.val());
                } else {
                    console.log("User does not exist");
                }
            }).catch((error) => {
                console.log(error);
            })

        }).catch(() => {
            //Sign in failed
            alert(error);
        })
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
}


// ---------------- Keep User Logged In ----------------------------------//

function stayLoggedIn(user){
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    //Session storage is temporary (only active while browser open).
    //Information is saved as a string (must convert JS object to save).
    //Session storage will be cleared with a signOut() function.

    if(!keepLoggedIn){
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location = 'home.html';      //Browser redirect to homepage
    }

    //Local storage is more permenant (persists after browser closes)
    //Is cleared with signOut() function
    else{
        localStorage.setItem('keepLoggedIn', 'yes')
        localStorage.setItem('user', JSON.stringify(user));
        window.location = 'home.html';      //Browser redirect to homepage
    }

}