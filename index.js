import { APP_CONFIG } from './config.js';
const endpoint = `${APP_CONFIG.API_URL}`; 

function initAplikasi() {
//if(localStorage.getItem("admin_is_logged") === "true") { pemicuBukaPortalAdminDashboard(); }
document.getElementById("admin").addEventListener("click", function(e) { e.preventDefault(); 
pemicuBukaPortalAdminLogin(); 
});
					
const loginContainer = document.getElementById("loginContainer");
function periksaSesiLogin() {
            const namaDokter = localStorage.getItem("idi_nama_dokter");
            const isLogin = localStorage.getItem("idi_is_logged_in");
			const idUser = localStorage.getItem("idi_id_user");
            if (isLogin === "true" && namaDokter) {
                loginContainer.innerHTML = `
                    <div class="dropdown">
                            <div class="profile-avatar-container dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="cursor:pointer">
                                <img src="https://lh3.googleusercontent.com/d/138_TC12u5QkNRHo6Za2hDMzihwPl51AT?authuser=1/view" class="profile-avatar" alt="Foto Profil" style="width:35px;height:35px;border-radius:50%" id="navBarAvatarImage"> <span style="color:#ffffff">Akun Saya</span>
                                
                            </div>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li><div class="dropdown-header fw-bold text-warning">${namaDokter}</div></li>
                                <li><a class="dropdown-item" href="#" id="linkMenuProfil"><i class="bi bi-person-bounding-box me-2"></i>Profil Saya</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" id="btnLogOutAction"><i class="bi bi-box-arrow-right me-2"></i>Keluar</a></li>
                            </ul>
                        </div>
                `;
				document.getElementById("linkMenuProfil").addEventListener("click", function(e) {
                        e.preventDefault();
                        bukaModalFullscreenProfil(namaDokter);
                    });
				document.getElementById("btnLogOutAction").addEventListener("click", prosesLogout);
				
				if (idUser) {
            const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
            
            fetch(`${cleanEndpoint}/proses.php?aksi=get_avatar_navigasi&id_user=${idUser}`)
            .then(res => res.json())
            .then(res => {
                if (res.status === "success" && res.fotoprofil) {
                    const avatarImageEl = document.getElementById("navBarAvatarImage");
                    if (avatarImageEl) {
                        // Perbarui sumber gambar menjadi ID file Google Drive milik dokter terkait
                        avatarImageEl.src = "https://lh3.googleusercontent.com/d/" + res.fotoprofil;
                    }
                }
            })
            .catch(err => console.error("Gagal memperbarui avatar navigasi dari database:", err));
        }
            } else {
                loginContainer.innerHTML = `
                    <button class="btn btn-outline-light d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                        <i class="bi bi-person-circle"></i> Login Anggota
                    </button>
                `;
            }
        }

/**
 * ðŸ”’ MODUL AUTENTIKASI: SYSTEM LOGOUT MULTI-STAGE AUTOMATOR
 * PROSES: Hancurkan \$_SESSION di Server PHP â†’ Bersihkan LocalStorage â†’ Cek Sesi
 */
function prosesLogout(e) { 
    if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // 1. ðŸ”¥ JALANKAN PENGHANCURAN SESSION SERVER: Tembak proses.php di latar belakang via POST
    fetch(`${cleanEndpoint}/proses.php?aksi=eksekusi_logout_total_server`, {
        method: "POST"
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error dari server: " + res.status);
        return res.json();
    })
    .then(data => {
       let konfirm=confirm('Apakah Anda yakin ingin LogOut');
        if(konfirm)
{
        localStorage.removeItem("idi_nama_dokter");
        localStorage.removeItem("idi_is_logged_in"); 
        localStorage.removeItem("admin_review_mode");
        localStorage.removeItem("idi_user_whatsapp");
        localStorage.removeItem("idi_id_user");
        window.location.reload();
}
    })
    .catch(err => {
        console.error("Gagal sinkronisasi logout ke server:", err);
        
        // Fallback Keamanan: Jika internet putus, tetap paksa logout di sisi browser agar aman
        localStorage.removeItem("idi_nama_dokter");
        localStorage.removeItem("idi_is_logged_in"); 
        localStorage.removeItem("admin_review_mode");
        localStorage.removeItem("idi_user_whatsapp");
        localStorage.removeItem("idi_id_user");

        window.location.reload();
    });
}

		

function togglePasswordVisibility(fieldId, btnElement) {
            const inputField = document.getElementById(fieldId);
            const iconElement = btnElement.querySelector('i');
            inputField.type = inputField.type === "password" ? "text" : "password";
            iconElement.classList.toggle('bi-eye');
            iconElement.classList.toggle('bi-eye-slash');
        }

function muatDataHeadlineMasonry() {
    const container = document.getElementById('masonryContainer') || document.getElementById('masonryInfoContainer');
    if(localStorage.getItem("admin_is_logged") === "true") {
         document.getElementById('icon_admin').style.display='none';
    }
    if (container) {
        container.innerHTML = "";
    }

    // Bersihkan garis miring (slash) ganda di ujung URL endpoint secara otomatis
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    // Menarik data headline langsung dari server PHP proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_headline`)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(res => {
        if (res.status === 'success') {
            const daftarInfo = res.data; // Mengambil array data berita dari MySQL
            window.globalHeadlineWebsiteCache = daftarInfo; 
            // Menggunakan for-loop tradisional sesuai permintaan struktur
            for (let i = 0; i < daftarInfo.length; i++) {
                const info = daftarInfo[i];
                
                // 1. Definisikan variasi badge warna berdasarkan kategori berita
                let badgeClass = "bg-secondary";
                if (info.kategori === "Informasi") badgeClass = "bg-danger";
                if (info.kategori === "Podcast") badgeClass = "bg-warning text-dark";
                if (info.kategori === "Youtube") badgeClass = "bg-primary";
                if (info.kategori === "Sosial Media") badgeClass = "bg-success";

                // 2. PARSING ENGINE: Mengevaluasi template HTML mentah dari MySQL agar sinkron dengan variabel JS
                let cardHTML = "";
                try {
                    const parserTpl = new Function('info', 'badgeClass', `return \`${info.template}\`;`);
                    cardHTML = parserTpl(info, badgeClass);
                    
                } catch (parseError) {
                    console.error("Gagal melakukan parsing template database pada ID ke-" + i, parseError);
                    
                    cardHTML = `
                        <div class="masonry-item">
                            <div class="card border-danger border shadow-sm p-3">
                                <h6 class="text-danger fw-bold"><i class="bi bi-exclamation-octagon me-1"></i> Gagal Memuat Template DB</h6>
                                <p class="small text-muted mb-0">Terjadi kesalahan pemetaan variabel pada judul: <b>${info.judul}</b></p>
                            </div>
                        </div>
                    `;
                }
                
                // 3. Masukkan elemen kartu hasil pemrosesan template ke dalam container masonry
                container.innerHTML += cardHTML;
            }

           
            setTimeout(function() {              
                    muatSatuFotoAcakHeadlineDrive();    
                    					
            }, 1000);

        } else {
            console.error("Gagal memuat data dari database:", res.message);
        }
    })
    .catch(error => {
        console.error("Detail Error Jaringan / AJAX:", error);
    });
}

function pemicuBukaPortalAdminLogin() {
const myModal = new bootstrap.Modal(document.getElementById('generalFullscreenModal'));
    myModal.show();
const titleElement = document.getElementById("generalModalTitle");
const bodyElement = document.getElementById("generalModalBody");

const adminlogin=`<div class="row justify-content-center py-4">
    <div class="col-md-7 col-lg-5">
        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-dark text-white text-center py-3 rounded-top-4">
                <h5 class="fw-bold mb-0"><i class="bi bi-shield-lock-fill me-2"></i>Portal Login Administrator</h5>
                <small class="text-white-50">Ikatan Dokter Indonesia Cabang Batam</small>
            </div>
            <div class="card-body p-4">
                <div id="adminAlertContainer"></div>
                
                <form id="formLoginAdminMySQL">
                    <!-- Input WhatsApp -->
                    <div class="mb-3">
                        <label for="admWA" class="form-label fw-semibold text-secondary">Nomor WhatsApp Admin</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted"><i class="bi bi-whatsapp"></i></span>
                            <input type="tel" class="form-control" id="admWA" placeholder="08110000000" required>
                        </div>
                    </div>
                    
                    <!-- Input Password -->
                    <div class="mb-4">
                        <label for="admPassword" class="form-label fw-semibold text-secondary">Kata Sandi</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted"><i class="bi bi-key"></i></span>
                            <input type="password" class="form-control" id="admPassword" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-dark w-100 py-2 fw-bold shadow-sm">
                        <i class="bi bi-box-arrow-in-right me-1"></i> Masuk Ke Dasbor Admin
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>`;
titleElement.innerHTML = `<i class="bi bi-shield-lock me-2"></i>Akses Administrator`;
bodyElement.innerHTML = adminlogin;

        const formAdmin = document.getElementById("formLoginAdminMySQL");
        const alertContainer = document.getElementById("adminAlertContainer");

        formAdmin.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const formPayload = new FormData();
            formPayload.append("adm_wa", document.getElementById("admWA").value.trim());
            formPayload.append("adm_password", document.getElementById("admPassword").value);

            fetch(endpoint+"admin_login.php?aksi=proses_login_admin", {
                method: "POST",
                body: formPayload
            })
            .then(res => res.json())
            .then(data => {
				alert(data.status);
                if(data.status === "success") {
                    alertContainer.innerHTML = "";
                    localStorage.setItem("admin_is_logged", "true");
                    localStorage.setItem("admin_nama_user", data.nama_admin);
                    localStorage.setItem("admin_level", data.level_admin);
                    window.location.reload();
                } else {
                    alertContainer.innerHTML = `
                        <div class="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                            <i class="bi bi-exclamation-octagon-fill"></i>
                            <div>${data.message}</div>
                        </div>
                    `;
                }
            })
            .catch(err => {
                console.error("Gagal interaksi internal secure fetch:", err);
            });
        
})
}

function bukaModalFullscreenProfil(nama) {
    const titleElement = document.getElementById("generalModalTitle");
    const bodyElement = document.getElementById("generalModalBody");

    // Atur judul modal utama
    titleElement.innerHTML = `<i class="bi bi-person-badge-fill me-2"></i>Data Profil Anggota Resmi`;
    
    // Tampilkan indikator loading animasi saat data sedang ditarik dari server MySQL
    bodyElement.innerHTML = `
        <div class="d-flex justify-content-center align-items-center py-5">
            <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Memuat Data...</span>
            </div>
            <h5 class="ms-3 text-muted mb-0">Sinkronisasi database...</h5>
        </div>
    `;

    // Ambil nomor WhatsApp dari localStorage untuk kunci pencarian data unik di MySQL
    const userWA = localStorage.getItem("idi_user_whatsapp") || "";

    // Bersihkan slash berlebih di ujung URL config secara otomatis jika ada
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
   
    // Lakukan pemanggilan FETCH AJAX ke backend proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_profil&whatsapp=${userWA}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            const member = data.data;

            // Urai data JSON Pekerjaan & Tempat Kerja agar tampil cantik, beri fallback jika data kosong
            let listPekerjaan = "[]";
            let listTempatKerja = "[]";
            try {
                if(member.pekerjaan) listPekerjaan = JSON.stringify(JSON.parse(member.pekerjaan), null, 2);
                if(member.tempatkerja) listTempatKerja = JSON.stringify(JSON.parse(member.tempatkerja), null, 2);
            } catch(e) {
                console.error("Gagal parsing JSON database:", e);
            }

            // Render isi data dinamis dari database MySQL ke dalam Tabel Modal Fullscreen
            bodyElement.innerHTML = `
                <div class="container py-3">
                    <div class="row g-4">
                        <div class="col-lg-3 text-center border-end">
                            <img id="displayFotoProfilModal" src="https://lh3.googleusercontent.com/d/${member.fotoprofil ? member.fotoprofil : '138_TC12u5QkNRHo6Za2hDMzihwPl51AT?authuser=1" class="profile-avatar" alt="Foto Profil" style="width:200px;border-radius:50%"'}" style="width:200px;border-radius:50%">
                            <h4 class="fw-bold text-dark">${member.nama}</h4>
                            <!-- Tombol Pemicu Edit Foto Profil -->
                            <!-- Kontrol Manajemen Unggah Berkas -->
                            <div class="d-grid gap-2 mb-2">
                                <button class="btn btn-sm btn-outline-secondary fw-bold shadow-sm" id="btnPilihFoto">
                                    <i class="bi bi-images me-1"></i> Pilih Foto Baru
                                </button>
                                <button class="btn btn-sm btn-success fw-bold shadow-sm d-none" id="btnSimpanKeCloud">
                                    <i class="bi bi-cloud-upload-fill me-1"></i> Unggah & Simpan
                                </button>
                            </div>
                            
                            <!-- Input File Tersembunyi -->
                            <input type="file" id="inputFileFotoProfil" accept="image/*" style="display: none;">
                            
                            <!-- Area Alert Status Upload -->
                            <div id="uploadAlertStatus" class="mt-2 small font-monospace"></div>
							<div class="d-grid border-top pt-3 mt-2">
                    <button class="btn btn-sm btn-primary fw-bold shadow-sm py-2 rounded-3" 
                            onclick="event.preventDefault(); window.prosesEditAnggota(${member.id},'anggota')">
                        <i class="bi bi-pencil-square me-1"></i> Edit Data Profile
                    </button>
                </div>
                        </div>
                        <div class="col-lg-9">
                            <h5 class="fw-bold text-idi border-bottom pb-2 mb-3">Biodata Pribadi (MySQL Live Data)</h5>
                            <table class="table table-striped table-bordered align-middle">
                                <tr><th width="35%">Nama Lengkap & Gelar</th><td>${member.nama}</td></tr>
                                <tr><th>Nomor Anggota (NPA)</th><td>${member.npa ? member.npa : '<span class="text-danger small"><i>Belum diverifikasi Admin (Kosong)</i></span>'}</td></tr>
                                <tr><th>NIK KTP</th><td>${member.nik ? member.nik : '<span class="text-muted small"><i>Belum diisi</i></span>'}</td></tr>
                                <tr><th>Surat Tanda Registrasi (STR)</th><td>${member.str ? member.str : '<span class="text-muted small"><i>Belum diisi</i></span>'}</td></tr>
                                <tr><th>Profesi Utama</th><td>${member.profesiutama ? member.profesiutama : '<span class="text-muted small"><i>Belum diisi</i></span>'}</td></tr>
                                <tr><th>Nomor Telepon / WA</th><td>+62 ${member.telpon}</td></tr>
                                <tr><th>Alamat Email</th><td>${member.email}</td></tr>
                                <tr>
                                    <th>Riwayat Pekerjaan</th>
                                    <td><code>${listPekerjaan}</code></td>
                                </tr>
                                <tr>
                                    <th>Tempat Praktik Kerja</th>
                                    <td><code>${listTempatKerja}</code></td>
                                </tr>
                                <tr><th>Alamat ID Cloud Folder</th><td><span class="badge bg-secondary text-wrap" style="word-break: break-all; text-align: left;"><i class="bi bi-google-drive me-1"></i> ${member.folder ? member.folder : 'Belum Terhubung'}</span></td></tr>
                                <tr><th>Waktu Registrasi</th><td><small class="text-muted">${member.uregistrasi}</small></td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            `;
			
			const btnPilih = document.getElementById("btnPilihFoto");
            const btnSimpan = document.getElementById("btnSimpanKeCloud");
            const inputFile = document.getElementById("inputFileFotoProfil");
            const alertStatus = document.getElementById("uploadAlertStatus");
            const imgDisplay = document.getElementById("displayFotoProfilModal");
			let fileMentahTerpilih = null;
            // Aksi 1: Klik tombol Ubah Foto memicu klik pada input file tersembunyi
            btnPilih.addEventListener("click", function() {
                inputFile.click();
            });
			
			            // âš¡ PROSES 1: DETEKSI FILE & BUAT PREVIEW LOKAL INSTAN (PERBAIKAN)
            inputFile.addEventListener("change", function() {
				
                // Pastikan ada file yang dipilih oleh pengguna
                if (inputFile.files.length === 0) return;
               
                // PERBAIKAN: Ambil index ke-0 untuk mendapatkan objek file tunggal
                fileMentahTerpilih = inputFile.files[0]; 
                
                // Validasi batasan ukuran file secara lokal (2 MB)
                if (fileMentahTerpilih.size > 2 * 1024 * 1024) {
                    alertStatus.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-x-circle"></i> Ukuran file maks 2MB!</span>`;
                    btnSimpan.classList.add("d-none");
                    fileMentahTerpilih = null; // Reset kembali data terpilih
                    return;
                }
                
                // Jalankan FileReader untuk mengubah berkas menjadi base64 untuk pratinjau di browser
                const readerPreview = new FileReader();
                readerPreview.onload = function(e) {
                    imgDisplay.src = e.target.result; // Menampilkan hasil baca file ke elemen <img>
                    imgDisplay.style.opacity = "0.7"; // Memberi efek semi-transparan sebagai penanda preview
                    btnSimpan.classList.remove("d-none"); // Memunculkan tombol unggah permanen
                    alertStatus.innerHTML = `<span class="text-warning fw-bold"><i class="bi bi-eye-fill"></i> Mode Pratinjau Aktif</span>`;
                };
                readerPreview.readAsDataURL(fileMentahTerpilih); // Mulai proses pembacaan berkas gambar
            });


			// âš¡ PROSES 2: EKSEKUSI DUAL-JALUR CLOUD DRIVE & INTERNAL MYSQL
            btnSimpan.addEventListener("click", function() {
                if (!fileMentahTerpilih) return;

                btnSimpan.disabled = true;
                btnPilih.disabled = true;
                btnSimpan.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Processing...`;
                alertStatus.innerHTML = `<span class="text-muted">Mengirim berkas ke Google Cloud...</span>`;

                const readerCloud = new FileReader();
                readerCloud.onload = function(e) {
                    const base64String = e.target.result.split(',')[1];
                    const googleAppsScriptWebGroupUrl = "https://script.google.com/macros/s/AKfycbxd_h5y4YyqhPFlP69_RGZvMb1tOhe_pA5hHE0izrbRfeXuEf4_DM3hAY83LA_vI1ZYlw/exec";

                    // Payload data untuk Google Apps Script
                    const payloadGAS = new URLSearchParams({
                        "aksi": "upload_foto_profil",
                        "iduser": member.id,
                        "nama_dokter": member.nama,
                        "tipe_konten": fileMentahTerpilih.type,
                        "data_base64": base64String
                    });

                    // JALUR 1: Kirim berkas gambar biner ke Google Drive
                    fetch(googleAppsScriptWebGroupUrl, {
                        method: "POST",
                        body: payloadGAS,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    })
                    .then(res => res.json())
                    .then(gasRes => {
                        if (gasRes.status === "success") {
                            alertStatus.innerHTML = `<span class="text-muted">Berkas tersimpan di Drive. Sinkronisasi MySQL...</span>`;

                            // Payload data untuk sinkronisasi database MySQL local
                            const payloadMySQL = new FormData();
                            payloadMySQL.append("iduser", member.id);
                            payloadMySQL.append("google_file_id", gasRes.file_id);

                            // JALUR 2: Kirim ID File Google Drive yang sukses terbentuk menuju tabel anggota MySQL
                            return fetch(`${cleanEndpoint}/proses.php?aksi=update_id_foto_anggota`, {
                                method: "POST",
                                body: payloadMySQL
                            });
                        } else {
                            throw new Error(gasRes.message);
                        }
                    })
                    .then(res => res.json())
                    .then(mysqlRes => {
                        btnSimpan.disabled = false;
                        btnPilih.disabled = false;
                        btnSimpan.classList.add("d-none");
                        imgDisplay.style.opacity = "1";

                        if (mysqlRes.status === "success") {
                            alertStatus.innerHTML = `<span class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> Foto Profil Terupload Sukses!, Selanjutnya akan di Validasi Admin sebelum Layout</span>`;
                            imgDisplay.src = "https://lh3.googleusercontent.com/d/"+mysqlRes.url_baru;
                            
                            const mainAvatar = document.querySelector(".profile-avatar-container img");
                            if(mainAvatar) mainAvatar.src = "https://lh3.googleusercontent.com/d/"+mysqlRes.url_baru;
                        } else {
                            alertStatus.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-exclamation-triangle"></i> MySQL Error: ${mysqlRes.message}</span>`;
                            setTimeout(() => {
  window.location.reload();
}, 2000);
                        }
                    })
                                        .catch(err => {
                        btnSimpan.disabled = false;
                        btnPilih.disabled = false;
                        imgDisplay.style.opacity = "1";
                        alertStatus.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-cloud-slash"></i> Kegagalan Transaksi: Cloud Terputus.</span>`;
                        console.error(err);
                    });
                };
                readerCloud.readAsDataURL(fileMentahTerpilih);
            });
			
        } else {
            bodyElement.innerHTML = `<div class="alert alert-danger p-3 m-3"><i class="bi bi-exclamation-triangle-fill me-2"></i>Gagal memuat profil: ${data.message}</div>`;
            
            setTimeout(() => {
window.location.reload();
}, 2000);
        }
    })
    .catch(error => {
        console.error("Gagal menarik data profil:", error);
        bodyElement.innerHTML = `
            <div class="alert alert-danger p-4 m-3">
                <h5><i class="bi bi-wifi-off me-2"></i>Koneksi Gagal Tarik Data MySQL</h5>
            </div>
        `;
    });

    // Tampilkan Modal Fullscreen menggunakan instansiasi Bootstrap 5
    const myModal = new bootstrap.Modal(document.getElementById('generalFullscreenModal'));
    myModal.show();
}



window.bukaDetailBeritaKeModalUmumDirect = function(idInfo) {
if (!window.globalHeadlineWebsiteCache) return;

    // 1. Ambil data berita utuh secara otomatis berdasarkan ID yang diklik
    const info = window.globalHeadlineWebsiteCache.find(x => x.id == idInfo);
    if (!info) return;
	
    const generalModalEl = document.getElementById("generalFullscreenModal");
    const generalTitle = document.getElementById("generalModalTitle");
    const generalBody = document.getElementById("generalModalBody");

 if (generalModalEl && generalBody) {
	 if (generalTitle) {
            generalTitle.innerHTML = `<i class="bi bi-newspaper me-2"></i> Detail Publikasi`;
        }
		
		const kategoriCek = (info.kategori || "").toLowerCase().trim();

		if (kategoriCek === "image" || info.id == 4) {
			if (generalTitle) {
                generalTitle.innerHTML = `<i class="bi bi-images me-2"></i> Dokumentasi Kegiatan`;
            }
			
			generalBody.innerHTML = `
                <div class="container-fluid py-2">
                    <div class="row g-4">
                        <!-- PANEL KIRI (col-md-8): GRID GAMBAR DARI FOLDER GOOGLE DRIVE YANG TERPILIH -->
                        <div class="col-md-8 border-end">
                            <h5 class="fw-bold text-dark mb-3" id="activeFolderTitleHeader">
                                <i class="bi bi-images text-success me-1"></i> File Foto Dokumentasi
                            </h5>
                            <!-- Wadah tempat menyuntikkan kumpulan foto hasil fetch GAS -->
                            <div id="nativeGalleryGridDisplayArea" class="row row-cols-3 row-cols-sm-4 g-2 p-1 bg-light rounded-4">
                                <div class="col-12 text-center py-5 text-muted small">
                                    <i class="bi bi-arrow-right-square d-block fs-3 mb-2 text-muted"></i>
                                    Silakan pilih salah satu album di panel kanan.
                                </div>
                            </div>
                        </div>

                        <!-- PANEL KANAN (col-md-4): DAFTAR SELURUH BARIS ALBUM DARI TABLE GALLERY MYSQL -->
                        <div class="col-md-4">
                            <h6 class="fw-bold text-idi border-bottom pb-2 mb-3">
                                <i class="bi bi-folder-fill text-warning me-1"></i> Daftar Album Kegiatan
                            </h6>
                            <!-- Wadah penampung baris data dari php get_gallery_admin -->
                            <div id="phpSidebarRecommendationArea" class="list-group shadow-sm rounded-3 overflow-auto border" style="max-height: 520px;">
                                <div class="text-center py-5 text-muted small">
                                    <span class="spinner-border spinner-border-sm text-success me-2" role="status"></span>
                                    Menghubungkan ke tabel gallery...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

			
			// Eksekusi pemanggilan AJAX internal menuju proses.php untuk memuat daftar album di panel kanan (col-md-4)
            const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
            const rightSidebarContainer = document.getElementById("phpSidebarRecommendationArea");

            fetch(`${cleanEndpoint}/proses.php?aksi=get_gallery_admin`)
            .then(response => response.json())
            .then(res => {
                if (!rightSidebarContainer) return;

                if (res.status === 'success' && res.data) {
                    const listAlbum = res.data;
                    let sidebarHtml = "";

                    if (listAlbum.length === 0) {
                        rightSidebarContainer.innerHTML = `<div class="p-4 text-center text-muted small"><i class="bi bi-folder-x me-1"></i> Belum ada album terdaftar di MySQL.</div>`;
                        return;
                    }

                    // Render boks list group data album di panel kanan (col-md-4)
                    for (let i = 0; i < listAlbum.length; i++) {
                        const rowAlbum = listAlbum[i];
                        const tglFormat = rowAlbum.waktu ? rowAlbum.waktu.substring(0, 10) : "Recent";

                        // Event click memicu pemanggilan fungsi: window.muatKumpulanFotoKeKanvasKiri
                        // Membawa parameter kode ID folder Google Drive (rowAlbum.image) dan judul album
                        sidebarHtml += `
                            <div class="list-group-item list-group-item-action p-3 click-native-album-item" 
                                 data-folder-id="${rowAlbum.image}" 
                                 style="cursor: pointer; transition: all 0.2s;"
                                 onclick="window.muatKumpulanFotoKeKanvasKiri('${rowAlbum.image}', '${rowAlbum.judul.replace(/'/g, "\\'")}', this)">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted font-monospace" style="font-size:0.65rem;"><i class="bi bi-calendar3 me-1"></i>${tglFormat}</small>
                                    <span class="badge bg-secondary-subtle text-secondary rounded-pill font-monospace" style="font-size:0.55rem;">ID #${rowAlbum.id}</span>
                                </div>
                                <div class="fw-bold text-dark small text-truncate mb-1" style="max-width: 100%;"><i class="bi bi-folder-fill text-warning me-1"></i>${rowAlbum.judul}</div>
                                <p class="text-muted mb-0 font-monospace text-truncate small" style="font-size:0.65rem;">Folder Code: ${rowAlbum.image}</p>
                            </div>
                        `;
                    }
                    rightSidebarContainer.innerHTML = sidebarHtml;

                    // AUTO-TRIGGER FIRST ROW: Otomatis memicu klik baris pertama agar panel kiri langsung memuat foto saat modal terbuka
                    const firstRowItem = rightSidebarContainer.querySelector(".click-native-album-item");
                    if (firstRowItem) {
                        firstRowItem.click();
                    }

                } else {
                    rightSidebarContainer.innerHTML = `<div class="alert alert-danger p-2 small">Gagal memuat list MySQL: ${res.message}</div>`;
                }
            })
            .catch(err => {
                console.error("Gagal terhubung ke database:", err);
                if (rightSidebarContainer) rightSidebarContainer.innerHTML = `<div class="p-3 text-center text-muted small"><i class="bi bi-wifi-off me-1"></i> Koneksi server lokal terputus.</div>`;
            });
            
            const bsGeneralModal = new bootstrap.Modal(generalModalEl);
            bsGeneralModal.show();
            return; // Potong eksekusi agar tidak masuk ke layout berita biasa di bawah
        }

		
		
        let visualMediaModal = "";
        

        // Ambil data kode video / link gambar
        let mediaCode = info.img || "";

        if (kategoriCek === "podcast" || kategoriCek === "youtube") {
            // Jika kategori berupa media video, bersihkan string URL untuk mengambil 11 karakter kode ID YouTube
            let youtubeId = mediaCode;
            if (mediaCode.includes("vi/")) {
                youtubeId = mediaCode.split("vi/")[1].split("/")[0];
            } else if (mediaCode.includes("v=")) {
                youtubeId = mediaCode.split("v=")[1].substring(0, 11);
            } else if (mediaCode.includes("d/")) {
                // fallback jika di tabel headline tersimpan format ID drive
                youtubeId = mediaCode; 
            }

            // Render Iframe Player Responsif bawaan YouTube
            visualMediaModal = `
                <div class="mb-3 ratio ratio-16x9 rounded-3 overflow-hidden border shadow-sm bg-black animate-fade-in">
					<iframe src="https://www.youtube.com/embed/`+youtubeId+`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            `;
        } else {
            // Jika rumpun informasi biasa, tampilkan Gambar Foto Statis
            if (mediaCode && !mediaCode.startsWith("http")) {
                    mediaCode = "https://lh3.googleusercontent.com/d/" + mediaCode;
                }
                
            visualMediaModal = mediaCode 
                ? `<div class="mb-3 text-center bg-black rounded-3 overflow-hidden shadow-sm">
                        <img src="${mediaCode}" class="img-fluid" style="max-height: 450px; object-fit: contain;" alt="${info.judul}">
                   </div>` 
                : '';
        }
			
	const isiFormatHtml = info.isi ? info.isi.split('\n').join('<br>').split('\\n').join('<br>') : '<span class="text-muted italic">Tidak ada deskripsi.</span>';

generalBody.innerHTML = `
            <div class="container-fluid py-2">
                <div class="row g-4">
                    <!-- SISI KIRI: GAMBAR UTAMA & ARTIKEL LENGKAP (col-md-8) -->
                    <div class="col-md-8 border-end">
                        ${visualMediaModal}
                        <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom text-muted small">
                            <span class="badge bg-dark px-3 py-2 text-uppercase" style="font-size: 0.68rem;">Kategori: ${info.kategori}</span>
                            <span class="font-monospace"><i class="bi bi-calendar3 me-1"></i> Rilis: ${info.tanggal}</span>
                        </div>
                        <h3 class="fw-bold text-dark mb-4" style="line-height: 1.45;">${info.judul}</h3>
                        <p class="text-secondary" style="text-align: justify; line-height: 1.8; font-size: 1.05rem;">
                          ${isiFormatHtml}  
                        </p>
                    </div>

                    <!-- SISI KANAN: REKOMENDASI TERKAIT DARI DATABASE PHP (col-md-4) -->
                    <div class="col-md-4">
                        <h6 class="fw-bold text-idi border-bottom pb-2 mb-3">
                            <i class="bi bi-patch-check-fill text-success me-1"></i> Rekomendasi Terkait
                        </h6>
                        <!-- Kontener tempat menyuntikkan list berita dari AJAX PHP -->
                        <div id="phpSidebarRecommendationArea" class="list-group list-group-flush shadow-sm rounded-3">
                            <div class="text-center py-4 text-muted small">
                                <span class="spinner-border spinner-border-sm text-success me-2" role="status"></span>
                                Membaca tabel relasi kategori...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
// 3. SEKTOR ENGINE SIDEBAR: Ambil data dinamis via PHP sesuai rumpun kategori artikel
        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
        const targetSidebarContainer = document.getElementById("phpSidebarRecommendationArea");

        // Normalisasi penentu arah endpoint backend (informasi atau sosial_media)
        let aksiApiUrl = "get_informasi_news"; // Default tabel informasi
        if (info.kategori === "Podcast" || info.kategori === "Youtube") {
            aksiApiUrl = "get_podcast_admin"; // Pindah ke rumpun tabel sosial_media
        }

        fetch(`${cleanEndpoint}/proses.php?aksi=${aksiApiUrl}&kategori=${info.kategori}`)
        .then(response => response.json())
        .then(sidebarRes => {

            if (sidebarRes.status === 'success' && sidebarRes.data) {
                const listData = sidebarRes.data;
                let sidebarHtml = "";

                // Saring data agar artikel yang sedang dibuka di sisi kiri tidak ikut muncul sebagai rekomendasi double
                const listFiltered = listData.filter(x => x.judul.toLowerCase().trim() !== info.judul.toLowerCase().trim()).slice(0, 4);

                if (listFiltered.length === 0) {
                    targetSidebarContainer.innerHTML = `<div class="p-3 text-muted text-center small bg-light rounded"><i class="bi bi-folder-x me-1"></i> Belum ada artikel terkait lainnya.</div>`;
                    return;
                }

                // Render kartu sidebar mini
                for (let j = 0; j < listFiltered.length; j++) {
                    const row = listFiltered[j];
                    const waktuSamping = row.waktu ? row.waktu.substring(0, 10) : (row.tanggal || "Recent");
                    const penandaAsalTabel = (aksiApiUrl === "get_podcast_admin") ? "podcast" : "informasi";

                    sidebarHtml += `
                        <div class="list-group-item p-3 list-group-item-action" style="cursor:default;">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="text-muted font-monospace" style="font-size:0.65rem;"><i class="bi bi-clock me-1"></i> ${waktuSamping}</small>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill" style="font-size:0.55rem;">ID ${row.id}</span>
                            </div>
                            <a href="#" class="fw-bold text-dark text-decoration-none small d-block mb-1 text-truncate text-primary-hover" 
                               style="max-width: 100%; cursor: pointer;" 
                               onclick="event.preventDefault(); window.updateKontenKiriModalDirect(${row.id}, '${penandaAsalTabel}')">
                                ${row.judul}
                            </a>
                            <p class="text-muted mb-0 text-truncate small" style="font-size:0.75rem;">${row.isi}</p>
                        </div>
                    `;
                }
                targetSidebarContainer.innerHTML = sidebarHtml;

            } else {
                targetSidebarContainer.innerHTML = `<div class="alert alert-warning p-2 small">Gagal menarik relasi data PHP.</div>`;
            }
        })
        .catch(err => {
            console.error("Gagal sinkronisasi komponen sidebar:", err);
            if(targetSidebarContainer) {
                targetSidebarContainer.innerHTML = `<div class="p-3 text-center text-muted small"><i class="bi bi-cloud-slash me-1"></i> Gagal terhubung ke modul internal.</div>`;
            }
        });

        const bsGeneralModal = new bootstrap.Modal(generalModalEl);
        bsGeneralModal.show();
    }
}
window.bukaDetailBeritaKeModalUmumDirect = bukaDetailBeritaKeModalUmumDirect;

// =========================================================================
// ðŸ’¡ SUB-ENGINE GALERI: MEMBACA KODE DRIVE KANAN UNTUK MERENDER FOTO DI KIRI
// =========================================================================
window.muatKumpulanFotoKeKanvasKiri = function(folderDriveId, judulAlbum, elementKlik) {
    const gridLeftBox = document.getElementById("nativeGalleryGridDisplayArea");
    const headerTitleLeft = document.getElementById("activeFolderTitleHeader");
    if (!gridLeftBox) return;

    // Beri efek highlight warna hijau lembut pada baris album yang sedang aktif diklik di sisi kanan (col-md-4)
    document.querySelectorAll('.click-native-album-item').forEach(el => el.classList.remove('bg-success-subtle'));
    if (elementKlik) elementKlik.classList.add('bg-success-subtle');

    // Update teks nama judul folder aktif di bagian atas panel kiri
    if (headerTitleLeft) {
        headerTitleLeft.innerHTML = `<i class="bi bi-images text-success me-1"></i> File Foto: <span class="text-dark small fw-medium">${judulAlbum}</span>`;
    }

    // Tampilkan efek loading spinner berputar di panel kiri (col-md-8)
    gridLeftBox.innerHTML = `
        <div class="col-12 text-center py-5 text-muted small" id="cloudLoadingSpinner">
            <span class="spinner-border spinner-border-sm text-success me-2" role="status"></span>
            Membuka repositori berkas gambar Google Drive...
        </div>
    `;

    // Hubungkan tautan Web App URL Google Apps Script Anda yang valid
    const googleAppsScriptWebGroupUrl = "https://script.google.com/macros/s/AKfycbxKEXAM5VW6fRieoMuRLK-sqqtUomP-cnLXrmu9K4ufMGJIL0UxMlVToi56-OEasiq1/exec";

    // Lakukan pemanggilan Fetch JSON API murni menuju Google Apps Script membawa parameter kode folder list kanan
    fetch(`${googleAppsScriptWebGroupUrl}?kode=${folderDriveId}`)
    .then(res => res.json())
    .then(gasRes => {
        if (gasRes.status === 'success') {
            const listFoto = gasRes.data;
            let gridHtml = "";

            if (listFoto.length === 0) {
                gridLeftBox.innerHTML = `<div class="col-12 text-center text-muted py-5 small"><i class="bi bi-images d-block fs-4 mb-2 text-muted"></i>Folder Google Drive ini kosong atau tidak memiliki aset gambar.</div>`;
                return;
            }

            // Loop menyusun foto-foto mini (thumbnails) di panel sebelah kiri (col-md-8) menggunakan kolom Bootstrap responsif
            for (let k = 0; k < listFoto.length; k++) {
                const foto = listFoto[k];
                const thumbUrl = "https://lh3.googleusercontent.com/d/" + foto.id;

                // Ketika foto kecil diklik, buka tab gambar ukuran penuh murni bawaan Drive
                gridHtml += `
                    <div class="col animate-fade-in">
                        <div class="card h-100 border border-secondary-subtle rounded-3 shadow-sm overflow-hidden p-0" 
                             style="aspect-ratio: 1/1; cursor: pointer; transition: all 0.2s;"
                             onmouseover="this.style.transform='scale(1.05)';"
                             onmouseout="this.style.transform='scale(1)';"
                             onclick="window.popupMediaLightboxViaModal2Direct('${foto.id}', '${foto.nama.replace(/'/g, "\\'")}')">
                            <img src="${thumbUrl}" alt="${foto.nama}" class="w-100 h-100 object-fit-cover" title="Klik untuk memperbesar: ${foto.nama}">
                        </div>
                    </div>
                `;
            }
            gridLeftBox.innerHTML = gridHtml;

        } else {
            gridLeftBox.innerHTML = `<div class="col-12 alert alert-danger p-2 small"><i class="bi bi-exclamation-triangle-fill me-1"></i> Cloud Error: ${gasRes.message}</div>`;
        }
    })
    .catch(err => {
        console.error("Gagal koneksi Google Apps Script API:", err);
        gridLeftBox.innerHTML = `<div class="col-12 alert alert-danger p-2 small"><i class="bi bi-cloud-slash me-1"></i> Jaringan data cloud Google terputus.</div>`;
    });
};

window.popupMediaLightboxViaModal2Direct = function(fileId, namaFoto) {
    // Ambil URL gambar ukuran besar resolusi penuh dari CDN Google Drive
    const fullImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    // Bentuk kerangka tata letak gambar responsif Bootstrap yang steril
    const htmlLightboxModal2 = `
        <div class="text-center p-1 w-100">
            <div class="bg-dark rounded-4 p-2 d-inline-block border shadow-lg max-w-100 overflow-hidden" style="max-height: 70vh;">
                <img src="${fullImageUrl}" alt="${namaFoto}" class="img-fluid rounded-3" style="max-height: 65vh; object-fit: contain;">
            </div>
            <div class="mt-3 text-muted font-monospace small">
                <i class="bi bi-info-circle me-1"></i> Judul Berkas: <span class="text-dark fw-bold">${namaFoto}</span>
            </div>
            <div class="mt-3 pt-2 border-top text-center">
                <a href="${fullImageUrl}" target="_blank" class="btn btn-sm btn-outline-success px-4 fw-bold rounded-pill">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Buka File Asli
                </a>
            </div>
        </div>
    `;

    // Panggil fungsi modal2 bawaan sistem Anda untuk menampilkan lightbox foto
    if (typeof modal2x === "function") {
        modal2x('Pratinjau Foto', htmlLightboxModal2);
    } else {
        console.warn("FUNGSI GLOBAL modal2() TIDAK TERDETEKSI DI SYSTEM DOM WINDOW");
    }
};

window.popupMediaLightboxViaModal2Direct = popupMediaLightboxViaModal2Direct;

const formLogin = document.getElementById("formSimulasiLogin");
const errorAlertContainer = document.getElementById("errorAlertContainer");

formLogin.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('whatsapp', document.getElementById("inputWA").value.trim());
    formData.append('password', document.getElementById("inputPassword").value);

    fetch(endpoint+'proses.php?aksi=login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
         if (data.status === 'success') {
			        localStorage.setItem("idi_id_user", data.id);
                    localStorage.setItem("idi_nama_dokter", data.nama_dokter);
					localStorage.setItem("idi_user_whatsapp", data.whatsapp);
                    localStorage.setItem("idi_is_logged_in", "true");
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                    periksaSesiLogin();
                } else {
                    document.getElementById("errorAlertContainer").innerHTML = `<div class="alert alert-danger py-2 small">${data.message}</div>`;
                }
    })
	.catch(() => {

              console.error("Gagal melakukan login:", err);   
            });
});


window.updateKontenKiriModalDirect = function(idTarget, asalTabel) {
    const areaKontenKiri = document.querySelector("#generalModalBody .col-md-8");
    if (!areaKontenKiri) return;

    areaKontenKiri.style.opacity = "0.5";
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    
    let aksiUrl = "get_informasi_news";
    if (asalTabel === "podcast" || asalTabel === "youtube") { aksiUrl = "get_podcast_admin"; }

    fetch(`${cleanEndpoint}/proses.php?aksi=${aksiUrl}&id_tunggal=${idTarget}`)
    .then(res => res.json())
    .then(res => {
        areaKontenKiri.style.opacity = "1";

        if (res.status === 'success' && res.data) {
            const item = Array.isArray(res.data) ? res.data.find(x => x.id == idTarget) : res.data;
            if (!item) return;

            let badgeClass = "bg-dark";
            const katCek = (item.kategori || "").toLowerCase().trim();

            if (katCek === "informasi" || katCek === "info") badgeClass = "bg-danger";
            if (katCek === "podcast") badgeClass = "bg-warning text-dark";
            if (katCek === "youtube") badgeClass = "bg-primary";

            let mediaSource = item.image || item.img || "";
            let htmlMediaKiri = "";

            // DETEKSI PLAYER: Jika kategori bernilai podcast atau youtube, pasang Embed Player YouTube
            if (katCek === "podcast" || katCek === "youtube") {
                let videoId = mediaSource;
                if (mediaSource.includes("vi/")) {
                    videoId = mediaSource.split("vi/")[1].split("/")[0];
                } else if (mediaSource.includes("v=")) {
                    videoId = mediaSource.split("v=")[1].substring(0, 11);
                }
                
                htmlMediaKiri = `
                    <div class="mb-3 ratio ratio-16x9 rounded-3 overflow-hidden border shadow-sm bg-black animate-fade-in">
						<iframe src="https://www.youtube.com/embed/`+videoId+`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                `;
            } else {
                // Jika rumpun foto/gambar statis biasa (Filter tautan CDN Google Drive)
                if (mediaSource && !mediaSource.startsWith("http")) {
                    mediaSource = "https://lh3.googleusercontent.com/d/" + mediaSource;
                }
                
                htmlMediaKiri = mediaSource
                    ? `<div class="mb-3 text-center bg-black rounded-3 overflow-hidden shadow-sm animate-fade-in">
                        <img src="${mediaSource}" class="img-fluid" style="max-height: 450px; object-fit: contain;">
                       </div>`
                    : '';
            }

            // Normalisasi pemecah baris baru (\n) agar rapi membentuk paragraf di HTML halaman depan
            const isiFormatHtml = item.isi ? item.isi.split('\n').join('<br>').split('\\n').join('<br>') : 'Tidak ada deskripsi teks.';
            const tanggalTampil = item.waktu ? item.waktu.substring(0, 10) : (item.tanggal || "Recent");

            // Suntikkan hasil kompilasi data baru ke DOM sisi kiri modal
            areaKontenKiri.innerHTML = `
                ${htmlMediaKiri}
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom text-muted small">
                    <span class="badge ${badgeClass} px-3 py-2 text-uppercase" style="font-size: 0.68rem;">Kategori: ${item.kategori}</span>
                    <span class="font-monospace"><i class="bi bi-calendar3 me-1"></i> Rilis: ${tanggalTampil}</span>
                </div>
                <h3 class="fw-bold text-dark mb-4" style="line-height: 1.45;">${item.judul}</h3>
                <p class="text-secondary" style="text-align: justify; line-height: 1.8; font-size: 1.05rem;">
                    ${isiFormatHtml}
                </p>
            `;
        }
    })
    .catch(err => {
        areaKontenKiri.style.opacity = "1";
        console.error("Gagal melakukan update video player kiri:", err);
    });
};


function resetNavigasiAwal() {
        loginContainer.innerHTML = `
            <button class="btn btn-outline-light d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="bi bi-person-circle"></i> Login Anggota
            </button>
        `;
}

// ==========================================
// 3. JAVASCRIPT MATH CAPTCHA ENGINE (SINKRONISASI TOTAL)
// ==========================================
let kunciJawabanCaptcha = 0;
let isPhpCaptchaActive = false; 

function buatCaptchaBaru() {
    // Mengambil soal captcha dari server PHP jika tersedia
    fetch(endpoint+'proses.php?aksi=get_captcha')
    .then(response => response.json())
    .then(data => {
        document.getElementById("captchaBox").innerText = data.soal;
        document.getElementById("regCaptchaInput").value = "";
        isPhpCaptchaActive = true; // Tandai bahwa server PHP aktif merespons
    })
    .catch(() => {
        // FALLBACK LOKAL: Jika proses.php offline/tidak terjangkau, buat hitungan lokal agar tidak macet
        isPhpCaptchaActive = false;
        let angkaPertama = Math.floor(Math.random() * 9) + 1;
        let angkaKedua = Math.floor(Math.random() * 9) + 1;
        kunciJawabanCaptcha = angkaPertama + angkaKedua; 
        
        document.getElementById("captchaBox").innerText = `${angkaPertama} + ${angkaKedua} = ?`;
        document.getElementById("regCaptchaInput").value = "";
    });
}

// Pemicu pembuatan captcha baru
document.getElementById("btnRefreshCaptcha").addEventListener("click", buatCaptchaBaru);
document.getElementById("register-tab").addEventListener("click", buatCaptchaBaru);
window.addEventListener("DOMContentLoaded", buatCaptchaBaru);
	
const formRegistrasi = document.getElementById("formSimulasiRegistrasi");
const registerAlertContainer = document.getElementById("registerAlertContainer");

formRegistrasi.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const sandi = document.getElementById("regPassword").value;
    const konfirmasiSandi = document.getElementById("regConfirmPassword").value;
    const inputUserCaptcha = parseInt(document.getElementById("regCaptchaInput").value, 10);

    // 1. VALIDASI KATA SANDI
    if (sandi !== konfirmasiSandi) {
        registerAlertContainer.innerHTML = `
            <div class="alert alert-danger py-2 small" role="alert">
                <i class="bi bi-shield-slash-fill me-2"></i>Kata sandi konfirmasi tidak cocok!
            </div>
        `;
        return; 
    }

    // 2. VALIDASI CAPTCHA HANYA JIKA PHP OFFLINE (Jika PHP online, verifikasi dilakukan langsung di server php)
    if (!isPhpCaptchaActive && inputUserCaptcha !== kunciJawabanCaptcha) {
        registerAlertContainer.innerHTML = `
            <div class="alert alert-danger py-2 small" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>Jawaban Captcha salah! Silakan hitung kembali.
            </div>
        `;
        buatCaptchaBaru(); 
        return; 
    }

    // 3. JIKA LOLOS, KIRIM DATA SECARA NYATA KE MYSQL VIA PHP
    const formData = new FormData();
    formData.append('nama', document.getElementById("regNama").value.trim());
    formData.append('whatsapp', document.getElementById("regWA").value.trim());
    formData.append('email', document.getElementById("regEmail").value.trim());
    formData.append('password', sandi);
    formData.append('confirm_password', konfirmasiSandi);
    formData.append('captcha_input', inputUserCaptcha);
 	
    fetch(endpoint+'proses.php?aksi=register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            registerAlertContainer.innerHTML = `
                <div class="alert alert-success py-2 small" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i>${data.message}
                </div>
            `;
            formRegistrasi.reset();
            buatCaptchaBaru();
        } else {
            // Menangkap respon error asli dari query MySQL php (Misal: Email duplikat atau Captcha salah)
            registerAlertContainer.innerHTML = `
                <div class="alert alert-danger py-2 small" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>${data.message}
                </div>
            `;
            buatCaptchaBaru();
        }
    })
    .catch(error => {
		console.error("Detail Error Jaringan:", error);
        // Pesan simulasi lokal ini hanya akan keluar jika koneksi ke proses.php benar-benar terputus/gagal total
        registerAlertContainer.innerHTML = `
            <div class="alert alert-success py-3 small" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <div>
                    <b>Simulasi Sukses (Lokal Offline):</b><br>
                    Validasi kecocokan sandi & hitungan Captcha Matematika berhasil diverifikasi di sisi komputer Anda!
                </div>
            </div>
        `;
        formRegistrasi.reset();
        buatCaptchaBaru();
    });
});


const formlupapassword = document.getElementById('form-lupa-password');

    formlupapassword.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah halaman reload bawaan form

    const emailInput = document.getElementById('email');
    const btnSubmit = document.getElementById('btn-submit');
    const alertBox = document.getElementById('alert-box');

    // Sembunyikan alert sebelumnya dan ubah teks tombol menjadi loading
    alertBox.style.display = 'none';
    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Mengirim...';

    // Ambil data dari form
    const formData = new FormData();
    formData.append('email', emailInput.value);

    // Kirim data ke PHP menggunakan Fetch API
    fetch(endpoint+'proses-lupa.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Terjadi kesalahan koneksi server.');
        }
        return response.json(); // Mengubah respon text menjadi JSON objek
    })
    .then(data => {
        alertBox.className = 'alert ' + (data.status === 'success' ? 'success' : 'error');
        alertBox.innerText = data.message;
        alertBox.style.display = 'block';

        if (data.status === 'success') {
            emailInput.value = ''; // Kosongkan input email jika berhasil
        }
    })
    .catch(error => {
        alertBox.className = 'alert error';
        alertBox.innerText = error.message;
        alertBox.style.display = 'block';
    })
    .finally(() => {
        // Kembalikan status tombol seperti semula
        btnSubmit.disabled = false;
        btnSubmit.innerText = 'Kirim Tautan Reset';
    });
});

// =========================================================================
// ENGINE FRONTEND: CARI DATA HEADLINE 7 -> AMBIL FOTO DRIVE -> PILIH ACAK 1
// =========================================================================
function muatSatuFotoAcakHeadlineDrive() {

    // Membidik elemen gambar target secara spesifik lewat ID DOM [1]
    const targetImageEl = document.getElementById("headlineImageTarget");
    if (!targetImageEl) return;

    // 1. Masukkan URL Web App Google Apps Script (GAS) Anda
    const googleAppsScriptWebGroupUrl = "https://script.google.com/macros/s/AKfycbxKEXAM5VW6fRieoMuRLK-sqqtUomP-cnLXrmu9K4ufMGJIL0UxMlVToi56-OEasiq1/exec";

    // 2. FETCH JALUR 1: Membaca repositori data headline untuk membedah kode Drive milik ID 7
    fetch(endpoint + 'proses.php?aksi=get_headline_admin')
    .then(res => res.json())
    .then(headlineRes => {
		
        if (headlineRes.status === 'success' && headlineRes.data) {
            // Temukan baris khusus milik ID nomor 4
            const headline4 = headlineRes.data.find(h => h.id == 4);
            
            // Periksa ketersediaan Kode Folder Google Drive di kolom 'img'
            if (headline4 && headline4.img && headline4.img.trim() !== "") {
                const folderDriveId = headline4.img.trim();

                // 3. FETCH JALUR 2: Mengambil array list data gambar dari Google Apps Script
                return fetch(`${googleAppsScriptWebGroupUrl}?kode=${folderDriveId}`);
            } else {
                throw new Error("Kolom kode folder Google Drive (img) pada Headline ID 4 kosong.");
            }
        } else {
            throw new Error("Gagal menyinkronkan data repositori tabel headline.");
        }
    })
    .then(res => {
        if (!res) return;
        return res.json();
    })
    .then(gasRes => {
        if (!gasRes) return;

        if (gasRes.status === 'success') {
            const arrayFoto = gasRes.data;

            if (arrayFoto.length > 0) {

                const indeksAcak = Math.floor(Math.random() * arrayFoto.length);
                const fotoTerpilih = arrayFoto[indeksAcak];
                targetImageEl.src = "https://lh3.googleusercontent.com/d/" + fotoTerpilih.id;
                targetImageEl.style.cursor = "pointer";

            } else {
                console.log("Folder Google Drive terhubung, namun tidak ada file gambar di dalamnya.");
            }
        } else {
            console.error("Google Apps Script Error:", gasRes.message);
        }
    })
    .catch(err => {
        console.warn("Sistem dialihkan menggunakan visualisasi teks bawaan website:", err.message);
        // Sembunyikan elemen gambar jika folder drive bermasalah/kosong agar layout kartu tidak rusak
        targetImageEl.style.display = "none"; 
    });
};

function muatLayananCepatDrawer() {
    const container = document.getElementById("drawerMenuContainer");
    if (!container) return;

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/members.php?aksi=get_navmenu`)
    .then(response => {
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return response.json();
    })
    .then(res => {
        if (res.status === 'success') {
            const daftarMenu = res.data;
            let menuHtml = "";

            if (daftarMenu.length === 0) {
                container.innerHTML = `<div class="col-12 text-center text-muted small py-3">Belum ada layanan tersedia.</div>`;
                return;
            }

            for (let i = 0; i < daftarMenu.length; i++) {
                const item = daftarMenu[i];
                const namaMenu = item.nama.toLowerCase();

                // Pemetaan Ikon Otomatis berdasarkan kata kunci nama menu di database
                let iconClass = "bi-journal-bookmark"; // Default ikon
                if (namaMenu.includes("iuran")) iconClass = "bi-qr-code-scan";
                if (namaMenu.includes("mutasi")) iconClass = "bi bi-arrow-left-right";
                if (namaMenu.includes("ppds")) iconClass = "bi bi-file-earmark-medical";
                if (namaMenu.includes("fellow")) iconClass = "bi-award";
                if (namaMenu.includes("log")) iconClass = "bi bi-file-earmark-check";
                if (namaMenu.includes("sarana kesehatan")) iconClass = "bi bi-clipboard2-pulse";
                if (namaMenu.includes("bakti sosial")) iconClass = "bi bi-people-fill";
                if (namaMenu.includes("sarana kesehatan")) iconClass = "bi bi-hospital";
                if (namaMenu.includes("link kesehatan")) iconClass = "bi bi-heart-pulse";
                // Render struktur item menu grid sesuai permintaan (col-6 col-md-3)
                menuHtml += `
                    <div class="col-4 col-md-2">
                        <a href="#" class="text-decoration-none" onclick="event.preventDefault(); ${item.menu_action}">
                            <div class="drawer-icon-box"><i class="bi ${iconClass}"></i></div>
                            <small class="text-center text-dark" style="font-size:9px">${item.nama}</small>
                        </a>
                    </div>
                `;
            }
            container.innerHTML = menuHtml;
        } else {
            container.innerHTML = `<div class="col-12 alert alert-danger p-2 small">Gagal: ${res.message}</div>`;
        }
    })
    .catch(error => {
        console.error("Gagal menarik data navmenu:", error);
        container.innerHTML = `<div class="col-12 text-center text-muted small py-3"><i class="bi bi-wifi-off me-1"></i> Koneksi server terputus.</div>`;
    });
}

function loadInformasiKontakSekretariatUser() {
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    const kontainerTargetGrid = document.getElementById("canvasKontakSekretariatWrapper"); // Pastikan ID ini ada di HTML Anda

    if (!kontainerTargetGrid) return;

    // ðŸ’¡ TAHAP 1: Ambil data kontak personil resmi dari peladen proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_informasi_kontak_publik`)
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status peladen: " + res.status);
        return res.json();
    })
    .then(res => {
        if (res.status !== 'success' || !res.data) {
            kontainerTargetGrid.innerHTML = `<div class="alert alert-light small text-center p-3">Gagal memuat papan informasi kontak sekretariat.</div>`;
            return;
        }

        // Tampung data kaku baris tunggal hasil response MySQL
        const row = res.data;

        // Ekstrak data kolom database menjadi variabel lokal pendukung template Anda
        const badgeClass         = "bg-success"; // Default warna badge Kategori Informasi
        const jam_operasional    = row.jam_operasional || "-";
        const hari_kerja         = row.hari_kerja || "-";
        const alamat_sekretariat = row.alamat_sekretariat || "-";
        const email_institusi    = row.email_institusi || "-";
        const telpon_kantor      = row.telpon_kantor || "-";
        const nama_bank          = row.nama_bank || "-";
        const no_rekening        = row.no_rekening || "-";
        const atas_nama          = row.atas_nama || "-";

        const info = {
            kategori: "Informasi",
            tanggal: row.terakhir_diperbarui_indo || "Terbaru",
            judul: "Informasi Sekretariat & Kas Resmi"
        };

        // ðŸ’¡ TAHAP 2: Parsing biner Array JSON Personil Pengurus untuk dilahirkan jadi Tombol Grid WA
        let htmlTombolWhatsappDinamis = "";
        try {
            const arrayPersonil = JSON.parse(row.daftar_kontak_json || "[]");
            
            if (Array.isArray(arrayPersonil) && arrayPersonil.length > 0) {
                arrayPersonil.forEach(p => {
                    // Hilangkan angka 0 di depan wa ketikan admin agar format wa.me/62 tidak patah
                    const cleanNoWa = String(p.wa || '').trim().replace(/^0+/, '');
                    
                    htmlTombolWhatsappDinamis += `
                        <a href="https://wa.me/${cleanNoWa}" target="_blank" class="btn btn-sm btn-outline-success text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-decoration-none">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-whatsapp fs-5"></i>
                                <div>
                                    <span class="fw-bold d-block" style="font-size:0.8rem;">${p.nama}</span>
                                    <small class="text-muted opacity-75 d-block" style="font-size:0.7rem;">${p.jabatan}</small>
                                </div>
                            </div>
                            <span class="badge bg-success small font-monospace">0${cleanNoWa}</span>
                        </a>
                    `;
                });
            } else {
                htmlTombolWhatsappDinamis = `<span class="text-muted small italic font-monospace d-block text-center py-2">- Belum ada contact person aktif -</span>`;
            }
        } catch (errParse) {
            console.error("Gagal melakukan parsing data biner helpdesk:", errParse);
            htmlTombolWhatsappDinamis = `<span class="text-muted small italic font-monospace d-block text-center py-2">- Gagal mengurai data JSON -</span>`;
        }

        // ðŸ’¡ TAHAP 3: Satukan seluruh data ke dalam template HTML kustom Anda secara presisi
        kontainerTargetGrid.innerHTML = `
            
                <div class="card card-branch border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge ${badgeClass} text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">${info.kategori}</span>
                            <small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i>${info.tanggal}</small>
                        </div>
                        <h5 class="fw-bold mb-3 text-success" style="font-size: 1.2rem; line-height: 1.4;">
                            <i class="bi bi-telephone-inbound-fill me-2"></i>${info.judul}
                        </h5>
                        <div class="small text-dark-emphasis mb-3" style="line-height: 1.6; font-size: 0.85rem;">
                            <div class="p-2 bg-light rounded-3 mb-2">
                                <b class="text-dark d-block"><i class="bi bi-clock-history me-1 text-success"></i> Jam Operasional Sekretariat:</b> 
                                ${jam_operasional}<br>
                                <span class="text-muted small">${hari_kerja}</span>
                            </div>
                            <div class="mb-2">
                                <b class="text-dark d-block"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> Alamat Kantor:</b> 
                                ${alamat_sekretariat}
                            </div>
                            <div class="mb-2">
                                <b class="text-dark d-block"><i class="bi bi-envelope-fill me-1 text-primary"></i> Email & Telp:</b> 
                                <a href="mailto:${email_institusi}" class="text-decoration-none">${email_institusi}</a><br>
                                Telp: ${telpon_kantor}
                            </div>
                            <div class="p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mb-3">
                                <b class="text-success d-block"><i class="bi bi-bank me-1"></i> Info Rekening Kas Resmi IDI:</b> 
                                Bank ${nama_bank}: <span class="font-monospace fw-bold text-dark">${no_rekening}</span><br>
                                <small class="text-muted">Atas Nama: ${atas_nama}</small>
                            </div>
                            <b class="text-dark d-block border-bottom pb-1 mb-2"><i class="bi bi-chat-left-dots-fill me-1 text-success"></i> CONTACT PERSON (WHATSAPP):</b>
                            <div class="d-grid gap-2">
                                ${htmlTombolWhatsappDinamis}
                            </div>
                        </div>
                    </div>
                </div>
            
        `;
    })
    .catch(err => {
        console.error("Mata rantai penarikan informasi kontak terputus:", err);
        kontainerTargetGrid.innerHTML = `<div class="alert alert-danger small text-center p-3">Gagal menyinkronkan data helpdesk dari server.</div>`;
    });
};

// Pastikan fungsi ini dipanggil di akhir initAplikasi()

periksaSesiLogin();
muatDataHeadlineMasonry();
muatLayananCepatDrawer();
setTimeout(() => {
loadInformasiKontakSekretariatUser();
}, 2000);

}

function modal2x(judulMenu,kontenHtml) {
            const sTitle = document.getElementById("secondModalTitle");
            const sBody = document.getElementById("secondModalBody");

            // 1. Suntik judul dan isi konten secara dinamis
            sTitle.innerHTML = `<i class="bi bi-window-stack me-2"></i>${judulMenu}`;
            sBody.innerHTML = kontenHtml;

            // 2. Panggil dan tampilkan Modal Kedua menggunakan instansiasi resmi Bootstrap 5
            const modalKedua = new bootstrap.Modal(document.getElementById('secondAdminModal'));
            modalKedua.show();

}

function modal3x(judulMenu,kontentHtml)
{
	        const sBody = document.getElementById("bodimodal3");
			const dialog = document.getElementById('fsDialog');
            // Otomatis buka popup fullscreen
            dialog.showModal(); 
            $('#titlepopup').html('<i class="bi bi-folder2-open me-2"></i>'+judulMenu);
			sBody.innerHTML = kontentHtml;
            // Tombol tutup tetap berfungsi normal
            document.getElementById('closeBtn').addEventListener('click', () => {
            dialog.close();
            });
}

initAplikasi();
