$(document).ready(function () {

  /* 1. DATA PRODUK */
  const produkData = [
    { id: 1,  nama: 'Pisang Cavendish',   harga: 20000, kategori: 'lokal', icon: '🍌', desc: 'Manis dan lembut, per sisir', badge: 'Best Seller', badgeType: 'hot' },
    { id: 2,  nama: 'Mangga Harum Manis', harga: 30000, kategori: 'lokal', icon: '🥭', desc: 'Mangga manis per kg', badge: 'Favorit', badgeType: '' },
    { id: 3,  nama: 'Semangka Merah',     harga: 15000, kategori: 'lokal', icon: '🍉', desc: 'Segar dan berair per kg', badge: '', badgeType: '' },
    { id: 4,  nama: 'Nanas Madu',         harga: 12000, kategori: 'lokal', icon: '🍍', desc: 'Nanas manis tanpa gatal', badge: 'Baru', badgeType: '' },
    { id: 5,  nama: 'Apel Fuji',          harga: 35000, kategori: 'impor', icon: '🍎', desc: 'Apel renyah per kg', badge: 'Best Seller', badgeType: 'hot' },
    { id: 6,  nama: 'Anggur Ungu',        harga: 60000, kategori: 'impor', icon: '🍇', desc: 'Anggur ungu tanpa biji per kg', badge: 'Favorit', badgeType: '' },
    { id: 7,  nama: 'Strawberry',         harga: 45000, kategori: 'impor', icon: '🍓', desc: 'Stroberi segar per kg', badge: '', badgeType: '' },
    { id: 8,  nama: 'Kiwi Hijau',         harga: 50000, kategori: 'impor', icon: '🥝', desc: 'Kiwi asam manis per kg', badge: 'Baru', badgeType: '' },
    { id: 9,  nama: 'Jus Alpukat',        harga: 18000, kategori: 'jus',   icon: '🥑', desc: 'Jus alpukat dengan cokelat', badge: 'Best Seller', badgeType: 'hot' },
    { id: 10, nama: 'Jus Jeruk',          harga: 12000, kategori: 'jus',   icon: '🍊', desc: 'Jeruk peras asli', badge: '', badgeType: '' },
    { id: 11, nama: 'Jus Mangga',         harga: 15000, kategori: 'jus',   icon: '🥤', desc: 'Jus mangga dingin', badge: '', badgeType: '' },
    { id: 12, nama: 'Jus Melon',          harga: 14000, kategori: 'jus',   icon: '🍈', desc: 'Jus melon segar', badge: 'Baru', badgeType: '' }
  ];

  /* 2. STATE */
  let cart = [];
  let currentFilter = 'all';
  let searchKeyword = '';
  const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

  /* 3. RENDER PRODUK */
  function renderProduk() {
    const $grid = $('#produkGrid').empty();
    const kw = searchKeyword.toLowerCase();
    const filtered = produkData.filter(function (p) {
      const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
      const matchSearch = p.nama.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw);
      return matchKategori && matchSearch;
    });

    if (filtered.length === 0) {
      $grid.html(`
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#999;">
          <i class="fas fa-search" style="font-size:3.5rem;color:#e8d5f2;margin-bottom:20px;display:block;"></i>
          <h3>Produk tidak ditemukan</h3>
          <p style="font-size:0.9rem;">Coba kata kunci atau kategori lain</p>
        </div>`);
      return;
    }

    filtered.forEach(function (p) {
      const badgeHtml = p.badge ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>` : '';
      $grid.append(`
        <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
          ${badgeHtml}
          <div class="produk-img">${p.icon}</div>
          <div class="produk-info">
            <h3>${p.nama}</h3>
            <p class="desc">${p.desc}</p>
            <div class="produk-footer">
              <div class="produk-price">${rupiah(p.harga)}<small>per satuan</small></div>
              <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>`);
    });
  }

  /* 4 & 5. FILTER */
  function setFilter(kategori) {
    currentFilter = kategori;
    $('.nav-link, .filter-btn').removeClass('active');
    $(`.nav-link[data-filter="${kategori}"]`).addClass('active');
    $(`.filter-btn[data-cat="${kategori}"]`).addClass('active');
    renderProduk();
  }
  $('.nav-link').click(function () { setFilter($(this).data('filter')); });
  $('.filter-btn').click(function () { setFilter($(this).data('cat')); });

  /* 6. PENCARIAN */
  $('#searchProduk').on('input', function () {
    searchKeyword = $(this).val();
    renderProduk();
  });

  /* 7. TAMBAH KE KERANJANG */
  $(document).on('click', '.btn-add-cart', function (e) {
    e.stopPropagation();
    const id = $(this).data('id');
    const produk = produkData.find(p => p.id === id);
    if (!produk) return;
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty += 1; }
    else { cart.push({ id: produk.id, nama: produk.nama, harga: produk.harga, icon: produk.icon, qty: 1 }); }
    updateCartUI();
    showToast(`${produk.icon} ${produk.nama} ditambahkan!`);
    $('#cartBadge').css('transform', 'scale(1.4)');
    setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
  });

  /* LATIHAN 1: DISKON 10% JIKA TOTAL > Rp 100.000 */
  function hitungTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const diskon = subtotal > 100000 ? subtotal * 0.1 : 0;
    return { subtotal: subtotal, diskon: diskon, total: subtotal - diskon };
  }

  /* 8. UPDATE UI KERANJANG */
  function updateCartUI() {
    const $cartItems = $('#cartItems');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const hasil = hitungTotal();

    $('#cartBadge').text(totalQty);

    if (hasil.diskon > 0) {
      $('#cartTotal').html(`
        <span class="coret">${rupiah(hasil.subtotal)}</span>
        ${rupiah(hasil.total)}
        <span class="hemat">Diskon 10% · hemat ${rupiah(hasil.diskon)}</span>`);
    } else {
      $('#cartTotal').text(rupiah(hasil.total));
    }

    if (cart.length === 0) {
      $cartItems.html(`
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang masih kosong</p>
          <small>Yuk pilih buah dulu!</small>
        </div>`);
      return;
    }

    let html = '';
    cart.forEach(function (item) {
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-icon">${item.icon}</div>
          <div class="cart-item-info">
            <h5>${item.nama}</h5>
            <div class="price">${rupiah(item.harga * item.qty)}</div>
            <div class="qty-control">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>`;
    });
    $cartItems.html(html);
  }

  /* 9. QTY */
  $(document).on('click', '.qty-btn', function () {
    const action = $(this).data('action');
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (action === 'plus') { item.qty += 1; }
    else {
      item.qty -= 1;
      if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
  });

  /* 10. HAPUS ITEM */
  $(document).on('click', '.cart-item-remove', function () {
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (item) showToast(`${item.icon} ${item.nama} dihapus dari keranjang`);
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
  });

  /* 11. BUKA/TUTUP KERANJANG */
  $('#cartBtn').click(function () {
    $('#cartSidebar').addClass('open');
    $('#cartOverlay').fadeIn(300);
  });
  function tutupCart() {
    $('#cartSidebar').removeClass('open');
    $('#cartOverlay').fadeOut(300);
  }
  $('#cartClose, #cartOverlay').click(tutupCart);

  /* LATIHAN 2: SIMPAN RIWAYAT KE localStorage */
  function simpanRiwayat(total, qty, pembeli) {
    const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
    riwayat.push({ tanggal: new Date().toISOString(), total: total, qty: qty, pembeli: pembeli });
    localStorage.setItem('riwayat', JSON.stringify(riwayat));
  }

  /* 12. CHECKOUT -> MODAL FORM (LATIHAN 3) */
  $('#btnCheckout').click(function () {
    if (cart.length === 0) { showToast('❌ Keranjang masih kosong!'); return; }
    $('#modalOverlay').css('display', 'flex').hide().fadeIn(250);
  });
  function tutupModal() { $('#modalOverlay').fadeOut(200); }
  $('#modalClose').click(tutupModal);
  $('#modalOverlay').click(function (e) { if (e.target === this) tutupModal(); });

  /* LATIHAN 3: VALIDASI */
  function setError(inputId, errId, pesan) {
    $('#' + errId).text(pesan);
    $('#' + inputId).toggleClass('invalid', pesan !== '');
    return pesan === '';
  }
  function validasiForm() {
    const nama = $('#nama').val().trim();
    const alamat = $('#alamat').val().trim();
    const hp = $('#hp').val().trim();

    const okNama = setError('nama', 'errNama',
      nama === '' ? 'Nama wajib diisi' :
      nama.length < 3 ? 'Nama minimal 3 karakter' :
      !/^[a-zA-Z\s.']+$/.test(nama) ? 'Nama hanya boleh berisi huruf' : '');
    const okAlamat = setError('alamat', 'errAlamat',
      alamat === '' ? 'Alamat wajib diisi' :
      alamat.length < 10 ? 'Alamat minimal 10 karakter' : '');
    const okHp = setError('hp', 'errHp',
      hp === '' ? 'No. HP wajib diisi' :
      !/^(08|\+628|628)\d{7,11}$/.test(hp) ? 'Format HP tidak valid (contoh: 081234567890)' : '');

    return okNama && okAlamat && okHp;
  }
  $('#nama, #alamat, #hp').on('input', function () {
    $(this).removeClass('invalid').next('.error').text('');
  });

  $('#formPembeli').on('submit', function (e) {
    e.preventDefault();
    if (!validasiForm()) return;

    const pembeli = { nama: $('#nama').val().trim(), alamat: $('#alamat').val().trim(), hp: $('#hp').val().trim() };
    const hasil = hitungTotal();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    const $btn = $('#btnKonfirmasi');
    $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

    setTimeout(function () {
      $btn.html('<i class="fas fa-check-circle"></i> Konfirmasi Pesanan').prop('disabled', false);
      simpanRiwayat(hasil.total, totalQty, pembeli);
      cart = [];
      updateCartUI();
      $('#formPembeli')[0].reset();
      tutupModal();
      tutupCart();
      showToast(`✅ Terima kasih ${pembeli.nama}! ${totalQty} item · ${rupiah(hasil.total)}`);
    }, 1500);
  });

  /* 13. TOAST */
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toastMsg').text(message);
    $('#toast').addClass('show');
    toastTimer = setTimeout(() => $('#toast').removeClass('show'), 2800);
  }

  /* 14. HAMBURGER */
  $('#hamburger').click(function () {
    $('#navMenu').toggleClass('show');
    $(this).find('i').toggleClass('fa-bars fa-times');
  });
  $('.nav-link').click(function () {
    if (window.innerWidth <= 768) {
      $('#navMenu').removeClass('show');
      $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
    }
  });

  /* 15. INISIALISASI */
  renderProduk();
  updateCartUI();
  console.log('%c🍇 Warung Buah - Siap!', 'color:#8e44ad;font-size:16px;font-weight:bold;');
});