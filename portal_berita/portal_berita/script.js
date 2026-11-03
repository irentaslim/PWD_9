
document.addEventListener("DOMContentLoaded", function () {

    // Menampilkan tahun saat ini pada footer
    const tahun = document.getElementById("tahun");
    tahun.textContent = new Date().getFullYear();

    // Menampilkan tanggal edisi secara otomatis
    const tanggalHariIni = document.getElementById("tanggalHariIni");
    const sekarang = new Date();

    tanggalHariIni.textContent = sekarang.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).toUpperCase();

    // Mengatur modal ringkasan artikel
    const elemenModal = document.getElementById("modalArtikel");
    const modalArtikel = new bootstrap.Modal(elemenModal);

    const judulModal = document.getElementById("judulModal");
    const isiModal = document.getElementById("isiModal");

    // Mengambil semua tombol baca artikel
    const tombolArtikel = document.querySelectorAll(".open-story");

    tombolArtikel.forEach(function (tombol) {
        tombol.addEventListener("click", function () {

            const judul = tombol.getAttribute("data-title");
            const isi = tombol.getAttribute("data-body");

            judulModal.textContent = judul;
            isiModal.textContent = isi;

            // Membuka modal
            modalArtikel.show();
        });
    });

});
