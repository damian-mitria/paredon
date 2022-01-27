// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"
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

// Get a reference to the database service
const database = getDatabase(app);

export const saveTask = (nombre, texto, fecha, d) =>
  addDoc(collection(db, 'tasks'), { nombre, texto, fecha, d });

export const getTasks = () => getDocs(query(collection(db, 'tasks'), orderBy("d")));



const auth = getAuth(); // esto me sirve para todo lo que es logueo y registrarse


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
      alert("Usuario registrado correctamente!");
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
    console.log("atroden");
    $("#mensajeLogueado").empty();
    $("#mensajeLogueado").append("<p class='text-primary'>Por estar logueado usted puede darle like a los mensajes!!!</p>");
     $("#mensajeLogueado").show();
  } else {
    // User is signed out
    // ...
    console.log("aqui no ha entrado nadie hermanote");
    $("#mensajeLogueado").hide();
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
    alert("Usted se ha logueado correctamente");
    singInForm.reset();
    $('#singinModal').modal('hide');
    console.log("aaaqui estoyyyy"); // esto no aparece 26/01/2022 11.25pm
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

