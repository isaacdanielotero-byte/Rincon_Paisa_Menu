// Inicializar el widget de Cloudinary
const cloudName = "TU_CLOUD_NAME"; // cambia por el tuyo
const uploadPreset = "ml_default"; // puedes usar este por defecto

var myWidget = cloudinary.createUploadWidget({
  cloudName: cloudName,
  uploadPreset: uploadPreset,
  sources: ["local", "url", "camera"], // desde PC, link o cámara móvil
  multiple: false,
  folder: "menus", // opcional: carpeta en tu Cloudinary
  resourceType: "image"
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log("Imagen subida con éxito: ", result.info.secure_url);
    // Cambiar la imagen en la página automáticamente
    document.getElementById("menu-img").src = result.info.secure_url;
  }
});

document.getElementById("upload_widget").addEventListener("click", function(){
  myWidget.open();
}, false);
