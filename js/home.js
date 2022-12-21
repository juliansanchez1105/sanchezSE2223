// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

  import { getDatabase, ref, set, update, child, get, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

  import {getUserName} from '../navbar.js';

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


// ----------------------- Get reference values -----------------------------
let welcome = document.getElementById('welcome');           //Welcome header
let currentUser = null;                                     //Initialize currentUser to null


// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, trial, day, time, water){
  //Must use brackets around variable name to use it as a key
  set(ref(db, 'users/' + userID + '/data/' + trial + '/' + day), {
    [time]: water
  }).then(()=>{
    alert('Data set successfully!');
  }).catch((error)=>{
    alert('There was an error. Error: ' + error);
  });
}

// -------------------------Update data in database --------------------------
function updateData(userID, trial, day, time, water){
  //Must use brackets around variable name to use it as a key
  update(ref(db, 'users/' + userID + '/data/' + trial + '/' + day), {
    [time]: water
  }).then(()=>{
    alert('Data updated successfully!');
  }).catch((error)=>{
    alert('There was an error. Error: ' + error);
  });
}

// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, trial, day, time){
  let trialVal = document.getElementById('trialVal');
  let dayVal = document.getElementById('dayVal');
  let timeVal = document.getElementById('timeVal');
  let waterVal = document.getElementById('waterVal');

  const dbref = ref(db);      //firebase parameter required for 'get'
  //Provide a path through the nodes to the data
  get(child(dbref, 'users/' + userID + '/data/' + trial + '/' + day)).then((snapshot) => {
    if(snapshot.exists()){
      console.log(snapshot.val());

      trialVal.textContent = trial;
      dayVal.textContent = day;
      timeVal.textContent = time;

      //To get a specific value from the key:    snapshot.val()[key]
      waterVal.textContent = snapshot.val()[time];
    } else {
      alert('No data found.');
    }
  }).catch((error) => {
    alert('unsuccessful, error ' + error);
  });
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, trial, day){
  let trialVal = document.getElementById('setTrialVal');
  let dayVal = document.getElementById('setDayVal');

  trialVal.textContent = `Trial: ${trial}`;
  dayVal.textContent = `Day: ${day}`;

  const times = [];
  const waterVolumes = [];
  const tbodyEl = document.getElementById("tbody-2"); //Select tbody

  const dbref = ref(db);      //firebase parameter required for 'get'

  //Wait for all data to be pulled from FRD
  //Provide path through the nodes
  await get(child(dbref, 'users/' + userID + '/data/' + trial + '/' + day)).then((snapshot) => {
    if(snapshot.exists()){
      //console.log(snapshot.val());
      snapshot.forEach(child => {
        //console.log(child.key, child.val());
        //Push values to correct arrays
        times.push(child.key);
        waterVolumes.push(child.val());
      });
      
    } else {
      alert('No data found.');
    }
  }).catch((error) => {
    alert('unsuccessful, error ' + error);
  });

  //Dynamically add table rows to HTML
  tbodyEl.innerHTML = '';
  for(let i = 0; i < times.length; i++){
    addItemToTable(times[i], waterVolumes[i], tbodyEl);
  }
}


// Add a item to the table of data
function addItemToTable(time, waterVolume, tbody){
  let tRow = document.createElement("tr");      //create table row
  let td1 = document.createElement("td");       //column 1
  let td2 = document.createElement("td");       //column 2

  td1.innerHTML = time;
  td2.innerHTML = waterVolume;

  tRow.appendChild(td1);
  tRow.appendChild(td2);

  tbody.appendChild(tRow);
}


// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, trial, day, time){
  remove(ref(db, 'users/' + userID + '/data/' + trial + '/' + day + '/' + time))
  .then(() => {
    alert('Data removed successfully!');
  }).catch((error) => {
    alert('Removal unsuccessful, error: ' + error);
  })
}



// --------------------------- Home Page Loading -----------------------------
window.addEventListener('load', () => {

  // ------------------------- Set Welcome Message -------------------------
  currentUser = getUserName();
  if(currentUser != null){
    welcome.innerText = 'Welcome ' + currentUser.firstName;
  
  // Get, Set, Update, Delete Sharkriver Temp. Data in FRD
  // Set (Insert) data function call
  document.getElementById('set').onclick = function(){
    const trial = document.getElementById('trial').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;
    const water = document.getElementById('water').value;
    const userID = currentUser.uid;

    setData(userID, trial, day, time, water);
  };

  // Update data function call
  document.getElementById('update').onclick = function(){
    const trial = document.getElementById('trial').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;
    const water = document.getElementById('water').value;
    const userID = currentUser.uid;

    updateData(userID, trial, day, time, water);
  };

  // Get a datum function call
  document.getElementById('get').onclick = function(){
    const trial = document.getElementById('getTrial').value;
    const day = document.getElementById('getDay').value;
    const time = document.getElementById('getTime').value;
    const userID = currentUser.uid;

    getData(userID, trial, day, time);
  };

  // Get a data set function call
  document.getElementById('getDataSet').onclick = function(){
    const trial = document.getElementById('getSetTrial').value;
    const day = document.getElementById('getSetDay').value;
    const userID = currentUser.uid;

    getDataSet(userID, trial, day);
  };

  // Delete a single day's data function call
  document.getElementById('delete').onclick = function(){
    const trial = document.getElementById('delTrial').value;
    const day = document.getElementById('delDay').value;
    const time = document.getElementById('delTime').value;
    const userID = currentUser.uid;

    deleteData(userID, trial, day, time);
  };
}
});

  

