const menuImg = document.getElementById("menu-img");
const adminBtn = document.querySelector(".admin-btn");
const modal = document.getElementById("adminModal");
const adminPass = document.getElementById("adminPass");
const menuFile = document.getElementById("menuFile");

// Cargar imagen almacenada en LocalStorage
window.onload = () => {
  const savedMenu = localStorage.getItem("menuImage");
  if (savedMenu) {
    menuImg.src = savedMenu;
  } else {
    menuImg.src = "https://via.placeholder.com/500x700?text=Sube+el+menú";
  }
};

// Abrir modal
adminBtn.onclick = () => {
  modal.style.display = "flex";
};

// Cerrar modal
function closeModal() {
  modal.style.display = "none";
}

// Verificar clave
function checkPassword() {
  const password = "MMJ"; // 🔑 Cambia esta clave
  if (adminPass.value === password) {
    menuFile.style.display = "block";
    menuFile.onchange = () => {
      const file = menuFile.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        menuImg.src = e.target.result;
        localStorage.setItem("menuImage", e.target.result);
        alert("Menú actualizado ✅");
        closeModal();
      };
      reader.readAsDataURL(file);
    };
  } else {
    alert("Clave incorrecta ❌");
  }
}
