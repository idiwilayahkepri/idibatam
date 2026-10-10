import { APP_CONFIG } from './config.js';
const endpoint = `${APP_CONFIG.API_URL}`; 

function modal1v(judulMenu,kontenHtml) {
	const titleElement = document.getElementById("generalModalTitle");
    const bodyElement = document.getElementById("generalModalBody");

    titleElement.innerHTML = `<i class="bi bi-shield-lock me-2"></i>${judulMenu}`;
    bodyElement.innerHTML = `<p class="text-center py-0 text-muted">${kontenHtml}</p>`;

    const myModal = new bootstrap.Modal(document.getElementById('generalFullscreenModal'));
    myModal.show()
}

function modal2v(judulMenu,kontenHtml) {
            const sTitle = document.getElementById("secondModalTitle");
            const sBody = document.getElementById("secondModalBody");

            // 1. Suntik judul dan isi konten secara dinamis
            sTitle.innerHTML = `<i class="bi bi-window-stack me-2"></i>${judulMenu}`;
            sBody.innerHTML = kontenHtml;

            // 2. Panggil dan tampilkan Modal Kedua menggunakan instansiasi resmi Bootstrap 5
            const modalKedua = new bootstrap.Modal(document.getElementById('secondAdminModal'));
            modalKedua.show();

}

function modal3v(judulMenu,kontentHtml)
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

window.closeSecondAdminModal = function() {
    const targetModalEl = document.getElementById('secondAdminModal');
    
    if (targetModalEl) {
        // Ambil instansiasi aktif modal kedua yang sedang terbuka di layar
        let bootstrapModalInstance = bootstrap.Modal.getInstance(targetModalEl);
        
        // Jika instansiasi belum terikat di DOM, buat instansiasi baru untuk memanipulasinya
        if (!bootstrapModalInstance) {
            bootstrapModalInstance = new bootstrap.Modal(targetModalEl);
        }
        
        if (bootstrapModalInstance) {
            // Tutup modal secara elegan lewat method bawaan Bootstrap 5
            bootstrapModalInstance.hide();
        } else {
            // Fallback darurat: Cari tombol penutup bawaan HTML dan picu klik otomatis
            const btnCloseManual = document.getElementById("tutupmodal2") || document.getElementById("secondModalCloseBtn");
            if (btnCloseManual) btnCloseManual.click();
        }
    } else {
        console.warn("Elemen container dengan ID 'secondAdminModal' tidak ditemukan di dokumen HTML.");
    }
};
window.menuIuran=function()
{
	const isLogin = localStorage.getItem("idi_is_logged_in");
    const namaDokter = localStorage.getItem("idi_nama_dokter");
    const telponDokter = localStorage.getItem("idi_user_whatsapp");
	document.getElementById('btnadmin').innerHTML='';
if (isLogin === "true" && telponDokter) {
const htmlIuranManager = `
            <div class="container py-0" id="iuranPencarianWrapper">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <!-- WELCOME CARD ANGGOTA -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 text-center text-sm-start d-sm-flex flex-sm-row align-items-sm-center justify-content-between" id="namapemilikiuran">
                            <div>
                                <h5 class="fw-bold text-success mb-1"><i class="bi bi-person-badge-fill me-1"></i> Halo, ${namaDokter}</h5>
                                <p class="text-muted small mb-0 font-monospace">Histori rincian mutasi kas iuran wajib Anda yang terdaftar pada nomor +62 ${telponDokter}</p>
                            </div>
                            <div class="mt-3 mt-sm-0">
                                <span class="badge bg-success px-3 py-2 rounded-pill font-monospace"><i class="bi bi-shield-check me-1"></i> Terverifikasi</span>
                            </div>
                        </div>

                        <!-- KANVAS DISK RECOGNITION DATA IURAN -->
                        <div id="mysqlIuranResultTableArea" class="animate-fade-in">
                            <div class="text-center py-5 text-muted bg-white rounded-4 shadow-sm border">
                                <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                                <p class="small mb-0 font-monospace">Menghubungkan ke secure cloud kas IDI Batam...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
		
		        // Luncurkan antarmuka manifest ke Modal Kedua
        modal1v('Iuran Anggota', htmlIuranManager);
        window.generateMainMenuDropdownHtml('Iuran Anggota');
        
        // ⚡ AUTO TRIGGER FETCH: Langsung tembak kueri nomor telepon tanpa jeda pengetikan tombol
        setTimeout(function() {
            window.eksekusiFetchIuranMurni(telponDokter);
        }, 300);
} else {
const htmlIuranManager = `
<div class="container" id="iuranPencarianWrapper">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <!-- CARD PANEL PENCARIAN -->
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4" id="namapemilikiuran">
                <label class="form-label fw-bold text-success mb-2" style="font-size:1rem;">
                    <i class="bi bi-telephone-fill me-1"></i> Masukkan Nomor Telepon / WA Anggota
                </label>
                <p class="text-muted small mb-3">Ketik nomor telepon dokter (tanpa angka 0 atau 62 di depan), lalu klik tombol cari atau tekan Enter.</p>
                
                <!-- 💡 PERUBAHAN DISINI: Menggunakan Row & Col Grid Bootstrap agar fleksibel di Mobile -->
                <div class="row g-2">
                    <div class="col-12 col-md-9">
                        <div class="input-group input-group-lg">
                            
                            
                            <!-- Indikator +62 -->
                            <span class="input-group-text bg-light text-success border-start-0 border-end-0 fw-bold font-monospace">+62</span>
                            
                            <input type="number" class="form-control bg-light border-start-0 fw-bold font-monospace text-success" 
                                   id="inputCariNamaIuran" 
                                   placeholder="811XXXXXXXX..." 
                                   autocomplete="off"
                                   onkeydown="if(event.key === 'Enter') window.liveTriggerFetchIuranMySQL()">
                        </div>
                    </div>
                    <div class="col-12 col-md-3 d-grid">
                        <button class="btn btn-success btn-lg fw-bold px-4" type="button" id="btnEksekusiCariIuran" onclick="window.liveTriggerFetchIuranMySQL()">
                            <i class="bi bi-search me-1"></i> Cari
                        </button>
                    </div>
                </div>
            </div>

            <!-- CONTAINER DINAMIS -->
            <div id="mysqlIuranResultTableArea" class="animate-fade-in">
                <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed">
                    <i class="bi bi-file-earmark-spreadsheet display-5 d-block mb-2 text-secondary-subtle"></i>
                    <h6 class="fw-bold mb-1 text-secondary">Ready to Search</h6>
                    <p class="small mb-0 px-3">Data iuran keuangan kosong. Silakan masukkan nomor telepon dokter dan klik cari di atas.</p>
                </div>
            </div>
        </div>
    </div>
</div>
`;
    // Luncurkan ke dalam komponen Modal Kedua (Fullscreen Window bawaan sistem)
    modal1v('Iuran Anggota', htmlIuranManager);
window.generateMainMenuDropdownHtml('Iuran Anggota');
}
}

window.liveTriggerFetchIuranMySQL = function() {
    const inputVal = document.getElementById("inputCariNamaIuran").value.trim();
        // Normalisasi pangkas angka 0 atau 62 di awal ketikan form admin

        // VALIDASI KOSONG: Jika admin mengklik tombol cari namun kotak inputan kosong
    if (inputVal.length < 2) {
        alert("Silakan masukkan nomor telepon / WA dokter terlebih dahulu sebelum mencari!");
        resultArea.innerHTML = `
            <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed animate-fade-in">
                <i class="bi bi-file-earmark-spreadsheet display-5 d-block mb-2 text-secondary-subtle"></i>
                <h6 class="fw-bold mb-1 text-secondary">Ready to Search</h6>
                <p class="small mb-0">Data iuran keuangan kosong. Silakan masukkan nomor telepon dokter dan klik cari di atas.</p>
            </div>
        `;
        return;
    }

window.eksekusiFetchIuranMurni(inputVal);
};

window.eksekusiFetchIuranMurni = function(nomorTelpon) {
    const resultArea = document.getElementById("mysqlIuranResultTableArea");
    const btnCari = document.getElementById("btnEksekusiCariIuran");
    if (!resultArea) return;

    if (btnCari) {
        btnCari.disabled = true;
        btnCari.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Mencari...`;
    }

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_pencarian_iuran&telpon=${encodeURIComponent(nomorTelpon)}`, {
	method: "POST",
    mode: "cors",              
    credentials: "include",    
    body: payload
	})
    .then(res => res.json())
    .then(res => {
        if (btnCari) {
            btnCari.disabled = false;
            btnCari.innerHTML = `<i class="bi bi-arrow-right-circle me-1"></i> Cari Data`;
        }

        if (res.status === 'success') {
            const listDb = res.data;
            window.globalListDbIuranAktif = listDb;
			let tambahiuran="";
			if(res.status_anggota!=='Aktif')
			{
			tambahiuran=`<div class="mb-3">Status Keanggotaan Anda : Anggota Biasa, untuk menjadi Anggota Cabang, pastikan untuk membayar Iuran terlebih dahulu</div>`;
			}
            if (!listDb || listDb.length === 0) {
                resultArea.innerHTML = `
                    <div class="alert alert-warning border shadow-sm rounded-4 p-4 text-center mb-0 animate-fade-in">
                        <i class="bi bi-telephone-x-fill display-6 d-block mb-2 text-danger"></i>
                        <h6 class="fw-bold text-dark">Data Tidak Ditemukan!</h6>
                        <p class="small mb-0 text-muted">Nomor telepon "<b>+62 ${nomorTelpon}</b>" belum memiliki riwayat transaksi awal di database iuran. ${tambahiuran}</p>
                    </div>
                      <div class="mt-3 pt-3 border-top d-flex justify-content-center align-items-center w-100">
			<button type="button" class="btn btn-sm btn-success fw-bold px-4 rounded-pill shadow-sm animate-pulse" onclick="bukaFormBayarIuranModal2ManualDinamis(${res.idAnggota}, '${res.namaAnggota}', '${res.telpon}','true',${res.tahun})">
                                <i class="bi bi-plus-lg me-1"></i> Bayar Iuran 
                            </button>
                        </div>  
                    
                `;
                return;
            }

            // 1. PINDAI TAHUN TERTUA DARI DATABASE MYSQL
			const waktuSistemAktif = new Date().getFullYear();
            let tahunTertua = waktuSistemAktif; 
			let tahunTertinggi = waktuSistemAktif; 
			let kuitansi=[];
            for (let m = 0; m < listDb.length; m++) {
                const thnDb = parseInt(listDb[m].tahun, 10);
                if (thnDb) {
                    if (thnDb < tahunTertua) {
                        tahunTertua = thnDb; // Mengunci tahun pembayaran pertama
                    }
                    if (thnDb > tahunTertinggi) {
                        tahunTertinggi = thnDb; // 🔒 KUNCI BARU: Menangkap tahun masa depan di DB (ex: 2027)
                    }
                }
            }

            const listPeriodeWajib = [];

            let lastIntervalBulan = 12; // Default jika data awal kosong
            let lastPeriodeBulanTeks = "juli-juni"; // Default jika data awal kosong
			
			const matrixSemuaBulan = [
                "januari", "februari", "maret", "april", "mei", "juni",
                "juli", "agustus", "september", "oktober", "november", "desember"
            ];
			
            for (let thnStart = tahunTertua; thnStart <= tahunTertinggi; thnStart++) {

        const dbMatchRow = listDb.find(x => x.tahun == thnStart.toString());
        let labelPeriodeFinal = "";

                if (dbMatchRow) {

                    labelPeriodeFinal = dbMatchRow.periode;
                    lastIntervalBulan = parseInt(dbMatchRow.interval, 10) || 12;
                    lastPeriodeBulanTeks = dbMatchRow.periode_bulan || "juli-juni";
                } else {
					const bulanSplit = lastPeriodeBulanTeks.split('-'); 
                    const bulanAwalNama = bulanSplit[0] ? bulanSplit[0].trim() : "juli";
                    

                    // Cari index bulan awal (ex: "juli" -> index 6)
                    let indexBulanAwal = matrixSemuaBulan.indexOf(bulanAwalNama);
                    if (indexBulanAwal === -1) indexBulanAwal = 6;

                    // Hitung index bulan akhir berdasarkan durasi interval warisan
                    let indexBulanAkhir = indexBulanAwal + (lastIntervalBulan - 1);
                    let tahunSelesaiHitung = thnStart;

                    if (indexBulanAkhir > 11) {
                        tahunSelesaiHitung = thnStart + Math.floor(indexBulanAkhir / 12);
                        indexBulanAkhir = indexBulanAkhir % 12;
                    }

                    // Format Kapital huruf awal nama bulan (ex: "juni" -> "Juni")
                    const strBulanAwal = matrixSemuaBulan[indexBulanAwal].charAt(0).toUpperCase() + matrixSemuaBulan[indexBulanAwal].slice(1);
                    const strBulanAkhir = matrixSemuaBulan[indexBulanAkhir].charAt(0).toUpperCase() + matrixSemuaBulan[indexBulanAkhir].slice(1);

                    // Susun teks periode tiruan yang presisi mengikuti warisan atasnya
                    labelPeriodeFinal = `${strBulanAwal}-${thnStart} s/d ${strBulanAkhir}-${tahunSelesaiHitung}`;
                }

                // Masukkan data objek final yang sudah pintar ke dalam array matriks linimasa
                listPeriodeWajib.push({
                    tahun_tagihan: thnStart.toString(),
                    label_otomatis: labelPeriodeFinal, // Sudah dinamis mengikuti DB / Warisan atasnya
                    tahun_awal: thnStart
                });
				}

            // Ekstrak data profil dokter dari record pertama MySQL
            const infoDokter = listDb[0];
            const idAnggota = infoDokter.id_anggota || "-";
            const npaDokter = infoDokter.npa_anggota || "N/A";
            const namaDokter = infoDokter.nama_anggota || "Anggota Dokter";
            const telponDokter = infoDokter.telpon_anggota || nomorTelpon;

            let tableRowsHtml = "";
            let counterNo = 1;
			
            let isSemuaLunas = true;
            let lastKnownInterval = 12;
            let lastKnownPeriodeBulan = "juli-juni";

            for (let k = 0; k < listPeriodeWajib.length; k++) {
                const slot = listPeriodeWajib[k];
                const thnBerjalan = slot.tahun_awal;
                
                // Cari kesamaan data tahun tagihan di database MySQL
                const dbMatch = listDb.find(x => x.tahun == slot.tahun_tagihan);

                let statusBadge = "";
                let statusbelumlunas="";
                let cetakNominal = "";
                let berkasBukti = "";
                let keteranganText = "";
                let tglBayarText = "-";
                let labelPeriodeTampil = slot.label_otomatis;
                let kuitansi="";
				let ska="";
                if (dbMatch) {
                    // KONDISI A: DATA ADA DI MYSQL DRAF/VALID
                    lastKnownInterval = parseInt(dbMatch.interval, 10) || 12;
                    lastKnownPeriodeBulan = dbMatch.periode_bulan || "juli-juni";
                    
					window.globalLastKnownInterval = lastKnownInterval;
                    window.globalLastKnownPeriodeBulan = lastKnownPeriodeBulan;
       
                    window.globalLastLabelOtomatis = slot.label_otomatis; 

const statusTeks = (dbMatch.status || "").toLowerCase().trim();
let nominalRupiahTampil = parseInt(dbMatch.jumlah, 10) || 0;

if (statusTeks === "cash bertahap") {
    // 💡 UTILITY LOGIK: Cari semua baris setoran cicilan untuk id_anggota dan tahun buku yang sama
    if (window.globalListDbIuranAktif) {
        const semuaCicilanTahunIni = window.globalListDbIuranAktif.filter(x => {
            const matchId = (x.id_anggota == idAnggota || x.no_anggota == idAnggota);
            const matchTahun = (x.tahun == dbMatch.tahun);
            const statusClean = (x.status || "").toLowerCase().trim();
            const matchStatus = (
                statusClean === 'cash bertahap' || 
                statusClean === 'upload bukti' || 
                statusClean === 'menunggu verifikasi admin'
            );
            return matchId && matchTahun && matchStatus;
        });

        // 🔥 HITUNG MASSAL: Jumlahkan seluruh nominal uang dari baris cicilan yang ditemukan
        nominalRupiahTampil = semuaCicilanTahunIni.reduce((total, item) => total + (parseInt(item.jumlah, 10) || 0), 0);
    }
}

// FORMAT KE MATA UANG RUPIAH INDONESIA (Rp) UNTUK DIINJEKSI KE <td> TABEL
const teksJumlahKasKolom = nominalRupiahTampil > 0 
    ? `Rp ${nominalRupiahTampil.toLocaleString('id-ID')}` 
    : `<span class="text-muted font-monospace">Rp 0</span>`;

if (statusTeks === "lunas") {
    statusBadge = `<span class="badge bg-success-subtle text-success px-2 py-1 rounded small fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Lunas</span>`;
} else if (statusTeks === "cash bertahap") {
    statusbelumlunas="belum";
    statusBadge = `
        <a href="#" id="cb${dbMatch.iuran_id}" class="badge bg-info-subtle text-info px-2 py-1 rounded small fw-bold text-decoration-none border border-info border-opacity-25 d-inline-flex align-items-center gap-1" 
           title="Klik untuk melihat buku besar riwayat cicilan & tambah setoran cash bertahap" 
           onclick="event.preventDefault(); window.bukaModal3AplikasiCashBertahapMandiri('${dbMatch.id_anggota}', '${dbMatch.nama_anggota.replace(/'/g, "\\'")}', '${dbMatch.tahun}', '${slot.label_otomatis}', '${telponDokter}')">
            <i class="bi bi-credit-card-2-front-fill"></i> Cash Bertahap (Buka Pembukuan)
        </a>
    `;
} else if (statusTeks === "upload bukti") {
    statusbelumlunas="belum";
                        statusBadge = `<a href="#" class="badge bg-warning-subtle text-warning-emphasis px-2 py-1 rounded small fw-bold text-decoration-none border border-warning d-inline-flex align-items-center gap-1 animate-pulse" title="Klik untuk langsung mengunggah file bukti transfer untuk transaksi ini" onclick="event.preventDefault(); window.bukaPortalUploadDriveModal3Direct('${dbMatch.iuran_id}', '${telponDokter}')"><i class="bi bi-cloud-arrow-up-fill"></i> Upload Bukti</a>`;
} else if (statusTeks === "menunggu verifikasi admin") {
					    statusBadge = `<span class="badge bg-primary-subtle text-primary px-2 py-1 rounded small fw-bold"><i class="bi bi-hourglass-split me-1"></i>Menunggu Verifikasi Admin</span>`;
} else if (statusTeks === "pending") {
    const safeAlasan = (dbMatch.alasan_pending || "Tidak ada catatan koreksi spesifik dari admin.").replace(/'/g, "\\'");
    statusBadge = `
        <a href="#" class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold text-decoration-none border border-danger d-inline-flex align-items-center gap-1 animate-pulse" 
           title="Klik untuk melihat alasan penangguhan berkas"
           onclick="event.preventDefault(); window.bukaModal3LihatAlasanPendingIuranMurni('${safeAlasan}', '${slot.label_otomatis}', '${dbMatch.iuran_id}', '${telponDokter}','user')">
            <i class="bi bi-exclamation-circle-fill"></i> Pending (Cek Alasan)
        </a>
    `;
} else { 
    statusbelumlunas="belum";
    // Belum Lunas / Default awal
    const sessionLoginCheck = localStorage.getItem("idi_is_logged_in");
    const adminLoginCheck = localStorage.getItem("admin_is_logged");
    if (sessionLoginCheck === "true" || adminLoginCheck==="true") {
        statusBadge = `
            <a href="#" class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold text-decoration-none d-inline-flex align-items-center gap-1" 
               onclick="event.preventDefault(); window.bukaFormBayarIuranModal2Direct('${idAnggota}', '${namaDokter.replace(/'/g, "\\'")}', '${telponDokter}', '${slot.tahun_tagihan}', '${slot.label_otomatis}', ${lastKnownInterval},${k})">
                <i class="bi bi-plus-circle-fill"></i> Belum Lunas
            </a>
        `;
    } else {
        statusBadge = `<span class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold"><i class="bi bi-lock-fill"></i> Belum Lunas</span>`;
    }
}


 
					
                    const nominalMentah = parseFloat(dbMatch.jumlah.replace(/[^0-9]/g, '')) || 0;
                    cetakNominal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nominalMentah);
                    
                    berkasBukti = dbMatch.img && dbMatch.img.trim() !== ""
                        ? `<a href="#" class="btn btn-xs btn-outline-primary px-2 py-0 rounded" style="font-size:0.7rem;" 
                              onclick="event.preventDefault(); window.bukaPratinjauBuktiBayarModal2Direct('${dbMatch.img}', '${namaDokter.replace(/'/g, "\\'")}', '${slot.label_otomatis}')">
                                <i class="bi bi-receipt me-1"></i>Bukti Bayar
                           </a>`
                        : `<span class="text-muted small"><i>No File</i></span>`;

                        
                    keteranganText = dbMatch.keterangan || "";
                    if (keteranganText === "null" || keteranganText.trim() === "") { keteranganText = ""; }
                    tglBayarText = dbMatch.tanggal_bayar || "-";
                    kuitansi =`
                            <a href="${cleanEndpoint}/kuitansi.html?id=${dbMatch.iuran_id}" target="newtab" class="badge bg-primary-subtle text-danger px-2 py-1 rounded text-decoration-none small fw-bold" >
                                <i class="bi bi-eye"></i> Lihat
                            </a>
                        `;
					ska=`<a href="${cleanEndpoint}/surat_keterangan_anggota.html?id=${idAnggota}&id_iuran=${dbMatch.iuran_id}" target="newtab" class="badge bg-primary-subtle text-danger px-2 py-1 rounded text-decoration-none small fw-bold" >
                                <i class="bi bi-eye"></i> Lihat
                            </a>
                        `;
                } else {
                    statusbelumlunas="belum";
					isSemuaLunas = false; 
					labelPeriodeTampil += ` <small class="text-muted italic">(Inherited)</small>`;
                   
                    const cleanLabelPeriode = slot.label_otomatis; 
                    labelPeriodeTampil = `${cleanLabelPeriode} <small class="text-muted italic">(Inherited)</small>`;
                    // Tautan dinamis klik Belum Lunas menuju form pendaftaran modal2 membawa context utuh
                    const sessionLoginCheck = localStorage.getItem("idi_is_logged_in");
                    const adminLoginCheck = localStorage.getItem("admin_is_logged");
                    
                    if (sessionLoginCheck === "true" || adminLoginCheck==="true") {
                        statusBadge = `
                            <a href="#" class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold text-decoration-none d-inline-flex align-items-center gap-1" 
                               title="Klik untuk mendaftarkan bukti pembayaran periode ini"
                               onclick="event.preventDefault(); window.bukaFormBayarIuranModal2Direct('${idAnggota}', '${namaDokter.replace(/'/g, "\\'")}', '${telponDokter}', '${slot.tahun_tagihan}', '${cleanLabelPeriode}', ${lastKnownInterval},${k})">
                                <i class="bi bi-plus-circle-fill"></i> Belum Lunas
                            </a>
                        `;
                    } else {
                        // 🔒 JALUR 2: JIKA USER BELUM LOGIN / ADMIN -> Kunci akses dan paksa munculkan instruksi alert()
                        statusBadge = `
                            <a href="#" class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold text-decoration-none d-inline-flex align-items-center gap-1" 
                               title="Hak akses terbatas, silakan login anggota"
                               onclick="event.preventDefault(); alert('Silakan login terlebih dahulu untuk menyelesaikan pembayaran iuran!')">
                                <i class="bi bi-lock-fill"></i> Belum Lunas
                            </a>
                        `;
                    }
                    
                    cetakNominal = `<span class="text-muted font-monospace small">Rp 0</span>`;
                    berkasBukti = `<span class="text-secondary small"><i>Belum Bayar</i></span>`;
                    keteranganText = `<span class="text-danger small"><i>Tunggakan (${lastKnownInterval} bln)</i></span>`;
                    tglBayarText = "-";
					kuitansi="";
					ska="";
                }
                
const statusTeksLower = (dbMatch && dbMatch.status ? dbMatch.status.toString().toLowerCase().trim() : "");
const keteranganTeksLower = (dbMatch && dbMatch.keterangan ? dbMatch.keterangan.toString().toLowerCase().trim() : "");


let cetakNominalDinamis = cetakNominal; // Gunakan default cetakNominal bawaan kode lama Anda


if (statusTeksLower === "cash bertahap" || (statusTeksLower === "lunas" && keteranganTeksLower.includes("cash bertahap"))) {

    if (window.globalListDbIuranAktif) {
        const kumpulanCicilanTahunIni = window.globalListDbIuranAktif.filter(x => {
            // Sinkronisasi ID menggunakan properti ganda untuk mencegah null/undefined
            const matchId = (x.id_anggota == idAnggota || x.no_anggota == idAnggota);
            const matchTahun = (x.tahun == dbMatch.tahun);
            const statusClean = (x.status || "").toLowerCase().trim();
            
            // Masukkan status 'upload bukti' atau 'menunggu verifikasi' agar cicilan baru langsung ikut terhitung akumulasinya
            const matchStatus = (
                statusClean === 'cash bertahap' || 
                statusClean === 'lunas' || 
                statusClean === 'upload bukti' || 
                statusClean === 'menunggu verifikasi admin'
            );
            return matchId && matchTahun && matchStatus;
        });

        // 🔥 SUM ENGINE: Jumlahkan seluruh nominal uang dari baris cicilan yang lolos saringan
        const totalAkumulasiRupiah = kumpulanCicilanTahunIni.reduce((total, item) => total + (parseInt(item.jumlah, 10) || 0), 0);
        
        // Format ulang angka total ke mata uang Rupiah Indonesia (Rp) secara rapi
        cetakNominalDinamis = `Rp ${totalAkumulasiRupiah.toLocaleString('id-ID')}`;
    }
}
                tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                        <td class="small fw-semibold text-secondary" nowrap>${labelPeriodeTampil}</td>
                        <td class="text-center font-monospace small" nowrap>${tglBayarText}</td>
                        <td class="font-monospace fw-bold text-end text-success" style="font-size:0.88rem;" nowrap>${cetakNominalDinamis}</td>
                        <td class="text-center sbl" nowrap data-status="${statusbelumlunas}" data-id="${k}">${statusBadge}</td>
                        <td class="text-center" nowrap>${berkasBukti}</td>
                        <td class="text-muted small " style="max-width:400px;">${keteranganText}</td>
						<td class="text-center">${kuitansi}</td>
						<td class="text-center">${ska}</td>
                    </tr>
                `;
            }


            // Cari data tahun tagihan paling terakhir/terbaru untuk diwariskan ke form tambah
            //let tahunTertinggi = tahunTertua;
            for (let m = 0; m < listDb.length; m++) {
                const thnCek = parseInt(listDb[m].tahun, 10);
                if (thnCek && thnCek > tahunTertinggi) {
                    tahunTertinggi = thnCek;
                }
            }
            const sessionLoginCheck = localStorage.getItem("idi_is_logged_in");
            let tombolTambahHtml = "";

            if (sessionLoginCheck === "true") {
                // Hanya render tombol tambah jika status login bernilai TRUE (Anggota Terlogin)
                tombolTambahHtml = `
                    <button type="button" class="btn btn-sm btn-success fw-bold px-3 rounded-pill shadow-sm" 
            onclick="window.bukaFormBayarIuranModal2ManualDinamis('${idAnggota}', '${namaDokter.replace(/'/g, "\\\\'")}', '${telponDokter}', '${isSemuaLunas}', '${tahunTertinggi}')">
        <i class="bi bi-plus-lg me-1"></i> Tambah Data Iuran
    </button>
                `;
            }
			
            resultArea.innerHTML = `
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">
                    <div class="card-header bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <span class="text-muted small fw-bold">
                            <i class="bi bi-clock-history me-1 text-success"></i> LIST IURAN ANGGOTA
                        </span>
						${tombolTambahHtml}
                                                
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                            <thead class="table-dark text-uppercase font-monospace" style="font-size:0.75rem; letter-spacing:0.5px;">
                                <tr>
                                    <th width="3%" class="text-center">No</th>
                                    <th width="19%">Siklus Periode Wajib</th>
                                    <th width="10%" class="text-center">Tgl Bayar</th>
                                    <th width="11%" class="text-end">Jumlah Kas</th>
                                    <th width="8%" class="text-center">Status</th>
                                    <th width="10%" class="text-center">Bukti Bayar</th>
                                    <th width="20%">Keterangan</th>
									<th width="10%" class="text-center">Kuitansi</th>
									<th width="10%" class="text-center">SKA</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    })
    
    .catch(err => {
        if (btnCari) {
            btnCari.disabled = false;
            btnCari.innerHTML = `<i class="bi bi-arrow-right-circle me-1"></i> Cari Data`;
        }
        console.error("Gagal melakukan penarikan timeline iuran:", err);
        resultArea.innerHTML = `
            <div class="alert alert-danger p-3 small mb-0 animate-fade-in">
                <i class="bi bi-wifi-off me-1"></i> Gagal merestorasi relasi data iuran. Koneksi server database terputus atau bermasalah.
            </div>
        `;
    });
};

window.bukaModal3AplikasiCashBertahapMandiri = function(idAnggota, namaDokter, tahunBuku, labelPeriode, nomorTelpon) {
    
    if (typeof modal2v !== "function") {
        alert("Fungsi penampung modal3v tidak ditemukan di browser.");
        return;
    }
    
    modal2v(`Cash Bertahap - Tahun ${tahunBuku}`, `
        <div class="text-center py-5 text-muted" id="cashBertahapAppWrapper">
            <div class="spinner-border text-info mb-2" role="status"></div>
            <p class="small font-monospace">Menghitung akumulasi riwayat cicilan kas...</p>
        </div>
    `);

    // 💡 1. PERBAIKAN FILTER: Menyelaraskan x.id_anggota dan melonggarkan filter status agar setoran pertama terdeteksi
    let daftarCicilanEksis = [];
    if (window.globalListDbIuranAktif) {
        daftarCicilanEksis = window.globalListDbIuranAktif.filter(x => {
            // Deteksi ID Anggota menggunakan properti alternatif untuk mencegah null/undefined
            const matchId = (x.id_anggota == idAnggota || x.no_anggota == idAnggota);
            const matchTahun = (x.tahun == tahunBuku);
            
            // Ubah teks status menjadi lowercase steril
            const statusClean = (x.status || "").toLowerCase().trim();
            
            // Mengakomodir status 'upload bukti' atau 'menunggu verifikasi admin' sebagai cicilan yang sah masuk
            const matchStatus = (
                statusClean === 'cash bertahap' || 
                statusClean === 'lunas' || 
                statusClean === 'upload bukti' || 
                statusClean === 'menunggu verifikasi admin'
            );

            return matchId && matchTahun && matchStatus;
        });
    }

    // 2. Urutkan daftar cicilan berdasarkan ID transaksi terkecil ke terbesar
    // Langkah ini menjamin Tahap 1, Tahap 2, dst. terisi berurutan sesuai urutan waktu member membayar
    daftarCicilanEksis.sort((a, b) => (parseInt(a.iuran_id || a.id) - parseInt(b.iuran_id || b.id)));

    const namaBulanSiklus = [
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
        "Januari", "Februari", "Maret", "April", "Mei", "Juni"
    ];

    let totalSudahDibayar = 0;
    let barisCicilanHtml = "";
    let stTeks="cash bertahap";
    let setor="Sudah Disetor";
    let hapuscicilan="";
    let bacaTeks=1;
    // 3. Bangun visualisasi susunan 12 bulan secara presisi
    for (let i = 0; i < 12; i++) {
        const bulanTarget = namaBulanSiklus[i];
        
        // Membaca data indeks transaksi ke-i secara berurutan
        const dataTransaksiBulanIni = daftarCicilanEksis[i] || null;
        
        let statusBadgeBulan = "";
        let tombolAksiBulan = "";
        let infoKeteranganBulan = "";
        
        
        if (dataTransaksiBulanIni) {
            stTeks = (dataTransaksiBulanIni.status || "").toLowerCase().trim();
            bacaTeks= dataTransaksiBulanIni.baca;
            const nominalBayarx = parseInt(dataTransaksiBulanIni.jumlah, 10) || 0;
            
            if ((bacaTeks === '0' || bacaTeks==='2' || bacaTeks==='3') && stTeks === 'cash bertahap') {
                dataTransaksiBulanIni.jumlah=0;
                setor="Setoran di Verifikasi"
            }
           
            const nominalBayar = parseInt(dataTransaksiBulanIni.jumlah, 10) || 0;
            
            totalSudahDibayar += nominalBayar;
             if ((bacaTeks === '0' || bacaTeks==='2' || bacaTeks==='3') && stTeks === 'cash bertahap') {
                  totalSudahDibayar='';
             }
            
            // Berikan lencana warna sesuai kondisi verifikasi admin
            if (bacaTeks === '0' && stTeks === 'cash bertahap') {
                if(localStorage.getItem('admin_is_logged')==="true")
                {
                statusBadgeBulan = `<span class="badge bg-warning text-dark px-2 py-1 rounded-pill small fw-bold" onclick="bukaModal3VerifikasiCashBertahap(${dataTransaksiBulanIni.iuran_id})" style="cursor:pointer"><i class="bi bi-hourglass-split me-1"></i>Menunggu Verifikasi</span>`;
                }
                else
                {
                statusBadgeBulan = `<span class="badge bg-warning text-dark px-2 py-1 rounded-pill small fw-bold"><i class="bi bi-hourglass-split me-1"></i>Menunggu Verifikasi</span>`;
                }
                hapuscicilan="";
            }
                else if(bacaTeks==='2' && stTeks ==='cash bertahap')
                {
                statusBadgeBulan = `<span class="badge bg-warning text-dark px-2 py-1 rounded-pill small fw-bold" onclick="lihatAlasanDitolakCashBertahap(${dataTransaksiBulanIni.iuran_id},2)" style="cursor:pointer"><i class="bi bi-hourglass-split me-1"></i>Di Tolak, lihat alasan ?</span>`;
                hapuscicilan=`<a style="cursor:pointer" onclick="hapuscicilanbertahap(${dataTransaksiBulanIni.iuran_id})"><i class="bi bi-trash"></i></a>`;
                    
                }
                else if(bacaTeks==='3' && stTeks ==='cash bertahap')
                {
                statusBadgeBulan = `<span class="badge bg-warning text-dark px-2 py-1 rounded-pill small fw-bold" onclick="lihatAlasanDitolakCashBertahap(${dataTransaksiBulanIni.iuran_id},3)" style="cursor:pointer"><i class="bi bi-hourglass-split me-1"></i>Upload Bukti</span>`;     
                hapuscicilan=`<a style="cursor:pointer" onclick="hapuscicilanbertahap(${dataTransaksiBulanIni.iuran_id})"><i class="bi bi-trash"></i></a>`;
            } else {
                statusBadgeBulan = `<span class="badge bg-success text-white px-2 py-1 rounded-pill small fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Sudah Dibayar</span>`;
                hapuscicilan="";
            }

            infoKeteranganBulan = `<span class="font-monospace fw-bold text-dark">Rp ${nominalBayarx.toLocaleString('id-ID')}</span> <br> <small class="text-muted text-truncate d-inline-block" style="max-width:150px;">${dataTransaksiBulanIni.keterangan || 'Setoran Berhasil'}</small>`;
            tombolAksiBulan = `
                <button type="button" class="btn btn-xs btn-light text-muted px-2 py-0 border rounded" disabled>
                    <i class="bi bi-lock-fill"></i> Terkunci
                </button>
            `;
        } else {
            statusBadgeBulan = `<span class="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill small fw-bold"><i class="bi bi-exclamation-triangle-fill me-1"></i>Belum Dibayar</span>`;
            infoKeteranganBulan = `<span class="font-monospace text-danger fw-bold">Rp 50.000</span><br><small class="text-muted italic">Tunggakan Tahap ${i+1}</small>`;
            
            tombolAksiBulan = `
                <button type="button" class="btn btn-xs btn-success px-3 py-1 rounded fw-bold shadow-sm" style="font-size:0.7rem;"
                        onclick="window.eksekusiTambahCicilanCashBertahapMandiri(${idAnggota}, '${namaDokter.replace(/'/g, "\\'")}', '${tahunBuku}', '${labelPeriode}', '${bulanTarget}', ${i+1}, '${nomorTelpon}')">
                    <i class="bi bi-plus-circle-fill me-1"></i>Bayar 50K
                </button>
            `;
        }

        barisCicilanHtml += `
            <tr>
                <td class="text-center font-monospace small fw-bold">${i + 1}</td>
                <td class="fw-bold text-dark small">Tahap ${i + 1} (${bulanTarget})</td>
                <td class="text-center">${statusBadgeBulan}</td>
                <td class="text-end small">${infoKeteranganBulan}</td>
                <td class="text-center">${tombolAksiBulan}</td>
                <td class="text-center">${hapuscicilan}</td>
            </tr>
        `;
    }

    const totalSisaTagihan = 600000 - totalSudahDibayar;
    const persentaseLunas = Math.round((totalSudahDibayar / 600000) * 100);

    const htmlAppTemplate = `
        <div class="container py-1 text-start" id="appCashBertahapMainContainer">
            <div class="card border-0 bg-light p-3 rounded-4 mb-4 border shadow-sm">
                <span class="small text-muted d-block mb-1">Progress Pemutihan Tunggakan (Tahun Buku ${tahunBuku}):</span>
                <div class="d-flex align-items-center gap-3">
                    <div class="progress w-100 rounded-pill shadow-sm" style="height: 14px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: ${persentaseLunas}%" aria-valuenow="${persentaseLunas}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <span class="fw-bold font-monospace text-info small" style="min-width:40px;">${persentaseLunas}%</span>
                </div>
                <div class="row g-2 mt-2 pt-2 border-top text-center" style="font-size:0.75rem;">
                    <div class="col-6 border-end text-success">
                        <span class="d-block text-muted small">${setor}:</span>
                        <b class="font-monospace">Rp ${totalSudahDibayar.toLocaleString('id-ID')}</b>
                    </div>
                    <div class="col-6 text-danger">
                        <span class="d-block text-muted small">Sisa Tunggakan:</span>
                        <b class="font-monospace">Rp ${totalSisaTagihan.toLocaleString('id-ID')}</b>
                    </div>
                </div>
            </div>

            <div class="table-responsive rounded-4 border bg-white shadow-sm" style="max-height: 350px; overflow-y: auto;">
                <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.8rem;">
                    <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.70rem; z-index:10;">
                        <tr>
                            <th width="5%" class="text-center">No</th>
                            <th width="30%">Skema Bulanan</th>
                            <th width="20%" class="text-center">Status</th>
                            <th width="25%" class="text-end">Nominal</th>
                            <th width="15%" class="text-center">Aksi</th>
                            <th width="5%" class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${barisCicilanHtml}
                    </tbody>
                </table>
            </div>
            
            <div class="text-start pt-3 border-top mt-4">
                <button type="button" class="btn btn-sm btn-dark rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">Keluar Aplikasi</button>
            </div>
        </div>
    `;

    document.getElementById("cashBertahapAppWrapper").innerHTML = htmlAppTemplate;
};

/**
 * Modul Keuangan: Pembatalan Skema Cash Bertahap & Reset Berkas Iuran
 * POTONGAN 1: Handler Konfirmasi Konfirmasi & Tembakan AJAX Dua Sisi (admin.js)
 */
window.hapuscicilanbertahap = function(idIuranTarget) {
    // 1. Tampilkan banner konfirmasi tegas demi keamanan pangkalan data
    let konfirm = confirm('⚠️ PERINGATAN SISTEM OLEH ADMIN!\n\nApakah Anda yakin ingin membatalkan skema cicilan bertahap ini?\n\nTindakan ini akan menghapus tautan struk gambar di server dan mengembalikan status dokter menjadi belum membayar.');
    
    if (!konfirm) {
        return false; // Gagalkan fungsi jika admin menekan tombol 'Batal'
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Siapkan bodi payload biner pengenal ID baris
    const payloadHapus = new FormData();
    payloadHapus.append("id", idIuranTarget);

    fetch(`${cleanEndpoint}/proses.php?aksi=batal_hapus_cicilan_bertahap`, {
        method: "POST",
        body: payloadHapus,
        mode: "cors",              
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status " + res.status);
        return res.json();
    })
    .then(data => {
        // Tampilkan pesan umpan balik resmi dari server MySQL
        alert(data.message);
        
        if (data.status === 'success') {
tutupModalTerbuka();
            menuIuran();

        }
    })
    .catch(err => {
        console.error("Gagal mengeksekusi pembatalan cicilan ID #" + idIuranTarget + ":", err);
        alert("🚨 Gagal berkomunikasi dengan sistem server. Koneksi database cPanel terputus.");
    });
};


window.lihatAlasanDitolakCashBertahap = function(iuran_id,statusbaca) {
    if (typeof modal3v !== "function") return;
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Tampilkan loading screen sementara mengambil catatan penolakan dari database
    modal3v('Status Penolakan', `
        <div class="text-center py-5 text-muted animate-fade-in" id="containerAlasanDitolakUser">
            <div class="spinner-border text-danger mb-2" role="status"></div>
            <p class="small font-monospace">Mengambil catatan sekretariat IDI Batam...</p>
        </div>
    `);

    // Tarik data detail iuran spesifik dari MySQL
    fetch(`${cleanEndpoint}/proses.php?aksi=get_detail_iuran_spesifik&id=${iuran_id}`,
	{
	method: "POST",
    mode: "cors",              
    credentials: "include",    
    body: payload
	})
    .then(res => res.json())
    .then(res => {
        const wrapper = document.getElementById("containerAlasanDitolakUser");
        if (!wrapper) return;

        if (res.status === 'success') {
            const dataIuran = res.data;

            wrapper.className = "container-fluid py-1 text-start animate-fade-in";
            let pernyataan='';
            let keteranganpenolakan='';
            if(statusbaca===2)
            {
            pernyataan=`<div>
                                    <strong class="d-block" style="font-size: 0.95rem;">Pembayaran Ditolak / Dibatalkan</strong>
                                    <span class="small">Mohon maaf, bukti pembayaran yang Anda unggah sebelumnya belum dapat diverifikasi oleh admin keuangan.</span>
                                </div>`;
            keteranganpenolakan=`<div class="mb-3">
                                <label class="form-label fw-bold small text-danger"><i class="bi bi-chat-left-text-fill me-1"></i> Alasan Penolakan dari Sekretariat:</label>
                                <div class="p-3 bg-white border border-danger-subtle rounded-4 font-sans text-dark shadow-sm" style="font-size: 0.88rem; min-height: 80px; line-height: 1.5; white-space: pre-line;">
                                    ${dataIuran.keterangan || '<span class="text-muted italic">Tidak ada catatan spesifik dari admin. Mohon unggah ulang struk transfer Anda yang sah secara jelas.</span>'}
                                </div>
                            </div>`;
            }
            if(statusbaca===3)
            {
            pernyataan=`<div>
                                    <strong class="d-block" style="font-size: 0.95rem;">Upload Bukti Pembayaran</strong>
                                    <span class="small">Silakan unggah bukti pembayaran Anda</span>
                                </div>`;
            keteranganpenolakan='';
            }
            wrapper.innerHTML = `
                <div class="row g-4">
                    <!-- 💡 SISI KIRI: NOTIFIKASI ALASAN DITOLAK SEKRITARIAT -->
                    <div class="col-md-6 border-end">
                        <div class="p-1">
                            <div class="alert bg-danger-subtle text-danger border-0 p-3 rounded-4 mb-3 d-flex align-items-start gap-2 shadow-sm">
                                <i class="bi bi-exclamation-octagon-fill fs-4 mt-0.5"></i>
                                ${pernyataan}
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold small text-secondary">Periode Iuran / Tahun Buku</label>
                                <input type="text" class="form-control form-control-sm font-monospace fw-bold bg-light" value="Tahun ${dataIuran.tahun} - (Rp ${parseInt(dataIuran.jumlah, 10).toLocaleString('id-ID')})" readonly>
                            </div>

                            ${keteranganpenolakan}
                        </div>
                    </div>

                    <!-- 💡 SISI KANAN: FORMULIR UPLOAD ULANG KE GOOGLE DRIVE -->
                    <div class="col-md-6">
                        <div class="p-1">
                            <div class="card bg-success-subtle border-0 p-3 rounded-4 mb-3 shadow-sm">
                                <h6 class="fw-bold text-success-emphasis mb-1 small" style="font-size:0.8rem;"><i class="bi bi-cloud-arrow-up-fill me-1"></i> UNGGAH ULANG BUKTI TRANSFER BARU</h6>
                                <p class="text-muted mb-3" style="font-size: 0.72rem;">Silakan pilih dan unggah file foto/gambar struk transfer pendaftaran Anda yang valid untuk diajukan verifikasi kembali.</p>
                                
                                <div class="row g-2">
                                    <div class="col-sm-8">
                                        <input type="file" class="form-control form-control-sm" id="uploadFileDriveInput" accept="image/*">
                                    </div>
                                    <div class="col-sm-4">
                                        <button type="button" class="btn btn-sm btn-success fw-bold w-100 d-flex align-items-center justify-content-center gap-1" id="btnTriggerReUpload" onclick="eksekusiUploadStrukKeGoogleDriveGas(${dataIuran.id})">
                                            <i class="bi bi-cloud-check-fill"></i> Kirim Struk
                                        </button>
                                    </div>
                                </div>
                                <div id="wrapperStatusProgressDrive" class="small mt-2 font-monospace text-secondary d-none" style="font-size:0.75rem;"></div>
                            </div>

                            <div class="text-end pt-3 border-top mt-4">
                                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="this.closest('dialog').close();">
                                    Tutup Halaman
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            wrapper.innerHTML = `<div class="alert alert-danger small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("containerAlasanDitolakUser").innerHTML = `<div class="alert alert-danger small text-center m-2">Gagal memuat catatan dari server database.</div>`;
    });
};

window.bukaModal3VerifikasiCashBertahap = function(iuran_id) {
    if (typeof modal3v !== "function") return;
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Tampilkan loading screen sementara mengambil data iuran riil dari MySQL
    modal3v('Verifikasi', `
        <div class="text-center py-5 text-muted animate-fade-in" id="containerVerifikasiCashBertahap">
            <div class="spinner-border text-success mb-2" role="status"></div>
            <p class="small font-monospace">Mengambil arsip berkas iuran anggota IDI Batam...</p>
        </div>
    `);

    // Tarik data detail iuran spesifik berdasarkan iuran_id
    fetch(`${cleanEndpoint}/proses.php?aksi=get_detail_iuran_spesifik&id=${iuran_id}`,
	{
	method: "POST",
    mode: "cors",              
    credentials: "include",    
    body: payload
	})
    .then(res => res.json())
    .then(res => {
        const wrapper = document.getElementById("containerVerifikasiCashBertahap");
        if (!wrapper) return;

        if (res.status === 'success') {
            const dataIuran = res.data;
            const namaFileGambar = (dataIuran.img || "").trim();
            
            // Siapkan URL tautan gambar struk lokal
            let urlStrukLokal = "https://lh3.googleusercontent.com/d/1o_mDEAegaq8u7vXB6q8wSxa3nShI7T5C?authuser=1/view";
            if (namaFileGambar !== "" && namaFileGambar !== "-" && namaFileGambar !== "null") {
                urlStrukLokal = `https://lh3.googleusercontent.com/d/${namaFileGambar}`;
            }

            wrapper.className = "container-fluid py-1 text-start animate-fade-in";
            wrapper.innerHTML = `
                <div class="row g-4">
                    <!-- 💡 SISI KIRI: KOLOM FORM VALIDASI (TERIMA / TOLAK / BATAL) -->
                    <div class="col-md-5 border-end">
                        <div class="p-1">
                            <h6 class="fw-bold text-dark mb-3"><i class="bi bi-shield-check text-success me-1"></i> Formulir Otorisasi Pembayaran</h6>
                            
                            <div class="bg-light p-3 rounded-4 mb-3 border shadow-sm" style="font-size: 0.85rem; line-height: 1.6;">
                                <table class="table table-sm table-borderless mb-0">
                                    <tr><td class="text-muted p-0" width="35%">Nama Dokter</td><td class="fw-bold p-0">: ${dataIuran.nama_anggota}</td></tr>
                                    <tr><td class="text-muted p-0">No. Anggota</td><td class="font-monospace p-0">: ${dataIuran.no_anggota || '-'}</td></tr>
                                    <tr><td class="text-muted p-0">Tahun Buku</td><td class="font-monospace fw-bold text-primary p-0">: Tahun ${dataIuran.tahun}</td></tr>
                                    <tr><td class="text-muted p-0">Nominal Kas</td><td class="font-monospace fw-bold text-success p-0">: Rp ${parseInt(dataIuran.jumlah, 10).toLocaleString('id-ID')}</td></tr>
                                </table>
                            </div>

                            <form id="formOtorisasiIuranMySQL">
                                <input type="hidden" id="verifIuranId" value="${dataIuran.id}">
                                
                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-secondary">Aksi Keputusan</label>
                                    <select class="form-select form-select-sm fw-bold" id="verifStatusAksi" required onchange="if(this.value!=='0') { document.getElementById('btnSubmitVerifIuran').disabled=false}">
                                        <option disabled selected value=="0">KEPUTUSAN</option>
                                        <option value="1">TERIMA </option>
                                        <option value="2">TOLAK</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-secondary">Catatan / Keterangan Admin</label>
                                    <textarea class="form-control form-control-sm small font-sans p-2" id="verifKeterangan" rows="3" placeholder="Contoh: Pembayaran cicilan kedua via transfer Bank Mandiri valid.">${dataIuran.keterangan || ''}</textarea>
                                </div>

                                <div class="pt-2">
                                    <button type="submit" class="btn btn-sm btn-success px-4 fw-bold shadow-sm rounded-pill w-100" id="btnSubmitVerifIuran" disabled>
                                        <i class="bi bi-check-circle-fill me-1"></i> Simpan & Eksekusi Otorisasi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- 💡 SISI KANAN: PREVIEW STRUK & INPUT FILE GOOGLE DRIVE -->
                    <div class="col-md-7">
                        <div class="p-1">
                            <!-- BAGIAN ATAS DARI SEBELAH KANAN: INPUT FILE UPLOAD GOOGLE DRIVE -->
                            <div class="card bg-info-subtle border-0 p-3 rounded-4 mb-3 shadow-sm">
                                <h6 class="fw-bold text-info-emphasis mb-1 small" style="font-size:0.8rem;"><i class="bi bi-cloud-arrow-up-fill me-1"></i> ARSIPKAN STRUK KE GOOGLE DRIVE VIA GAS</h6>
                                <p class="text-muted mb-2" style="font-size: 0.72rem;">Unggah gambar bukti bayar ini untuk disimpan langsung ke folder awan kesekretariatan IDI.</p>
                                
                                <div class="row g-2">
                                    <div class="col-sm-8">
                                        <input type="file" class="form-control form-control-sm" id="uploadFileDriveInput" accept="image/*">
                                    </div>
                                    <div class="col-sm-4">
                                        <button type="button" class="btn btn-sm btn-info text-white fw-bold w-100 d-flex align-items-center justify-content-center gap-1" id="btnTriggerUploadDrive" onclick="window.eksekusiUploadStrukKeGoogleDriveGas(${iuran_id})">
                                            <i class="bi bi-cloud-plus-fill"></i> Upload
                                        </button>
                                    </div>
                                </div>
                                <div id="wrapperStatusProgressDrive" class="small mt-2 font-monospace text-secondary d-none" style="font-size:0.75rem;"></div>
                            </div>

                            <!-- PREVIEW BUKTI STRUK DARI DATA IMG -->
                            <h6 class="fw-bold text-dark mb-2 small"><i class="bi bi-image me-1"></i> Lampiran Bukti Transfer Saat Ini:</h6>
                            <div class="text-center bg-light border rounded-4 p-2 overflow-hidden shadow-sm" style="max-height: 290px;">
                                <img src="${urlStrukLokal}" id="imgPreviewStrukVerif" class="img-fluid rounded-3" style="max-height: 275px; object-fit: contain;" alt="Struk Bukti Pembayaran Dokter IDI">
                            </div>
                        </div>
                    </div>
                </div>
            `;

            window.inisialisasiSubmitFormOtorisasiIuran();
        } else {
            wrapper.innerHTML = `<div class="alert alert-danger small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("containerVerifikasiCashBertahap").innerHTML = `<div class="alert alert-danger small text-center m-2">Gagal memuat interaksi server database iuran.</div>`;
    });
};

/**
 * POTONGAN 2: Handler Submit Form AJAX Sisi Kiri (Simpan Keputusan Terima/Tolak)
 */
window.inisialisasiSubmitFormOtorisasiIuran = function() {
    const form = document.getElementById("formOtorisasiIuranMySQL");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const btn = document.getElementById("btnSubmitVerifIuran");
        if (btn) btn.disabled = true;

        const payload = new FormData();
        payload.append("id", document.getElementById("verifIuranId").value);
        payload.append("baca", document.getElementById("verifStatusAksi").value);
        payload.append("keterangan", document.getElementById("verifKeterangan").value.trim());

        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

        fetch(`${cleanEndpoint}/proses.php?aksi=update_otorisasi_iuran_cash`, {
            method: "POST",
            body: payload,
            mode: "cors",              
            credentials: "include"    	
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
            tutupModalTerbuka();
            menuIuran();
            setTimeout(() => {
            alert('berhasil')
            document.getElementById('cb'+document.getElementById('verifIuranId').value).click();
            }, 1000);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Koneksi bermasalah.");
            if (btn) btn.disabled = false;
        });
    });
};

/**
 * POTONGAN 1 (NEW AUTOMATOR): Kirim Berkas ke Google Drive GAS, Lalu Tembak ID-nya ke Kolom 'img' MySQL
 */
window.eksekusiUploadStrukKeGoogleDriveGas = function(idBarisIuran) {
    const fileInput = document.getElementById("uploadFileDriveInput");
    const progressLabel = document.getElementById("wrapperStatusProgressDrive");
    const btnUpload = document.getElementById("btnTriggerUploadDrive");
    

        
        
    if (!fileInput || fileInput.files.length === 0) {
        alert("⚠️ Silakan pilih file gambar bukti struk pembayaran terlebih dahulu!");
        return;
    }

    const fileTarget = fileInput.files[0];
    if (progressLabel) {
        progressLabel.className = "small mt-2 font-monospace text-primary d-block fw-bold";
        progressLabel.innerHTML = `<div class="spinner-border spinner-border-sm me-1" role="status"></div> Mengonversi berkas ke Base64...`;
    }
    if (btnUpload) btnUpload.disabled = true;

    const ekstensiFile = fileTarget.name.substring(fileTarget.name.lastIndexOf('.'));

    const reader = new FileReader();
    reader.readAsDataURL(fileTarget);
    
    reader.onload = function() {
        const base64DataRaw = reader.result.split(',')[1]; // Mengambil string biner Base64 bersih
        
        if (progressLabel) progressLabel.innerHTML = `<div class="spinner-border spinner-border-sm text-warning me-1" role="status"></div> Mengarsipkan file ke Google Drive via GAS...`;

        const payloadDrive = new URLSearchParams();
        payloadDrive.append("fileData", base64DataRaw);
        payloadDrive.append("fileName", `${idBarisIuran}${ekstensiFile}`);
        payloadDrive.append("mimeType", fileTarget.type);

        // 🟢 PENTING: Ganti URL di bawah ini dengan URL Web App Google Apps Script resmi IDI Batam Anda
        const targetGoogleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbyxvH3Q63O1Tzc8Y7nwAxytDopwzzrPk3d3Gb1smfqGHGvtTISceWbZH7Ud2LiMBgEL/exec";

        // LANGKAH 1: Unggah berkas fisik gambar ke awan Google Drive
        // Catatan: Mengubah mode menjadi "cors" agar JavaScript dapat membaca return JSON 'fileId' dari Google
        fetch(targetGoogleAppsScriptUrl, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: payloadDrive
        })
        .then(res => res.json())
        .then(res => {
            if (res.status !== 'success') throw new Error(res.message || "Gagal mengunggah ke Drive.");

            if (progressLabel) progressLabel.innerHTML = `<div class="spinner-border spinner-border-sm text-success me-1" role="status"></div> Sukses Drive! Sinkronisasi ID berkas ke database MySQL IDI...`;

            const payloadMySQL = new FormData();
            payloadMySQL.append("id", idBarisIuran);
            payloadMySQL.append("google_file_id", res.fileId);
            payloadMySQL.append("baca", "0");
            // Melemparkan string ID unik berkas Drive

            const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
            return fetch(`${cleanEndpoint}/proses.php?aksi=update_image_id_iuran`, {
                method: "POST",
                body: payloadMySQL,
                mode: "cors",              
                credentials: "include"
            });
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            if (res.status === 'success') {
                if (progressLabel) {
                    progressLabel.className = "small mt-2 font-monospace text-success d-block fw-bold";
                    progressLabel.innerHTML = `✔️ SUKSES TOTAL! Berkas tersimpan di Google Drive`;
                }
            
        
            if(localStorage.getItem("admin_is_logged")==="true")
            {
                const imgPreview = document.getElementById("imgPreviewStrukVerif");
                if (imgPreview) imgPreview.src = URL.createObjectURL(fileTarget);
                let konfirm=confirm('Apakah Anda ingin kembali ke List Cast Iuran?');
                tutupModalTerbuka();
                menuIuran();
                if(konfirm)
                {
                setTimeout(() => {
                alert('berhasil')
                document.getElementById('cb'+idBarisIuran).click();
                }, 1000);
                }
            }
            else
            {
            tutupModalTerbuka();
            menuIuran();
            setTimeout(() => {
            alert('berhasil')
            document.getElementById('cb'+idBarisIuran).click();
            }, 1000);
            }
                
            }
            if (btnUpload) btnUpload.disabled = false;
        })
        .catch(err => {
            console.error(err);
            alert("Proses sinkronisasi terganggu: " + err.message);
            if (progressLabel) {
                progressLabel.className = "small mt-2 font-monospace text-danger d-block";
                progressLabel.innerHTML = `❌ Gagal memproses sinkronisasi dua sisi.`;
            }
            if (btnUpload) btnUpload.disabled = false;
        });
    };
};


window.eksekusiTambahCicilanCashBertahapMandiri = function(idAnggota, namaDokter, tahunBuku, labelPeriode, namaBulan, nomorTahap, nomorTelpon) {
    if (!confirm(`KONFIRMASI CICILAN MANDIRI!\nApakah Anda yakin ingin menambah pembayaran Cash Bertahap sebesar Rp 50.000 untuk perbaikan tunggakan bulan [${namaBulan}] pada tahun buku ${tahunBuku}?`)) {
        return;
    }

    const hariIniStr = new Date().toISOString().substring(0, 10);
    
    // Siapkan form payload data menuju MySQL database
    const payload = new FormData();
    payload.append("no_anggota", idAnggota);
    payload.append("nama_anggota", namaDokter);
    payload.append("tanggal_bayar", hariIniStr);
    payload.append("periode", labelPeriode);
    payload.append("jumlah", "50000"); // Kunci nominal flat wajib 50.000
    payload.append("cabang", "Batam");
    payload.append("tahun", tahunBuku);
    payload.append("status", "Cash Bertahap"); // Set status tetap Cash Bertahap
    payload.append("keterangan", `Cicilan Mandiri Tahap ${nomorTahap} (${namaBulan})`);
    payload.append("interval", "1");
    payload.append("periode_bulan", "juli-juni");
    payload.append("baca","3");

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=insert_transaksi_iuran`, {
        method: "POST",
        body: payload,
        mode: "cors",              
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert(`Sukses! Pembayaran Cash Bertahap Tahap ${nomorTahap} (${namaBulan}) berhasil ditambahkan ke database.`);
            tutupModalTerbuka();
            menuIuran();
            setTimeout(() => {
            alert('berhasil')
            document.getElementById('cb'+data.id_baru).click();
            }, 1000);
        } else {
            alert("Gagal menyimpan cicilan: " + data.message);
            window.location.reload();
        }
    })
        .catch(err => {
        console.error("Gagal update cicilan cash bertahap:", err);
        alert("Gangguan koneksi cloud server");
    });
};


/**
 * Fungsi Menampilkan Popup Alasan Pending Iuran + Form Perbaikan Keterangan & Upload Struk
 */
window.bukaModal3LihatAlasanPendingIuranMurni = function(teksAlasan, labelPeriode, idIuran, nomorTelpon,adminuser) {
    // Ambil catatan keterangan lama yang tertera di baris tabel (jika ada) untuk ditampilkan kembali
    let keteranganLama = "";
    if (window.globalListDbIuranAktif) {
        const itemEksis = window.globalListDbIuranAktif.find(x => x.iuran_id == idIuran);
        if (itemEksis) keteranganLama = itemEksis.keterangan || "";
    }
    
    let khusususer="";
    if(adminuser==="user")
    {
    khusususer=`<form id="formPerbaruiKeteranganIuranPending" class="mb-4">
                <div class="mb-3 bg-light p-3 rounded-4 border">
                    <label class="form-label fw-bold text-dark small mb-1">
                        <i class="bi bi-pencil-square text-success me-1"></i> Perbarui Catatan / Keterangan Pembayaran
                    </label>
                    <p class="text-muted" style="font-size: 0.72rem; margin-bottom: 8px;">Anda dapat mengubah pesan keterangan di bawah ini untuk memberikan konfirmasi atau klasifikasi balasan kepada tim verifikator admin.</p>
                    
                    <div class="input-group">
                        <input type="text" class="form-control form-control-sm fw-semibold" id="editKeteranganIuranPending" 
                               value="${keteranganLama}" placeholder="Contoh: Sudah ditransfer kekurangan Rp 50.000 via Bank Mandiri..." required autocomplete="off">
                        <button type="submit" class="btn btn-sm btn-success fw-bold font-monospace" id="btnSaveKeteranganPending" style="font-size:0.75rem;">
                            <i class="bi bi-save-fill"></i> Simpan Catatan
                        </button>
                    </div>
                    <div id="statusSimpanKeteranganText" class="form-text small mt-1 font-monospace"></div>
                </div>
            </form>

            <!-- 3. TOMBOL ALSI UNTUK RE-UPLOAD STRUK SECARA INSTAN -->
            <div class="alert bg-success-subtle text-success border-0 p-3 rounded-4 mb-4 d-flex justify-content-between align-items-center gap-3">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-cloud-arrow-up-fill fs-4"></i>
                    <div class="small">
                        <span class="fw-bold d-block text-success-emphasis">Unggah Ulang Bukti Transfer</span>
                        <span>Klik tombol di kanan untuk mengganti berkas gambar struk yang salah.</span>
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-success fw-bold px-3 rounded-pill shadow-sm"
                        onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close(); setTimeout(() => { window.bukaPortalUploadDriveModal3Direct('${idIuran}', '${nomorTelpon}'); }, 300);">
                    <i class="bi bi-cloud-arrow-up-fill me-1"></i> Upload Struk Baru
                </button>
            </div>
`;
}
    const htmlKotakInfoAlasan = `
        <div class="container py-2" id="userLihatAlasanPendingIuranWrapper">
            <!-- 1. KOTAK NOTIFIKASI CATATAN KOREKSI ADMIN -->
            <div class="card border-0 bg-warning-subtle rounded-4 p-4 mb-4 border border-warning-subtle shadow-sm">
                <div class="d-flex align-items-start gap-3">
                    <i class="bi bi-chat-left-text-fill text-warning fs-2 mt-1"></i>
                    <div class="w-100">
                        <h6 class="fw-bold text-warning-emphasis mb-1">Catatan Koreksi Verifikator Iuran IDI:</h6>
                        <p class="small text-dark-emphasis mb-0 font-monospace p-3 bg-white bg-opacity-70 rounded-3 border border-warning border-opacity-25" style="line-height: 1.6; white-space: pre-line;">
                            ${teksAlasan}
                        </p>
                    </div>
                </div>
            </div>

${khusususer}
            <!-- TOMBOL KELUAR -->
            <div class="text-start pt-2 border-top">
                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" 
                        onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">
                    Tutup Jendela
                </button> <button type="button" class="btn btn-sm btn-danger fw-bold rounded-pill px-4 shadow-sm" 
                        onclick="PembatalanPembayaranIuran(${idIuran})">
                    Batalkan
                </button>
            </div>
        </div>
    `;

    // Bentangkan Formulir Isian ke dalam Jendela Komponen Modal 3 (fsDialog) Bawaan Aplikasi
    if (typeof modal3v === "function") {
        modal3v(`Status Pending: Periode ${labelPeriode}`, htmlKotakInfoAlasan);
    } else {
        alert("Modul jendela modal3v tidak terdefinisi!");
        return;
    }

    // 4. HANDLER AJAX: Menyimpan perubahan teks keterangan tanpa menutup modal
    const formEditKet = document.getElementById("formPerbaruiKeteranganIuranPending");
    if (formEditKet) {
        formEditKet.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const btnSave = document.getElementById("btnSaveKeteranganPending");
            const statusLabel = document.getElementById("statusSimpanKeteranganText");
            const teksKeteranganBaru = document.getElementById("editKeteranganIuranPending").value.trim();

            if (btnSave) {
                btnSave.disabled = true;
                btnSave.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span>`;
            }
            if (statusLabel) {
                statusLabel.className = "form-text text-muted small mt-1 font-monospace animate-pulse";
                statusLabel.innerText = "Mengirim catatan ke MySQL...";
            }

            const payload = new FormData();
            payload.append("id_iuran", idIuran);
            payload.append("keterangan_baru", teksKeteranganBaru);

            const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

            fetch(`${cleanEndpoint}/proses.php?aksi=update_keterangan_iuran_pending`, {
                method: "POST",
                body: payload,
                mode: "cors",              
                credentials: "include"
            })
            .then(res => {
                if (!res.ok) throw new Error("HTTP error " + res.status);
                return res.json();
            })
            .then(data => {
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.innerHTML = `<i class="bi bi-save-fill"></i> Simpan Catatan`;
                }

                if (data.status === 'success') {
                    if (statusLabel) {
                        statusLabel.className = "form-text text-success fw-bold small mt-1 font-monospace animate-fade-in";
                        statusLabel.innerHTML = `<i class="bi bi-check-circle-fill"></i> Catatan berhasil diperbarui!`;
        
        const modal1El = document.getElementById('generalFullscreenModal');
                        if (modal1El && modal1El.classList.contains('show')) {
        if (typeof window.closeGeneralFullscreenModal === 'function') {
            window.closeGeneralFullscreenModal();
        return true;
        }
                        }
                        menuIuran();
                    }
                    // Perbarui data array lokal agar sinkron saat form dibuka kembali
                    if (window.globalListDbIuranAktif) {
                        const item = window.globalListDbIuranAktif.find(x => x.iuran_id == idIuran);
                        if (item) item.keterangan = teksKeteranganBaru;
                    }
                } else {
                    if (statusLabel) {
                        statusLabel.className = "form-text text-danger small mt-1 font-monospace";
                        statusLabel.innerText = `Gagal: ${data.message}`;
                    }
                    setTimeout(() => {
  window.location.reload();
}, 2000);
                }
            })
            .catch(err => {
                console.error("Gagal update keterangan pending:", err);
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.innerHTML = `<i class="bi bi-save-fill"></i> Simpan Catatan`;
                }
                if (statusLabel) {
                    statusLabel.className = "form-text text-danger small mt-1 font-monospace";
                    statusLabel.innerText = "Koneksi terputus ke file proses.php.";
                }
            });
        });
    }
};


window.PembatalanPembayaranIuran = function(idIuran) {
    if (!idIuran) {
        alert("Gagal memproses pembatalan: Parameter ID Iuran kosong!");
        return;
    }

    // Konfirmasikan tindakan gawat darurat kepada pengurus/admin sebelum menghapus data
    if (!confirm(`PERINGATAN KAS!\nApakah Anda yakin ingin membatalkan transaksi ?`)) {
        return;
    }

    // Bungkus ID iuran ke dalam form data objek payload
    const payload = new FormData();
    payload.append("id_iuran", idIuran);

    // Ambil endpoint hulu dan nomor WA context aktif untuk keperluan refresh otomatis
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_iuran`, {
        method: "POST",
        body: payload,
    mode: "cors",              
    credentials: "include"
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            // ⚡ REFRESH OTOMATIS: Segarkan kembali linimasa tabel iuran dokter di layar modal hulu
            tutupModalTerbuka();
            setTimeout(() => {
    menuIuran();
}, 1000);
            
        }
        else
        {
           window.location.reload(); 
        }
    })
    .catch(err => {
        console.error("Gagal mengeksekusi pembatalan iuran:", err);
        alert("Koneksi gagal: Tidak dapat terhubung dengan file proses.php server.");
    });
};


window.bukaFormBayarIuranModal2Direct = function(idAngg, namaDokter, telpon, tahunTagihan, labelPeriode, intervalBulan, idk) {
    let modestatus="";
    var elemen = document.getElementsByClassName('sbl');
    for (var i = 0; i < elemen.length; i++) {
    var status = elemen[i].getAttribute('data-status');
    var id_status = elemen[i].getAttribute('data-id')
    if(id_status<idk && status!="")
    {
    modestatus="tolak";
    }
    }
    
    if(modestatus==="tolak")
    {
    alert('Maaf, Akses di tolak, silakan selesaikan tunggakan iuran sebelumnya')
    return;
    }
    const hariIni = new Date().toISOString().substring(0, 10);
    const totalNominalKasAuto = 50000 * parseInt(intervalBulan, 10);
    
    const tahunTerbaruBerjalan = new Date().getFullYear(); 
    const tahunBukuTransaksi = parseInt(tahunTagihan);

    let komponenPilihanStatus = '';
    
    if (tahunBukuTransaksi === tahunTerbaruBerjalan) {
        komponenPilihanStatus='disabled';
    }
 
    const htmlFormBayar = `
        <div class="container py-2" id="formEntryIuranWrapper">
            <form id="formInsertTransaksiIuranMySQL" class="row g-3">
                <div class="col-md-3">
                    <label class="form-label fw-semibold text-secondary small">ID Anggota</label>
                    <input type="text" class="form-control bg-light font-monospace fw-bold" id="payNoAnggota" value="${idAngg}" readonly>
                </div>
                <div class="col-md-5">
                    <label class="form-label fw-semibold text-secondary small">Nama Dokter</label>
                    <input type="text" class="form-control bg-light fw-bold" id="payNamaAnggota" value="${namaDokter}" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold text-secondary small">No Telepon</label>
                    <input type="text" class="form-control bg-light font-monospace" id="payTelpon" value="${telpon}" readonly>
                </div>

                <div class="col-md-5">
                    <label class="form-label fw-semibold text-secondary small">Siklus Periode Wajib</label>
                    <input type="text" class="form-control bg-light fw-bold text-success" id="payPeriode" value="${labelPeriode}" readonly>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold text-secondary small">Tahun Buku</label>
                    <input type="text" class="form-control bg-light font-monospace text-center fw-bold" id="payTahun" value="${tahunTagihan}" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> Tanggal Bayar</label>
                    <input type="date" class="form-control font-monospace" id="payTanggalBayar" value="${hariIni}" required>
                </div>

                <!-- 🟢 1. TAMBAHAN DROPDOWN PILIHAN STATUS TERMASUK CASH BERTAHAP -->
                <div class="col-md-4">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> Status Verifikasi</label>
                    <select class="form-select fw-bold text-dark" id="payStatusSelect" onchange="window.hitungUlangNominalIuranDinamis(${totalNominalKasAuto})"  ${komponenPilihanStatus}>
                        <option value="Upload Bukti" selected>Upload Bukti (Default)</option>
                        <option value="Cash Bertahap">Cash Bertahap (Cicilan Tunggakan)</option>
                        
                    </select>
                </div>

                <div class="col-md-4">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> Jumlah Nominal Kas</label>
                    <input type="number" class="form-control font-monospace fw-bold text-dark-emphasis" id="payJumlah" value="${totalNominalKasAuto}" style="letter-spacing:0.5px;" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> Cabang</label>
                    <input type="text" class="form-control bg-light font-monospace fw-bold text-dark-emphasis" id="payCabang" value="Batam" readonly>
                </div>
                
                <div class="col-md-12">
                    <label class="form-label fw-bold small">Catatan / Keterangan</label>
                    <input type="text" class="form-control" id="payKeterangan" placeholder="Transfer Mandiri / Cicilan Tunggakan Masa Lalu...">
                </div>

                <input type="hidden" id="payInterval" value="${intervalBulan}">
                <input type="hidden" id="payPeriodeBulan" value="juli-juni">

                <div class="col-md-12">
                    <div class="alert alert-danger mb-0" role="alert" style="font-size:12px" id="payHintAlertText">
                        Jika pada periode ini, ada alasan tertentu yang menyebabkan anda tidak menyelesaikan pembayaran iuran, ganti nominal menjadi 0 (nihil), dan pada catatan/keterangan beri penjelasan yang meyakinkan.
                    </div>
                </div>
                
                <div class="col-12 text-end pt-3 border-top mt-4">
                    <button type="submit" class="btn btn-sm btn-success px-4 fw-bold" id="btnSubmitSimpanIuran">
                        <i class="bi bi-save2 me-1"></i> Simpan & Lanjutkan Upload Struk
                    </button>
                </div>
            </form>
        </div>
    `;

    // Render formulir baru ke dalam Modal Kedua
    modal2v(`Pelunasan Iuran: Tahun ${tahunTagihan}`, htmlFormBayar);
	
    /**
     * 🟢 2. ENGINE SWITCHER: Mengunci nominal 50.000 saat status Cash Bertahap dipilih
     */
    window.hitungUlangNominalIuranDinamis = function(nominalNormalOtomatis) {
        const statusSelect = document.getElementById("payStatusSelect").value;
        const inputJumlah = document.getElementById("payJumlah");
        const hintAlert = document.getElementById("payHintAlertText");
        const btnSubmitText = document.getElementById("btnSubmitSimpanIuran");

        if (statusSelect === "Cash Bertahap") {
            inputJumlah.value = "50000"; // Mengunci nilai input kas bulanan ke 50.000
            inputJumlah.className = "form-control bg-light font-monospace fw-bold text-success";
            inputJumlah.readOnly = false; 
            
            if (hintAlert) {
                hintAlert.className = "alert alert-info mb-0";
                hintAlert.innerHTML = `<i class="bi bi-info-circle-fill me-1"></i> <b>Mode Cash Bertahap Aktif:</b> Nominal dikunci sebesar <b>Rp 50.000</b> untuk cicilan tunggakan bulanan masa lalu anggota.`;
            }
            if (btnSubmitText) {
                btnSubmitText.innerHTML = `<i class="bi bi-save2 me-1"></i> Simpan Cicilan Cash Bertahap`;
            }
        } else {
            inputJumlah.value = nominalNormalOtomatis; // Kembalikan ke nominal hitungan awal
            inputJumlah.className = "form-control font-monospace fw-bold text-dark-emphasis";
            inputJumlah.readOnly = false;
            
            if (hintAlert) {
                hintAlert.className = "alert alert-danger mb-0";
                hintAlert.innerHTML = `Jika pada periode ini, ada alasan tertentu yang menyebabkan anda tidak menyelesaikan pembayaran iuran, ganti nominal menjadi 0 (nihil), dan pada catatan/keterangan beri penjelasan yang meyakinkan.`;
            }
            if (btnSubmitText) {
                btnSubmitText.innerHTML = `<i class="bi bi-save2 me-1"></i> Simpan & Lanjutkan Upload Struk`;
            }
        }
    };

    // 🟢 3. SUBMIT HANDLER YANG SUDAH BERSIH DARI BUG DUPLIKASI STATUS
    const formInsert = document.getElementById("formInsertTransaksiIuranMySQL");
    formInsert.addEventListener("submit", function(e) {
        e.preventDefault();

        const btnSimpan = document.getElementById("btnSubmitSimpanIuran");
        if (btnSimpan) btnSimpan.disabled = true;

        const payload = new FormData();
        payload.append("no_anggota", document.getElementById("payNoAnggota").value);
        payload.append("nama_anggota", document.getElementById("payNamaAnggota").value);
        payload.append("tanggal_bayar", document.getElementById("payTanggalBayar").value);
        payload.append("periode", document.getElementById("payPeriode").value);
        payload.append("jumlah", document.getElementById("payJumlah").value);
        payload.append("cabang", document.getElementById("payCabang").value);
        payload.append("tahun", document.getElementById("payTahun").value);
        
        

        const targetStatusKirim = document.getElementById("payStatusSelect").value;
        payload.append("status", targetStatusKirim);
        
        if(targetStatusKirim==="Cash Bertahap")
        {
        payload.append("baca", "3");
        }
        else
        {
        payload.append("baca", "1");   
        }
        
        payload.append("keterangan", document.getElementById("payKeterangan").value.trim());
        payload.append("interval", document.getElementById("payInterval").value);
        payload.append("periode_bulan", document.getElementById("payPeriodeBulan").value);

        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

        fetch(`${cleanEndpoint}/proses.php?aksi=insert_transaksi_iuran`, {
            method: "POST",
			mode: "cors",
            body: payload,
			credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                tutupModalTerbuka();
                
                setTimeout(() => { 
                    window.eksekusiFetchIuranMurni(telpon); 
                }, 400);
                
                if (targetStatusKirim === "Upload Bukti") {
                    window.bukaPortalUploadDriveModal3Direct(data.id_baru, telpon);
                } else {
                    alert(`Sukses! Pembayaran dengan status [${targetStatusKirim}] berhasil dicatat.`);
                }
            } else {
                alert(data.message);
                if (btnSimpan) btnSimpan.disabled = false;
                window.location.reload();
            }
        })
        .catch(err => {
            alert("Koneksi gagal.");
            if (btnSimpan) btnSimpan.disabled = false;
        });
    });
};


window.bukaPortalUploadDriveModal3Direct = function(idIuranMySQL, nomorTelponOriginal) {
    

    const htmlUploadEngine = `
        <div class="container py-2" id="driveUploadWrapper">
            <div class="alert alert-info py-2 small mb-3">
                <i class="bi bi-info-circle me-1"></i> Berkas struk akan disimpan otomatis dengan nama: <b>${idIuranMySQL}.jpg</b>
            </div>
            <form id="ajaxFormUploadToGoogleDrive" class="p-1">
            <div class="p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mb-3"><b class="text-success d-block"><i class="bi bi-bank me-1"></i> Info Rekening Kas Resmi IDI:</b> Bank Mandiri: <span class="font-monospace fw-bold text-dark">109.00.10502060</span><br><small class="text-muted">Atas Nama: IDI BATAM</small></div>
                <div class="mb-3">
                    <label class="form-label small"><b><u>Upload Berkas Struk Bukti Bayar</u></b><br>* <i>Jika pada periode ini, Anda tidak membayar karena alasan tertentu, lampirkan bukti (misalnya Surat Keterangan Pindah dari cabang sebelumnya atau surat keterangan PPDS, atau fotokopi Ijasah Spesialis atau S2 pada periode tersebut</i></label>
                    <input type="file" class="form-control" id="fileBuktiDrive" accept="image/*" required>
                </div>
                <div class="progress mb-3 d-none" id="uploadProgressBarContainer" style="height: 8px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" id="uploadProgressBarElement" style="width: 0%"></div>
                </div>
                <div class="text-end border-top pt-2">
                    <button type="submit" class="btn btn-sm btn-success px-4 fw-bold" id="btnSubmitUploadDrive">
                        <i class="bi bi-cloud-upload me-1"></i> Unggah Bukti
                    </button>
                    <button type="submit" class="btn btn-sm btn-danger px-4 fw-bold" id="btnSubmitUploadDrive" onclick="PembatalanPembayaranIuran(${idIuranMySQL})">
                        <i class="bi bi-x-circle me-1"></i> Batalkan
                    </button>
                </div>
            </form>
        </div>
    `;

    // Pastikan Anda memanggil fungsi modal3 bawaan sistem Anda untuk membuka popup
    if (typeof modal3v === "function") {
        modal3v('Upload', htmlUploadEngine);
    } else {
        alert("Fungsi modal3() tidak terdeteksi di dalam memori global.");
        return;
    }

  const formUpload = document.getElementById("ajaxFormUploadToGoogleDrive");
formUpload.addEventListener("submit", function(e) {
    e.preventDefault();

    const fileInput = document.getElementById("fileBuktiDrive");
    const btnUpload = document.getElementById("btnSubmitUploadDrive");
    const progressBar = document.getElementById("uploadProgressBarElement");
    const progressContainer = document.getElementById("uploadProgressBarContainer");

    // 1. Validasi awal ketersediaan berkas di input file
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Silakan pilih berkas struk bukti bayar terlebih dahulu!");
        return;
    }
	
	const fileMurni = fileInput.files[0]; 
    const googleAppsScriptUploadUrl = "https://script.google.com/macros/s/AKfycbwTEAq-xocdPHFIOKXY-vh12EzNFBGXjZYGlQoP5sN_KcEpZjTZWf-XZfWdxShd5DGMPQ/exec";
    if (btnUpload) btnUpload.disabled = true;
    if (progressContainer) progressContainer.classList.remove("d-none");
    if (progressBar) progressBar.style.width = "40%";

            const reader = new FileReader();
        reader.readAsDataURL(fileMurni);  
        reader.onload = function(event) {
        // Ambil string kode enkripsi Base64 murni setelah karakter koma ","
        const base64DataMurni = event.target.result.split(',')[1]; 
        
        if (progressBar) progressBar.style.width = "70%";

        // Konversi paket parameters ke bentuk teksSearchParams agar lolos Cloudflare & CORS
        const paketTeksParams = new URLSearchParams();
        paketTeksParams.append("filename", idIuranMySQL + ".jpg");
        paketTeksParams.append("mimeType", "image/jpeg");
        paketTeksParams.append("base64", base64DataMurni);

            fetch(googleAppsScriptUploadUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: paketTeksParams.toString()
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error status " + res.status);
            return res.json();
        })
            .then(data => {
            if (progressBar) progressBar.style.width = "90%";

            if (data.status === 'success' || data.id) {
                const googleFileId = data.id;

                const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
                const updatePayload = new FormData();
                updatePayload.append("id", idIuranMySQL);
                updatePayload.append("img", googleFileId);
                updatePayload.append("status", "Menunggu Validasi Admin");
				updatePayload.append("nama_anggota", localStorage.getItem("idi_nama_dokter"));
				updatePayload.append("no_anggota", localStorage.getItem("idi_id_user"));
                // Kirim tautan gambar kembali ke server PHP MySQL lokal Anda
                fetch(`${cleanEndpoint}/proses.php?aksi=update_link_drive_iuran`, {
                    method: "POST",
                    body: updatePayload,
					mode: "cors",              
                    credentials: "include"
                })
                .then(res => res.json())
                .then(finalRes => {
                    if (progressBar) progressBar.style.width = "100%";
                    alert(`Sukses! Bukti pembayaran berhasil diunggah dengan nama ${idIuranMySQL}.jpg`);

                    const dialog3 = document.getElementById("fsDialog");
                    if (dialog3 && typeof dialog3.close === "function") {
                        dialog3.close();
                        setTimeout(() => { 
                            window.eksekusiFetchIuranMurni(nomorTelponOriginal); 
                        }, 400);
                    }
                    const dialogModalEl = document.getElementById("secondAdminModal") || document.getElementById("fsDialog2");
    
                   if (dialogModalEl) {
                   if (typeof dialogModalEl.close === "function") {
                   dialogModalEl.close(); // Tutup dialog native HTML5
                    }
				   }
                    if (typeof window.menuPencarianIuran === "function") {
                        window.menuPencarianIuran();
                        setTimeout(() => { 
                            window.eksekusiFetchIuranMurni(nomorTelponOriginal); 
                        }, 400);
                    }
                });
            }  else {
                alert("Gagal mengunggah berkas bukti ke Google Apps Script: " + (data.message || "Unknown error"));
                window.resetUploadButtonStateDirect();
            }
        })
        .catch(err => {
            console.error("Cloud Transmission Error:", err);
            alert("Terjadi gangguan transmisi data CORS/Cloudflare. Silakan periksa ukuran file atau coba kembali.");
            window.resetUploadButtonStateDirect();
        });
    };
});
}

window.bukaFormBayarIuranModal2ManualDinamis = function(idAngg, namaDokter, telpon, isSemuaLunas, tahunTerakhirTerarsip) {
    if (isSemuaLunas === false || isSemuaLunas === "false") {
        alert("Akses Ditolak! \nFormulir Tambah Iuran Baru hanya dapat dibuka jika seluruh periode sebelumnya sudah berstatus LUNAS. Cari Tombol Belum Lunas, lalu klik untuk menyelesaikan tunggakan anda");
        return;
    }

    const hariIni = new Date().toISOString().substring(0, 10);
	const daftarSemuaBulan = [
        "januari", "februari", "maret", "april", "mei", "juni",
        "juli", "agustus", "september", "oktober", "november", "desember"
    ];
	
	let bulanAwalBaru = "juli";
    let tahunAwalBaru = parseInt(tahunTerakhirTerarsip, 10) + 1; // Fallback default
    let intervalTerakhir = 12;
    let periodeBulanTerakhir = "juli-juni";

    if (window.globalLastKnownInterval) intervalTerakhir = window.globalLastKnownInterval;
    if (window.globalLastKnownPeriodeBulan) periodeBulanTerakhir = window.globalLastKnownPeriodeBulan;
    if (window.globalLastLabelOtomatis) {
        const strLabelLast = window.globalLastLabelOtomatis; // Ambil memori label terakhir
        if (strLabelLast.includes("s/d")) {
            const splitSId = strLabelLast.split("s/d");
            const bagianKanan = splitSId[1].trim(); // Ambil "Juli-2027"
            
            if (bagianKanan.includes("-")) {
                const splitBlnThn = bagianKanan.split("-");
                const namaBulanSelesai = splitBlnThn[0].toLowerCase().trim(); // "juli"
                const tahunSelesai = parseInt(splitBlnThn[1], 10); // 2027

                // Cari index bulan selesai, lalu majukan 1 bulan ke depan untuk periode baru
                let indexBlnLast = daftarSemuaBulan.indexOf(namaBulanSelesai);
                if (indexBlnLast !== -1) {
                    let nextBlnIndex = indexBlnLast + 1;
                    tahunAwalBaru = tahunSelesai;
                    
                    if (nextBlnIndex > 11) { // Jika melompati Desember, tahun bertambah
                        nextBlnIndex = 0;
                        tahunAwalBaru = tahunSelesai + 1;
                    }
                    bulanAwalBaru = daftarSemuaBulan[nextBlnIndex]; // Berhasil dikunci (ex: "agustus")
                }
            }
        }
    }
    // Hitung tahun buku pelanjutan baru (1 tahun setelah tahun arsip tertinggi)
    const tahunBukuBaru = parseInt(tahunTerakhirTerarsip, 10) + 1;

    // Urai teks bulan awal dari properti database (contoh: "juni-mei" -> ambil "juli")
    const arrayBulan = periodeBulanTerakhir.split('-');
    const textBulanAwal = arrayBulan[0] ? arrayBulan[0].toLowerCase().trim() : "juli";

    // Struktur formulir input Modal 2
    const htmlFormTambahManual = `
        <div class="container py-2" id="formEntryIuranManualWrapper">
            <div class="row justify-content-center">
                <div class="col-lg-11">
                    <div class="alert bg-primary-subtle text-primary border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3">
                        <i class="bi bi-calendar-plus-fill fs-3"></i>
                        <div>
                            <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Form Tambah Iuran Periode Baru</span>
                            <span class="small">Siklus teks terkunci otomatis. Mengubah pilihan interval bulan di kanan akan langsung menghitung ulang tanggal rentang secara real-time.</span>
                        </div>
                    </div>

                    <form id="formInsertTransaksiIuranMySQLManual" class="row g-3">
                        <!-- PROFIL DATA ANGGOTA -->
                        <div class="col-md-3">
                            <label class="form-label fw-bold small">ID Anggota</label>
                            <input type="text" class="form-control bg-light font-monospace fw-bold" id="payNoAnggotaManual" value="${idAngg}" readonly>
                        </div>
                        <div class="col-md-5">
                            <label class="form-label fw-bold small">Nama Lengkap Anggota</label>
                            <input type="text" class="form-control bg-light fw-bold" id="payNamaAnggotaManual" value="${namaDokter}" readonly>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold small">Nomor Telepon / WA</label>
                            <input type="text" class="form-control bg-light font-monospace" id="payTelponManual" value="${telpon}" readonly>
                        </div>

                        <!-- 🔒 SECTION SIKLUS: READONLY DAN DINAMIS BERHITUNG TERGANTUNG SELECT INTERVAL -->
                        <div class="col-md-5">
                            <label class="form-label fw-bold text-success small">Siklus Periode Wajib (Readonly Auto)</label>
                            <input type="text" class="form-control bg-light fw-bold border-success text-success" id="payPeriodeManual" value="" readonly>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-bold small">Tahun Buku Tagihan</label>
                            <input type="text" class="form-control bg-light font-monospace text-center fw-bold" id="payTahunManual" value="${tahunBukuBaru}" readonly>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold small"><span class="text-danger">*</span> Interval Tagihan (Jumlah Bulan)</label>
                            <!-- 💡 REVISI UTAMA: Mengubah input angka menjadi SELECT DROPDOWN kustom modular -->
                            <select class="form-select font-monospace fw-bold border-primary text-primary" 
        id="payIntervalManual" 
        onchange="window.hitungOtomatisSiklusTeksFormManual('${bulanAwalBaru}', ${tahunAwalBaru})">
    <option value="1">1 Bulan (Siklus Pendek)</option>
    <option value="3">3 Bulan (Triwulan Kas)</option>
    <option value="6">6 Bulan (Semester Kas)</option>
    <option value="12">12 Bulan (1 Tahun Buku)</option>
</select>
                        </div>

                        <!-- ENTRY TRANSAKSI KAS -->
                        <div class="col-md-4">
                            <label class="form-label fw-bold small"><span class="text-danger">*</span> Tanggal Pembayaran</label>
                            <input type="date" class="form-control font-monospace" id="payTanggalBayarManual" value="${hariIni}" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold small"><span class="text-danger">*</span> Jumlah Nominal Kas (Angka Murni)</label>
                            <div class="input-group">
                                <span class="input-group-text fw-bold">Rp</span>
                                      <input type="number" class="form-control bg-light font-monospace fw-bold text-dark-emphasis" id="payJumlahManual" value="" style="letter-spacing:0.5px;">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold small"><span class="text-danger">*</span> Cabang Kas Pembayaran</label>
                            <input type="text" class="form-control bg-light font-monospace text-center text-muted fw-bold" id="payCabangManual" value="Batam" readonly>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold small">Label Rentang Bulan</label>
                            <input type="text" class="form-control bg-light font-monospace text-center text-muted fw-bold" id="payPeriodeBulanManual" value="" readonly>
                        </div>
                        <div class="col-md-8">
                            <label class="form-label fw-bold small">Catatan / Keterangan Tambahan</label>
                            <input type="text" class="form-control" id="payKeteranganManual" placeholder="Input Terjadwal via Dashboard Admin...">
                        </div>

                        <div class="col-12 text-end pt-3 border-top mt-4">
                            <button type="submit" class="btn btn-sm btn-success px-4 fw-bold" id="btnSubmitSimpanIuranManual">
                                <i class="bi bi-save2-fill me-1"></i> Simpan & Lanjutkan Struk
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    modal2v('Tambah Iuran', htmlFormTambahManual);

    // 💡 REVISI ENGINE: Pasang nilai default select dropdown mengikuti interval terakhir tabel kas Anda
    const dropdownInterval = document.getElementById("payIntervalManual");
    if (dropdownInterval) {
        // Jika interval terakhir terdaftar di sistem (1, 3, 6, 12) pasang valuenya, jika tidak default 12
        if ([1, 3, 6, 12].includes(intervalTerakhir)) {
            dropdownInterval.value = intervalTerakhir.toString();
        } else {
            dropdownInterval.value = "12";
        }
    }

    // Pemicu awal agar teks rentang langsung terkalkulasi saat form pertama kali terbuka lebar
    window.hitungOtomatisSiklusTeksFormManual(bulanAwalBaru, tahunAwalBaru);
const formInsertManual = document.getElementById("formInsertTransaksiIuranMySQLManual");
    formInsertManual.addEventListener("submit", function(eventSubmit) {
        eventSubmit.preventDefault();

        const btnSimpanManual = document.getElementById("btnSubmitSimpanIuranManual");
        if (btnSimpanManual) {
            btnSimpanManual.disabled = true;
            btnSimpanManual.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Memproses...`;
        }

        const payloadManual = new FormData();
        payloadManual.append("no_anggota", document.getElementById("payNoAnggotaManual").value.trim());
        payloadManual.append("nama_anggota", document.getElementById("payNamaAnggotaManual").value.trim());
        payloadManual.append("tanggal_bayar", document.getElementById("payTanggalBayarManual").value);
        payloadManual.append("periode", document.getElementById("payPeriodeManual").value.trim());
        // Mengirimkan nilai nominal angka bersih hasil hitungan rumus otomatis ke database
        payloadManual.append("jumlah", document.getElementById("payJumlahManual").value);
        payloadManual.append("cabang", document.getElementById("payCabangManual").value.trim());
        payloadManual.append("tahun", document.getElementById("payTahunManual").value.trim());
        payloadManual.append("status", "Upload Bukti");
        payloadManual.append("keterangan", document.getElementById("payKeteranganManual").value.trim());
        payloadManual.append("interval", document.getElementById("payIntervalManual").value);
        payloadManual.append("periode_bulan", document.getElementById("payPeriodeBulanManual").value.trim());

        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

        // ⚡ FIX CONCATENATE: Memasang backtick (`) pembungkus string URL fetch secara valid
        fetch(`${cleanEndpoint}/proses.php?aksi=insert_transaksi_iuran`, {
            method: "POST",
            body: payloadManual,
			mode: "cors",              
            credentials: "include"
        })
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
           // return response.json();
            window.location.reload();
        })
        .then(dataJson => {
            if (dataJson.status === 'success') {
                
                 
                // Buka Modal 3 untuk Mulai Unggah Struk dengan nama otomatis [ID_BARU].jpg
                if (typeof window.bukaPortalUploadDriveModal3Direct === "function") {
					tutupModalTerbuka();
                    window.bukaPortalUploadDriveModal3Direct(dataJson.id_baru, telpon);
                }
				setTimeout(() => { 
                            window.eksekusiFetchIuranMurni(telpon); 
                        }, 400);
            } else {
                alert(dataJson.message);
                 window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal melakukan penambahan data manual:", err);
            alert("Gagal terhubung dengan server. Silakan periksa jaringan Anda.");
            if (btnSimpanManual) {
                btnSimpanManual.disabled = false;
                btnSimpanManual.innerHTML = `<i class="bi bi-save2-fill me-1"></i> Simpan Draf & Lanjutkan Struk`;
            }
        });
    });
};

/**
 * Fungsi Otomatisasi Hitung Siklus Periode Keanggotaan / Iuran IDI Batam
 * @param {string} bulanAwal - Nama bulan awal (contoh: 'Juni' atau 'Juli')
 * @param {number} tahunAwal - Angka tahun awal berjalan (contoh: 2026)
 */
window.hitungOtomatisSiklusTeksFormManual = function(bulanAwal, tahunAwal) {
    console.log(`[Siklus Dimulai] Memproses parameter awal: ${bulanAwal} - ${tahunAwal}`);

    // 1. Sterilkan string teks dari spasi menggunakan regex
    const bulanSteril = String(bulanAwal).replace(/\s/g, "").toLowerCase();
    const tahunSteril = Number(tahunAwal);

    // Ambil durasi interval bulan yang dipilih user dari elemen dropdown Form Manual
    const intervalSelect = document.getElementById("payIntervalManual");
    const intervalBulan = intervalSelect ? parseInt(intervalSelect.value, 10) : 12;

    const matrixSemuaBulan = [
        "januari", "februari", "maret", "april", "mei", "juni",
        "juli", "agustus", "september", "oktober", "november", "desember"
    ];

    // 2. Cari indeks bulan awal di dalam matriks kalender
    let indexBulanAwal = matrixSemuaBulan.indexOf(bulanSteril);
    if (indexBulanAwal === -1) indexBulanAwal = 6; // Default fallback ke Juli jika tidak cocok

    // 3. Kalkulasi bulan akhir dan tahun akhir secara adaptif berdasarkan jumlah interval
    let indexBulanAkhir = indexBulanAwal + (intervalBulan - 1);
    let tahunSelesaiHitung = tahunSteril;

    if (indexBulanAkhir > 11) {
        tahunSelesaiHitung = tahunSteril + Math.floor(indexBulanAkhir / 12);
        indexBulanAkhir = indexBulanAkhir % 12;
    }

    // Format Kapital huruf pertama untuk konsistensi tampilan dokumen resmi IDI
    const strBulanAwal = matrixSemuaBulan[indexBulanAwal].charAt(0).toUpperCase() + matrixSemuaBulan[indexBulanAwal].slice(1);
    const strBulanAkhir = matrixSemuaBulan[indexBulanAkhir].charAt(0).toUpperCase() + matrixSemuaBulan[indexBulanAkhir].slice(1);

    // 4. Susun teks label rentang periode lengkap
    const labelPeriodeLengkap = `${strBulanAwal}-${tahunSteril} s/d ${strBulanAkhir}-${tahunSelesaiHitung}`;
    
    // 5. Suntikkan hasil kalkulasi otomatis langsung ke elemen Input Form Manual
    const inputPeriodeManual = document.getElementById("payPeriodeManual");
    const inputPeriodeBulanManual = document.getElementById("payPeriodeBulanManual");
    const inputJumlahManual = document.getElementById("payJumlahManual");

    if (inputPeriodeManual) {
        inputPeriodeManual.value = labelPeriodeLengkap;
    }
    if (inputPeriodeBulanManual) {
        // Menyimpan teks kombinasi format database (contoh: "juli-juni")
        inputPeriodeBulanManual.value = `${matrixSemuaBulan[indexBulanAwal]}-${matrixSemuaBulan[indexBulanAkhir]}`;
    }
    if (inputJumlahManual) {
        // Hitung nominal kas otomatis (Rp 50.000 x jumlah interval bulan)
        inputJumlahManual.value = 50000 * intervalBulan;
    }

    console.log(`[Siklus Sukses] Hasil teks terformat: ${labelPeriodeLengkap}`);
    
    return {
        periode_formatted: labelPeriodeLengkap,
        nominal_kas: 50000 * intervalBulan
    };
};

window.bukaPratinjauBuktiBayarModal2Direct = function(urlGambarDrive, namaDokter, labelPeriode) {
    
const elements = document.getElementsByClassName("idB");
// =========================================================================
// ⚡ FIX ENGINE: PERBAIKAN PERULANGAN DETEKSI DATA-PENDING JSON (admin.js)
// =========================================================================

let idrekomx = "";
let kategorix = "";
let pendingx = null; // Siapkan sebagai objek kosong/null bawaan

for (let i = 0; i < elements.length; i++) {
    // Memeriksa kecocokan URL Gambar Drive berdasarkan label periode aktif
    if (elements[i].getAttribute("data-" + labelPeriode) === urlGambarDrive) {
        
        idrekomx  = elements[i].getAttribute("data-id").trim();
        kategorix = elements[i].getAttribute("data-kategori").trim();
        break; 
    }
}

    const htmlPratinjauStruk = `
        <div class="container py-2" id="lightboxStrukIuranWrapper">
            <div class="row justify-content-center">
                <div class="col-lg-11 text-center">
                    
                    <!-- BINGKAI FOTO PREMIUM SHADOW -->
                    <div class="bg-dark rounded-4 p-3 d-inline-block border shadow-lg overflow-hidden mb-3" style="max-width: 100%; max-height: 65vh;">
                        <img src="https://lh3.googleusercontent.com/d/${urlGambarDrive}" alt="Struk ${namaDokter}" class="img-fluid rounded-3" style="max-height: 60vh; object-fit: contain;"
                             onerror="this.src='https://placehold.co'">
                    </div>

                    <!-- META DATA STRUK -->
                    <div class="card border-0 shadow-sm rounded-3 p-3 bg-light text-start mt-2">
                        <div class="row g-2 small font-monospace text-muted">
                            <div class="col-sm-4">
                                <i class="bi bi-person-fill text-success me-1"></i> Pemilik: <span class="text-dark fw-bold">${namaDokter}</span>
                            </div>
                            <div class="col-sm-4">
                                <i class="bi bi-calendar-range-fill text-warning me-1"></i> Syarat: <span class="text-dark fw-bold">${labelPeriode}</span>
                            </div>
                            <div class="col-sm-4">
                                <button type="button" class="btn btn-xs btn-warning text-dark px-2.5 py-0.5 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-1 animate-pulse" 
                    style="font-size: 0.68rem;"
                    onclick="bukaModal3kirimpesan(${idrekomx},'${namaDokter}','${kategorix}')">
                <i class="bi bi-exclamation-triangle-fill text-dark"></i> Kirim Pesan
            </button> 
                            </div>
                        </div>
                    </div>

                    <!-- AKSES UTURAN UNDUH FILE ASLI -->
                    <div class="mt-4 pt-2 border-top text-center">
                        <a href="https://lh3.googleusercontent.com/d/${urlGambarDrive}" target="_blank" class="btn btn-sm btn-outline-success px-4 fw-bold rounded-pill">
                            <i class="bi bi-box-arrow-up-right me-1"></i> Buka Tab Sumber Asli Drive
                        </a>
                    </div>

                </div>
            </div>
        </div>
    `;

    // Luncurkan langsung ke jendela modal2 bawaan sistem Anda
    if (typeof modal3v === "function") {
        modal3v('Pratinjau Berkas', htmlPratinjauStruk);
    } else {
        alert("Fungsi global modal3() tidak ditemukan di dalam ruang lingkup aplikasi!");
    }
};

window.bukaModal3kirimpesan=function(id,nama,kategori,pending)
{
const jsonMentahAman = pending 
    ? String(pending).replace(/'/g, "\\'").replace(/"/g, '&quot;') 
    : "{}";
window.bukaFormAlasanPendingModal3Direct(id, nama,kategori,jsonMentahAman)    
}

window.menuRekom = function(subKategori) {
	subKategori=subKategori.replace(/'/,'');
	let subKategorix=subKategori;
	if(subKategori==="fellow") { subKategorix=subKategori+"ship"; }
	if(subKategori==="log") { subKategorix="Letter of Good Standing"; }
    const isLogin = localStorage.getItem("idi_is_logged_in");
    const namaDokter = localStorage.getItem("idi_nama_dokter");
    const telponDokter = localStorage.getItem("idi_user_whatsapp");
    const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
	let uckatx=uckat;
	if(uckat==="Fellow") { uckatx=uckat+"ship"; }
	if(uckat==="Log") { uckatx="Letter Of Good Standing"; }
    if (isLogin === "true" && telponDokter) {

        const htmlMutasiManager = `
            <div class="container py-2" id=subKategori+"PencarianWrapper">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <!-- WELCOME CARD ANGGOTA -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 text-center text-sm-start d-sm-flex flex-sm-row align-items-sm-center justify-content-between">
                            <div>
                                <h5 class="fw-bold text-success mb-1"><i class="bi bi-person-badge-fill me-1"></i> Rekomendasi ${uckat}: ${namaDokter}</h5>
                                <p class="text-muted small mb-0 font-monospace">Histori rincian permohonan ${subKategorix} Anda yang terdaftar pada nomor +62 ${telponDokter}</p>
                            </div>
                            <div class="mt-3 mt-sm-0">
                                <span class="badge bg-success px-3 py-2 rounded-pill font-monospace"><i class="bi bi-shield-check me-1"></i> Sesi Aktif</span>
                            </div>
                        </div>

                        <!-- AREA DINAMIS PENERIMA TABEL MYSQL VIA AJAX -->
                        <div id="mysql${uckat}ResultTableArea" class="animate-fade-in">
                            <div class="text-center py-5 text-muted bg-white rounded-4 shadow-sm border">
                                <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                                <p class="small mb-0 font-monospace">Menghubungkan ke secure cloud ${subKategorix}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
		
        // Luncurkan antarmuka manifest ke Modal Utama Tingkat 1 (Menggunakan fungsi modal1v bawaan)
        if (typeof modal1v === "function") {
            modal1v('Data Rekomendasi '+uckatx, htmlMutasiManager);
			window.generateMainMenuDropdownHtml('Data Rekomendasi '+uckatx);
        } else {
            alert("Sistem modal1v tidak terdeteksi di DOM.");
        }

        // ⚡ AUTO TRIGGER FETCH: Langsung tembak kueri nomor telepon tanpa jeda pengetikan tombol
        setTimeout(function() {
            window.eksekusiFetchMutasiMurni(telponDokter,subKategori);
        }, 300);

    } else {
        // 🔒 KONDISI B: JIKA USER BELUM LOGIN / KHUSUS AKSES PENCARIAN ADMIN OUTSIDER
        const htmlMutasiManager = `
            <div class="container py-2" id="mutasiPencarianWrapper">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <!-- CARD PANEL PENCARIAN PENGURUS/UMUM -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <label class="form-label fw-bold text-success mb-2" style="font-size:1rem;">
                                <i class="bi bi-telephone-fill me-1"></i> Masukkan Nomor Telepon / WA Pemohon ${uckat}
                            </label>
                            <p class="text-muted small mb-3">Ketik nomor WhatsApp dokter (tanpa angka 0 atau 62 di depan), lalu klik tombol cari atau tekan Enter untuk melihat berkas ${subKategori}.</p>
                            
                            <div class="row g-2">
							<div class="col-12 col-md-9">
							<div class="input-group input-group-lg">
							<span class="input-group-text bg-light text-success border-start-0 border-end-0 fw-bold font-monospace">+62</span>                               
                                <input type="number" class="form-control bg-light border-start-0 border-end-0 fw-bold font-monospace text-success" 
                                       id="inputCariNama${uckat}" 
                                       placeholder="Contoh: 811XXXXXXXX..." 
                                       autocomplete="off"
                                       onkeydown="if(event.key === 'Enter') window.liveTriggerFetchMutasiMySQL('${subKategori}')">
                            </div>   
                            </div>
                            <div class="col-12 col-md-3 d-grid">							
                                <button class="btn btn-success fw-bold px-4" type="button" id="btnEksekusiCari${uckat}" onclick="window.liveTriggerFetchMutasiMySQL('${subKategori}')">
                                    <i class="bi bi-arrow-right-circle me-1"></i> Cari Data
                                </button>
                            </div>
                        </div>
</div>
                        <!-- CONTAINER DINAMIS: DEFAULT DATA KOSONG SAAT AWAL DIBUKA -->
                        <div id="mysql${uckat}ResultTableArea" class="animate-fade-in">
                            <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed">
                                <i class="bi bi-file-earmark-person display-5 d-block mb-2 text-secondary-subtle"></i>
                                <h6 class="fw-bold mb-1 text-secondary">Ready to Search</h6>
                                <p class="small mb-0 px-3">Data rekomendasi ${subKategori} kosong. Silakan masukkan nomor telepon dokter dan klik cari di atas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (typeof modal1v === "function") {
			
            modal1v('Data Rekomendasi '+uckatx, htmlMutasiManager);
			window.generateMainMenuDropdownHtml('Data Rekomendasi '+uckatx);
        } else {
            alert("Sistem modal1v tidak terdeteksi di DOM.");
        }
    }
};

window.liveTriggerFetchMutasiMySQL = function(subKategori) {
	let subKategorix=subKategori;
	if(subKategori==="fellow") { subKategorix=subKategori+"ship"; }
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    const inputVal = document.getElementById("inputCariNama"+uckat).value.trim();
    const resultArea = document.getElementById("mysql"+uckat+"ResultTableArea");

    if (inputVal.length < 2) {
        alert("Silakan masukkan nomor telepon / WA dokter terlebih dahulu sebelum mencari!");
        if (resultArea) {
            resultArea.innerHTML = `
                <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed animate-fade-in">
                    <i class="bi bi-file-earmark-person display-5 d-block mb-2 text-secondary-subtle"></i>
                    <h6 class="fw-bold mb-1 text-secondary">Ready to Search</h6>
                    <p class="small mb-0">Data rekomendasi ${subKategorix} kosong. Silakan masukkan nomor telepon dokter dan klik cari di atas.</p>
                </div>
            `;
        }
        return;
    }

    window.eksekusiFetchMutasiMurni(inputVal,subKategori);
};

window.eksekusiFetchMutasiMurni = function(nomorTelpon,subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
	let subKategorix=subKategori; let uckatx=uckat;
if(subKategori==="fellow") { subKategorix=subKategori+"ship"; uckatx=uckat+"ship"; }
    const resultArea = document.getElementById("mysql"+uckat+"ResultTableArea");
    const btnCari = document.getElementById("btnEksekusiCari"+uckat);
	    
    if (!resultArea) return;
    if (btnCari) {
        btnCari.disabled = true;
        btnCari.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Mencari...`;
    }
    
    // Mengambil variabel endpoint hulu dari config yang diimport oleh file pemanggil (mainmenu.js)
    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;
    const siduser = localStorage.getItem("idi_id_user");	
    const namadokter =	localStorage.getItem("idi_nama_dokter");
    const sessionLoginCheck = localStorage.getItem("idi_is_logged_in");

    fetch(`${cleanEndpoint}/proses.php?aksi=get_pencarian_${subKategori}&telpon=${encodeURIComponent(nomorTelpon)}`,{
	method: "POST",
    mode: "cors",              
    credentials: "include",    
    body: payload
	})
    .then(res => res.json())
    .then(res => {
        if (btnCari) {
            btnCari.disabled = false;
            btnCari.innerHTML = `<i class="bi bi-arrow-right-circle me-1"></i> Cari Data`;
        }

        if (res.status === 'success') {
            const listDb = res.data;
            window.globalListDbMutasiAktif = listDb;
            if (!listDb || listDb.length === 0) {
				let tombolDinamisAlertHtml = "";
                if (sessionLoginCheck === "true") {
                    tombolDinamisAlertHtml = `
                        <div class="mt-3 pt-3 border-top d-flex justify-content-center align-items-center w-100">
                            <button type="button" class="btn btn-sm btn-success fw-bold px-4 rounded-pill shadow-sm animate-pulse" 
                                    onclick="bukaFormTambahMutasiDirect(${siduser}, '${namadokter}', ${nomorTelpon}, '${subKategori}')">
                                <i class="bi bi-plus-lg me-1"></i> Tambah ${uckatx} Baru
                            </button>
                        </div>
                    `;
                }

                resultArea.innerHTML = `
                    <div class="alert alert-warning border shadow-sm rounded-4 p-4 text-center mb-0 animate-fade-in">
                        <i class="bi bi-person-x-fill display-6 d-block mb-2 text-danger"></i>
                        <h6 class="fw-bold text-dark">Data Tidak Ditemukan!</h6>
                        <p class="small mb-0 text-muted">Nomor telepon "<b>+62 ${nomorTelpon}</b>" belum mengajukan permohonan ${subKategori} di pangkalan data.</p>
                    </div>
					${tombolDinamisAlertHtml}
                `;
                return;
            }

            let tableRowsHtml = "";
            let counterNo = 1;

            for (let i = 0; i < listDb.length; i++) {
                const row = listDb[i];
                const tglPermohonan = row.waktu ? row.waktu.substring(0, 10) : "-";					
                let statusBadge = "";
                const currentStatus = (row.status || "").toUpperCase().trim();
                
                if (currentStatus === "VALID" || currentStatus === "SUKSES") {

        statusBadge = `
            <span class="badge bg-success-subtle text-success px-2 py-1 rounded small fw-bold d-inline-flex align-items-center gap-1">
                <i class="bi bi-check-circle-fill"></i> Valid
            </span>
        `;
    } else if (currentStatus === "MENUNGGU VERIFIKASI ADMIN") {

        statusBadge = `
            <span class="badge bg-info-subtle text-info-emphasis px-2 py-1 rounded small fw-bold border border-info-subtle d-inline-flex align-items-center gap-1">
                <i class="bi bi-hourglass-split"></i> Menunggu Verifikasi Admin
            </span>
        `;
    } else if (currentStatus === "PENDING") {

        
 const catatanAlasanBaku = row.textvalidasi_permohonan 
    ? String(row.textvalidasi_permohonan).replace(/'/g, "\\'").replace(/"/g, '&quot;') 
    : "{}";
    
        statusBadge = `
            <a href="#" class="badge bg-warning-subtle text-warning-emphasis px-2 py-1 rounded small fw-bold border border-warning text-decoration-none d-inline-flex align-items-center gap-1 animate-pulse"
               title="Klik untuk melihat catatan alasan penangguhan berkas Anda"
               onclick="event.preventDefault(); window.bukaModal3LihatAlasanPendingUserDirect('${catatanAlasanBaku}', '${row.tujuan}','${subKategori}')">
                <i class="bi bi-exclamation-circle-fill"></i> Pending (Cek Koreksi)
            </a>
        `;
    } else if (currentStatus === "TOLAK") {
        statusBadge = `
            <span class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold d-inline-flex align-items-center gap-1">
                <i class="bi bi-x-circle-fill"></i> Ditolak
            </span>
        `;
    } else {
        // ⚪ KONDISI 5: DRAFT / DEFAULT -> LENCANA ABU-ABU TRANSISI
        statusBadge = `
            <span class="badge bg-secondary-subtle text-secondary px-2 py-1 rounded small fw-bold d-inline-flex align-items-center gap-1">
                <i class="bi bi-file-earmark-text"></i> Draft
            </span>
        `;
    }
                const isUserLoggedIn = localStorage.getItem("idi_is_logged_in") === "true" || typeof $_SESSION !== 'undefined';

    let linkPermohonan = "";
    let linkIuran = "";
    if (isUserLoggedIn) {
        linkPermohonan = row.permohonan 
            ? `<a href="#" onclick="event.preventDefault(); window.popupMediaLightboxViaModal2Direct('${row.permohonan}', 'Permohonan ID #${row.id}','${subKategori}')" class="btn btn-xs btn-outline-dark px-2 py-0 rounded font-monospace" style="font-size:0.7rem;"><i class="bi bi-file-earmark-text me-1"></i>Lihat Berkas</a>` 
            : `<span class="text-muted small"><i>Kosong</i></span>`;
            
        linkIuran = row.iuranidi 
            ? `<a href="#" onclick="event.preventDefault(); window.popupMediaLightboxViaModal2Direct('${row.iuranidi}', 'Kwitansi ID #${row.id}','${subKategori}')" class="btn btn-xs btn-outline-dark px-2 py-0 rounded font-monospace" style="font-size:0.7rem;"><i class="bi bi-receipt me-1"></i>Lihat Iuran</a>` 
            : `<span class="text-muted small"><i>Kosong</i></span>`;
    } else {
        linkPermohonan = `<span class="text-danger small font-monospace" style="font-size:0.68rem;" title="Hak akses terbatas, silakan login ke akun Anda"><i class="bi bi-lock-fill"></i> Terkunci</span>`;
        linkIuran = `<span class="text-danger small font-monospace" style="font-size:0.68rem;" title="Hak akses terbatas, silakan login ke akun Anda"><i class="bi bi-lock-fill"></i> Terkunci</span>`;
    }
				
				let rtujuan="";
				if(subKategori==="mutasi" || subKategori==="log")
				{
					rtujuan=row.tujuan;
				}
				if(subKategori==="ppds" || subKategori==="ppdssub" || subKategori==="fellow")
				{
					rtujuan=row.jurusan;
				}
				
				let htmlTombolHapus = "";
                if (currentStatus === "DRAFT" || currentStatus === "PENDING" || currentStatus === "TOLAK") {
                    htmlTombolHapus = `
                        <button type="button" class="btn btn-sm btn-outline-danger border-0 px-2 py-0 rounded-circle" 
                                title="Hapus pengajuan ${subKategori} ini seutuhnya"
                                onclick="window.eksekusiHapusDrafMutasiMySQL(${row.id}, '${rtujuan}','${subKategori}','user')">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    `;
                } else {
                    htmlTombolHapus = `<span class="text-muted small opacity-50" title="Berkas sah, tidak boleh dihapus"><i class="bi bi-slash-circle"></i></span>`;
                }
				
				//let htmlCetakSertifikat = "";
                //if (currentStatus === "VALID") {
                    //htmlCetakSertifikat = `
                        //<a href="${cleanEndpoint}/surat_keterangan_${subKategori}.html?id=${row.id}" target="newtab" type="button" class="btn btn-xs btn-primary px-2 py-0 rounded fw-bold animate-pulse" style="font-size:0.7rem;">
                           // <i class="bi bi-patch-check-fill me-1"></i>Cetak
                        //</a>
                   // `;
                //} else {
                    //htmlCetakSertifikat = `<button type="button" class="btn btn-xs btn-secondary px-2 py-0 rounded small opacity-60 font-monospace" style="font-size:0.7rem;" disabled title="Menunggu validasi berkas oleh tim pengurus"><i class="bi bi-hourglass"></i> Lock</button>`;
               // }
				
                let htmlAksiUpload = "";
                if (currentStatus === "DRAFT" || currentStatus === "PENDING") {
					if (isUserLoggedIn) {
                    htmlAksiUpload = `
                        <button type="button" class="btn btn-xs btn-success px-2 py-0 rounded fw-bold" style="font-size:0.7rem;"
                onclick="window.bukaFormUploadPersyaratanMutasiModal2(${siduser},'${row.id}', '${rtujuan}', '${row.folder_anggota.trim() || ''}','${row.ttd_anggota}','${subKategori}')">
            <i class="bi bi-cloud-arrow-up-fill me-1"></i>Upload Berkas
        </button>
                    `;
					}
					else
					{
					htmlAksiUpload = `
						<span class="text-danger small font-monospace" style="font-size:0.68rem;" title="Hak akses terbatas, silakan login ke akun Anda"><i class="bi bi-lock-fill"></i> Terkunci</span>`;
					}
                } else {
                    htmlAksiUpload = `<span class="text-muted small"><i class="bi bi-lock-fill me-1"></i>Terkunci</span>`;
                }
                
				let tujuan="-"; let alasan_m="";
				if(subKategori==="mutasi")
				{
					tujuan=row.tujuan;
					alasan_m=row.alasan_mutasi;
				}
				if(subKategori==="log")
				{
					tujuan=row.tujuan;
					alasan_m=row.alasan_log;
				}
				if(subKategori==="ppds" || subKategori==="ppdssub" || subKategori==="fellow")
				{
					tujuan=row.jurusan;
					alasan_m=row.universitas;
				}
				
				let htmlCetakDanEditGabungan = "";

if (currentStatus === "VALID") {
    htmlCetakDanEditGabungan = `
        <div class="d-flex align-items-center justify-content-center gap-1">
            <!-- Tombol Cetak Dokumen Sah -->
            <a href="${cleanEndpoint}/surat_keterangan_${subKategori}.html?id=${row.id}" target="newtab" type="button" class="btn btn-xs btn-primary px-2 py-0 rounded fw-bold animate-pulse" style="font-size:0.7rem;">
                            <i class="bi bi-patch-check-fill me-1"></i>Cetak
                        </a>
            <!-- Tombol Edit Terkunci (Readonly Mode) -->
            <button type="button" class="btn btn-xs btn-light text-muted px-2 py-0 rounded border" style="font-size:0.7rem;" disabled title="Berkas sudah disahkan (Valid), data terkunci untuk penyuntingan.">
                <i class="bi bi-pencil"></i>
            </button>
        </div>
    `;
} else {
    htmlCetakDanEditGabungan = `
        <div class="d-flex align-items-center justify-content-center gap-1">
            <!-- Tombol Cetak Terkunci -->
            <button type="button" class="btn btn-xs btn-secondary px-2 py-0 rounded small opacity-60 font-monospace" style="font-size:0.7rem;" disabled title="Menunggu validasi berkas oleh tim pengurus"><i class="bi bi-hourglass"></i> Lock</button>
            <!-- Tombol Edit Aktif Berbentuk Ikon Pensil -->
            <button type="button" class="btn btn-xs btn-outline-warning px-2 py-0 rounded fw-bold shadow-sm" style="font-size:0.7rem;" title="Klik untuk mengedit formulir data pengajuan ini"
                    onclick="event.preventDefault(); window.bukaFormEditPengajuanDinamisModal2(${row.id}, '${rtujuan ? rtujuan.replace(/'/g, "\\'") : ''}', '${subKategori}')">
                <i class="bi bi-pencil-square"></i>
            </button>
        </div>
    `;
}

                tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                        <td class="small fw-semibold text-secondary text-center">${tglPermohonan}</td>
                        <td class="fw-bold text-idi text-center small">${tujuan || '-'}</td>
                        <td class="text-muted small text-truncate" style="max-width:180px;" title="${alasan_m || ''}">${alasan_m || '<span class="text-muted italic">-</span>'}</td>
                        <td class="text-center">${statusBadge}</td>
                        <td class="text-center" nowrap>${linkPermohonan}</td>
                        <td class="text-center" nowrap>${linkIuran}</td>
						<td class="text-center" nowrap>${htmlAksiUpload}</td>
						<td class="text-center">${htmlCetakDanEditGabungan}</td>
						<td class="text-center">${htmlTombolHapus}</td>
                        
                    </tr>
                `;
            }

const barisTableHtml=tableRowsHtml;
    if (!barisTableHtml || barisTableHtml === "") {
        const btnTambahMutasiKosong = document.getElementById("btnTambah"+uckat+"Anggota");
        if (btnTambahMutasiKosong && sessionCheckText === "true") {
            btnTambahMutasiKosong.disabled = false;
            btnTambahMutasiKosong.className = "btn btn-sm btn-success fw-bold px-3 rounded-pill shadow-sm ms-sm-auto animate-pulse";
            btnTambahMutasiKosong.innerHTML = `<i class="bi bi-plus-lg me-1"></i> Tambah ${uckat}`;
            btnTambahMutasiKosong.removeAttribute("title");
        }
        return;
    }
let tombolTambahMutasiHtml = "";

// Tombol hanya dicetak jika user sudah login sebagai anggota resmi
if (sessionLoginCheck === "true") {
    tombolTambahMutasiHtml = `

        <button type="button" id="btnTambah${uckat}Anggota" class="btn btn-sm btn-success fw-bold px-3 rounded-pill shadow-sm ms-sm-auto" disabled onclick="bukaFormTambahMutasiDirect(${siduser}, '${namadokter}', ${nomorTelpon}, '${subKategori}')">
            <i class="bi bi-plus-lg me-1"></i> Tambah ${uckat}
        </button>
    `;
}
let titlerekom=""; let am=""; let ct="";
if(subKategori==="mutasi")
{
titlerekom="RECORD DATA PERMOHONAN REKOMENDASI PINDAH ANGGOTA";
am="Alasan Mutasi";
ct="Cabang Tujuan";
}
if(subKategori==="ppds")
{
titlerekom="RECORD DATA PERMOHONAN REKOMENDASI PPDS";
am="Universitas";
ct="Jurusan";
}
if(subKategori==="ppdssub")
{
titlerekom="RECORD DATA PERMOHONAN REKOMENDASI PPDS SUBSPESIALIS";
am="Universitas";
ct="Jurusan";
}
if(subKategori==="fellow")
{
titlerekom="RECORD DATA PERMOHONAN REKOMENDASI FELLOWSHIP";
am="Universitas";
ct="Jurusan";
}
if(subKategori==="log")
{
titlerekom="RECORD DATA PERMOHONAN REKOMENDASI LOG";
am="Alasan LOG";
ct="Tujuan";
}
            resultArea.innerHTML = `
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">
                    <div class="card-header bg-light border-0 py-3 px-4 d-flex align-items-center justify-content-between gap-2">
            <span class="text-muted small fw-bold">
                <i class="bi bi-folder2-open me-1 text-success"></i> ${titlerekom}
            </span>
            ${tombolTambahMutasiHtml}
        </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                            <thead class="table-dark text-uppercase font-monospace" style="font-size:0.75rem; letter-spacing:0.5px;">
                                  <tr>
                                    <th width="3%" class="text-center">No</th>
                                    <th width="10%" class="text-center" nowrap>Tgl Ajuan</th>
                                    <th width="13%" class="text-center">${ct}</th>
                                    <th width="15%">${am}</th>
                                    <th width="10%" class="text-center">Status</th>
                                    <th width="11%" class="text-center" nowrap>Permohonan</th>
                                    <th width="11%" class="text-center">Iuran</th>
                                    <th width="11%" class="text-center">Upload Berkas</th>
                                    <th width="11%" class="text-center" nowrap>Cetak Surat/Edit</th>
                                    <th width="5%" class="text-center">Hapus</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            const btnTambahMutasiActive = document.getElementById("btnTambah"+uckat+"Anggota");
            if (btnTambahMutasiActive) {
                if (!listDb || listDb.length === 0) {
                    btnTambahMutasiActive.disabled = false;
                    btnTambahMutasiActive.className = "btn btn-sm btn-success fw-bold px-3 rounded-pill shadow-sm ms-sm-auto animate-pulse";
                    btnTambahMutasiActive.innerHTML = `<i class="bi bi-plus-lg me-1"></i> Tambah ${uckat}`;
                    btnTambahMutasiActive.removeAttribute("title");
                } 
                else {
                    const adakahBerkasBelumValid = listDb.some(row => {
                        const statusTeks = (row.status || "").toUpperCase().trim();
                        return statusTeks !== "VALID" && statusTeks !== "SUKSES";
                    });

                    if (adakahBerkasBelumValid) {
                        btnTambahMutasiActive.disabled = true;
                        btnTambahMutasiActive.className = "btn btn-sm btn-secondary fw-bold px-3 rounded-pill shadow-sm ms-sm-auto opacity-75";
                        btnTambahMutasiActive.innerHTML = `<i class="bi bi-lock-fill me-1"></i> Tambah ${uckatx} (Selesaikan Berkas Aktif)`;
                        btnTambahMutasiActive.setAttribute("title", "Tombol terkunci. Anda tidak dapat menambah pengajuan baru sebelum berkas "+uckat+" sebelumnya disahkan (VALID) oleh admin.");
                    } else {
                        // 🔓 KONDISI UNLOCK: Seluruh riwayat pengajuan mutasi terbukti bernilai VALID sepenuhnya
                        btnTambahMutasiActive.disabled = false;
                        btnTambahMutasiActive.className = "btn btn-sm btn-success fw-bold px-3 rounded-pill shadow-sm ms-sm-auto animate-pulse";
                        btnTambahMutasiActive.innerHTML = `<i class="bi bi-plus-lg me-1"></i> Tambah ${uckat}`;
                        btnTambahMutasiActive.removeAttribute("title");
                    }
                }
            }

        }
		
    })
    .catch(err => {
        if (btnCari) {
            btnCari.disabled = false;
            btnCari.innerHTML = `<i class="bi bi-arrow-right-circle me-1"></i> Cari Data`;
        }
        console.error("Gagal melakukan penarikan data "+subKategori+":", err);
        resultArea.innerHTML = `
            <div class="alert alert-danger p-3 small mb-0 animate-fade-in">
                <i class="bi bi-wifi-off me-1"></i> Gagal merestorasi relasi data ${subKategori}. Koneksi cloud server bermasalah.
            </div>
        `;
    });
};

/**
 * Fungsi Membuka Form Edit Pengajuan Dinamis (Mutasi, PPDS, PPDS Sub, Fellowship, LOGS)
 * @param {number} idTransaksi - ID unik dari baris pengajuan yang akan diedit
 * @param {string} dataTujuanEksis - Nilai tujuan atau jurusan lama saat ini
 * @param {string} subKategori - Jenis sub-layanan keanggotaan ('mutasi', 'ppds', 'ppdssub', 'fellow', 'log')
 */
 
window.bukaFormEditPengajuanDinamisModal2 = function(idTransaksi, dataTujuanEksis, subKategori) {
    if (!idTransaksi) return;

    const uckat = subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    let uckatx = uckat;
    if (subKategori === "fellow") uckatx = uckat + "ship";
    if (subKategori === "log") uckatx = "Letter of Good Standing";

    // 1. Cari data lama (alasan/universitas) dari array memori global agar pengisian form instan
    let alasanLamaEksis = "";
    if (window.globalListDbMutasiAktif) {
        const rowEksis = window.globalListDbMutasiAktif.find(x => x.id == idTransaksi);
        if (rowEksis) {
            if (subKategori === "mutasi") alasanLamaEksis = rowEksis.alasan_mutasi || "";
            if (subKategori === "log") alasanLamaEksis = rowEksis.alasan_log || "";
            if (subKategori === "ppds" || subKategori === "ppdssub" || subKategori === "fellow") {
                alasanLamaEksis = rowEksis.universitas || "";
            }
        }
    }

    // 2. Sesuaikan label teks formulir secara dinamis mengikuti rumpun subKategori
    let labelTujuan = "Cabang Kota Tujuan";
    let placeholderTujuan = "Contoh: Jakarta, Surabaya, Makassar";
    let labelAlasan = "Alasan Melakukan Pindah";
    let placeholderAlasan = "Tuliskan alasan kepindahan Anda secara jelas...";

    if (subKategori === "ppds" || subKategori === "ppdssub" || subKategori === "fellow") {
        labelTujuan = "Jurusan / Kepeminatan Spesialis";
        placeholderTujuan = "Contoh: Spesialis Bedah, Spesialis Anak";
        labelAlasan = "Universitas / RS Pendidikan Tujuan";
        placeholderAlasan = "Contoh: Universitas Indonesia, Universitas Airlangga";
    }
    if (subKategori === "log") {
        labelTujuan = "Kota/Instansi Tujuan LOGS";
        placeholderTujuan = "Contoh: Dinas Kesehatan DKI Jakarta";
        labelAlasan = "Alasan Pengajuan LOGS";
        placeholderAlasan = "Contoh: Syarat kredensial RS Baru / Melanjutkan Studi";
    }

    // 3. Struktur Layouting Form HTML untuk Jendela Modal Tingkat 2
    const htmlFormEdit = `
        <div class="container py-2" id="formEdit${uckat}Wrapper">
            <form id="formUpdateTransaksi${uckat}MySQL" class="row g-3">
                <input type="hidden" id="editIdTransaksi" value="${idTransaksi}">
                
                <div class="col-md-12">
                    <div class="alert bg-warning-subtle text-warning-emphasis border-0 p-3 rounded-4 mb-2 small d-flex align-items-center gap-2">
                        <i class="bi bi-pencil-square fs-4"></i>
                        <span>Anda sedang menyunting berkas <b>#ID-${idTransaksi}</b>. Pastikan data tujuan dan alasan sudah valid sebelum disimpan kembali.</span>
                    </div>
                </div>

                <!-- Input Dinamis 1: Tujuan / Keminatan -->
                <div class="col-md-12">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> ${labelTujuan}</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-geo-alt-fill"></i></span>
                        <input type="text" class="form-control fw-bold text-dark" id="editMutTujuan" value="${dataTujuanEksis}" placeholder="${placeholderTujuan}" required>
                    </div>
                </div>

                <!-- Input Dinamis 2: Alasan / Universitas -->
                <div class="col-md-12">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> ${labelAlasan}</label>
                    <textarea class="form-control fw-semibold" id="editMutAlasan" rows="4" placeholder="${placeholderAlasan}" required>${alasanLamaEksis}</textarea>
                </div>

                <!-- Tombol Eksekusi -->
                <div class="col-12 text-end pt-3 border-top mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-3 me-2" onclick="window.closeSecondAdminModal()">Batal</button>
                    <button type="submit" class="btn btn-sm btn-success px-4 fw-bold shadow-sm" id="btnSubmitUpdate${uckat}">
                        <i class="bi bi-cloud-check-fill me-1"></i> Perbarui Data Pengajuan
                    </button>
                </div>
            </form>
        </div>
    `;

    // 4. Luncurkan kerangka formulir langsung ke Modal Tingkat 2 bawaan aplikasi
    if (typeof modal2v === "function") {
        modal2v(`Edit Pengajuan ${uckatx}`, htmlFormEdit);
    } else {
        alert("Fungsi global modal2v tidak ditemukan di DOM Window.");
        return;
    }

    // 5. Penanganan Pengiriman Data Pembaruan (Submit Event)
    const formUpdate = document.getElementById(`formUpdateTransaksi${uckat}MySQL`);
    formUpdate.addEventListener("submit", function(e) {
        e.preventDefault();

        const btnSimpan = document.getElementById(`btnSubmitUpdate${uckat}`);
        if (btnSimpan) {
            btnSimpan.disabled = true;
            btnSimpan.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Menyimpan...`;
        }

        // AMBIL DATA & STERILKAN SPASI DI AWAL/AKHIR INPUT (Metode Trim Adaptif)
        const tujuanBersih = document.getElementById("editMutTujuan").value.trim();
        const alasanBersih = document.getElementById("editMutAlasan").value.trim();

        const payload = new FormData();
        payload.append("id", document.getElementById("editIdTransaksi").value);
        payload.append("tujuan", tujuanBersih);
        payload.append(`alasan_${subKategori}`, alasanBersih);

        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
        const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

        // Eksekusi pembaruan data menuju file proses.php
        fetch(`${cleanEndpoint}/proses.php?aksi=edit_transaksi_${subKategori}`, {
            method: "POST",
            body: payload,
			mode: "cors",              // Memastikan mode CORS aktif lintas domain
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Tutup modal tingkat 2 secara elegan
                window.closeSecondAdminModal();
                
                // Segarkan tabel riwayat utama pada modal tingkat 1 setelah jeda efek transisi
                setTimeout(() => {
                    if (typeof window.eksekusiFetchMutasiMurni === "function") {
                        window.eksekusiFetchMutasiMurni(telponDokterContext, subKategori);
                    }
                }, 400);
            } else {
                if (btnSimpan) {
                    btnSimpan.disabled = false;
                    btnSimpan.innerHTML = `<i class="bi bi-cloud-check-fill me-1"></i> Perbarui Data Pengajuan`;
                }
            }
        })
        .catch(err => {
            console.error(`Gagal mengupdate draf ${subKategori}:`, err);
            alert("Koneksi cloud server gagal atau terputus.");
            if (btnSimpan) {
                btnSimpan.disabled = false;
                btnSimpan.innerHTML = `<i class="bi bi-cloud-check-fill me-1"></i> Perbarui Data Pengajuan`;
            }
        });
    });
};


window.popupMediaLightboxViaModal2Direct = function(fileId, namaFoto,subKategori) {
const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    if (!fileId || fileId.trim() === "") {
        alert("ID Berkas Google Drive tidak valid atau tidak ditemukan.");
        return;
    }

    let fullImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    let visualHtml = "";

    if (fileId.startsWith("http")) {
        fullImageUrl = fileId;
    }

    const isWordDocument = fullImageUrl.toLowerCase().endsWith('.doc') || 
                           fullImageUrl.toLowerCase().endsWith('.docx') || 
                           namaFoto.toLowerCase().includes('.doc') || 
                           namaFoto.toLowerCase().includes('.docx');

    if (isWordDocument) {
        const urlGoogleViewer = `https://google.com{encodeURIComponent(fullImageUrl)}&embedded=true`;
        
        visualHtml = `
            <div class="ratio ratio-4x3 rounded-4 overflow-hidden border shadow-sm bg-white" style="min-height: 480px;">
                <iframe src="${urlGoogleViewer}" title="${namaFoto}" allow="autoplay" frameborder="0"></iframe>
            </div>
            <div class="mt-2 text-center">
                <small class="text-muted d-block mb-1"><i class="bi bi-info-circle"></i> Jika pratinjau tidak muncul, Google sedang memproses konversi dokumen Anda.</small>
            </div>
        `;
    } 
    else if (fullImageUrl.includes("://google.com") && fullImageUrl.includes("/view")) {
        const previewUrl = fullImageUrl.replace("/view", "/preview");
        visualHtml = `
            <div class="ratio ratio-4x3 rounded-4 overflow-hidden border shadow-sm bg-white" style="min-height: 480px;">
                <iframe src="${previewUrl}" title="${namaFoto}" allow="autoplay" frameborder="0"></iframe>
            </div>
        `;
    } 
    else {
        visualHtml = `
            <div class="bg-dark rounded-4 p-2 d-inline-block border shadow-lg overflow-hidden style-lightbox-container" style="max-height: 70vh; max-width: 100%;">
                <img src="${fullImageUrl}" alt="${namaFoto}" class="img-fluid rounded-3" style="max-height: 65vh; object-fit: contain;">
            </div>
        `;
    }

    const htmlLightboxModal2 = `
        <div class="text-center p-1 w-100 animate-fade-in">
            ${visualHtml}
            <div class="mt-3 text-muted font-monospace small">
                <i class="bi bi-info-circle me-1 text-success"></i> Informasi Berkas: <span class="text-dark fw-bold">${namaFoto}</span>
            </div>
            <div class="mt-3 pt-3 border-top text-center d-flex justify-content-center gap-2">
                <a href="${fullImageUrl}" target="_blank" class="btn btn-sm btn-outline-success px-4 fw-bold rounded-pill">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Buka File Asli
                </a>
            </div>
        </div>
    `;

    // Deteksi fungsi pemanggil Modal Level 2 bawaan aplikasi Anda (Mendukung modal2v maupun modal2x)
    if (typeof modal2v === "function") {
        modal2v('Pratinjau', htmlLightboxModal2);
    } else if (typeof modal2x === "function") {
        modal2x('Pratinjau', htmlLightboxModal2);
    } else {
        console.error("FUNGSI GLOBAL MODAL TINGKAT 2 (modal2v / modal2x) TIDAK TERDETEKSI DI SYSTEM DOM WINDOW");
        alert("Gagal memuat jendela pratinjau tingkat 2. Skrip modal internal tidak ditemukan.");
    }
};

window.bukaFormTambahMutasiDirect = function(idAngg, namaDokter, telpon, subKategori) {
const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
let subKategorix=subKategori; let uckatx=uckat;
if(subKategori==="fellow") { subKategorix=subKategori+"ship"; uckatx=uckat+"ship"; }
const hariIni = new Date().toISOString().substring(0, 10);
let ckt=""; let amp="";
if(subKategori=="mutasi" || subKategori=="log")
{
	ckt=`<label class="form-label fw-bold small"><span class="text-danger">*</span> Cabang Kota Tujuan ${uckat}</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-geo-alt-fill"></i></span>
                        <input type="text" class="form-control fw-bold text-success" id="mutTujuan" placeholder="contoh: Jakarta, Semarang, Makassar" required>
                    </div>`;
	amp=`<label class="form-label fw-bold small"><span class="text-danger">*</span> Alasan Melakukan Pindah</label>
                    <textarea class="form-control" id="mutAlasan" rows="3" placeholder="Tuliskan alasan Anda (misal: Melanjutkan Pendidikan PPDS / Pindah Tugas Dinas)..." required></textarea>`;
}
if(subKategori=="ppds" || subKategori=="ppdssub" || subKategori=="fellow")
{
	ckt=`<label class="form-label fw-bold small"><span class="text-danger">*</span> Jurusan/Kepeminatan ${uckatx}</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-geo-alt-fill"></i></span>
                        <input type="text" class="form-control fw-bold text-success" id="mutTujuan" placeholder="contoh Spesialis Bedah, Spesialis Penyalit Dalam" required>
                    </div>`;
	amp=`<label class="form-label fw-bold small"><span class="text-danger">*</span> Universitas yang di tuju</label>
                    <div class="input-group"><span class="input-group-text bg-light text-muted"><i class="bi bi-geo-alt-fill"></i></span><input class="form-control fw-bold text-success" id="mutAlasan" placeholder="Contoh: Universitas Indonesia  " required> </div>`;
		
                                      
}
	
    const htmlFormMutasi = `
        <div class="container py-2" id="formEntry${uckat}Wrapper">
            <form id="formInsertTransaksi${uckat}MySQL" class="row g-3">
                <!-- Data Profil Terkunci -->
                <div class="col-md-3">
                    <label class="form-label fw-semibold text-secondary small">ID Anggota</label>
                    <input type="text" class="form-control bg-light font-monospace fw-bold" id="mutNoAnggota" value="${idAngg}" readonly>
                </div>
                <div class="col-md-5">
                    <label class="form-label fw-semibold text-secondary small">Nama Dokter</label>
                    <input type="text" class="form-control bg-light fw-bold" id="mutNamaAnggota" value="${namaDokter}" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold text-secondary small">No WhatsApp</label>
                    <input type="text" class="form-control bg-light font-monospace" id="mutTelpon" value="${telpon}" readonly>
                </div>

                <!-- Input Utama Pengajuan -->
                <div class="col-md-6">
                    ${ckt}
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small"><span class="text-danger">*</span> Tanggal Pengajuan</label>
                    <input type="date" class="form-control font-monospace" id="mutWaktu" value="${hariIni}" required>
                </div>

                <div class="col-12">
				${amp}
                </div>

                <!-- Notifikasi Info Berkas -->
                <div class="col-12">
                    <div class="alert alert-info py-2 px-3 small border-start border-4 border-info mb-0">
                        <i class="bi bi-info-circle-fill me-1"></i> <b>Catatan:</b> Setelah data formulir ini disimpan, status awal akan menjadi <b>DRAFT</b>. Anda dapat mengunggah berkas lampiran pendukung (Surat Permohonan, STR, & Bukti Iuran) pada langkah berikutnya.
                    </div>
                </div>

                <!-- Tombol Submit -->
                <div class="col-12 text-end pt-3 border-top mt-4">
                    <button type="submit" class="btn btn-sm btn-success px-4 fw-bold" id="btnSubmitSimpan${uckat}">
                        <i class="bi bi-save2 me-1"></i> Simpan & Lanjutkan
                    </button>
                </div>
            </form>
        </div>
    `;

    // Render formulir ke dalam jendela Modal Tingkat 2 bawaan aplikasi Anda
    if (typeof modal2v === "function") {
        modal2v(`Formulir Pengajuan ${uckat}`, htmlFormMutasi);
    } else if (typeof modal2x === "function") {
        modal2x(`Formulir Pengajuan ${uckat}`, htmlFormMutasi);
    } else {
        alert("Fungsi modal tingkat 2 tidak ditemukan.");
        return;
    }

    // Penanganan Pengiriman Data Form (Submit Event)
    const formInsert = document.getElementById("formInsertTransaksi"+uckat+"MySQL");
    formInsert.addEventListener("submit", function(e) {
        e.preventDefault();

        const btnSimpan = document.getElementById("btnSubmitSimpan"+uckat);
        if (btnSimpan) btnSimpan.disabled = true;
        const payload = new FormData();
		payload.append("idAnggota", idAngg);
		payload.append("namaAnggota", namaDokter);
        payload.append("iduser", document.getElementById("mutNoAnggota").value);
        payload.append("tujuan", document.getElementById("mutTujuan").value.trim());
        payload.append("waktu", document.getElementById("mutWaktu").value);
        payload.append("alasan_"+subKategori, document.getElementById("mutAlasan").value.trim());
        payload.append("status", "DRAFT"); // Status standar awal pengajuan baru

        // Amankan penutupan instansiasi resmi Bootstrap 5 hulu modal 2
        const targetModalEl = document.getElementById('secondAdminModal');
        let bootstrapModalInstance = bootstrap.Modal.getInstance(targetModalEl);
        if (!bootstrapModalInstance && targetModalEl) {
            bootstrapModalInstance = new bootstrap.Modal(targetModalEl);
        }

        const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
        const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

        fetch(`${cleanEndpoint}/proses.php?aksi=insert_transaksi_${subKategori}`, {
            method: "POST",
            body: payload,
			mode: "cors",              
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // Tutup modal secara aman tanpa memicu crash tombol manual click
                if (bootstrapModalInstance) {
                    bootstrapModalInstance.hide();
                } else {
                    const btnCloseManual = document.getElementById("tutupmodal2") || document.getElementById("secondModalCloseBtn");
                    if (btnCloseManual) btnCloseManual.click();
                }

                alert("Data permohonan "+subKategorix+" berhasil disimpan!");

                // Segarkan data tabel kas utama anggota setelah jeda penutupan efek transisi modal
                setTimeout(() => { 
                    window.eksekusiFetchMutasiMurni(telpon,subKategori); 
                }, 400);

            } else {
				if(data.status==='error anggota')
				{
                alert(data.message);
				tutupModalTerbuka();
				prosesEditAnggota(idAngg,'Anggota');
				
				}
				else
				{
				alert(data.message);
				window.location.reload();
				}
                if (btnSimpan) btnSimpan.disabled = false;
            }
        })
        .catch(err => {
            console.error("Gagal melakukan penyimpanan data "+subKategorix+":", err);
            alert("Koneksi ke secure cloud server database gagal.");
            if (btnSimpan) btnSimpan.disabled = false;
        });
    });
};

window.bukaFormUploadPersyaratanMutasiModal2 = function(idAnggota,idMutasi, kotaTujuan, folderAnggota, ttdAnggota, subKategori) {
    window.globalActiveFolderIdContext = folderAnggota;
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
	let subKategorix=subKategori; let uckatx=uckat;
if(subKategori==="fellow") { subKategorix=subKategori+"ship"; uckatx=uckat+"ship"; }
    let htmlAlertStatemenFolder = "";
    let isFormDisabled = "";
    let htmlTombolSimpan = "";

    const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";
	const namaDokterContext=localStorage.getItem("idi_nama_dokter");

    if (!folderAnggota || folderAnggota.trim() === "" || folderAnggota === "null") {
        htmlAlertStatemenFolder = `
            <div class="alert bg-danger-subtle text-danger border border-danger-subtle p-3 rounded-4 mb-4 d-flex align-items-start gap-3 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill fs-3 mt-1"></i>
                <div class="w-100">
                    <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Akses Ditolak: Folder Utama Belum Tersedia!</span>
                    <span class="small d-block mb-3">Sistem mendeteksi bahwa arsip folder Google Drive utama Anda belum dibuat di data keanggotaan.</span>
                   
                    <button type="button" class="btn btn-sm btn-danger fw-bold rounded-pill px-3 shadow-sm d-inline-flex align-items-center gap-1"
                            onclick="window.bukaPanduanDanInputFolderModal3Direct(${idAnggota},'${idMutasi}', '${kotaTujuan}','${ttdAnggota}','${subKategori}')">
                        <i class="bi bi-book-half"></i> Panduan Pembuatan Folder & Input Kode
                    </button>
                </div>
            </div>
        `;
        isFormDisabled = "disabled bg-secondary-subtle text-muted text-opacity-50"; //
        
        htmlTombolSimpan = `
            <button type="button" class="btn btn-sm btn-secondary px-4 fw-bold" disabled>
                <i class="bi bi-lock-fill me-1"></i> Fitur Dikunci: Selesaikan Folder Anda
            </button>
        `;
} else {
    // 💡 PERUBAHAN UTAMA: Menambahkan teks link interaktif untuk mengedit kode folder drive yang terdaftar
    htmlAlertStatemenFolder = `
        <div class="alert bg-success-subtle text-success border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
            <i class="bi bi-cloud-arrow-up fs-3 text-success animate-pulse"></i>
            <div class="w-100">
                <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Dokumen Kelengkapan ${uckatx}</span>
                <span class="small d-block mb-1">Folder Keanggotaan Terdeteksi Aktif. Silakan tautkan ID File Google Drive yang valid untuk verifikasi ${subKategori} ke <b>${kotaTujuan}</b>.</span>
                
                <!-- TOMBOL EDIT LINK KODE FOLDER ACTIVE -->
                <div class="mt-2 pt-2 border-top border-success border-opacity-25" style="font-size: 0.75rem;">
                    <i class="bi bi-folder-check me-1"></i> ID Folder Aktif: 
                    <a href="#" class="font-monospace fw-bold text-success-emphasis text-decoration-underline p-1 bg-white bg-opacity-50 rounded" 
                       title="Klik di sini jika Anda ingin mengubah atau mengedit kode ID Folder Google Drive Anda"
                       onclick="event.preventDefault(); window.bukaPanduanDanInputFolderModal3Direct(${idAnggota}, '${idMutasi}', '${kotaTujuan.replace(/'/g, "\\'")}', '${ttdAnggota}', '${subKategori}')">
                        ${folderAnggota} <i class="bi bi-pencil-square ms-1"></i> (Edit Mode)
                    </a>
                </div>
            </div>
        </div>
    `;
    
    isFormDisabled = ""; 
    
    htmlTombolSimpan = `
        <button type="submit" class="btn btn-sm btn-success px-4 fw-bold shadow-sm" id="btnSubmitUploadPersyaratan">
            <i class="bi bi-cloud-check-fill me-1"></i> Simpan Dokumen Kelengkapan
        </button>
    `;
}

let valPermohonan = "";
    let valIuran = "";
    let valSTR = "";
    let valKTP = "";
	
	if (window.globalListDbMutasiAktif) {
        const itemEksis = window.globalListDbMutasiAktif.find(x => x.id == idMutasi);
        if (itemEksis) {
            // Fungsi pembantu memotong URL Drive penuh menjadi ID kode bersih murni
            const ekstrakIdMurni = function(strUrl) {
                if (!strUrl || strUrl.trim() === "" || strUrl.toLowerCase() === "null") return "";
                if (strUrl.includes("/d/")) {
                    return strUrl.split("/d/")[1].split("/")[0].trim();
                }
                return strUrl.trim();
            };

            valPermohonan = ekstrakIdMurni(itemEksis.permohonan);
            valIuran      = ekstrakIdMurni(itemEksis.iuranidi);
            valSTR        = ekstrakIdMurni(itemEksis.str);
            valKTP        = ekstrakIdMurni(itemEksis.ktp);
			
        }
    }
	
    // Susun struktur formulir dengan menyisipkan variabel statemen kondisional di atas
    const htmlFormUploadPersyaratan = `
        <div class="container py-2" id="formUploadPersyaratanWrapper">
            <div class="row justify-content-center">
                <div class="col-lg-11">
                    
                    ${htmlAlertStatemenFolder}

                    <form id="formUpdatePersyaratan${uckat}MySQL" class="row g-4">
                        <input type="hidden" id="uploadId${uckat}" value="${idMutasi}">

                        <!-- BARIS LIST 1: SURAT PERMOHONAN -->
						<div class="col-12 border-bottom pb-4 bg-light p-3 rounded-4 border">
						<label class="form-label fw-bold text-dark small mb-2"><span class="text-danger">*</span> 1. Dokumen Surat Permohonan ${uckatx}</label>
								
                            <div class="d-flex gap-2 align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text bg-light text-muted small" style="font-size:0.7rem;">ID FILE</span>
                                    <input type="text" class="form-control font-monospace text-primary fw-semibold" id="upPermohonan" value="${valPermohonan}"  placeholder="Belum ada file terpilih..." required readonly>
                                </div>
							
                                <button type="button" id="btnTriggerPickManualDrive" class="btn btn-sm btn-outline-primary  fw-bold text-nowrap py-2 px-3 ${isFormDisabled}" ${isFormDisabled}" onclick="window.bukaPortalPickFileDriveModal3('${folderAnggota}', 'upPermohonan','${subKategori}')"><i class="bi bi-folder-symlink"></i> Ambil dari Drive</button>
                                
                            </div>
							<div class="ps-1">
							<a href="#" id="linkFormulirPermohonanModal2" class="text-decoration-none small fw-bold text-primary d-inline-flex align-items-center gap-1 ${isFormDisabled ? 'text-muted opacity-50 pointer-events-none' : ''}"
                                   onclick="event.preventDefault(); if('${isFormDisabled}' === '') { window.bukaFormulirPermohonanKhususModal3('${idMutasi}', '${kotaTujuan}', '${ttdAnggota}','${subKategori}');}">
    <i class="bi bi-clipboard-check-fill text-success"></i> 📋 Formulir Permohonan
</a>
                            </div>
                        </div>

                        <!-- BARIS LIST 2: KWITANSI BUKTI IURAN -->
                        <div class="col-12 border-bottom pb-3">
                            <label class="form-label fw-bold text-dark small"><span class="text-danger">*</span> 2. Kwitansi Bukti Pelunasan Iuran Wajib</label>
                            <div class="d-flex gap-2 align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text bg-light text-muted small" style="font-size:0.7rem;">ID FILE</span>
                                    <input type="text" class="form-control font-monospace text-primary fw-semibold ${isFormDisabled}" id="upIuran" value="${valIuran}" placeholder="Belum ada file terpilih..." required readonly>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-primary fw-bold text-nowrap py-2 px-3 ${isFormDisabled}" ${isFormDisabled}
                                        onclick="window.bukaPortalPickFileDriveModal3('${folderAnggota}', 'upIuran','${subKategori}')">
                                    <i class="bi bi-folder-symlink"></i> Ambil dari Drive
                                </button>
                            </div>
                        </div>

                        <!-- BARIS LIST 3: DOKUMEN STR -->
                        <div class="col-12 border-bottom pb-3">
                            <label class="form-label fw-bold text-dark small"><span class="text-danger">*</span> 3. Berkas STR (Surat Tanda Registrasi) Resmi</label>
                            <div class="d-flex gap-2 align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text bg-light text-muted small" style="font-size:0.7rem;">ID FILE</span>
                                    <input type="text" class="form-control font-monospace text-primary fw-semibold ${isFormDisabled}" id="upSTR" value="${valSTR}" placeholder="Belum ada file terpilih..." required readonly>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-primary fw-bold text-nowrap py-2 px-3 ${isFormDisabled}" ${isFormDisabled}
                                        onclick="window.bukaPortalPickFileDriveModal3('${folderAnggota}', 'upSTR','${subKategori}')">
                                    <i class="bi bi-folder-symlink"></i> Ambil dari Drive
                                </button>
                            </div>
                        </div>

                        <!-- BARIS LIST 4: NEW COMPONENT KTP -->
                        <div class="col-12 pb-2">
                            <label class="form-label fw-bold text-dark small"><span class="text-danger">*</span> 4. Kartu Tanda Penduduk (KTP / Identitas Dokter)</label>
                            <div class="d-flex gap-2 align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text bg-light text-muted small" style="font-size:0.7rem;">ID FILE</span>
                                    <input type="text" class="form-control font-monospace text-primary fw-semibold ${isFormDisabled}" id="upKTP" value="${valKTP}" placeholder="Belum ada file terpilih..." required readonly>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-primary fw-bold text-nowrap py-2 px-3 ${isFormDisabled}" ${isFormDisabled}
                                        onclick="window.bukaPortalPickFileDriveModal3('${folderAnggota}', 'upKTP','${subKategori}')">
                                    <i class="bi bi-folder-symlink"></i> Ambil dari Drive
                                </button>
                            </div>
                        </div>

                        <div class="col-12 text-end pt-3 border-top mt-4">
                            ${htmlTombolSimpan}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    modal2v(`Upload ${uckatx}: ID #${idAnggota}`, htmlFormUploadPersyaratan);

    const formUpload = document.getElementById("formUpdatePersyaratan"+uckat+"MySQL");
    if (formUpload && isFormDisabled === "") {
        formUpload.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const btnSimpan = document.getElementById("btnSubmitUploadPersyaratan");
            if (btnSimpan) {
                btnSimpan.disabled = true;
                btnSimpan.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Menyimpan Berkas...`;
            }

            // 💡 REVISI PENGAMAN: Mengunci nomor WhatsApp context dokter agar bebas dari ReferenceError
            const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

            const payload = new FormData();
			payload.append("idAnggota", idAnggota );
			payload.append("namaAnggota", namaDokterContext );
            payload.append("id", document.getElementById("uploadId"+uckat).value);
            payload.append("permohonan", document.getElementById("upPermohonan").value);
            payload.append("iuranidi", document.getElementById("upIuran").value);
            payload.append("str", document.getElementById("upSTR").value);
            payload.append("ktp", document.getElementById("upKTP").value); // Sukses mengirim parameter KTP baru

            const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
            const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

            // ⚡ FIX CONCATENATE: Memasang backtick (`) pembungkus string URL fetch secara valid
            fetch(`${cleanEndpoint}/proses.php?aksi=update_berkas_${subKategori}`, { 
                method: "POST", 
                body: payload,
				mode: "cors",              
                credentials: "include"
            })
            .then(res => {
                if (!res.ok) throw new Error("HTTP error " + res.status);
                return res.json();
            })
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    // Tutup secondAdminModal (Modal 2) secara aman
                    if (typeof window.closeSecondAdminModal === "function") {
                        window.closeSecondAdminModal();
                    }
                    // Refresh otomatis rekapitulasi data mutasi pada layar utama
                    if (typeof window.eksekusiFetchMutasiMurni === "function") {
                        window.eksekusiFetchMutasiMurni(telponDokterContext,subKategori);
                    }
                } else {
                    if (btnSimpan) {
                        btnSimpan.disabled = false;
                        btnSimpan.innerHTML = `<i class="bi bi-cloud-check-fill me-1"></i> Simpan Dokumen Kelengkapan`;
                    }
                }
            })
            .catch(err => {
                console.error("Gagal memperbarui dokumen "+subKategori+":", err);
                alert("Terjadi masalah komunikasi data. Berkas gagal disimpan ke server PHP.");
                if (btnSimpan) {
                    btnSimpan.disabled = false;
                    btnSimpan.innerHTML = `<i class="bi bi-cloud-check-fill me-1"></i> Simpan Dokumen Kelengkapan`;
                }
            });
        });
    }
};

window.bukaFormulirPermohonanKhususModal3 = function(idMutasi, kotaTujuan, idTtdDriveEksis, subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
		let subKategorix=subKategori; let uckatx=uckat;
if(subKategori==="fellow") { subKategorix=subKategori+"ship"; uckatx=uckat+"ship"; }
    const idAnggotaAsliMySQL= localStorage.getItem("idi_id_user");
    const namaDokterContext = localStorage.getItem("idi_nama_dokter") || "Anggota Dokter";
    const tglHariIni = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const folderIdTarget = "1RRP6I5aMCY1TLZQ4JcCaV8jg-D7UdcJc";

    if (idAnggotaAsliMySQL === "0") {
        alert("Gagal memuat formulir: ID Anggota Dokter tidak terdeteksi di konteks formulir.");
        return;
    }

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_profil_anggota_${subKategori}&iduser=${idAnggotaAsliMySQL}&id_${subKategori}=${idMutasi}`, {
        method: "GET"
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status " + res.status);
        return res.json();
    })
    .then(res => {
        if (res.status !== 'success') {
            throw new Error(res.message || "Data profil gagal ditarik.");
            setTimeout(() => {
  window.location.reload();
}, 2000);
        }
        
        const dataDokter  = res.data;
        const namaDokter  = dataDokter.nama || "Anggota Dokter";
        const tempatLahir = dataDokter.tempat_lahir || "-";
        const tglLahir    = dataDokter.tgl_lahir || "-";
        const alamatRumah = dataDokter.alamat || "Belum melengkapi alamat di data profil keanggotaan.";
        const nomorStr    = dataDokter.str || "-";
		let alm=""; 
	    if(subKategori==="mutasi" || subKategori==="log")
		{
        alm= dataDokter.alasan_mutasi || "-";
		}
		if(subKategori==="log")
		{
        alm= dataDokter.alasan_log || "-";
		}
		if(subKategori==="ppds" || subKategori==="ppdssub" || subKategori==="fellow")
		{
		alm= dataDokter.universitas || "-";
		}
        const tglHariIni  = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        let htmlKomponenTtdSeksi = "";
        let isTombolKirimDisabled = "disabled"; 

        if (idTtdDriveEksis && idTtdDriveEksis.trim() !== "" && idTtdDriveEksis !== "null" && idTtdDriveEksis.length > 15) {
            htmlKomponenTtdSeksi = `
                <div class="p-2 text-center text-success small font-monospace animate-fade-in fw-bold">
                    <img src="https://lh3.googleusercontent.com/d/${idTtdDriveEksis}" style="width:200px; height:130px; object-fit:contain;" class="d-block mx-auto mb-1 rounded bg-white">
                    
                </div>
            `;
            isTombolKirimDisabled = ""; 
        } else {
            htmlKomponenTtdSeksi = `
                <div id="wrapperPlaceholderTriggerTtdLink" class="py-3 my-2 border border-danger border-dashed bg-danger bg-opacity-10 rounded-3 text-center">
                    <span class="text-danger small d-block fw-bold mb-1"><i class="bi bi-x-circle-fill"></i> Tanda Tangan Kosong</span>
                    <a href="#" class="text-decoration-none btn btn-xs btn-danger fw-bold rounded-pill px-2 py-0" style="font-size:0.65rem;"
                       onclick="event.preventDefault(); window.bukaPanelGoresCanvasTtdDiModal3Inline('${subKategori}')">
                        ✍️ Buat Tanda Tangan Baru
                    </a>
                </div>

                <div id="wrapperCanvasInlineModal3" class="d-none bg-light border border-secondary rounded p-2 my-2 animate-fade-in text-center">
                    <canvas id="signaturePadInlineCanvas" width="220" height="90" style="cursor:crosshair; touch-action: none; background:#fff; margin:0 auto; display:block;"></canvas>
                    <div class="mt-1 d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-xs btn-outline-secondary py-0 px-2 font-monospace" style="font-size:0.6rem;" onclick="window.hapusCoretanInlineModal3()"><i class="bi bi-eraser"></i> Clear</button>
                        <button type="button" class="btn btn-xs btn-success py-0 px-2 fw-bold font-monospace" style="font-size:0.6rem;" onclick="window.eksekusiSimpanTtdInlineModal3ViaGAS('${folderIdTarget}','${subKategori}')">✔ Kunci</button>
                    </div>
                </div>
            `;
        }
        
		let perm=""; let titlejur=""; let jurus=""; let alas=""; 
		if(subKategori==="mutasi")
		{
		perm=`Dengan hormat, yang bertanda tangan di bawah ini saya mengajukan permohonan  pindah keanggotaan Ikatan Dokter Indonesia dari Cabang Kota Batam menuju cabang kota tujuan baru:`;
		titlejur="Cabang Kota Tujuan";
		jurus=`IDI CABANG ${kotaTujuan.toUpperCase()}`;
		alas="Alasan Pindah";
		}
		if(subKategori==="log")
		{
		perm=`Dengan hormat, yang bertanda tangan di bawah ini saya mengajukan permohonan  Letter of Good Standing ke kota tujuan baru:`;
		titlejur="Kota Tujuan";
		jurus=`${kotaTujuan.toUpperCase()}`;
		alas="Alasan Log";
		}
		if(subKategori==="ppds" || subKategori==="ppdssub"  || subKategori==="fellow")
		{
		perm=`Dengan hormat, yang bertanda tangan di bawah ini saya mengajukan permohonan Surat Rekomendasi melanjutkan Studi:`;
		titlejur="Jurusan/Kepeminatan";
		jurus=`${kotaTujuan.toUpperCase()}`;
		alas ="Universitas";
		}
        const htmlFormulirPermohonanModal3 = `
		<div class="container py-2" id="formulirPermohonanModal3Wrapper">
                <div class="row justify-content-center">
                    <div class="col-12">
                        
                        <!-- AREA LEMBAR CETAK SURAT -->
                        <div id="printAreaSuratPermohonanDokter" class="card p-4 shadow-sm border rounded-4 bg-white mb-4 position-relative overflow-hidden font-serif" style="color:#000; line-height:1.6; font-size:0.92rem; font-family: 'Times New Roman', Times, serif;">
                            
                            <div class="text-center border-bottom pb-2 mb-4">
                                <h5 class="fw-bold m-0" style="color:#0f5132; letter-spacing:0.5px;">SURAT PERMOHONAN ${subKategorix.toUpperCase()} </h5>
                                <span class="small font-monospace text-muted">ID Registrasi Pengajuan: #M-${idMutasi}</span>
                            </div>

                            <div class="mb-4">
                                Kepada Yth,<br>
                                <b>Ketua Ikatan Dokter Indonesia (IDI) Cabang Kota Batam</b><br>
                                di Tempat
                            </div>

                            <div class="mb-3 text-justify" style="text-indent: 30px;">
                                ${perm}
                            </div>

                            <!-- 💡 SUNTIKAN KOTAK BIODATA DETAIL HASIL QUERY AJAX TABEL ANGGOTA -->
                            <div class="ps-4 mb-4 fw-bold">
                                <div class="row mb-1">
                                    <div class="col-4">Nama Lengkap</div>
                                    <div class="col-8">: <span class="text-uppercase">${namaDokter}</span></div>
                                </div>
                                <div class="row mb-1">
                                    <div class="col-4">Tempat, Tgl Lahir</div>
                                    <div class="col-8">: ${tempatLahir}, ${tglLahir}</div>
                                </div>
                                <div class="row mb-1">
                                    <div class="col-4">Alamat Domisili</div>
                                    <div class="col-8">: ${alamatRumah}</div>
                                </div>
                                <div class="row mb-1">
                                    <div class="col-4">Nomor STR Resmi</div>
                                    <div class="col-8">: <span class="font-monospace">${nomorStr}</span></div>
                                </div>
                                <div class="row mb-1">
                                    <div class="col-4">${titlejur}</div>
                                    <div class="col-8">: ${jurus}</div>
                                </div>
								<div class="row mb-1">
                                    <div class="col-4">${alas}</div>
                                    <div class="col-8">: ${alm}</div>
                                </div>
                            </div>

                            <div class="mb-4 text-justify">
                                Demikian surat permohonan ini saya buat dengan sadar untuk digunakan sebagaimana mestinya dalam pengurusan dokumen administrasi keprofesian dokter.
                            </div>

                            <div class="d-flex justify-content-end text-center mt-5" style="page-break-inside: avoid;">
                                <div style="width: 250px;">
                                    <div>Batam, ${tglHariIni}</div>
                                    <div class="fw-bold mb-2">Hormat Saya,</div>
                                    
                                    <div id="containerAreaTtdDinamisModal3">
                                        ${htmlKomponenTtdSeksi}
                                    </div>

                                    <div class="border-top pt-1 fw-bold text-uppercase" style="font-size:0.85rem; margin-top:5px;">( ${namaDokter} )</div>
                                </div>
                            </div>

                        </div>

                        <!-- TOMBOL ACTION DOWNLOAD PDF -->
                        <div class="card p-3 bg-light rounded-4 text-end border shadow-sm">
                            <button type="button" id="btnProsesGenerateFinalDocGas" class="btn btn-sm btn-success fw-bold px-4" ${isTombolKirimDisabled}>
                                <i class="bi bi-file-earmark-arrow-down-fill me-1"></i> Download Surat Permohonan (PDF)
                            </button>
                        </div>
                        
                        <!-- TOMBOL ACTION BATAL KELUAR -->
                        <div class="text-start pt-3 border-top mt-4">
                            <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">
                                Batal & Keluar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;

        // Bentangkan ulang Modal 3 dengan visual dokumen utuh yang sudah berisi biodata
        if (typeof modal3v === "function") {
            modal3v('Formulir Surat Permohonan '+uckat, htmlFormulirPermohonanModal3);
        }

        // Pemicu Klik Instan jika TTD sudah aman (Bawaan Anda)
        if (isTombolKirimDisabled === "") {
            const btnDownload = document.getElementById("btnProsesGenerateFinalDocGas");
            if (btnDownload) {
                btnDownload.onclick = function() {
                    window.eksekusiPrintPdfNativeModal3Engine(subKategori);
                };
            }
        }
    })
    .catch(err => {
        console.error("Gagal melakukan penarikan biodata tabel anggota:", err);
        if (typeof modal3v === "function") {
            modal3v('Formulir Mutasi', `
                <div class="alert alert-danger m-3 small p-3"> 
                    <i class="bi bi-exclamation-octagon me-1"></i> <b>Gagal Memuat Profil:</b> Koneksi ke database MySQL terputus atau field identitas dokter tidak valid. 
                </div>
            `);
        }
    });
};


window.eksekusiSimpanTtdInlineModal3ViaGAS = function(folderIdTarget,subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    if (!canvasInline) return; 
    
    const dataUrlBase64 = canvasInline.toDataURL('image/png');
    const rawBytes = dataUrlBase64.substring(dataUrlBase64.indexOf(',') + 1); 

    const btnSubmitFinal = document.getElementById("btnProsesGenerateFinalDocGas");
    const canvasBox = document.getElementById("wrapperCanvasInlineModal3");
    const idAnggotaAsliMySQL = localStorage.getItem("idi_id_user");;

    if (canvasBox) {
        canvasBox.innerHTML = `
            <div class="p-2 text-center text-success small font-monospace animate-fade-in fw-bold">
                <img src="${dataUrlBase64}" style="width:250px; height:130px; object-fit:contain;" class="d-block mx-auto mb-1 border rounded bg-white">
                <i class="bi bi-shield-check-fill"></i> Tanda Tangan Terkunci (ID: ${idAnggotaAsliMySQL})
            </div>
        `;
    }

    const gasUrl = "https://script.google.com/macros/s/AKfycbzz-g-O0ASTUmUzZ7RCK2bbBvMO_JIuGCFnwY383jkOGjt0bZPozvHj9CBJFyguZUaw/exec";

    // 1. Kirim biner gambar ke Google Apps Script via POST [INDEX]
    fetch(gasUrl, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ 
            folderId: folderIdTarget, 
            imageBytes: rawBytes,
            idAnggota: idAnggotaAsliMySQL 
        })
    })
    .then(res => res.text()) // Mengambil teks mentah untuk menghindari sandbox redirect crash [INDEX]
    .then(textRaw => {
        console.log("Respons dari GAS:", textRaw);
        if (btnSubmitFinal) {
            btnSubmitFinal.disabled = false;
            btnSubmitFinal.className = "btn btn-sm btn-success fw-bold px-4 animate-pulse";
            
            // 💡 REVISI ONCLICK: Saat tombol diklik, langsung cetak PDF cetak dokumen
            btnSubmitFinal.onclick = function(subKategori) {
                window.eksekusiPrintPdfNativeModal3Engine(subKategori);
            };
		};
        let idFileDriveTtd = "";
        try {
            // Bersihkan string bungkusan proksi Google jika ada
            const cleanJson = textRaw.trim().substring(textRaw.indexOf('{'), textRaw.lastIndexOf('}') + 1);
            const dataObj = JSON.parse(cleanJson);
            if (dataObj.id) idFileDriveTtd = dataObj.id;
        } catch (e) {
            // Fallback Regex jika JSON parser bawaan browser menolak akibat format biner
            const regexGetId = /"id"\s*:\s*"([a-zA-Z0-9_-]{25,50})"/;
            const match = textRaw.match(regexGetId);
            if (match && match[1]) idFileDriveTtd = match[1];
        }

        if (!idFileDriveTtd) {
            console.warn("Gagal mengurai ID TTD dari GAS, mengabaikan update DB lokal.");
            return;
        }

        const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
        const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

        const payloadDb = new URLSearchParams();
        payloadDb.append("iduser", idAnggotaAsliMySQL);
        payloadDb.append("id_ttd_drive", idFileDriveTtd);

        fetch(`${cleanEndpoint}/proses.php?aksi=update_ttd_anggota`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: payloadDb.toString(),
			mode: "cors",              // Memastikan mode CORS aktif lintas domain
            credentials: "include"
        })
        .then(dbRes => dbRes.json())
        .then(dbData => {
            console.log("MySQL Database Sync:", dbData.message);
			const idMutasiActive = document.getElementById("uploadIdMutasi") ? document.getElementById("uploadId"+uckat).value : "0";
            const targetLinkPermohonan = document.getElementById("linkFormulirPermohonanModal2");
            
            if (targetLinkPermohonan) {
                // Cari teks nama kota tujuan mutasi dari banner infobox Modal 2
                const wrapperForm2 = document.getElementById("formUploadPersyaratanWrapper");
                const kotaTujuanActive = wrapperForm2 && wrapperForm2.querySelector("b") ? wrapperForm2.querySelector("b").innerText : "Cabang";
                
                // Ganti trigger onclick agar menyuntikkan ID TTD Drive baru secara live tanpa re-log [INDEX]
                targetLinkPermohonan.setAttribute("onclick", `event.preventDefault(); window.bukaFormulirPermohonanKhususModal3('${idMutasiActive}', '${kotaTujuanActive}', '${idFileDriveTtd}', '${subKategori}');`);
                console.log("Link Formulir Permohonan sukses diperbarui dengan ID TTD Baru.");
            }
			if (window.globalListDbMutasiAktif) {
                const itemEksis = window.globalListDbMutasiAktif.find(x => x.id == idMutasiActive);
                if (itemEksis) itemEksis.ttd_anggota = idFileDriveTtd;
            }
        })
        .catch(dbErr => console.error("Gagal sinkronisasi ke MySQL:", dbErr));

        if (btnSubmitFinal) {
            btnSubmitFinal.disabled = false;
            btnSubmitFinal.className = "btn btn-sm btn-success fw-bold px-4 animate-pulse";
            
            const idMutasiActive = document.getElementById("uploadId"+uckat) ? document.getElementById("uploadId"+uckat).value : "0";
            const namaDokterActive = localStorage.getItem("idi_nama_dokter") || "Anggota Dokter";
            const wrapperForm2 = document.getElementById("formUploadPersyaratanWrapper");
            const kotaTujuanActive = wrapperForm2 && wrapperForm2.querySelector("b") ? wrapperForm2.querySelector("b").innerText : "Cabang";

            btnSubmitFinal.onclick = function() {
                this.disabled = true;
                this.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Mengirim Berkas...`;
                
                const inputPermohonanElement = document.getElementById("upPermohonan");
                window.pemicuCetakSuratAkhirGAS(gasUrl, folderIdTarget, idMutasiActive, namaDokterActive, kotaTujuanActive, this, inputPermohonanElement, subKategori);
            };
        }
    })
    .catch(err => {
        console.error("Gagal sinkronisasi tanda tangan inline:", err);
        if (btnSubmitFinal) {
            btnSubmitFinal.disabled = false;
            btnSubmitFinal.className = "btn btn-sm btn-success fw-bold px-4";
        }
    });
};


let canvasInline, ctxInline, isDrawingInline = false;

window.bukaPanelGoresCanvasTtdDiModal3Inline = function(subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    const triggerLinkBox = document.getElementById("wrapperPlaceholderTriggerTtdLink");
    const canvasBox = document.getElementById("wrapperCanvasInlineModal3");
    
    if (triggerLinkBox) triggerLinkBox.classList.add("d-none");
    if (canvasBox) canvasBox.classList.remove("d-none");
    // Inisialisasi Canvas Pad Inline di Modal 3
    canvasInline = document.getElementById('signaturePadInlineCanvas');
    if (!canvasInline) return;
    ctxInline = canvasInline.getContext('2d');
    ctxInline.strokeStyle = '#000000';
    ctxInline.lineWidth = 2.5;
    ctxInline.lineCap = 'round';

    // Pemicu coretan pointer mouse (Desktop)
    canvasInline.addEventListener('mousedown', (e) => { isDrawingInline = true; drawInline(e.offsetX, e.offsetY); });
    canvasInline.addEventListener('mousemove', (e) => { if(isDrawingInline) drawInline(e.offsetX, e.offsetY); });
    window.addEventListener('mouseup', () => { isDrawingInline = false; if(ctxInline) ctxInline.beginPath(); });

    // Pemicu coretan sentuhan jari (Mobile)
    canvasInline.addEventListener('touchstart', (e) => {
        isDrawingInline = true; const t = e.touches[0]; const rect = canvasInline.getBoundingClientRect();
        drawInline(t.clientX - rect.left, t.clientY - rect.top);
    });
    canvasInline.addEventListener('touchmove', (e) => {
        if(!isDrawingInline) return; const t = e.touches[0]; const rect = canvasInline.getBoundingClientRect();
        drawInline(t.clientX - rect.left, t.clientY - rect.top);
    });
    window.addEventListener('touchend', () => { isDrawingInline = false; if(ctxInline) ctxInline.beginPath(); });
};

function drawInline(x, y) {
    if (!ctxInline) return;
    ctxInline.lineTo(x, y); ctxInline.stroke();
    ctxInline.beginPath(); ctxInline.moveTo(x, y);
}

window.hapusCoretanInlineModal3 = function(subKategori) {
    if (canvasInline && ctxInline) ctxInline.clearRect(0, 0, canvasInline.width, canvasInline.height);
};


window.eksekusiPrintPdfNativeModal3Engine = function(subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    const areaKontenSurat = document.getElementById("printAreaSuratPermohonanDokter").innerHTML;
    
    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    winPrint.document.write(`
        <html>
        <head>
            <title>SURAT_PERMOHONAN ${subKategori}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Times New Roman', Times, serif; padding: 40px; background: #fff; color: #000; }
                .border-bottom { border-bottom: 2px solid #000 !important; }
                @media print {
                    body { padding: 0; margin: 0; }
                    @page { size: A4 portrait; margin: 2cm; }
                }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <div class="container mt-2">
                ${areaKontenSurat}
            </div>
        </body>
        </html>
    `);
    winPrint.document.close();
};

window.bukaPanduanDanInputFolderModal3Direct = function(idUserAnggotaAsli, idMutasi, kotaTujuan, ttdAnggota,subKategori) {
  const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);  
  let kodeFolderLamaEksis = "";
    if (window.globalActiveFolderIdContext) {
        kodeFolderLamaEksis = window.globalActiveFolderIdContext;
    } else if (window.globalListDbMutasiAktif) {
        const itemEksis = window.globalListDbMutasiAktif.find(x => x.id == idMutasi);
        if (itemEksis && itemEksis.folder_anggota) {
            kodeFolderLamaEksis = itemEksis.folder_anggota.trim();
        }
    }

    // Tentukan label dinamis apakah ini pendaftaran baru atau koreksi data
    const labelStatusMode = kodeFolderLamaEksis !== "" ? "SUNTING / EDIT KODE FOLDER AKTIF" : "AKTIVASI FOLDER BERKAS BARU";

    const htmlPanduanEngine = `
        <div class="container py-2" id="panduanDriveWrapper">
            <div class="card border-0 bg-light rounded-4 p-3 mb-4">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-info-circle-fill text-primary me-1"></i> Langkah Membuat Folder Berkas di Google Drive:</h6>
                <ol class="small text-muted ps-3 mb-0" style="line-height: 1.6;">
                    <li class="mb-2">Buka aplikasi <b>Google Drive</b> Anda, klik tombol <b>+ Baru</b> (New), lalu pilih opsi <b>Folder Baru</b>.</li>
                    <li class="mb-2">Beri nama folder tersebut dengan format: <b class="text-dark">FOLDER_NAMA_ANDA</b>.</li>
                    <li class="mb-2">Klik kanan atau ketuk ikon <b>Tiga Titik</b> pada folder, pilih <b>Bagikan (Share)</b> -> ubah akses umum menjadi <b class="text-success">Siapa saja yang memiliki link (Anyone with link) sebagai Penglihat (Viewer)</b>.</li>
                    <li class="mb-2">Salin kode ID unik foldernya saja yang tertera pada bilah alamat URL browser Anda setelah teks <i>/folders/</i>. <br>contoh : https://drive.google.com/drive/folders/<b class="text-danger">1O7eOGwK0Rw23of4OS4dleNBNgOoU98lM</b>?hl=ID</li>
                </ol>
            </div>

            <div class="card border border-warning-subtle shadow-sm rounded-4 p-4 bg-white">
                <form id="formUpdateFolderAnggotaMySQL">
                   
                    <input type="hidden" id="inputHiddenIdUserAnggota" value="${idUserAnggotaAsli}">

                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark small"><span class="text-danger">*</span> Tempel / Ketik ID Folder Google Drive Anda</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text bg-light text-muted" style="font-size:0.75rem;">folders/</span>
                            <input type="text" value="${kodeFolderLamaEksis}" class="form-control font-monospace text-success fw-bold" id="inputKodeFolderDriveNew" placeholder="Contoh: 1A2B3C4D...XyZ" required autocomplete="off">
                        </div>
                        <div class="form-text text-muted" style="font-size:0.72rem;">Pastikan hanya memasukkan kode ID unik foldernya saja tanpa menyertakan tautan domain hulu.</div>
                    </div>

                    <div class="text-end pt-3 border-top mt-4">
                        <button type="submit" class="btn btn-sm btn-success px-4 fw-bold" id="btnSubmitUpdateFolderDrive">
                            <i class="bi bi-cloud-arrow-up-fill me-1"></i> Daftarkan & Aktifkan Folder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    if (typeof modal3v === "function") {
        modal3v('Panduan', htmlPanduanEngine);
    } else {
        alert("Modul jendela modal3 tidak terdefinisi!");
        return;
    }

    const formUpdateFolder = document.getElementById("formUpdateFolderAnggotaMySQL");
    formUpdateFolder.addEventListener("submit", function(e) {
        e.preventDefault();

        const btnSave = document.getElementById("btnSubmitUpdateFolderDrive");
        if (btnSave) {
            btnSave.disabled = true;
            btnSave.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Mendaftarkan...`;
        }

       
		const kodeFolderBaru = document.getElementById("inputKodeFolderDriveNew").value.trim()
                        .replace('https://drive.google.com/drive/folders/', '')
                        .replace(/\?.*/, ''); // 🔥 Menghapus tanda tanya (?) dan semua teks di belakangnya secara otomatis


        const idAnggotaContext = document.getElementById("inputHiddenIdUserAnggota").value; 
        const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

        const payloadFolder = new FormData();
        payloadFolder.append("iduser", idAnggotaContext);
        payloadFolder.append("folder", kodeFolderBaru);

        const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
        const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

        fetch(`${cleanEndpoint}/proses.php?aksi=update_folder_anggota`, {
            method: "POST",
            body: payloadFolder,
			mode: "cors",              
    credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                
                const dialog3 = document.getElementById("fsDialog");
                if (dialog3 && typeof dialog3.close === "function") {
                    dialog3.close();
                }

                if (typeof window.eksekusiFetchMutasiMurni === "function") {
                    window.eksekusiFetchMutasiMurni(telponDokterContext,subKategori);
                }
                
               
                setTimeout(() => {
                    if (typeof window.bukaFormUploadPersyaratanMutasiModal2 === "function") {
                        window.bukaFormUploadPersyaratanMutasiModal2(idUserAnggotaAsli,idMutasi, kotaTujuan, kodeFolderBaru, ttdAnggota, subKategori);
					
                    }
                }, 450);

            } else {
                window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal melakukan registrasi folder keanggotaan:", err);
            alert("Koneksi gagal terhubung ke server pangkalan data.");
            if (btnSave) {
                btnSave.disabled = false;
                btnSave.innerHTML = `<i class="bi bi-cloud-arrow-up-fill me-1"></i> Daftarkan & Aktifkan Folder`;
            }
        });
    });
};

window.bukaPortalPickFileDriveModal3 = function(kodeFolderAsli, inputTargetIdFieldElement, subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbwGB6ZJLtNn1nZ5D6bd4Jwre8WMyAbnakOCN9kRbynVpFYyf3Bh4IvOyZGt2QgL9KGi/exec";

    const htmlFilePickerCanvas = `
        <div class="container py-1" id="gasDrivePickerWrapper">
            <div class="alert bg-success-subtle text-success py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-eye-fill"></i>
                <span><b>Pratinjau Struk Visual Aktif:</b> Silakan langsung klik pada baris berkas di bawah untuk memilih dan menyuntikkan ID-nya otomatis ke form.</span>
            </div>

            <!-- CONTAINER LIST -->
            <div id="gasDriveFilesContainer" class="list-group rounded-4 shadow-sm overflow-hidden animate-fade-in" style="max-height: 55vh; overflow-y: auto;">
                <div class="text-center py-5 text-muted bg-white border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                    <p class="small mb-0 font-monospace text-secondary">Sedang memindai gambar dan dokumen dari folder Google Drive...</p>
                </div>
            </div>
        </div>
    `;

    if (typeof modal3v === "function") {
        modal3v('Pilih Berkas', htmlFilePickerCanvas);
    } else {
        alert("Modul penampil tingkat modal3 tidak terkonfigurasi!");
        return;
    }

    const filesContainer = document.getElementById("gasDriveFilesContainer");
    if (!filesContainer) return;

    fetch(`${googleAppsScriptUrl}?folderId=${encodeURIComponent(kodeFolderAsli.trim())}`, {
        method: "GET",
        mode: "cors"
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const listFiles = res.data;

            if (listFiles.length === 0) {
                filesContainer.innerHTML = `
                    <div class="text-center py-5 text-muted bg-white border-0 p-4">
                        <i class="bi bi-folder-x display-4 text-secondary mb-2"></i>
                        <h6 class="fw-bold mb-1 text-dark">Folder Ini Kosong!</h6>
                        <p class="small mb-0 text-muted">Belum ada file dokumen apa pun di dalam folder Google Drive ini.</p>
                    </div>
                `;
                return;
            }

            let listItemsHtml = "";
            for (let i = 0; i < listFiles.length; i++) {
                const file = listFiles[i];
                let komponenVisualIkonAtauGambar = "";

                if (file.mimeType.includes("image")) {
                    komponenVisualIkonAtauGambar = `
                        <div class="position-relative bg-light rounded border overflow-hidden d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <img src="https://lh3.googleusercontent.com/d/${file.id}" 
                                 alt="${file.name}" 
                                 class="w-100 h-100" 
                                 style="object-fit: cover;"
                                 onerror="this.src='https://placehold.co'">
                        </div>
                    `;
                } else if (file.mimeType.includes("pdf")) {
                    komponenVisualIkonAtauGambar = `
                        <div class="bg-danger-subtle text-danger rounded border border-danger-subtle d-flex flex-column align-items-center justify-content-center fw-bold font-monospace" 
                             style="width: 52px; height: 52px; font-size: 0.65rem; letter-spacing:0.3px;">
                            <i class="bi bi-file-earmark-pdf-fill fs-5 mb-0"></i>
                            <span>PDF</span>
                        </div>
                    `;
                } else {
                    komponenVisualIkonAtauGambar = `
                        <div class="bg-light text-secondary rounded border d-flex flex-column align-items-center justify-content-center fw-bold font-monospace" 
                             style="width: 52px; height: 52px; font-size: 0.65rem;">
                            <i class="bi bi-file-earmark-text-fill fs-5 mb-0"></i>
                            <span>FILE</span>
                        </div>
                    `;
                }

                const sizeInKb = (file.size / 1024).toFixed(1);
                const stringUkuran = sizeInKb > 1024 ? (sizeInKb / 1024).toFixed(1) + " MB" : sizeInKb + " KB";

                listItemsHtml += `
                    <a href="#" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 px-4 transition-all animate-fade-in"
                       style="cursor: pointer;"
                       onclick="event.preventDefault(); window.eksekusiSuntikIdFileDriveOtomatisMurni('${file.id}', '${inputTargetIdFieldElement}','${subKategori}')"
                       title="Klik untuk memilih berkas ini">
                        
                        <div class="d-flex align-items-center gap-3">
                            ${komponenVisualIkonAtauGambar}
                            
                            <div class="text-start">
                                <h6 class="fw-bold text-dark mb-0 small text-uppercase" style="letter-spacing:0.3px; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</h6>
                                <span class="font-monospace text-muted d-block" style="font-size:0.68rem; margin-top:1px;">ID: ${file.id}</span>
                            </div>
                        </div>

                        <div>
                            <!-- Link Pratinjau Luar Cepat -->
                            <span class="badge bg-light text-secondary font-monospace border rounded-pill px-2 me-2" style="font-size:0.65rem;">${stringUkuran}</span>
                            <span class="btn btn-xs btn-light rounded-circle px-2 py-1 border text-muted" title="Pratinjau Terbuka"><i class="bi bi-chevron-right"></i></span>
                        </div>

                    </a>
                `;
            }

            filesContainer.innerHTML = listItemsHtml;

        } else {
            filesContainer.innerHTML = `<div class="alert alert-danger p-3 small m-3"><i class="bi bi-exclamation-octagon me-1"></i> Gagal memindai: ${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error("Gagal terhubung dengan GAS Explorer API:", err);
        filesContainer.innerHTML = `<div class="alert alert-danger p-3 small m-3 text-center"><i class="bi bi-wifi-off display-6 d-block mb-2"></i> Koneksi data awan terputus.</div>`;
    });
};


window.eksekusiSuntikIdFileDriveOtomatisMurni = function(idFileDriveHasilKlik, elementTargetIdFormModal2, subKategori) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    if (!idFileDriveHasilKlik) return;

    const targetBoksModal2 = document.getElementById(elementTargetIdFormModal2);
    if (targetBoksModal2) {
        targetBoksModal2.value = idFileDriveHasilKlik;
        targetBoksModal2.classList.add("is-valid"); 
        
        const dialog3 = document.getElementById("fsDialog");
        if (dialog3 && typeof dialog3.close === "function") {
            dialog3.close();
        }
    } else {
        alert("Gagal memetakan element target penampung variabel di form modal 2.");
    }
};

/**
 * Modul User / Dokter: Pratinjau Catatan Koreksi Berkas Tertangguh (Format JSON Terstruktur)
 * POTONGAN 1: Inisialisasi Tampilan List Kategori Di Modal 3 yang Informatif & Bersih
 */
window.bukaModal3LihatAlasanPendingUserDirect = function(teksCatatanKoreksi, kategoriAktif, idMutasiTarget) {
    if (typeof modal3v !== "function") {
        alert("Modul penampil tingkat modal3 tidak terkonfigurasi!");
        return;
    }

    const uckat = kategoriAktif.charAt(0).toUpperCase() + kategoriAktif.slice(1);

    // Variabel penampung default untuk teks catatan masing-masing kategori dokumen
    let alasanPermohonan = "";
    let alasanIuran = "";
    let alasanStr = "";
    let alasanKtp = "";

    // 💡 PARSER ENGINE: Bongkar string JSON bersih hasil kiriman dari database MySQL
    try {
        if (teksCatatanKoreksi && teksCatatanKoreksi !== "" && teksCatatanKoreksi !== "null" && teksCatatanKoreksi !== "-") {
            const objekJson = JSON.parse(teksCatatanKoreksi);
            
            // Baca data langsung dari struktur key-value murni kaku
            alasanPermohonan = objekJson.Permohonan || "";
            alasanIuran      = objekJson.Iuran || "";
            alasanStr        = objekJson.Str || "";
            alasanKtp        = objekJson.Ktp || "";
        }
    } catch (errParse) {
        console.error("Gagal mengurai biner JSON textvalidasipermohonan:", errParse);
        // Fallback: Jika ternyata data lama sebelum migrasi JSON (masih teks biasa)
        alasanPermohonan = teksCatatanKoreksi || "";
    }

    // Bangun rancangan antarmuka yang ramah bagi user dokter agar tahu bagian mana yang harus diperbaiki
    const htmlDetailPendingUser = `
        <div class="container py-2" id="detailPendingUserJsonWrapper">
            <!-- HEADER BUKU PETUNJUK USER -->
            <div class="alert bg-danger-subtle text-danger-emphasis border border-danger-subtle p-3 rounded-4 mb-4 d-flex align-items-start gap-3 shadow-sm">
                <i class="bi bi-exclamation-octagon-fill fs-3 mt-0.5 text-danger"></i>
                <div class="w-100">
                    <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Pemberitahuan Kelengkapan Berkas</span>
                    <span class="small">Pengajuan berkas Anda (ID #${idMutasiTarget}) ditangguhkan sementara oleh tim pengurus untuk koreksi administrasi. Silakan lengkapi kekurangan dokumen pada kategori yang ditandai warna kuning berikut:</span>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <!-- 1. KATEGORI PERMOHONAN -->
                <div class="col-12">
                    <div class="p-3 rounded-4 border shadow-sm ${kategoriAktif.toLowerCase() === 'permohonan' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                        <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                            📄 Catatan Dokumen Permohonan ${kategoriAktif.toLowerCase() === 'permohonan' ? '<span class="badge bg-danger text-white font-monospace mx-1" style="font-size:0.55rem; padding: 2px 6px;">WAJIB REVISI</span>' : ''}
                        </label>
                        <div class="font-monospace p-2 bg-white rounded border border-light-subtle text-dark-emphasis" style="min-height:38px; white-space: pre-line; font-size:0.82rem; font-weight: 600; line-height: 1.5;">
                            ${alasanPermohonan || '<span class="text-muted italic small fw-normal">- Berkas ini dinyatakan valid (Tidak ada koreksi) -</span>'}
                        </div>
                    </div>
                </div>

                <!-- 2. KATEGORI IURAN -->
                <div class="col-12">
                    <div class="p-3 rounded-4 border shadow-sm ${kategoriAktif.toLowerCase() === 'iuran' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                        <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                            💰 Catatan Bukti Pembayaran / Iuran ${kategoriAktif.toLowerCase() === 'iuran' ? '<span class="badge bg-danger text-white font-monospace mx-1" style="font-size:0.55rem; padding: 2px 6px;">WAJIB REVISI</span>' : ''}
                        </label>
                        <div class="font-monospace p-2 bg-white rounded border border-light-subtle text-dark-emphasis" style="min-height:38px; white-space: pre-line; font-size:0.82rem; font-weight: 600; line-height: 1.5;">
                            ${alasanIuran || '<span class="text-muted italic small fw-normal">- Berkas ini dinyatakan valid (Tidak ada koreksi) -</span>'}
                        </div>
                    </div>
                </div>

                <!-- 3. KATEGORI STR -->
                <div class="col-12">
                    <div class="p-3 rounded-4 border shadow-sm ${kategoriAktif.toLowerCase() === 'str' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                        <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                            🪪 Catatan Salinan Surat Tanda Registrasi (STR) ${kategoriAktif.toLowerCase() === 'str' ? '<span class="badge bg-danger text-white font-monospace mx-1" style="font-size:0.55rem; padding: 2px 6px;">WAJIB REVISI</span>' : ''}
                        </label>
                        <div class="font-monospace p-2 bg-white rounded border border-light-subtle text-dark-emphasis" style="min-height:38px; white-space: pre-line; font-size:0.82rem; font-weight: 600; line-height: 1.5;">
                            ${alasanStr || '<span class="text-muted italic small fw-normal">- Berkas ini dinyatakan valid (Tidak ada koreksi) -</span>'}
                        </div>
                    </div>
                </div>

                <!-- 4. KATEGORI KTP -->
                <div class="col-12">
                    <div class="p-3 rounded-4 border shadow-sm ${kategoriAktif.toLowerCase() === 'ktp' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                        <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                            🆔 Catatan Salinan Identitas KTP ${kategoriAktif.toLowerCase() === 'ktp' ? '<span class="badge bg-danger text-white font-monospace mx-1" style="font-size:0.55rem; padding: 2px 6px;">WAJIB REVISI</span>' : ''}
                        </label>
                        <div class="font-monospace p-2 bg-white rounded border border-light-subtle text-dark-emphasis" style="min-height:38px; white-space: pre-line; font-size:0.82rem; font-weight: 600; line-height: 1.5;">
                            ${alasanKtp || '<span class="text-muted italic small fw-normal">- Berkas ini dinyatakan valid (Tidak ada koreksi) -</span>'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center bg-light p-2.5 rounded-3 border mb-3">
                <small class="text-secondary" style="font-size:0.75rem;"><i class="bi bi-info-circle-fill text-info"></i> <b>Langkah Tindak Lanjut:</b> Silakan lakukan unggah ulang file pembetulan pada menu berkas akun Anda sesuai instruksi di atas agar berkas dapat divalidasi kembali oleh admin.</small>
            </div>

            <!-- TOMBOL NAVIGASI CLOSE ISOLASI MANDIRI -->
            <div class="text-end pt-3 border-top mt-2">
                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" 
                        onclick="this.closest('dialog').close();">
                    Saya Paham, Tutup
                </button>
            </div>
        </div>
    `;

    // Bentangkan langsung menggunakan objek instansiasi modal3 bawaan web app Anda
    modal3v('Catatan Perbaikan Berkas ' + uckat, htmlDetailPendingUser);
};


window.eksekusiHapusDrafMutasiMySQL = function(idMutasiTarget, kotaTujuan, subKategori, statuspenghapus) {
	const uckat=subKategori.charAt(0).toUpperCase() + subKategori.slice(1);
    if (!confirm(`PENTING!\nApakah Anda yakin ingin membatalkan dan menghapus seutuhnya data pengajuan ${subKategori} keluar ID #${idMutasiTarget} menuju IDI ${kotaTujuan}?`)) return;

    const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

    const payloadHapus = new URLSearchParams();
    payloadHapus.append("id", idMutasiTarget);

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_transaksi_${subKategori}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payloadHapus.toString(),
		mode: "cors",              
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
			if(statuspenghapus==="user")
			{
            if (typeof window.eksekusiFetchMutasiMurni === "function") {
                window.eksekusiFetchMutasiMurni(telponDokterContext,subKategori);
            }
			}
			if(statuspenghapus==="admin")
			{
			rekomendasi(subKategori);
			}
        }
        else
        {
        window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal menghapus draf "+subKategori+":", err);
        alert("Gangguan transmisi proksi Cloudflare. Data gagal dihapus dari server.");
    });
};

window.listpengurus = function() {
const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;
	
	if (typeof modal1v === "function") {
        modal1v('Manajer Organisasi', `
            <div class="text-center py-4 text-muted" id="tampilanlistpengurus">
                <div class="spinner-border text-primary mb-2" role="status"></div>
                <p class="small mb-0 font-monospace">Mengambil daftar periode dari MySQL...</p>
            </div>
        `);
    }
	
	fetch(`${cleanEndpoint}/pengurus.php?aksi=list_periode`)
    .then(res => res.json())
    .then(res => {
        if (res.status !== 'success') throw new Error(res.message);

        let htmlListCard = "";
        const dataPengurus = res.data;

        if (dataPengurus.length === 0) {
            htmlListCard = `
                <div class="text-center p-4 text-muted border border-dashed rounded-4 bg-white">
                    <i class="bi bi-people display-6 d-block mb-2 text-secondary"></i>
                    <h6 class="fw-bold">Belum Ada Data Periode</h6>
                </div>
            `;
        } else {
            // Urutkan dan rakit susunan list group
            dataPengurus.forEach(row => {
                htmlListCard += `
                    <div class="card p-3 rounded-4 bg-white border border-light shadow-sm mb-2 animate-fade-in d-flex flex-sm-row justify-content-between align-items-center gap-2">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-success bg-opacity-10 text-success p-2 rounded-3 fs-4">
                                <i class="bi bi-person-badge-fill"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold m-0 text-dark">Periode Kepengurusan ${row.periode}</h6>
                                <span class="font-monospace text-muted small" style="font-size:0.7rem;">ID SPREADSHEET: ${row.kode.substring(0, 20)}...</span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-success fw-bold rounded-pill px-3 shadow-sm text-nowrap"
                                onclick="window.fetchStrukturPengurusLiveDariGAS('${row.kode}', '${row.periode}')">
                            <i class="bi bi-cloud-lightning-fill"></i> Sinkronisasi Live
                        </button>
                    </div>
                `;
            });
        }

        // Sematkan list card ke dalam Modal 2
        const htmlLayoutModal2 = `
            <div class="container py-2" id="panelPengurusContainer">
                <div class="alert bg-success-subtle text-success border-0 p-3 rounded-4 mb-3 small d-flex align-items-center gap-2">
                    <i class="bi bi-shield-check-fill fs-5"></i>
                    <span>Pilih salah satu periode aktif untuk menarik bagan organisasi resmi langsung dari <b>Google Spreadsheet Cloud</b>.</span>
                </div>
                <div class="bg-light p-2 rounded-4 border overflow-auto" style="max-height:60vh;">
                    ${htmlListCard}
                </div>
            </div>
        `;
					
        //modal1v('Manajer Organisasi Pengurus IDI', htmlLayoutModal2);
		document.getElementById('tampilanlistpengurus').innerHTML=htmlLayoutModal2;
    })
    .catch(err => {
        console.error(err);
        modal2('Manajer Organisasi Pengurus IDI', `<div class="alert alert-danger p-3 small m-2"><i class="bi bi-wifi-off"></i> Gagal memuat data pengurus: ${err.message}</div>`);
    });
};

window.fetchStrukturPengurusLiveDariGAS = function(spreadsheetId, labelPeriode) {
    const gasUrl = "https://script.google.com/macros/s/AKfycbxlLea_EfpzXNSAHmxYr1EEVgHSOHz8quYS4TtCqkWmc910DAkDXZG8mmY5E9aRw4sb/exec";
    
    if (typeof modal2v === "function") {
        modal2v(`Struktur ${labelPeriode}`, `
            <div class="text-left py-5 text-muted" id="lihatpengurus">
			<div class="text-center">
                <div class="spinner-border text-success mb-2" role="status"></div>
                <p class="small mb-0 font-monospace">Mengunduh matriks pejabat dari Google Spreadsheet Cloud...</p>
            </div></div>
        `);
    }

    // Tembak GET Request ke Google Apps Script menggunakan parameter spreadsheetId
    fetch(`${gasUrl}?aksi=read_pengurus&spreadsheetId=${encodeURIComponent(spreadsheetId)}`, { method: "GET" })
    .then(res => res.text())
    .then(textRaw => {
        // Bersihkan balasan string dari sandbox pembungkus Google
        const cleanJson = textRaw.trim().substring(textRaw.indexOf('{'), textRaw.lastIndexOf('}') + 1);
        const resObj = JSON.parse(cleanJson);

        if (resObj.status !== "success") throw new Error(resObj.message || "Gagal menarik data");

        let htmlRowsPejabat = "";
        const listPejabat = resObj.data;

        listPejabat.forEach(p => {
            htmlRowsPejabat += `
                <tr>
                    <td class="fw-bold text-dark font-monospace small bg-light">${p.jabatan.toUpperCase()}</td>
                    <td class="fw-bold text-success small">: dr. ${p.nama}</td>
                    <td class="font-monospace text-muted small text-center">${p.npa || '-'}</td>
                </tr>
            `;
        });

        const htmlLayoutModal3 = `
            <div class="container py-1 animate-fade-in">
                <div class="card p-3 shadow-sm border rounded-4 bg-white mb-3">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-dark font-monospace text-uppercase small">
                            <tr>
                                <th width="40%">Jabatan Struktur</th>
                                <th width="45%">Nama Lengkap Pejabat</th>
                                <th width="15%" class="text-center">NPA IDI</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlRowsPejabat}
                        </tbody>
                    </table>
                </div>
                <div class="text-end border-top pt-3">
                    <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="window.closeSecondAdminModal()">Tutup Bagan</button>
                </div>
            </div>
        `;
        //modal2v(`Struktur Pengurus Periode ${labelPeriode}`, htmlLayoutModal3);
		document.getElementById('lihatpengurus').innerHTML=htmlLayoutModal3
    })
    .catch(err => {
        console.error("Gagal sinkronisasi GAS:", err);
        modal2v(`Struktur ${labelPeriode}`, `<div class="alert alert-danger p-3 small m-2"><i class="bi bi-exclamation-triangle"></i> Gagal sinkronisasi data awan: Token Spreadsheet salah atau Web App terkunci.</div>`);
    });
};

// =========================================================================
// 📂 FILE SCRIPT PART 1: COMPILER LIST TABEL AGENDA BAKSOS (MODAL 2)
// =========================================================================
window.bukaModal2ListBaktiSosial = function() {
    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    // 1. Tampilkan animasi memuat spinner di dalam ruang dialog Modal 2
    if (typeof modal1v === "function") {
        modal1v('Bakti Sosial', `
            <div class="text-left py-0 text-muted" id="baksoslist">
			<div class="text-center">
                <div class="spinner-border text-success mb-2" role="status"></div>
                <p class="small mb-0 font-monospace">Menyinkronkan database kegiatan bakti sosial...</p>
            </div></div>
        `);
		generateMainMenuDropdownHtml('Daftar Agenda Bakti Sosial');
    }

 fetch(`${cleanEndpoint}/proses.php?aksi=get_list_baksos`,{
 method: "POST",
    mode: "cors",              // Memastikan mode CORS aktif lintas domain
    credentials: "include",    // 💡 KUNCI UTAMA: Memaksa browser mengirim & menerima Cookie/Session PHP
    body: payload
 })
    .then(res => res.json())
    .then(res => {
        if (res.status !== 'success') throw new Error(res.message);

        const listDb = res.data;
        
        // Skenario penanganan jika record agenda baksos terdeteksi kosong murni
        if (!listDb || listDb.length === 0) {
            modal1v('Agenda Bakti Sosial', `
                <div class="alert alert-warning border shadow-sm rounded-4 p-4 text-center mb-0 m-2">
                    <i class="bi bi-calendar-x display-6 d-block mb-2 text-secondary"></i>
                    <h6 class="fw-bold text-dark">Belum Ada Agenda Bakti Sosial</h6>
                    <p class="small mb-0 text-muted">Belum ada jadwal kegiatan bakti sosial aktif yang terdaftar di pangkalan data.</p>
                </div>
            `);
            return;
        }

        let tableRowsHtml = "";
        let counterNo = 1;

        // Merakit baris matriks baksos berdasarkan array dari database informasi
        for (let i = 0; i < listDb.length; i++) {
            const row = listDb[i];
            
            let statusBadge = row.aktif == "1"
                ? `<span class="badge bg-success-subtle text-success px-2 py-1 rounded small fw-bold"><i class="bi bi-door-open-fill"></i> Buka</span>`
                : `<span class="badge bg-secondary-subtle text-secondary px-2 py-1 rounded small fw-bold"><i class="bi bi-door-closed-fill"></i> Tutup</span>`;

            // 💡 STRATEGI MULTI-MODAL: Klik tombol ini akan melempar data detail ke file PART 2 (Modal 3)
            const htmlAksiDetail = `
                <button type="button" class="btn btn-xs btn-success px-2 py-0 rounded fw-bold shadow-sm" style="font-size:0.7rem;"
                        onclick="window.bukaModal3DetailBaktiSosialDirect(${row.id})">
                    <i class="bi bi-search me-1"></i>Detail
                </button>
            `;
            
			const peserta = `
                <button type="button" class="btn btn-xs btn-primary px-2 py-0 rounded fw-bold shadow-sm" style="font-size:0.7rem;" data-bs-target="#secondAdminModal" data-bs-toggle="modal" data-bs-dismiss="modal"
                        onclick="window.bukaModal3DetailBaktiSosialPeserta(${row.id})">
                    <i class="bi bi-user me-1"></i>Peserta
                </button>
            `;
			
            tableRowsHtml += `
                <tr>
                    <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                    <td class="small fw-semibold text-secondary text-center">${row.waktu || '-'}</td>
                    <td class="fw-bold text-dark small text-uppercase text-truncate" style="max-width:220px;" title="${row.judul || ''}">${row.judul || '-'}</td>
                    <td class="text-muted small text-truncate" style="max-width:140px;" title="${row.lokasi || ''}">${row.lokasi || '-'}</td>
					<td class="text-center">${peserta}</td>
                    <td class="text-center">${statusBadge}</td>
                    <td class="text-center">${htmlAksiDetail}</td>
                </tr>
            `;
        }

        // Cetak struktur tabel murni ke dalam bingkai Modal 2 Anda
const htmlLayoutModal2Baksos = `
            <div class="container py-1 animate-fade-in" id="modal2BaksosListWrapper">
                <div class="alert bg-success-subtle text-success border-0 p-3 rounded-4 mb-3 small d-flex align-items-center gap-2">
                    <i class="bi bi-heart-pulse-fill fs-5 text-danger"></i>
                    <span>Berikut adalah daftar pengabdian masyarakat resmi. Klik <b>Detail</b> untuk meninjau pratinjau berkas dan poster acara.</span>
                </div>
                <div class="table-responsive rounded-4 border overflow-auto shadow-sm bg-white">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                        <thead class="table-dark text-uppercase font-monospace" style="font-size:0.72rem; letter-spacing:0.5px;">
                            <tr>
                                <th width="5%" class="text-center">No</th>
                                <th width="18%" class="text-center">Waktu Pelaksanaan</th>
                                <th width="45%">Nama Kegiatan Bakti Sosial</th>
                                <th width="15%">Lokasi</th>
								<th width="5%" class="text-center">Peserta</th>
                                <th width="5%" class="text-center">Status</th>
                                <th width="7%" class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>

            </div>
        `;
        
        
        document.getElementById('baksoslist').innerHTML = htmlLayoutModal2Baksos;
    })
    .catch(err => {
        console.error(err);
        document.getElementById('baksoslist').innerHTML=`<div class="alert alert-danger p-3 small m-2 text-center"><i class="bi bi-wifi-off"></i> Gagal merestorasi relasi agenda: ${err.message}</div>`;
    });
};

window.bukaModal3DetailBaktiSosialPeserta = function (idSeminarBaksos) {
    // 💡 1. URL Web App Google Apps Script Anda (Ganti dengan URL Apps Script Anda)
    const appsScriptUrl = "https://script.google.com/macros/s/AKfycby4MdqDpETCU3uTdHiilFvVqVbRmQ4_o0XYicPnBmScREgVpBVrH-OYZnuW8iOS0I0eUg/exec";

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    // Tampilkan layar pemuatan data (Loading State) ke dalam Modal 3
    modal2v('Data Peserta', `
        <div class="d-flex flex-column align-items-center justify-content-center p-2 m-2 text-secondary animate-fade-in" id="baksosmode">
            <div class="spinner-border text-success mb-3" role="status"></div>
            <p class="small fw-semibold mb-0">Sedang menarik data langsung dari Google Sheets, mohon tunggu...</p>
        </div>
    `);
    generateMainMenuDropdownHtml('Data Peserta');
    // Ambil detail spreadsheet_id_peserta terlebih dahulu dari server lokal php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_detail_baksos_peserta&id=${idSeminarBaksos}`, {
	method: "POST",
    mode: "cors",              // Memastikan mode CORS aktif lintas domain
    credentials: "include",    // 💡 KUNCI UTAMA: Memaksa browser mengirim & menerima Cookie/Session PHP
    body: payload
	})
        .then(res => res.json())
        .then(res => {
            if (res.status !== 'success') throw new Error(res.message);

            const dataBaksos = res.data;
            const spreadsheetId = dataBaksos.spreadsheet_id_peserta;

            if (!spreadsheetId || spreadsheetId.trim() === "") {
                throw new Error("ID Spreadsheet untuk agenda ini belum diatur oleh admin.");
            }

            // Tembak ke Google Apps Script API untuk mendapatkan array data murni
            return fetch(`${appsScriptUrl}?id=${spreadsheetId}`)
                .then(googleRes => googleRes.json())
                .then(googleData => {
                    return { dataBaksos, googleData };
                });
        })
        .then(({ dataBaksos, googleData }) => {
            if (googleData.status !== 'success') throw new Error(googleData.message);

            let headers = googleData.headers;
            const rows = googleData.rows;

            // Skenario jika sheet berhasil dibaca tapi isinya kosong murni
            if (!rows || rows.length === 0) {
				document.getElementById('baksosmode').innerHTML=`<div class="alert alert-warning border shadow-sm rounded-4 p-4 text-center mb-0 m-3 animate-fade-in">
                        <i class="bi bi-person-x display-6 d-block mb-2 text-secondary"></i>
                        <h6 class="fw-bold text-dark">Manifes Peserta Kosong</h6>
                        <p class="small mb-0 text-muted">Belum ada baris data peserta terdaftar yang tercatat di dalam spreadsheet.</p>
                    </div>
                `;
            }

headers = headers.filter(colName => {
                const namaNormal = colName.toLowerCase().trim();
                return namaNormal !== 'no' && 
                       namaNormal !== 'nomor whatsapp' &&
                       namaNormal !== 'email';
            });
            
            // ELIMINASI DUPLIKASI: Saring & buang kolom header yang bernama "No", "No.", atau "Nomor" bawaan spreadsheet

            const kolomNamaAsli = headers.find(colName => {
                const namaNormal = colName.toLowerCase().trim();
				
                return namaNormal === 'nama' || namaNormal.includes('nama lengkap');
				
            });
			
			
            // Merakit Header Tabel Dinamis berdasarkan kolom yang sudah disaring
            let tableHeaderHtml = "";
            headers.forEach(colName => {
                tableHeaderHtml += `<th class="text-nowrap">${colName}</th>`;
            });

            // 💡 Sisipkan header kolom aksi "Sertifikat" secara manual tepat di paling kanan
            tableHeaderHtml += `<th class="text-center text-nowrap" width="12%">Sertifikat</th>`;

            // 💡 VALIDASI TUNGGAL MYSQL: Cek apakah field image di tabel informasi terisi
            const isImageTerisi = dataBaksos.image && dataBaksos.image.trim() !== "";

            // Asumsi path folder penyimpanan gambar/sertifikat Anda (sesuaikan jika berbeda, misal: uploads/)
            const pathSertifikat = `${cleanEndpoint}/sertifikat_peserta_mode_peserta.php?id=&nama=`; 
            
            // Merakit Baris Data Dinamis
            let tableRowsHtml = "";
            rows.forEach((row, index) => {
                tableRowsHtml += `<tr class="baris-peserta-baksos">`;
                tableRowsHtml += `<td class="text-center font-monospace small fw-bold indeks-nomor">${index + 1}</td>`;
                
                // Tampilkan semua data dari kolom spreadsheet
                headers.forEach(colName => {
                    const cellValue = row[colName] !== undefined ? row[colName] : "-";
                    tableRowsHtml += `<td class="small nilai-kolom">${cellValue}</td>`;

                });
			
                const namaClean = kolomNamaAsli ? encodeURIComponent(row[kolomNamaAsli].toString().trim()) : 'Peserta';
				const idClean= row['No'];
			const linkSertifikatModePeserta = `${cleanEndpoint}/sertifikat_peserta_mode_peserta.php?id=${dataBaksos.id}&nama=${namaClean}&iduser=${idClean}`;
                // 💡 LOGIKA TOMBOL BERDASARKAN SYARAT FIELD IMAGE MYSQL SAJA
                let tombolSertifikatHtml = "";
                if (isImageTerisi) {
                    tombolSertifikatHtml = `
                        <a href="${linkSertifikatModePeserta}" target="_blank" class="btn btn-xs btn-primary px-2 py-0 rounded fw-bold shadow-sm" style="font-size:0.72rem;">
                            <i class="bi bi-patch-check-fill me-1 text-warning"></i>Lihat/Unduh
                        </a>
                    `;
                } else {
                    tombolSertifikatHtml = `
                        <button type="button" class="btn btn-xs btn-light text-muted px-2 py-0 rounded border small" style="font-size:0.72rem;" disabled title="Berkas sertifikat belum diunggah oleh admin ke database">
                            <i class="bi bi-hourglass-split me-1"></i>Belum Siap
                        </button>
                    `;
                }

                // Masukkan tombol ke dalam kolom paling akhir baris tabel
                tableRowsHtml += `<td class="text-center">${tombolSertifikatHtml}</td>`;
                tableRowsHtml += `</tr>`;
            });

            // Menyusun rancangan markup Tabel Responsif lengkap dengan INPUT PENCARIAN LIVE
           const htmlLayoutTabelMurni = `
    <div class="container-fluid p-2 animate-fade-in" id="modal3PesertaWrapper">
        <div class="row g-2 align-items-center mb-3">
            <div class="col-md-8">
                <div class="alert bg-success-subtle text-success border-0 p-2 px-3 rounded-3 mb-0 small d-flex align-items-center gap-2 shadow-sm">
                    <i class="bi bi-people-fill text-success fs-5"></i>
                    <span>Daftar Peserta: <b>${dataBaksos.judul}</b> (<span id="totalPesertaSaring">${rows.length}</span> / <b>${rows.length}</b>)</span>
                </div>
            </div>
            <div class="col-md-4">
                <div class="input-group shadow-sm">
                    <span class="input-group-text bg-white border-end-0 text-muted small"><i class="bi bi-search"></i></span>
                    <input type="text" id="kotakCariPesertaBaksos" class="form-control form-control-sm border-start-0 ps-1" placeholder="Ketik nama atau data lainnya..." style="font-size:0.85rem;">
                </div>
            </div>
        </div>
        
        <!-- 🔥 PERBAIKAN BESAR: Mengganti max-height ke nilai piksel tetap, menambahkan overflow-y, display block, dan mengosongkan overflow-hidden -->
        <div class="table-responsive rounded-4 border bg-white shadow-sm" 
             style="max-height: 460px; min-height: 300px; overflow-y: auto !important; overflow-x: auto; display: block; position: relative;">
            <table class="table table-striped table-hover align-middle mb-0" id="tabelUtamaPesertaBaksos" style="font-size:0.83rem;">
                <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.72rem; letter-spacing:0.5px; z-index: 10;">
                    <tr>
                        <th width="4%" class="text-center">No</th>
                        ${tableHeaderHtml}
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsHtml}
                </tbody>
            </table>
        </div>
    </div>
`;

// 1. Suntikkan layout tabel baru ke boks penampung baksosmode
document.getElementById('baksosmode').innerHTML = htmlLayoutTabelMurni;

// 2. ⚡ FORCE BACKBONE OVERFLOW DETECTOR (Suntikan CSS Darurat untuk Induk Elemen)
// Memaksa elemen bodi modal pembungkus (Bootstrap / Dialog) membuka jalur scroll vertikal
const targetBodyModal = document.getElementById("secondModalBody") || document.getElementById("bodimodal3");
if (targetBodyModal) {
    targetBodyModal.style.setProperty("overflow-y", "auto", "important");
    targetBodyModal.style.setProperty("max-height", "calc(100vh - 120px)", "important");
}

const targetDialogNative = document.getElementById("fsDialog");
if (targetDialogNative) {
    targetDialogNative.style.setProperty("overflow", "auto", "important");
}

            // FILTER PENCARIAN REAL-TIME JAVASCRIPT
            setTimeout(() => {
                const inputCari = document.getElementById('kotakCariPesertaBaksos');
                if (inputCari) {
                    inputCari.addEventListener('input', function () {
                        const keyword = this.value.toLowerCase().trim();
                        const semuaBaris = document.querySelectorAll('.baris-peserta-baksos');
                        let countTerlihat = 0;

                        semuaBaris.forEach(tr => {
                            const teksBaris = tr.textContent.toLowerCase();
                            if (teksBaris.includes(keyword)) {
                                tr.style.setProperty('display', '', 'important');
                                countTerlihat++;
                            } else {
                                tr.style.setProperty('display', 'none', 'important');
                            }
                        });

                        // Perbarui teks informasi total data terfilter di atas
                        const labelTotal = document.getElementById('totalPesertaSaring');
                        if (labelTotal) labelTotal.innerText = countTerlihat;
                    });
                }
            }, 200);

        })
        .catch(err => {
            console.error(err);
            modal2v('Gagal Memuat Data', `
                <div class="alert alert-danger p-4 small m-3 text-center rounded-4 shadow-sm animate-fade-in">
                    <i class="bi bi-exclamation-triangle display-6 d-block mb-2"></i>
                    <h6 class="fw-bold">Gagal Sinkronisasi Google Sheets</h6>
                    <p class="mb-0 small text-muted">${err.message}</p>
                </div>
            `);
        });
};

// =========================================================================
// 📂 FILE SCRIPT PART 2: DYNAMIC MODAL 3 VISUAL CARD EVENT COMPILER
// =========================================================================
window.bukaModal3DetailBaktiSosialDirect = function(idSeminarBaksos) {
    if (!idSeminarBaksos) return;

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    // Tampilkan loader memuat di dalam ruang dialog Modal 3
    if (typeof modal3 === "function") {
        modal3('Pratinjau Informasi Kegiatan', `
            <div class="text-center py-5 text-muted">
                <div class="spinner-border text-success mb-2" role="status"></div>
                <p class="small mb-0 font-monospace">Mengunduh lembar deskripsi baksos...</p>
            </div>
        `);
    }

    fetch(`${cleanEndpoint}/proses.php?aksi=get_detail_baksos&id=${idSeminarBaksos}`, {
	method: "POST",
    mode: "cors",              
    credentials: "include",    
    body: payload
	})
    .then(res => res.json())
    .then(res => {
        if (res.status !== 'success') throw new Error(res.message);

        const dataBaksos = res.data;
        const judulActivity = dataBaksos.judul || "Kegiatan Bakti Sosial";
        const biayaEvent    = (dataBaksos.biaya == "0" || dataBaksos.biaya == "" || !dataBaksos.biaya) ? "Gratis / Sosial" : `Rp ${parseInt(dataBaksos.biaya).toLocaleString('id-ID')}`;
        
        // Generator filter gambar poster CDN Google Drive
        const urlGambarCover = (dataBaksos.image && dataBaksos.image.trim() !== "" && dataBaksos.image !== "null")
            ? `https://lh3.googleusercontent.com/d/${dataBaksos.image}`
            : "https://placehold.co";

        // Susun kerangka layouting boks informasi spesifik untuk diletakkan di Modal 3
        const htmlLayoutModal3Baksos = `
            <div class="container py-1 animate-fade-in" id="modal3BaksosDetailWrapper">
                <div class="row g-3">
                    <!-- SISI KIRI: GAMBAR POSTER / BANNER -->
                    <div class="col-md-4 text-center">
                        <img src="${urlGambarCover}" alt="${judulActivity}" class="img-fluid rounded-3 border shadow-sm" style="max-height:220px; width:100%; object-fit:cover;">
                    </div>
                    <!-- SISI KANAN: MATRIKS KETERANGAN DETIL -->
                    <div class="col-md-8" style="font-size:0.83rem;">
                        <h6 class="fw-bold text-success border-bottom pb-2 mb-2 text-uppercase font-monospace" style="letter-spacing:0.5px;">${judulActivity}</h6>
                        <div class="row g-1 mb-2 font-monospace">
                            <div class="col-4 text-muted"><i class="bi bi-calendar-event me-1"></i>Waktu Mulai</div><div class="col-8 text-dark fw-bold">: ${dataBaksos.waktu || '-'}</div>
                            <div class="col-4 text-muted"><i class="bi bi-geo-alt-fill me-1"></i>Tempat/Lokasi</div><div class="col-8 text-dark fw-semibold">: ${dataBaksos.lokasi || '-'}</div>
                            <div class="col-4 text-muted"><i class="bi bi-wallet2 me-1"></i>Biaya Masuk</div><div class="col-8 text-success fw-bold">: ${biayaEvent}</div>
                            <div class="col-4 text-muted"><i class="bi bi-person-workspace me-1"></i>Ketua Panitia</div><div class="col-8 text-dark fw-semibold">: ${dataBaksos.ketua_panitia || '-'}</div>
                        </div>
                        <!-- KOTAK DESKRIPSI TEKS PARAGRAF -->
                        <div class="bg-light p-2 rounded border small" style="max-height:90px; overflow-y:auto; font-size:0.78rem; line-height:1.5;">
                            <b class="d-block text-muted small border-bottom mb-1 font-monospace"><i class="bi ::bi-text-paragraph"></i> KETERANGAN AGENDA:</b>
                            ${dataBaksos.isi || 'Tidak ada keterangan tambahan.'}
                        </div>
                    </div>
                </div>
                <!-- TOMBOL NAVIGASI KEMBALI DI BAWAH MODAL 3 -->
                <div class="text-end border-top pt-3 mt-3">
                    <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">Kembali ke Daftar</button>
                </div>
            </div>
        `;
        
        if (typeof modal3v === "function") {
            modal3v('Pratinjau', htmlLayoutModal3Baksos);
        }
    })
    .catch(err => {
        console.error(err);
        if (typeof modal3v === "function") {
            modal3v('Pratinjau', `<div class="alert alert-danger small p-2 m-2 text-center"><i class="bi bi-wifi-off"></i> Gagal merestorasi detail: ${err.message}</div>`);
        }
    });
};

window.generateMainMenuDropdownHtml = function(currentTitleText) {
	    
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    currentTitleText = currentTitleText.replace(/'/, '');

    fetch(`${cleanEndpoint}/proses.php?aksi=get_navmenu`, {
	method: "POST",
    mode: "cors",              
    credentials: "include",    
    body: payload
	})
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success' && res.data) {
            const daftarMenu = res.data;
            let dropdownItemsHtml = "";
            const targetTitleEl = document.getElementById("generalModalTitle");
			
            daftarMenu.forEach(menu => {
                // ⚡ FIX SAFE STRING: Mengamankan karakter petik tunggal agar tidak merusak inline HTML onclick
                const safeAction = menu.menu_action.replace(/'/g, "\\'");
                dropdownItemsHtml += `
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 py-2" style="cursor:pointer" 
                           onclick="event.preventDefault(); window.eksekusiAksiDropdownMenu('${safeAction}')">
                            <i class="bi bi-chevron-right text-success" style="font-size: 0.75rem;"></i>
                            <span>${menu.nama}</span>
                        </a>
                    </li>
                `;
            });
            
            
            if (targetTitleEl) {
                targetTitleEl.innerHTML = `
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-success dropdown-toggle fw-bold border-0 shadow-sm px-3 rounded-pill" type="button" id="dropdownMainMenuHeader" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-grid-fill me-2"></i> Main Menu
                        </button>
                        <ul class="dropdown-menu shadow rounded-3 border-0 mt-2" aria-labelledby="dropdownMainMenuHeader" style="font-size:0.88rem; min-width:200px; z-index:1060;">
                            ${dropdownItemsHtml}
                        </ul>
                    </div>
                    <span class="ms-3 text-muted fs-6 d-none d-sm-inline-block">| &nbsp; ${currentTitleText}</span>
                `;
            }
			
			const targetTitleE2=document.getElementById("secondModalTitle");
			
			if (targetTitleE2) {
                targetTitleE2.innerHTML = `
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-success dropdown-toggle fw-bold border-0 shadow-sm px-3 rounded-pill" type="button" id="dropdownMainMenuHeader" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-grid-fill me-2"></i> Main Menu
                        </button>
                        <ul class="dropdown-menu shadow rounded-3 border-0 mt-2" aria-labelledby="dropdownMainMenuHeader" style="font-size:0.88rem; min-width:200px; z-index:1060;">
                            ${dropdownItemsHtml}
                        </ul>
                    </div>
                    <span class="ms-3 text-muted fs-6 d-none d-sm-inline-block">| &nbsp; ${currentTitleText}</span>
                `;
            }
			const targetTitleE3=document.getElementById("titlepopup")
			if (targetTitleE3) {
                targetTitleE3.innerHTML = `
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-success dropdown-toggle fw-bold border-0 shadow-sm px-3 rounded-pill" type="button" id="dropdownMainMenuHeader" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-grid-fill me-2"></i> Main Menu
                        </button>
                        <ul class="dropdown-menu shadow rounded-3 border-0 mt-2" aria-labelledby="dropdownMainMenuHeader" style="font-size:0.88rem; min-width:200px; z-index:1060;">
                            ${dropdownItemsHtml}
                        </ul>
                    </div>
                    <span class="ms-3 text-muted fs-6 d-none d-sm-inline-block">| &nbsp; ${currentTitleText}</span>
                `;
            }
        }
    })
    .catch(error => {
        console.error("Gagal memuat struktur dropdown Main Menu:", error);
    });
};

window.dokumenPenting=function()
{
menuDokumenPenting('user');  
}

window.agendakegiatan=function()
{
menuAgenda();  
}

window.saranaKesehatan=function()
{

menuLinkTerkait('saranakesehatan#2');
setTimeout(() => {

  document.getElementById('ttb').style.display="none";
  let element = document.querySelectorAll('.ttt'); 
  let hapus = document.querySelectorAll('.tts'); 
for (let a = 0; a < element.length; a++) { 
    element[a].style.display = "none"; 
    hapus[a].style.display = "none";
}
}, 100);
}

window.linkKesehatan=function()
{
menuLinkTerkait('linkkesehatan#2');  
setTimeout(() => {

  document.getElementById('ttb').style.display="none";
  let element = document.querySelectorAll('.ttt'); 
  let hapus = document.querySelectorAll('.tts'); 
for (let a = 0; a < element.length; a++) { 
    element[a].style.display = "none"; 
    hapus[a].style.display = "none";
}
}, 100);
}
window.tutupModalTerbuka = function() {
    const modal1El = document.getElementById('generalFullscreenModal');
    const modal2El = document.getElementById('secondAdminModal');
    const dialog3El = document.getElementById('fsDialog');

    // 1. Prioritas Utama: Jika Modal 3 (Native Dialog) sedang terbuka, tutup ini dulu
    if (dialog3El && dialog3El.hasAttribute('open')) {
        if (typeof dialog3El.close === 'function') {
            dialog3El.close();
            console.log("Modal 3 (fsDialog) berhasil ditutup.");
            return true; // Berhasil menutup satu modal aktif
        }
    }

    // 2. Prioritas Kedua: Jika Modal 2 (Bootstrap 5) sedang terbuka, tutup ini
    if (modal2El && modal2El.classList.contains('show')) {
        if (typeof window.closeSecondAdminModal === 'function') {
			
            window.closeSecondAdminModal();
			 // Memakai fungsi bawaan script Anda
        } else {
            let instance2 = bootstrap.Modal.getInstance(modal2El) || new bootstrap.Modal(modal2El);
            instance2.hide();
        }
        console.log("Modal 2 (secondAdminModal) berhasil ditutup.");
        return true;
    }

    // 3. Prioritas Ketiga: Jika Modal 1 (Bootstrap 5) sedang terbuka, tutup ini
    if (modal1El && modal1El.classList.contains('show')) {
        if (typeof window.closeGeneralFullscreenModal === 'function') {
            window.closeGeneralFullscreenModal();
        } else {
            let instance1 = bootstrap.Modal.getInstance(modal1El) || new bootstrap.Modal(modal1El);
            instance1.hide();
        }
        console.log("Modal 1 (generalFullscreenModal) berhasil ditutup.");
        return true;
    }

// Opsional: Bootstrap sering menambahkan class .modal-open di tag <body> 
// yang membuat scrollbar hilang. Kita hapus juga agar halaman bisa di-scroll kembali.

    console.log("Tidak ada modal yang sedang terbuka di layar.");
    return false; // Tidak ada aksi penutupan karena semua bersih
};

// ⚡ REFIX PARSER ENGINE: Memastikan parsing Regex bekerja 100% tanpa error tanda kurung atau simbol '\$'
window.eksekusiAksiDropdownMenu = function(actionString) {
    if (!actionString) return;
    try {
        // Pemisahan nama fungsi dan parameter internal yang valid secara sintaksis
        

		const match = actionString.match(/^(\w+)\((.*)\)$/);
        if (match) {
    const functionName = match[1]; 
    const rawArgs = match[2].trim(); 
    
    if (typeof window[functionName] === 'function') {
        if (rawArgs) {
            const cleanArgs = rawArgs.split(',').map(arg => {
                let trimmed = arg.trim();
                
                // 🔥 PERBAIKAN REGEX: Menghapus pembungkus petik (') atau (") di awal ATAU di akhir string secara akurat
                trimmed = trimmed.replace(/^['"]|['"]\$/g, '');
                
                if (trimmed !== '' && !isNaN(trimmed)) {
                    return Number(trimmed);
                }
                return trimmed;
            });
            
            window.tutupModalTerbuka();
            setTimeout(function() {
                window[functionName](...cleanArgs);
            }, 500);
            
        } else {
            window.tutupModalTerbuka(); 
            setTimeout(function() {
                window[functionName]();
            }, 500);
        }
    } else {
        console.error(`Fungsi ${functionName} tidak ditemukan di DOM Window.`);
    }
}

    } catch (err) {
        console.error("Gagal mengeksekusi menu dropdown:", err);
    }
};


function encodeJavaScriptURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

function initMainmenu() {
    const navContainer = document.getElementById("layanananggota");
    const navContainer2 = document.getElementById("kegiatananggota");
    const navContainer3 = document.getElementById("informasipenting");
    const navContainer4 = document.getElementById("organisasianggota");
    
    if (!navContainer) return;

    // Bersihkan spasi ganda di ujung URL endpoint secara otomatis
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

function handleMenuClick(e) {
    const item = e.target.closest('.dropdown-item');
        if (item) {
            e.preventDefault();
            const actionString = item.getAttribute('data-action'); 
            
            if (actionString) {
                try {
                    // Regex untuk memisahkan Nama Fungsi dan seluruh isi di dalam Kurung ()
                    const match = actionString.match(/^(\w+)\((.*)\)$/);
                    
                    if (match) {
                        const functionName = match[1]; // Mengambil nama fungsi
                        const rawArgs = match[2].trim(); // Mengambil isi parameter di dalam kurung
                        if (typeof window[functionName] === 'function') {
                            if (rawArgs) {
                                // Memisahkan parameter berdasarkan koma, lalu membersihkan spasi & tanda petik
                                const cleanArgs = rawArgs.split(',').map(arg => {
                                    let trimmed = arg.trim();
                                    // Hapus tanda petik tunggal (') atau ganda (") di awal dan akhir string
                                    trimmed = trimmed.replace(/^['"]|['"]$/g, '');
                                    
                                    // OPSIONAL: Mengubah string angka menjadi tipe data Number murni (seperti 2026 atau 6)
                                    if (trimmed !== '' && !isNaN(trimmed)) {
                                        return Number(trimmed);
                                    }
                                    return trimmed;
                                });
                                
                                // Eksekusi fungsi dengan menyebarkan (Spread) semua parameter yang telah dibersihkan
                                window[functionName](...cleanArgs);
                            } else {
                                // Jalankan fungsi tanpa parameter jika kurung kosong ()
                                window[functionName]();
                            }
                        } else {
                            console.error(`Fungsi ${functionName} tidak ditemukan di window.`);
                        }
                    }
                } catch (err) {
                    console.error("Gagal mengeksekusi aksi menu:", err);
                }
            }
        }
}

// 2. Pasangkan fungsi yang sama ke kedua kontainer dokumen menggunakan Event Listener
if (navContainer) {
    navContainer.addEventListener("click", handleMenuClick);
}

if (navContainer2) {
    navContainer2.addEventListener("click", handleMenuClick);
}

if (navContainer3) {
    navContainer3.addEventListener("click", handleMenuClick);
}

if (navContainer4) {
    navContainer4.addEventListener("click", handleMenuClick);
}
    // Event Delegation untuk menangani klik pada menu dropdown
    //navContainer.addEventListener("click", function(e) {
        
    //});

    // Menarik data menu langsung dari server PHP via AJAX Fetch
    fetch(`${cleanEndpoint}/proses.php?aksi=get_navmenu`, {
	method: "POST",
    mode: "cors",              
    credentials: "include",   
    body: payload
	})
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(res => {
        if (res.status === 'success' && res.data) {
            const daftarMenu = res.data;
            let navHtml = "";
            let navHtml2="";
            let navHtml3="";
            let navHtml4="";
            if (daftarMenu.length === 0) {
                navContainer.innerHTML = '<li><a class="dropdown-item text-muted small" href="#">Belum ada layanan</a></li>';
                return;
            }
            
            
            
            for (let i = 0; i < daftarMenu.length; i++) {
                const menu = daftarMenu[i];
               if(menu.kategori==='layanananggota') 
               {
                // Menyusun tag HTML dengan menyimpan string fungsi ke dalam 'data-action'
                navHtml += `
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 py-2" style="cursor:pointer" 
                           data-kategori="${menu.kategori}" data-action="${menu.menu_action}">
                            <i class="bi bi-chevron-right text-success" style="font-size: 0.75rem;"></i>
                            <span>${menu.nama}</span>
                        </a>
                    </li>
                `;
            } 
            if(menu.kategori==='kegiatananggota') 
               {
                // Menyusun tag HTML dengan menyimpan string fungsi ke dalam 'data-action'
                navHtml2 += `
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 py-2" style="cursor:pointer" 
                           data-kategori="${menu.kategori}" data-action="${menu.menu_action}">
                            <i class="bi bi-chevron-right text-success" style="font-size: 0.75rem;"></i>
                            <span>${menu.nama}</span>
                        </a>
                    </li>
                `;
            } 
            if(menu.kategori==='informasipenting') 
               {
                // Menyusun tag HTML dengan menyimpan string fungsi ke dalam 'data-action'
                navHtml3 += `
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 py-2" style="cursor:pointer" 
                           data-kategori="${menu.kategori}" data-action="${menu.menu_action}">
                            <i class="bi bi-chevron-right text-success" style="font-size: 0.75rem;"></i>
                            <span>${menu.nama}</span>
                        </a>
                    </li>
                `;
            }
             if(menu.kategori==='organisasianggota') 
               {
                // Menyusun tag HTML dengan menyimpan string fungsi ke dalam 'data-action'
                navHtml4 += `
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 py-2" style="cursor:pointer" 
                           data-kategori="${menu.kategori}" data-action="${menu.menu_action}">
                            <i class="bi bi-chevron-right text-success" style="font-size: 0.75rem;"></i>
                            <span>${menu.nama}</span>
                        </a>
                    </li>
                `;
            }
            }
            
            navContainer.innerHTML = navHtml;
            navContainer2.innerHTML = navHtml2;
            navContainer3.innerHTML = navHtml3;
            navContainer4.innerHTML = navHtml4;

        } else {
            console.error("Gagal mengambil struktur navmenu:", res.message);
        }
    })
    .catch(error => {
        console.error("Gagal melakukan sinkronisasi AJAX navmenu:", error);
        navContainer.innerHTML = '<li><a class="dropdown-item text-danger small" href="#"><i class="bi bi-exclamation-circle me-1"></i> Gagal memuat menu</a></li>';
    });
}
initMainmenu();



