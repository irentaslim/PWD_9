// Matikan animasi jika sistem pengguna meminta reduced motion
jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {

    // ----- Toast (dipakai di beberapa tempat) -----
    function tampilkanToast(pesan, tipe) {
        $('#toast')
            .stop(true, true)
            .removeClass('success error')
            .addClass(tipe)
            .text(pesan)
            .fadeIn(250)
            .delay(2500)
            .fadeOut(400);
    }

    // ----- 0. HERO MASUK (fadeIn + animate) -----
    $('.hero-teks').hide().fadeIn(700);
    $('.hero-shoe')
        .css({ opacity: 0, left: '80px' })
        .animate({ opacity: 1, left: '0px' }, 800);

    // ----- 1. DROPDOWN NAVBAR (mouseenter/mouseleave, slideDown/slideUp) -----
    $('.dropdown')
        .on('mouseenter', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideDown(200);
        })
        .on('mouseleave', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideUp(200);
        });

    // ----- 2. TAB KOLEKSI (click, fadeOut + animate tinggi + fadeIn) -----
    $('.tab-panel').hide().first().show();

    function gantiTab(target) {
        const $tab = $('.tab[data-target="' + target + '"]');
        if ($tab.hasClass('active')) return;

        const $wadah = $('#tab-wrapper');
        const $lama = $('.tab-panel:visible');
        const $baru = $(target);

        $('.tab').removeClass('active');
        $tab.addClass('active');

        // kunci tinggi supaya konten di bawah tidak melompat
        $wadah.stop(true, true).css({ height: $wadah.height(), overflow: 'hidden' });

        $lama.stop(true, true).fadeOut(150, function () {
            const tinggiBaru = $baru.show().outerHeight(true);
            $baru.hide();

            $wadah.animate({ height: tinggiBaru }, 250, function () {
                $wadah.css({ height: 'auto', overflow: 'visible' });
            });
            $baru.fadeIn(250);
        });
    }

    $('.tab').on('click', function () {
        gantiTab($(this).data('target'));
    });

    // Menu dropdown "Koleksi" ikut membuka tab yang sesuai
    $('.dropdown-menu a').on('click', function () {
        gantiTab($(this).data('tab'));
    });

    // ----- 3. KARTU PRODUK (mouseenter/mouseleave, animate) -----
    $('.produk-card')
        .on('mouseenter', function () {
            $(this).stop().animate({ top: '-6px' }, 150);
        })
        .on('mouseleave', function () {
            $(this).stop().animate({ top: '0px' }, 150);
        });

    // ----- 4. KERANJANG (click, animate badge + toast) -----
    let jumlahKeranjang = 0;
    const $badge = $('#cartCount');

    function tambahKeranjang(nama) {
        jumlahKeranjang++;
        $badge.text(jumlahKeranjang)
            .stop(true, true)
            .animate({ top: '-6px' }, 100)
            .animate({ top: '0px' }, 100);
        tampilkanToast(nama + ' ditambahkan ke keranjang.', 'success');
    }

    $('.btn-beli').on('click', function () {
        tambahKeranjang($(this).closest('.produk-card').data('nama'));
    });

    $('.cart-btn').on('click', function () {
        if (jumlahKeranjang === 0) {
            tampilkanToast('Keranjang masih kosong.', 'error');
        } else {
            tampilkanToast('Ada ' + jumlahKeranjang + ' sepatu di keranjang Anda.', 'success');
        }
    });

    // ----- 5. MODAL DETAIL PRODUK (click, fadeIn/fadeOut) -----
    let produkAktif = '';

    function bukaModal($kartu) {
        produkAktif = $kartu.data('nama');
        $('#modalNama').text(produkAktif);
        $('#modalDesc').text($kartu.data('desc'));
        $('#modalHarga').text($kartu.data('harga'));
        $('#modalFoto').css('color', $kartu.data('warna'));
        $('#modalFoto use').attr('href', '#' + $kartu.data('shoe'));
        $('#modal').stop(true, true).fadeIn(250);
    }

    function tutupModal() {
        $('#modal').stop(true, true).fadeOut(200);
    }

    $('.btn-detail').on('click', function () {
        bukaModal($(this).closest('.produk-card'));
    });

    $('.modal-tutup').on('click', tutupModal);

    $('#modal').on('click', function (e) {
        if (e.target === this) tutupModal(); // klik area gelap
    });

    $(document).on('keyup', function (e) {
        if (e.key === 'Escape') tutupModal();
    });

    $('#modalBeli').on('click', function () {
        tambahKeranjang(produkAktif);
        tutupModal();
    });

    // ----- 6. FORM PESAN CEPAT (focus/blur, slideDown/slideUp, toast) -----
    $('#formPesan .field')
        .on('focus', function () {
            $(this).removeClass('is-error');
            $(this).siblings('.hint').stop(true, true).slideDown(150);
        })
        .on('blur', function () {
            $(this).siblings('.hint').stop(true, true).slideUp(150);
            $(this).toggleClass('is-error', $(this).val().trim() === '');
        });

    $('#formPesan').on('submit', function (e) {
        e.preventDefault();
        const nama = $('#nama').val().trim();
        const sepatu = $('#pilihSepatu').val();

        if (nama === '' || sepatu === '') {
            $('.wajib').each(function () {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            });
            tampilkanToast('Lengkapi nama dan pilihan sepatu terlebih dahulu.', 'error');
            return;
        }

        tampilkanToast('Pesanan ' + sepatu + ' atas nama ' + nama + ' berhasil dikirim.', 'success');
        this.reset();
    });

    // ----- 7. BACK TO TOP (scroll, fadeIn/fadeOut, animate) -----
    const $btnTop = $('#backToTop');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $btnTop.fadeIn(200);
        } else {
            $btnTop.fadeOut(200);
        }
    });
    $btnTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // ----- 8. JQUERY VALIDATION PLUGIN + CUSTOM METHOD -----
    $.validator.addMethod('nomorHp', function (value, element) {
        return this.optional(element) || /^[0-9]{10,12}$/.test(value);
    }, 'Nomor HP harus 10-12 digit angka');

    $.validator.addMethod('hurufAngka', function (value, element) {
        return this.optional(element) || (/[A-Za-z]/.test(value) && /[0-9]/.test(value));
    }, 'Password harus mengandung huruf dan angka');

    const validator = $('#formMember').validate({
        rules: {
            nama: { required: true, minlength: 3 },
            email: { required: true, email: true },
            hp: { required: true, nomorHp: true },
            ukuran: { required: true, digits: true, min: 25, max: 47 },
            password: { required: true, minlength: 8, hurufAngka: true },
            konfirmasi: { required: true, equalTo: '#mPassword' }
        },
        messages: {
            nama: { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email: { required: 'Email wajib diisi', email: 'Format email tidak valid' },
            hp: { required: 'Nomor HP wajib diisi' },
            ukuran: {
                required: 'Ukuran sepatu wajib diisi',
                digits: 'Ukuran harus berupa angka',
                min: 'Ukuran minimal 25',
                max: 'Ukuran maksimal 47'
            },
            password: { required: 'Password wajib diisi', minlength: 'Password minimal 8 karakter' },
            konfirmasi: { required: 'Konfirmasi password wajib diisi', equalTo: 'Password konfirmasi tidak sama' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        highlight: function (el) {
            $(el).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (el) {
            $(el).removeClass('is-error').addClass('is-valid');
        },
        submitHandler: function (form) {
            const nama = $('#mNama').val().trim();
            tampilkanToast('Selamat datang, ' + nama + '. Akun member berhasil dibuat.', 'success');
            $('#sukses').stop(true, true).slideDown(300).delay(3000).slideUp(300);

            
            form.reset();
            validator.resetForm();
            $('#formMember input').removeClass('is-error is-valid');
        }
    });

    // ----- 9. SMOOTH SCROLL NAVBAR -----
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (href.length < 2) return;
        const $tujuan = $(href);
        if ($tujuan.length === 0) return;
        e.preventDefault();
        $('html, body').animate({ scrollTop: $tujuan.offset().top - 60 }, 500);
    });
});