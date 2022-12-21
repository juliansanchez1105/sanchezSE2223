// ----------------------- Get User's Name'Name ------------------------------
function getUserName(){
    //Grab the value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn');
    
    //Grab user info passed in from signIn.js
    if(keepLoggedIn == 'yes'){
      currentUser = JSON.parse(localStorage.getItem('user'));
    }else{
      currentUser = JSON.parse(sessionStorage.getItem('user'));
    }

    return currentUser;
  }
  
// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD

function signOutUser(){
    sessionStorage.removeItem('user');    //Clear the session storage
    localStorage.removeItem('user');      //Clear local storage
    localStorage.removeItem('keepLoggedIn');

    signOutLink(auth).then(() => {
        //Sign out successful
    }).catch((error)=>{
        //Error occurred
    })

    //window.location.assign('index.html');
}

export {getUserName};

// ----------------------- Get reference values -----------------------------
let userLink = document.getElementById('userLink');         //Username for navbar
let signInOutLink = document.getElementById('signInOut');       //Sign out Link
let currentUser = null;                                     //Initialize currentUser to null

// --------------------------- Page Loading -----------------------------
window.addEventListener('load', () => {
    // ------------------------- Set Welcome Message -------------------------
    currentUser = getUserName();
    //console.log(currentUser);
    if(currentUser == null){
      userLink.innerText = 'Create New Account';
      userLink.classList.replace('nav-link', 'btn');
      userLink.classList.add('btn-primary');
      userLink.href = 'register.html';
  
      signInOutLink.innerText = 'Sign In';
      signInOutLink.classList.replace('nav-link', 'btn');
      signInOutLink.classList.add('btn-success');
      signInOutLink.href = 'signIn.html';
  
    } else {
      userLink.innerText = currentUser.firstName;
      userLink.classList.replace('btn', 'nav-link');
      userLink.classList.remove('btn-primary');
  
      signInOutLink.innerText = 'Sign Out';
      signInOutLink.classList.replace('nav-link', 'btn');
      signInOutLink.classList.add('btn-danger');
      document.getElementById('signInOut').onclick = function(){
        signOutUser();
      }
      signInOutLink.href = 'index.html';
    }
});


