const daftar = document.getElementById("daftar");
const inputNama = document.getElementById("nama");
const inputInstansi = document.getElementById("instansi");
const pesan = document.getElementById("pesan");

document.getElementById("simpan").addEventListener("click", function () {
  const nama = inputNama.value.trim();
  const instansi = inputInstansi.value.trim();

  // Periksa apakah nama sudah diisi.
  if (nama === "") {
    pesan.textContent = "Nama wajib diisi!";
    inputNama.focus();
    return;
  }

  // Buat item daftar pengunjung baru.
  const item = document.createElement("li");
  item.textContent = nama + " - " + (instansi || "Instansi tidak dicantumkan");

  // Tambahkan item ke daftar.
  daftar.appendChild(item);

  // Tampilkan pesan berhasil.
  pesan.textContent = "Tamu berhasil ditambahkan!";

  // Kosongkan formulir setelah data ditambahkan.
  inputNama.value = "";
  inputInstansi.value = "";
  inputNama.focus();
});