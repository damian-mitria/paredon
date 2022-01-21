  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBhw5ifbn4wnklj2zmzevM1eM_lvHLbfck",
    authDomain: "tuparedon.firebaseapp.com",
    projectId: "tuparedon",
    storageBucket: "tuparedon.appspot.com",
    messagingSenderId: "151232886278",
    appId: "1:151232886278:web:f9326c5d80f91289767587"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore();

export const saveTask = (nombre, texto, fecha) => 
  addDoc(collection(db,'tasks'), { nombre, texto, fecha });

export const getTasks = () => getDocs(collection(db,'tasks'));
