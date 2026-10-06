$(function () {
  // Data awal, dipakai untuk tombol Reset
  var awal = {
    nama: 'Iren Meiliani Taslim',
    role: 'Front-End Developer',
    lokasi: 'Jakarta, Indonesia',
    email: 'h1101251062@students.untan.ac.id'
  };
  var polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // .hover(): kartu menyala saat kursor di atasnya
  $('#profileCard').hover(
    function () { $(this).addClass('hover'); },
    function () { $(this).removeClass('hover'); }
  );
  // .click() + .slideToggle(): buka/tutup panel Ubah Profil
  $('#btnUbah').click(function () {
    $('#inNama').val($('#profileName').text());
    $('#inRole').val($('#profileRole').text());
    $('#inLokasi').val($('#profileLokasi').text());
    $('#inEmail').val($('#profileEmail').text());
    $('#errUbah').hide();
    $('#panelUbah').slideToggle(300);
  });
  // Simpan: .text(), .html(), .css() + .fadeOut()/.fadeIn()
  $('#btnSimpan').click(function () {
    var nama   = $('#inNama').val().trim();
    var role   = $('#inRole').val().trim();
    var lokasi = $('#inLokasi').val().trim();
    var email  = $('#inEmail').val().trim();
    if (nama === '' || role === '' || lokasi === '' || email === '') {
      $('#errUbah').text('Semua data tidak boleh kosong').show();
      return;
    }
    if (!polaEmail.test(email)) {
      $('#errUbah').text('Format email tidak valid, contoh: nama@domain.com').show();
      return;
    }
    $('#errUbah').hide();
    $('#dataProfil').fadeOut(300, function () {
      $('#profileName').text(nama).css('color', '#be185d');
      $('#profileRole').text(role);
      $('#profileLokasi').text(lokasi);
      $('#profileEmail').text(email);
      // Avatar jadi inisial nama (di-escape lewat .text() agar aman dari XSS)
      var inisial = nama.split(/\s+/).map(function (k) { return k.charAt(0); })
                        .slice(0, 2).join('').toUpperCase();
      $('#avatar').html('<strong style="font-size:34px">' + $('<i>').text(inisial).html() + '</strong>');

      $('#dataProfil').fadeIn(500);
    });
    $('#panelUbah').slideUp(300);
  });
  // Reset: kembalikan semua data ke data awal
  $('#btnReset').click(function () {
    $('#dataProfil').fadeOut(300, function () {
      $('#profileName').text(awal.nama).css('color', '');
      $('#profileRole').text(awal.role);
      $('#profileLokasi').text(awal.lokasi);
      $('#profileEmail').text(awal.email);
      $('#avatar').html('🤖');
      $('#dataProfil').fadeIn(500);
    });
    $('#panelUbah').slideUp(300);
  });
  // Validasi real-time dengan .show() / .hide()
  function cekNama() {
    var ok = $('#nama').val().trim().length >= 3;
    if (ok) { $('#errNama').hide(); } else { $('#errNama').show(); }
    $('#nama').toggleClass('salah', !ok);
    return ok;
  }
  function cekEmail() {
    var ok = polaEmail.test($('#email').val().trim());
    if (ok) { $('#errEmail').hide(); } else { $('#errEmail').show(); }
    $('#email').toggleClass('salah', !ok);
    return ok;
  }
  function cekPesan() {
    var ok = $('#pesan').val().trim().length >= 10;
    if (ok) { $('#errPesan').hide(); } else { $('#errPesan').show(); }
    $('#pesan').toggleClass('salah', !ok);
    return ok;
  }
  $('#nama').on('input', cekNama);
  $('#email').on('input', cekEmail);
  $('#pesan').on('input', cekPesan);
  // .submit(): validasi akhir form pesan
  $('#contactForm').submit(function (e) {
    e.preventDefault();
    var a = cekNama(), b = cekEmail(), c = cekPesan();   // semua dicek supaya semua error tampil
    if (a && b && c) {
      $('#successMessage').fadeIn().delay(2500).fadeOut();
      this.reset();
    }
  });
});