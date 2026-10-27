// ===== 1. Mode gelap dan terang =====
const tombolTema = document.getElementById("tombol-tema");

tombolTema.addEventListener("click", function () {
  document.body.classList.toggle("gelap");

  if (document.body.classList.contains("gelap")) {
    tombolTema.textContent = "Mode terang";
  } else {
    tombolTema.textContent = "Mode gelap";
  }
});

// ===== 2. Pencarian proyek =====
const kotakCari = document.getElementById("cari");
const semuaKartu = document.querySelectorAll(".kartu");
const pesanKosong = document.getElementById("pesan-kosong");

kotakCari.addEventListener("input", function () {
  const kataKunci = kotakCari.value.toLowerCase();
  let adaYangCocok = false;

  semuaKartu.forEach(function (kartu) {
    const isiKartu = kartu.textContent.toLowerCase();

    if (isiKartu.includes(kataKunci)) {
      kartu.style.display = "flex";
      adaYangCocok = true;
    } else {
      kartu.style.display = "none";
    }
  });

  if (adaYangCocok) {
    pesanKosong.style.display = "none";
  } else {
    pesanKosong.style.display = "block";
  }
});