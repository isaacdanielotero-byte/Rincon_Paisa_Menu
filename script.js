// Tu configuración de Cloudinary
const cloudName = "TU_CLOUD_NAME";   // 👈 reemplaza con tu Cloud Name
const uploadPreset = "menu_upload";  // 👈 el preset "unsigned"

// Clave secreta
const CLAVE_SECRETA = "1234";

// Por defecto, el botón de subir está desactivado
let autorizado = false;

function validarClave() {
  const claveIngresada = document.getElementById("clave").value;
  if (claveIngresada === CLAVE_SECRETA) {
    autorizado = true;
    alert("✅ Acceso autorizado, ya puedes cambiar el menú");
  } else {
    alert("❌ Clave incorrecta");
  }
}

// Configuración del widget
const myWidget = cloudinary.createUploadWidget({
  cloudName: cloudName,
  uploadPreset: uploadPreset,
  sources: ["local", "camera"],
  multiple: false,
  resourceType: "image",
  publicId: "plato",
  overwrite: true
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log("Menú actualizado: ", result.info.secure_url);
    document.getElementById("menu-img").src = result.info.secure_url + "?t=" + new Date().getTime();
  }
});

// Abrir widget solo si está autorizado
document.getElementById("upload_widget").addEventListener("click", () => {
  if (autorizado) {
    myWidget.open();
  } else {
    alert("⚠️ Ingresa la clave antes de cambiar el menú");
  }
}, false);

