$(function () {

  // ===== DATA PRODUK =====
  const buku = [
    { id: 1, judul: 'Jane Eyre',                   penulis: 'Charlotte Brontë', harga: 85000, warna: '#7a1f3d' },
    { id: 2, judul: 'Wuthering Heights',           penulis: 'Emily Brontë',     harga: 79000, warna: '#2f4b57' },
    { id: 3, judul: 'Agnes Grey',                  penulis: 'Anne Brontë',      harga: 69000, warna: '#5b6b3a' },
    { id: 4, judul: 'Emma',                        penulis: 'Jane Austen',      harga: 75000, warna: '#b5546b' },
    { id: 5, judul: 'The Tenant of Wildfell Hall', penulis: 'Anne Brontë',      harga: 89000, warna: '#4a3a6b' },
    { id: 6, judul: 'Pride and Prejudice',         penulis: 'Jane Austen',      harga: 72000, warna: '#a0672b' },
    { id: 7, judul: 'Persuasion',                  penulis: 'Jane Austen',      harga: 65000, warna: '#3b6b6b' },
    { id: 8, judul: 'Great Expectations',          penulis: 'Charles Dickens',  harga: 95000, warna: '#3a3a3a' }
  ];

  let cart = [];

  const rp = n => 'Rp ' + n.toLocaleString('id-ID');

  // ===== KATALOG =====
  function tampilKatalog() {
    buku.forEach(b => {
      $('#katalog').append(`
        <article class="buku">
          <div class="sampul" style="background:${b.warna}"><span>${b.judul}</span></div>
          <h3>${b.judul}</h3>
          <p class="penulis">${b.penulis}</p>
          <p class="harga">${rp(b.harga)}</p>
          <button type="button" class="tambah" data-id="${b.id}">+ Keranjang</button>
        </article>`);
    });
  }

  // .hover() versi delegasi: kartu buku naik sedikit saat disorot
  $('#katalog').on('mouseenter mouseleave', '.buku', function () {
    $(this).toggleClass('naik');
  });

  // ===== HITUNG TOTAL + DISKON (Latihan 1) =====
  function hitung() {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const jumlah   = cart.reduce((sum, item) => sum + item.qty, 0);
    const diskon   = subtotal > 100000 ? subtotal * 0.1 : 0;   // diskon 10% jika > Rp 100.000
    return { subtotal, jumlah, diskon, total: subtotal - diskon };
  }

  // ===== TAMPILKAN KERANJANG =====
  function updateCartUI() {
    const $list = $('#cartList').empty();

    if (cart.length === 0) {
      $list.html('<li class="kosong">Keranjang masih kosong</li>');
    } else {
      cart.forEach(item => {
        $list.append(`
          <li>
            <div><strong>${item.judul}</strong><small>${rp(item.harga)}</small></div>
            <div class="qty">
              <button type="button" class="kecil minus" data-id="${item.id}">−</button>
              <span>${item.qty}</span>
              <button type="button" class="kecil plus" data-id="${item.id}">+</button>
              <button type="button" class="kecil hapus" data-id="${item.id}">✕</button>
            </div>
          </li>`);
      });
    }

    const h = hitung();
    let html = `<div class="baris"><span>Subtotal</span><span>${rp(h.subtotal)}</span></div>`;
    if (h.diskon > 0) {
      html += `<div class="baris diskon"><span>Diskon 10%</span><span>- ${rp(h.diskon)}</span></div>`;
    }
    html += `<div class="baris total"><span>Total</span><span>${rp(h.total)}</span></div>`;

    $('#cartTotal').html(html);
    $('#cartCount').text(h.jumlah);
    $('#btnCheckout').prop('disabled', cart.length === 0);
  }

  // ===== AKSI KERANJANG =====
  $('#katalog').on('click', '.tambah', function () {
    const id = $(this).data('id');
    const b = buku.find(x => x.id === id);
    const ada = cart.find(x => x.id === id);
    if (ada) { ada.qty++; }
    else { cart.push({ id: b.id, judul: b.judul, harga: b.harga, qty: 1 }); }
    updateCartUI();
  });

  $('#cartList').on('click', '.plus', function () {
    cart.find(x => x.id === $(this).data('id')).qty++;
    updateCartUI();
  });

  $('#cartList').on('click', '.minus', function () {
    const id = $(this).data('id');
    const item = cart.find(x => x.id === id);
    item.qty--;
    if (item.qty <= 0) { cart = cart.filter(x => x.id !== id); }
    updateCartUI();
  });

  $('#cartList').on('click', '.hapus', function () {
    const id = $(this).data('id');
    cart = cart.filter(x => x.id !== id);
    updateCartUI();
  });

  // ===== RIWAYAT DI localStorage (Latihan 2) =====
  function simpanRiwayat(total, qty) {
    const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
    riwayat.push({ tanggal: new Date().toISOString(), total, qty });
    localStorage.setItem('riwayat', JSON.stringify(riwayat));
  }

  function tampilRiwayat() {
    const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
    const $ul = $('#riwayatList').empty();

    if (riwayat.length === 0) {
      $ul.html('<li class="kosong">Belum ada pembelian</li>');
      $('#btnHapusRiwayat').hide();
      return;
    }
    $('#btnHapusRiwayat').show();
    riwayat.slice().reverse().forEach(r => {
      $ul.append(`
        <li>
          <span>${new Date(r.tanggal).toLocaleString('id-ID')}</span>
          <span>${r.qty} buku</span>
          <strong>${rp(r.total)}</strong>
        </li>`);
    });
  }

  $('#btnHapusRiwayat').click(function () {
    localStorage.removeItem('riwayat');
    tampilRiwayat();
  });

  // ===== MODAL FORM PEMBELI + VALIDASI (Latihan 3) =====
  const polaHP = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

  function tampilError(input, err, ok) {
    if (ok) { $(err).hide(); } else { $(err).show(); }
    $(input).toggleClass('salah', !ok);
    return ok;
  }
  const cekNama   = () => tampilError('#nama',   '#errNama',   $('#nama').val().trim().length >= 3);
  const cekAlamat = () => tampilError('#alamat', '#errAlamat', $('#alamat').val().trim().length >= 10);
  const cekHP     = () => tampilError('#hp',     '#errHp',     polaHP.test($('#hp').val().trim()));

  $('#nama').on('input', cekNama);
  $('#alamat').on('input', cekAlamat);
  $('#hp').on('input', cekHP);

  function bukaModal() {
    $('#formPembeli')[0].reset();
    $('#formPembeli .error').hide();
    $('#formPembeli input, #formPembeli textarea').removeClass('salah');
    $('#modalTotal').text(rp(hitung().total));
    $('#modal').fadeIn(200);
  }
  function tutupModal() { $('#modal').fadeOut(200); }

  $('#btnCheckout').click(function () {
    if (cart.length > 0) { bukaModal(); }
  });
  $('#btnBatal').click(tutupModal);
  $('#modal').click(function (e) { if (e.target === this) { tutupModal(); } });
  $(document).keydown(function (e) { if (e.key === 'Escape') { tutupModal(); } });

  $('#formPembeli').submit(function (e) {
    e.preventDefault();
    const a = cekNama(), b = cekAlamat(), c = cekHP();   // semua dicek supaya semua error tampil
    if (!(a && b && c)) { return; }

    const h = hitung();
    const nama = $('#nama').val().trim();

    simpanRiwayat(h.total, h.jumlah);
    cart = [];
    updateCartUI();
    tampilRiwayat();
    tutupModal();

    // .text() agar nama pembeli aman dari XSS
    $('#toast').text('✅ Terima kasih, ' + nama + '! Pesanan Anda sedang diproses.')
               .fadeIn().delay(3000).fadeOut();
  });

  // ===== JALANKAN SAAT HALAMAN DIBUKA =====
  tampilKatalog();
  updateCartUI();
  tampilRiwayat();

});