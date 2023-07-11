// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//traigo datos de entorno
require('dotenv').config();

import mySetDeIds from "./main.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "tuparedon.firebaseapp.com",
  projectId: "tuparedon",
  storageBucket: "tuparedon.appspot.com",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

// Get a reference to the database service
const database = getDatabase(app);

export async function saveTask(nombre, texto, fecha, d, contadorMeGusta, contadorNOMeGusta) {

  let objeto = await addDoc(collection(db, 'tasks'), { nombre, texto, fecha, d, contadorMeGusta, contadorNOMeGusta });
  return objeto.id;

}

export const getTasks = () => getDocs(query(collection(db, 'tasks'), orderBy("d")));


// Parte del boton me gusta

export async function saveMeGusta(id) {

  const docRef = doc(db, "tasks", id);
  const docSnap = await getDoc(docRef);
  let objeto = docSnap.data();
  updateDoc(docRef, { contadorMeGusta: ++objeto.contadorMeGusta });
  //console.log(objeto.contadorMeGusta)
  return objeto.contadorMeGusta;
}

export async function saveSetMeGusta(likeUnicos) {

  const setMeGusta = doc(db, "setMeGusta", "arrayMeGusta");

  // Atomically add a new region to the "regions" array field.
  await updateDoc(setMeGusta, {
    arrayMeGusta: arrayUnion(likeUnicos)
  });
}

export const getArrayMeGustaFirebase = () => getDocs((collection(db, 'setMeGusta')));


//boton no me gusta
export async function saveNOMeGusta(id) {

  const docRef = doc(db, "tasks", id);
  const docSnap = await getDoc(docRef);
  let objeto = docSnap.data();
  updateDoc(docRef, { contadorNOMeGusta: ++objeto.contadorNOMeGusta });
  //console.log(objeto.contadorMeGusta)
  return objeto.contadorNOMeGusta;
}

export async function saveSetNoMeGusta(likeUnicos) {

  const setNoMeGusta = doc(db, "setNoMeGusta", "arrayNoMeGusta");

  // Atomically add a new region to the "regions" array field.
  await updateDoc(setNoMeGusta, {
    arrayNoMeGusta: arrayUnion(likeUnicos)
  });
}

export const getArrayNoMeGustaFirebase = () => getDocs((collection(db, 'setNoMeGusta')));




// esto me sirve para todo lo que es logueo y registrarse
const auth = getAuth();
export { auth }; // lo exporto para saber si esta logueado en el main.js


// Registrarse
const singupForm = document.querySelector("#singup-form");
singupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //obtengo el email y password
  const email = document.querySelector("#singup-email").value;
  const password = document.querySelector("#singup-password").value;
  //creo el usuario
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      set(ref(database, 'users/' + user.uid), {   //<----seteo al usuario en la base de datos
        email: email,
        password: password
      });
      alert("Usuario registrado correctamente y ya esta logueado!");
      singupForm.reset();
      $('#singupModal').modal('hide');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });

});

//Loguearse
const singInForm = document.querySelector("#login-form");
singInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //obtengo el email y password
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  //creo el usuario
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      const date = new Date(); // <----aca le estoy agregando cuando es su ultimo login
      update(ref(database, 'users/' + user.uid), {
        last_login: date
      });

      alert("Usted se ha logueado correctamente");
      singInForm.reset();
      $('#singinModal').modal('hide');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });

});

//Logout
const logout = document.querySelector("#logout");
logout.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
    // Sign-out successful.
    alert("Deslogueado. Gracias... vuelva pronto!")
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });

});


// Esto es para que todo el tiempo la app chequee si el usuario esta logueado
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
    console.log("estas logueado");
    $("#mensajeLogueado").empty();
    $("#mensajeLogueado").append("<p class='text-primary'>Por estar logueado usted puede darle ME GUSTA o NO ME GUSTA a los mensajes!!!</p>");
    $("#mensajeLogueado").show();
    for (let actual of mySetDeIds) { // muestro los stickers de los me gusta si esta logueado
      $(`#${actual}`).children(".sticker").show();
      $(`#${actual}`).children(".sticker2").show();
    }
    $("#boton-meGusta").show();
    $("#boton-NoMeGusta").show();

  } else {
    // User is signed out
    // ...
    console.log("no estas logueado");
    $("#mensajeLogueado").empty();
    $("#mensajeLogueado").append("<p class='text-primary'>Solamente los usuarios logueados pueden darle ME GUSTA o NO ME GUSTA a los mensajes!!!</p>");
    $("#mensajeLogueado").show();
    /*for (let actual of mySetDeIds) { // oculto los stickers de los me gusta al logout
      $(`#${actual}`).children(".sticker").hide();
    }
    */
    $("#boton-meGusta").hide();
    $("#boton-NoMeGusta").hide();
  }
});

const provider = new GoogleAuthProvider();

const googleLogin = document.querySelector("#googleLogin");
googleLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      alert("Usted se ha logueado correctamente con Google");
      singInForm.reset();
      $('#singinModal').modal('hide');
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      alert(errorMessage);
    });

});

// Persistencia de logueo, cuando cerras la pestaña o ventana te desloguea
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    //console.log("estas aca")
    return signInWithEmailAndPassword(auth, email, password);

  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

