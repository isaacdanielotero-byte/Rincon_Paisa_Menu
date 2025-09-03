// === IMPORTS de Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ===== CONFIGURA ESTO =====
const firebaseConfig = {
  apiKey: "AIzaSyCgd_jzFlrEcUZpEtNRVY8UWt3di5IgI2w",
  authDomain: "menu-1d72a.firebaseapp.com",
  projectId: "menu-1d72a",
  storageBucket: "menu-1d72a.firebasestorage.app",
  messagingSenderId: "883010052354",
  appId: "1:883010052354:web:5f341a7d06cf9c86e7221b"
};
const cloudName = "dwpei2qes";        // tu Cloudinary cloud name
const uploadPreset = "menu_upload";       // tu preset unsigned
// ==========================

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elementos de la interfaz
const menuImg = document.getElementById("menu-img");
const uploadBtn = document.getElementById("upload_widget");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");

// Documento en Firestore
const menuDocRef = doc(db, "menu", "current");

// 🔹 Mostrar la imagen siempre actualizada
onSnapshot(menuDocRef, (snap) => {
  if (snap.exists()) {
    const data = snap.data();
    if (data.url) {
      menuImg.src = data.url + "?t=" + new Date().getTime(); // evita caché
    }
  }
});

// 🔹 Login
btnLogin.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passInput.value);
    alert("Sesión iniciada");
  } catch (e) {
    alert("Error en login: " + e.message);
  }
});

// 🔹 Logout
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
});

// 🔹 Cambios en el estado de sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
    emailInput.style.display = "none";
    passInput.style.display = "none";
  } else {
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";
    emailInput.style.display = "inline-block";
    passInput.style.display = "inline-block";
  }
});

// 🔹 Cloudinary widget
const myWidget = cloudinary.createUploadWidget({
  cloudName: cloudName,
  uploadPreset: uploadPreset,
  sources: ["local", "camera"],
  multiple: false,
  resourceType: "image",
  showPoweredBy: false
}, async (error, result) => {
  if (!error && result && result.event === "success") {
    console.log("Upload success:", result.info.secure_url);

    const user = auth.currentUser;
    if (user) {
      await setDoc(menuDocRef, { url: result.info.secure_url });
      alert("Menú actualizado correctamente ✅");
    } else {
      alert("Debes iniciar sesión para publicar el menú ❌");
    }
  }
});

// Abrir el widget
uploadBtn.addEventListener("click", () => {
  myWidget.open();
});


