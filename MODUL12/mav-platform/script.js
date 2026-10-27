// Daftar menu untuk setiap peran pengguna.
const menuPerPeran = {
  admin: ["Dashboard", "Kelola pengguna", "Kelola layanan"],
  staf: ["Dashboard", "Layanan saya"],
  tamu: ["Daftar layanan"]
};

const pilihPeran = document.getElementById("peran");
const daftarMenu = document.getElementById("menu");

function tampilkanMenu() {
  // Ambil menu berdasarkan peran yang dipilih.
  const menu = menuPerPeran[pilihPeran.value];

  // Hapus menu sebelumnya.
  daftarMenu.innerHTML = "";

  // Tampilkan setiap menu yang sesuai.
  menu.forEach(function (nama) {
    const item = document.createElement("li");
    item.textContent = nama;
    daftarMenu.appendChild(item);
  });
}

// Perbarui menu saat pilihan peran berubah.
pilihPeran.addEventListener("change", tampilkanMenu);

// Tampilkan menu saat halaman pertama kali dibuka.
tampilkanMenu();