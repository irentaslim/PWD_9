/* ============================================================
   WARUNG ICE CREAM - JQUERY SCRIPT
   Praktikum Pemrograman Web Dasar
   Sudah termasuk:
   - Latihan 1: Diskon 10% jika total > Rp 100.000
   - Latihan 2: Simpan riwayat ke localStorage
   - Latihan 3: Modal form data pembeli + validasi
   ============================================================ */

$(document).ready(function () {

    /* =====================================================
       1. DATA PRODUK
       ===================================================== */
    const produkData = [
        { id: 1,  nama: 'Es Krim Cokelat',      harga: 15000, kategori: 'es-krim', icon: '🍫', desc: 'Cokelat premium lembut',        badge: 'Best Seller', badgeType: 'hot' },
        { id: 2,  nama: 'Es Krim Strawberry',   harga: 15000, kategori: 'es-krim', icon: '🍓', desc: 'Stroberi segar asli',           badge: 'Favorit',     badgeType: '' },
        { id: 3,  nama: 'Es Krim Vanilla',      harga: 13000, kategori: 'es-krim', icon: '🍦', desc: 'Vanilla klasik creamy',         badge: '',            badgeType: '' },
        { id: 4,  nama: 'Es Krim Mangga',       harga: 16000, kategori: 'es-krim', icon: '🥭', desc: 'Mangga manis tropis',           badge: 'Baru',        badgeType: '' },
        { id: 5,  nama: 'Sundae Cokelat',       harga: 25000, kategori: 'sundae',  icon: '🍨', desc: 'Sundae dengan topping cokelat', badge: 'Best Seller', badgeType: 'hot' },
        { id: 6,  nama: 'Sundae Keju',          harga: 27000, kategori: 'sundae',  icon: '🧀', desc: 'Sundae topping keju melimpah',  badge: '',            badgeType: '' },
        { id: 7,  nama: 'Sundae Buah',          harga: 28000, kategori: 'sundae',  icon: '🍧', desc: 'Sundae dengan buah segar',      badge: 'Favorit',     badgeType: '' },
        { id: 8,  nama: 'Milkshake Cokelat',    harga: 20000, kategori: 'minuman', icon: '🥤', desc: 'Milkshake cokelat dingin',      badge: '',            badgeType: '' },
        { id: 9,  nama: 'Milkshake Strawberry', harga: 20000, kategori: 'minuman', icon: '🥛', desc: 'Milkshake stroberi segar',      badge: 'Baru',        badgeType: '' },
        { id: 10, nama: 'Es Teh Manis',         harga: 8000,  kategori: 'minuman', icon: '🧊', desc: 'Es teh manis segar',            badge: '',            badgeType: '' },
        { id: 11, nama: 'Es Jeruk',             harga: 10000, kategori: 'minuman', icon: '🍊', desc: 'Es jeruk peras asli',           badge: '',            badgeType: '' },
        { id: 12, nama: 'Float Ice Cream',      harga: 22000, kategori: 'minuman', icon: '🍹', desc: 'Minuman soda dengan es krim',   badge: 'Best Seller', badgeType: 'hot' }
    ];

    /* =====================================================
       2. STATE (Variabel Global)
       ===================================================== */
    let cart = [];                // Array keranjang belanja
    let currentFilter = 'all';    // Filter kategori aktif
    let searchKeyword = '';       // Kata kunci pencarian

    // Pengaturan diskon (Latihan 1)
    const DISKON_MIN = 100000;    // batas minimal untuk dapat diskon
    const DISKON_PERSEN = 0.1;    // 10%

    /* =====================================================
       3. FUNGSI TOAST NOTIFICATION
       ===================================================== */
    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        $('#toastMsg').text(message);
        $('#toast').addClass('show');
        toastTimer = setTimeout(function () {
            $('#toast').removeClass('show');
        }, 2500);
    }

    /* =====================================================
       4. FUNGSI RENDER PRODUK
       ===================================================== */
    function renderProduk() {
        const $grid = $('#produkGrid');
        $grid.empty();

        // Filter data berdasarkan kategori & pencarian
        const filtered = produkData.filter(function (p) {
            const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
            const matchSearch =
                p.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                p.desc.toLowerCase().includes(searchKeyword.toLowerCase());
            return matchKategori && matchSearch;
        });

        // Jika tidak ada hasil
        if (filtered.length === 0) {
            $grid.html(`
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #bbb;">
                    <i class="fas fa-search" style="font-size: 3.5rem; color: #ffe4ec; margin-bottom: 20px; display: block;"></i>
                    <h3 style="color: #999; font-weight: 600; margin-bottom: 8px;">Produk tidak ditemukan</h3>
                    <p style="font-size: 0.9rem;">Coba kata kunci atau kategori lain</p>
                </div>
            `);
            return;
        }

        // Render setiap produk
        filtered.forEach(function (p) {
            const badgeHtml = p.badge
                ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>`
                : '';

            const card = `
                <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
                    ${badgeHtml}
                    <div class="produk-img">${p.icon}</div>
                    <div class="produk-info">
                        <h3>${p.nama}</h3>
                        <p class="desc">${p.desc}</p>
                        <div class="produk-footer">
                            <div class="produk-price">
                                Rp ${p.harga.toLocaleString('id-ID')}
                                <small>per porsi</small>
                            </div>
                            <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $grid.append(card);
        });
    }

    /* =====================================================
       5. EVENT: FILTER KATEGORI (Navbar)
       ===================================================== */
    $('.nav-link').click(function () {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');

        // Sync dengan tombol filter
        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');

        renderProduk();
    });

    /* =====================================================
       6. EVENT: FILTER KATEGORI (Tombol)
       ===================================================== */
    $('.filter-btn').click(function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('cat');

        // Sync dengan menu navbar
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');

        renderProduk();
    });

    /* =====================================================
       7. EVENT: PENCARIAN REAL-TIME
       ===================================================== */
    $('#searchProduk').on('input', function () {
        searchKeyword = $(this).val();
        renderProduk();
    });

    /* =====================================================
       8. EVENT: TAMBAH KE KERANJANG
       ===================================================== */
    $(document).on('click', '.btn-add-cart', function (e) {
        e.stopPropagation();

        const id = $(this).data('id');
        const produk = produkData.find(p => p.id === id);
        if (!produk) return;

        // Cek apakah produk sudah ada di keranjang
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: produk.id,
                nama: produk.nama,
                harga: produk.harga,
                icon: produk.icon,
                qty: 1
            });
        }

        updateCartUI();
        showToast(`${produk.icon} ${produk.nama} ditambahkan!`);

        // Animasi tombol
        const $tombol = $(this);
        $tombol.css('transform', 'rotate(90deg) scale(1.3)');
        setTimeout(() => $tombol.css('transform', ''), 300);

        // Animasi badge
        $('#cartBadge').css('transform', 'scale(1.4)');
        setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
    });

    /* =====================================================
       9. HITUNG TOTAL + DISKON (Latihan 1)
       ===================================================== */
    function hitungTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        const diskon = subtotal > DISKON_MIN ? subtotal * DISKON_PERSEN : 0;
        return { subtotal, diskon, total: subtotal - diskon };
    }

    /* =====================================================
       10. FUNGSI UPDATE UI KERANJANG
       ===================================================== */
    function updateCartUI() {
        const $cartItems = $('#cartItems');
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const { subtotal, diskon, total } = hitungTotal();

        // Update badge keranjang
        $('#cartBadge').text(totalQty);

        // Update total harga (dengan diskon jika berlaku)
        if (diskon > 0) {
            $('#cartTotal').html(`
                <small style="display:block;text-decoration:line-through;color:#999;font-size:0.75rem;font-weight:400;">
                    Rp ${subtotal.toLocaleString('id-ID')}
                </small>
                Rp ${total.toLocaleString('id-ID')}
                <small style="display:block;color:#2ecc71;font-size:0.7rem;font-weight:600;">Diskon 10%</small>
            `);
        } else {
            $('#cartTotal').text('Rp ' + total.toLocaleString('id-ID'));
        }

        // Jika kosong
        if (cart.length === 0) {
            $cartItems.html(`
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang masih kosong</p>
                    <small>Yuk pilih es krim dulu!</small>
                </div>
            `);
            return;
        }

        // Render item keranjang
        let html = '';
        cart.forEach(function (item) {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-icon">${item.icon}</div>
                    <div class="cart-item-info">
                        <h5>${item.nama}</h5>
                        <div class="price">Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</div>
                        <div class="qty-control">
                            <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        $cartItems.html(html);
    }

    /* =====================================================
       11. EVENT: KONTROL QTY (Plus/Minus)
       ===================================================== */
    $(document).on('click', '.qty-btn', function () {
        const action = $(this).data('action');
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (action === 'plus') {
            item.qty += 1;
        } else if (action === 'minus') {
            item.qty -= 1;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        updateCartUI();
    });

    /* =====================================================
       12. EVENT: HAPUS ITEM DARI KERANJANG
       ===================================================== */
    $(document).on('click', '.cart-item-remove', function () {
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (item) {
            showToast(`${item.icon} ${item.nama} dihapus dari keranjang`);
        }
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    });

    /* =====================================================
       13. EVENT: BUKA/TUTUP KERANJANG
       ===================================================== */
    $('#cartBtn').click(function () {
        $('#cartSidebar').addClass('open');
        $('#cartOverlay').fadeIn(300);
    });

    $('#cartClose, #cartOverlay').click(function () {
        $('#cartSidebar').removeClass('open');
        $('#cartOverlay').fadeOut(300);
    });

    /* =====================================================
       14. RIWAYAT PEMBELIAN - localStorage (Latihan 2)
       ===================================================== */
    function simpanRiwayat(total, qty, pembeli) {
        const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
        riwayat.push({
            tanggal: new Date().toISOString(),
            total,
            qty,
            pembeli   // { nama, alamat, hp }
        });
        localStorage.setItem('riwayat', JSON.stringify(riwayat));
    }

    /* =====================================================
       15. VALIDASI FORM PEMBELI (Latihan 3)
       ===================================================== */
    function setError($input, pesan) {
        $input.addClass('invalid');
        $input.next('.error-msg').text(pesan);
    }

    function clearError($input) {
        $input.removeClass('invalid');
        $input.next('.error-msg').text('');
    }

    function validasiForm() {
        let valid = true;

        const $nama = $('#inputNama');
        const $alamat = $('#inputAlamat');
        const $hp = $('#inputHp');

        const nama = $nama.val().trim();
        const alamat = $alamat.val().trim();
        const hp = $hp.val().replace(/[\s-]/g, '');   // buang spasi & tanda strip

        // Nama
        if (nama === '') {
            setError($nama, 'Nama wajib diisi'); valid = false;
        } else if (nama.length < 3) {
            setError($nama, 'Nama minimal 3 karakter'); valid = false;
        } else if (!/^[A-Za-z\s.'-]+$/.test(nama)) {
            setError($nama, 'Nama hanya boleh berisi huruf'); valid = false;
        } else {
            clearError($nama);
        }

        // Alamat
        if (alamat === '') {
            setError($alamat, 'Alamat wajib diisi'); valid = false;
        } else if (alamat.length < 10) {
            setError($alamat, 'Alamat terlalu pendek (minimal 10 karakter)'); valid = false;
        } else {
            clearError($alamat);
        }

        // No HP (format Indonesia: 08xx / +628xx / 628xx)
        if (hp === '') {
            setError($hp, 'No. HP wajib diisi'); valid = false;
        } else if (!/^(\+62|62|0)8[0-9]{8,11}$/.test(hp)) {
            setError($hp, 'Format tidak valid, contoh: 081234567890'); valid = false;
        } else {
            clearError($hp);
        }

        return valid ? { nama, alamat, hp } : null;
    }

    /* =====================================================
       16. CHECKOUT + MODAL FORM (Latihan 3)
       ===================================================== */
    function tutupModal() {
        $('#modalOverlay').removeClass('show');
    }

    // Klik "Checkout Sekarang" → buka modal
    $('#btnCheckout').click(function () {
        if (cart.length === 0) {
            showToast('❌ Keranjang masih kosong!');
            return;
        }
        $('#modalTotal').text('Rp ' + hitungTotal().total.toLocaleString('id-ID'));
        $('#modalOverlay').addClass('show');
    });

    // Tutup modal
    $('#modalClose').click(tutupModal);
    $('#modalOverlay').click(function (e) {
        if (e.target === this) tutupModal();   // klik area gelap di luar kotak
    });

    // Hapus pesan error saat user mulai mengetik ulang
    $('#formPembeli input, #formPembeli textarea').on('input', function () {
        clearError($(this));
    });

    // Submit form
    $('#formPembeli').on('submit', function (e) {
        e.preventDefault();

        const pembeli = validasiForm();
        if (!pembeli) return;   // ada yang salah → berhenti

        const { total } = hitungTotal();
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

        // Animasi loading
        const $btn = $('#btnKonfirmasi');
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

        setTimeout(function () {
            $btn.html('<i class="fas fa-check-circle"></i> Konfirmasi Pesanan').prop('disabled', false);

            // Simpan riwayat (Latihan 2)
            simpanRiwayat(total, totalQty, pembeli);

            // Reset keranjang & form
            cart = [];
            updateCartUI();
            $('#formPembeli')[0].reset();

            // Tutup modal & sidebar
            tutupModal();
            $('#cartSidebar').removeClass('open');
            $('#cartOverlay').fadeOut(300);

            showToast(`✅ Terima kasih, ${pembeli.nama}! ${totalQty} item · Rp ${total.toLocaleString('id-ID')}`);
        }, 1500);
    });

    /* =====================================================
       17. EVENT: HAMBURGER MENU (Mobile)
       ===================================================== */
    $('#hamburger').click(function () {
        $('#navMenu').toggleClass('show');
        const icon = $(this).find('i');
        if ($('#navMenu').hasClass('show')) {
            icon.removeClass('fa-bars').addClass('fa-times');
        } else {
            icon.removeClass('fa-times').addClass('fa-bars');
        }
    });

    // Tutup menu saat link diklik (mobile)
    $('.nav-link').click(function () {
        if (window.innerWidth <= 768) {
            $('#navMenu').removeClass('show');
            $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
        }
    });

    /* =====================================================
       18. INISIALISASI APLIKASI
       ===================================================== */
    renderProduk();
    updateCartUI();

    // Log ke console
    console.log('%c🍦 Warung Ice Cream - Siap!', 'color:#ff6b9d;font-size:16px;font-weight:bold;');
    console.log('%cTotal produk: ' + produkData.length, 'color:#2d1b3d;font-size:12px;');
});