// === IMPORTS de Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ===== CONFIG FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyCgd_jzFlrEcUZpEtNRVY8UWt3di5IgI2w",
  authDomain: "menu-1d72a.firebaseapp.com",
  projectId: "menu-1d72a",
  storageBucket: "menu-1d72a.firebasestorage.app",
  messagingSenderId: "883010052354",
  appId: "1:883010052354:web:5f341a7d06cf9c86e7221b"
};
const cloudName = "dwpei2qes";
const uploadPreset = "menu_upload";
// ==========================

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elementos UI
const menuImg = document.getElementById("menu-img");
const uploadBtn = document.getElementById("upload_widget");

// Menú y modal
const menuBtn = document.getElementById("menu-btn");
const menuOptions = document.getElementById("menu-options");
const loginModal = document.getElementById("login-modal");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");
const loginBtn = document.getElementById("btn-login");
const togglePassword = document.getElementById("toggle-password");
const cancelLoginBtn = document.getElementById("btn-cancel");

// Documento en Firestore
const menuDocRef = doc(db, "menu", "current");

// === Mostrar imagen siempre actualizada ===
onSnapshot(menuDocRef, (snap) => {
  if (snap.exists()) {
    const data = snap.data();
    if (data.url) {
      menuImg.src = data.url + "?t=" + new Date().getTime();
    }
  }
});

// === Menú desplegable ===
menuBtn.onclick = () => {
  menuOptions.style.display = menuOptions.style.display === "block" ? "none" : "block";
};

// === Función para cerrar modal ===
function closeLoginModal() {
  loginModal.style.display = "none";
  errorMsg.textContent = "";
  emailInput.value = "";
  passwordInput.value = "";
  passwordInput.type = "password";
  togglePassword.textContent = "👁️";
}

// === Cancelar: si ambos campos vacíos -> volver al inicio ===
cancelLoginBtn.addEventListener("click", () => {
  const emailEmpty = emailInput.value.trim() === "";
  const passEmpty = passwordInput.value.trim() === "";

  closeLoginModal();

  if (emailEmpty && passEmpty) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// === Mostrar/ocultar contraseña ===
togglePassword.onclick = () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "👁️";
  }
};

// === Login Firebase con validaciones ===
loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    errorMsg.textContent = "";
    closeLoginModal();
    menuOptions.style.display = "none";
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      errorMsg.textContent = "El email es incorrecto, pero la contraseña es correcta.";
    } else if (e.code === "auth/wrong-password") {
      errorMsg.textContent = "La contraseña es incorrecta, pero el email es correcto.";
    } else {
      errorMsg.textContent = "Error: " + e.message;
    }
  }
};

// === Estado de sesión ===
onAuthStateChanged(auth, (user) => {
  if (user) {
    menuOptions.innerHTML = `
      <button id="uploadOption">Subir foto</button>
      <button id="logoutOption">Cerrar sesión</button>
    `;
    uploadBtn.style.display = "inline-block";

    document.getElementById("uploadOption").onclick = () => {
      myWidget.open();
    };

    document.getElementById("logoutOption").onclick = async () => {
      await signOut(auth);
      alert("Sesión cerrada");
      menuOptions.innerHTML = `<button id="login-option">Iniciar sesión</button>`;
      document.getElementById("login-option").onclick = () => {
        loginModal.style.display = "flex";
      };
      uploadBtn.style.display = "none";
    };
  } else {
    menuOptions.innerHTML = `<button id="login-option">Iniciar sesión</button>`;
    document.getElementById("login-option").onclick = () => {
      loginModal.style.display = "flex";
    };
    uploadBtn.style.display = "none";
  }
});

// === Cloudinary widget ===
const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    sources: ["local", "camera"],
    multiple: false,
    resourceType: "image",
    showPoweredBy: false
  },
  async (error, result) => {
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
  }
);




