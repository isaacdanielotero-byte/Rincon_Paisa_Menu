const cloudName = "TU_CLOUD_NAME";   // 👈 tu cloud name
const uploadPreset = "menu_upload";  // 👈 tu upload preset

// Clave secreta (defínela tú)
const CLAVE_SECRETA = "mmj";

function validarClave() {
  const claveIngresada = document.getElementById("clave").value;
  if (claveIngresada === CLAVE_SECRETA) {
    document.getElementById("upload_widget").style.display = "inline-block";
    document.getElementById("login-area").style.display = "none";
  } else {
    alert("Clave incorrecta ❌");
  }
}

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

document.getElementById("upload_widget").addEventListener("click", () => {
  myWidget.open();
}, false);

