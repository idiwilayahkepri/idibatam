import { APP_CONFIG } from './config.js';
const endpoint = `${APP_CONFIG.API_URL}`; 

// Pindahkan semua fungsi menu ke window agar bisa diakses secara global
function modal1(judulMenu,kontenHtml) {
	const titleElement = document.getElementById("generalModalTitle");
    const bodyElement = document.getElementById("generalModalBody");

    titleElement.innerHTML = `<i class="bi bi-shield-lock me-2"></i>${judulMenu}`;
    bodyElement.innerHTML = `<p class="text-center py-0 text-muted">${kontenHtml}</p>`;

    const myModal = new bootstrap.Modal(document.getElementById('generalFullscreenModal'));
    myModal.show()
}

function modal2(judulMenu,kontenHtml) {
            const sTitle = document.getElementById("secondModalTitle");
            const sBody = document.getElementById("secondModalBody");

            // 1. Suntik judul dan isi konten secara dinamis
            sTitle.innerHTML = `<i class="bi bi-window-stack me-2"></i>${judulMenu}`;
            sBody.innerHTML = kontenHtml;

            // 2. Panggil dan tampilkan Modal Kedua menggunakan instansiasi resmi Bootstrap 5
            const modalKedua = new bootstrap.Modal(document.getElementById('secondAdminModal'));
            modalKedua.show();

}

function modal3(judulMenu,kontentHtml)
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

window.menuPengurus = function() {
    const kontentHtml=`<div class="p-2">
                    <h6 class="fw-bold text-success mb-3"><i class="bi bi-calendar3 me-1"></i>Pilih Periode Kepengurusan Aktif</h6>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered align-middle small mb-0">
                            <thead class="table-dark">
                                <tr class="text-center">
                                    <th width="10%">No</th>
                                    <th>Periode Kepengurusan</th>
                                    <th width="25%">Aksi Modul</th>
                                </tr>
                            </thead>
                            <tbody id="periodeTableBody">
                                <tr>
                                    <td colspan="3" class="text-center text-muted py-3">
                                        <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                                        Menghubungkan ke tabel MySQL pengurus...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>`;
modal2('Pengurus',kontentHtml);
const tBodyPeriode = document.getElementById("periodeTableBody");

            // 2. Fetch data list periode dari pengurus.php
            fetch(endpoint+'pengurus.php?aksi=list_periode')
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    const daftarPeriode = res.data;
                    let rowsHtml = "";

                    if (daftarPeriode.length === 0) {
                        rowsHtml = `<tr><td colspan="3" class="text-center text-muted py-3"><i class="bi bi-info-circle me-1"></i> Tidak ada data kepengurusan terdaftar di MySQL.</td></tr>`;
                    } else {
                        // Render baris periode dan pasangkan fungsi view secara interaktif
                        for (let i = 0; i < daftarPeriode.length; i++) {
                            const p = daftarPeriode[i];
                            rowsHtml += `
                                <tr>
                                    <td class="text-center fw-bold">${i + 1}</td>
                                    <td class="fw-semibold text-dark">Periode Bakti ${p.periode}</td>
                                    <td class="text-center">
                                        <button class="btn btn-sm btn-primary px-3 fw-bold" onclick="lihatDetailStaffCloud(${p.id})">
                                            <i class="bi bi-eye-fill me-1"></i> View Data
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }
                    }
                    tBodyPeriode.innerHTML = rowsHtml;
                } else {
                    tBodyPeriode.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-3">Gagal mengambil data: ${res.message}</td></tr>`;
                }
            })
            .catch(err => {
                console.error("Gagal load tabel periode:", err);
                tBodyPeriode.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-3"><i class="bi bi-wifi-off me-1"></i> Gagal terhubung ke server database.</td></tr>`;
            });
        
};

window.lihatDetailStaffCloud = function(a)
{
const kontentHtml=`<div class="d-flex flex-column align-items-center justify-content-center py-5" id="cloudLoadingState">
                    <div class="spinner-border text-primary mb-3" role="status"></div>
                    <p class="text-muted small mb-0">Melakukan sinkronisasi data ke Google Spreadsheet Cloud...</p>
                </div>
                <div id="cloudContentArea" class="d-none">
                    <div class="alert alert-success py-2 small mb-3">
                        <i class="bi bi-cloud-check-fill me-1"></i> Koneksi Stabil. Menampilkan data live dari Google Drive Periode: <b id="lblPeriodeAktif">-</b>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-striped table-bordered align-middle small font-monospace" style="font-size:0.8rem;">
                            <thead class="table-primary text-dark">
                                <tr class="text-center">
                                    <th width="5%">No</th>
                                    <th>Nama Lengkap</th>
                                    <th>Jabatan Struktural</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody id="cloudStaffTableBody"></tbody>
                        </table>
                    </div>
                </div>`;
modal3('Susunan Struktur Anggota Pengurus',kontentHtml);
const cLoader = document.getElementById("cloudLoadingState");
            const cContent = document.getElementById("cloudContentArea");
            const cTableBody = document.getElementById("cloudStaffTableBody");
            const cLabel = document.getElementById("lblPeriodeAktif");

            // Fetch detail data sheet pengurus ke backend membawa parameter ID baris terpilih
            fetch(endpoint+'pengurus.php?aksi=tarik_data_google&id_periode='+a)
            .then(res => res.json())
            .then(res => {
                if (cLoader) cLoader.remove();
                if (cContent) cContent.classList.remove("d-none");

                if (res.status === 'success') {
                    cLabel.innerText = res.periode;
                    const staffData = res.data;
                    let tableRows = "";

                    if (staffData.length === 0) {
                        tableRows = `<tr><td colspan="4" class="text-center text-muted py-3">Lembar baris baris data Google Spreadsheet kosong.</td></tr>`;
                    } else {
                        for (let i = 0; i < staffData.length; i++) {
                            const person = staffData[i];
                            tableRows += `
                                <tr>
                                    <td class="text-center fw-bold">${i + 1}</td>
                                    <td class="fw-semibold text-dark">${person.nama || '-'}</td>
                                    <td class="text-primary fw-medium">${person.jabatan || '-'}</td>
                                    <td>${person.tempat_kerja || person.tempatkerja || '-'}</td>
                                </tr>
                            `;
                        }
                    }
                    cTableBody.innerHTML = tableRows;
                } else {
                    cTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-3"><b>Gagal Tarik Cloud:</b> ${res.message}</td></tr>`;
                }
            })
            .catch(err => {
                console.error("Gagal integrasi cloud script:", err);
                if (cLoader) cLoader.remove();
                if (cContent) cContent.classList.remove("d-none");
                cTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-3"><i class="bi bi-wifi-off me-1"></i> Gagal menghubungi jembatan file pengurus.php</td></tr>`;
            });
                  
}

window.menuTemplate=function()
{
    const kontenHtmlHeadlineManager = `
        <div class="row g-4" id="headlineSortContainer">
            <!-- PANEL KIRI: DAFTAR JUDUL BERITA BERDASARKAN URUTAN (col-md-4) -->
            <div class="col-md-4 border-end">
			   <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold text-success mb-0">
                        <i class="bi bi-arrow-down-up me-1"></i> Urutan Headline
                    </h6>
                    <button class="btn btn-sm btn-success px-3 fw-bold rounded-3 shadow-sm" onclick="bukaFormTambahHeadlineBaru()">
                        <i class="bi bi-plus-circle me-1"></i> Add Headline
                    </button>
                </div>
                <div class="alert alert-info py-2 select-none" style="font-size: 0.75rem;">
                    <i class="bi bi-info-circle me-1"></i> Tarik dan lepaskan judul komponen ke atas/bawah untuk mengubah visual halaman depan website secara instan.
                </div>
                
                <!-- LIST URUTAN KUSTOM MENGGUNAKAN SORTABLEJS -->
                <div class="list-group shadow-sm rounded-3 select-none" id="dragDropSortableList">
                    <div class="text-center py-4 text-muted small">
                        <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                        Sinkronisasi tabel headline...
                    </div>
                </div>
            </div>

            <!-- PANEL KANAN: PREVIEW ISI DETAIL BERITA (col-md-8) -->
            <div class="col-md-8">
                <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-eye-fill me-1"></i> Pratinjau Detil Pengumuman</h6>
                <div class="p-4 bg-light rounded-4 border" id="headlinePreviewArea" style="min-height: 250px;">
                    <p class="text-muted small text-center my-5">Silakan pilih atau klik salah satu judul berita di panel kiri untuk melihat ringkasan deskripsi artikel.</p>
                </div>
            </div>
        </div>`;
        
    modal2('Template', kontenHtmlHeadlineManager);
    
    const sortListContainer = document.getElementById("dragDropSortableList");
    const previewArea = document.getElementById("headlinePreviewArea");

    // FETCH DAFTAR ANGGOTA HEADLINE BERDASARKAN ORDER URUTAN
    fetch(endpoint+'proses.php?aksi=get_headline_admin')
    .then(res => res.json())
    .then(res => {
        if(res.status === 'success') {
            const listBerita = res.data;
            let listItemsHtml = "";

            if(listBerita.length === 0) {
                sortListContainer.innerHTML = `<div class="p-3 text-muted text-center small">Belum ada berita tersimpan.</div>`;
                return;
            }

            // Simpan data ke cache global agar pratinjau judul berfungsi saat diklik
            window.globalListBeritaCache = listBerita;

            // Render daftar judul secara tradisional ke komponen list-group
            for(let i = 0; i < listBerita.length; i++) {
                const item = listBerita[i];
				const textStatus = item.aktif == 1 ? 'Aktif' : 'Nonaktif';
                const classStatus = item.aktif == 1 ? 'link-success fw-bold' : 'link-danger';
                const htmlIconSampah = (item.aktif == 0 && item.tetap == 0) 
        ? `<a href="#" class="link-danger ms-2" title="Hapus Berita" onclick="event.stopPropagation(); window.hapusHeadlineDirect(${item.id})">
                <i class="bi bi-trash3-fill" style="font-size: 0.75rem;"></i>
           </a>` 
        : ''; // Jika aktif, string kosong (Akan otomatis di-hide/tidak tampil)
    
                listItemsHtml += `
                    <div class="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3" 
                         data-id="${item.id}"  style="cursor: grab; transition: background-color 0.2s;">
                        <div class="pe-2">
                            <span class="badge bg-secondary mb-1" style="font-size:0.65rem;">Urutan: ${item.urutan}</span>
							<a href="#" class="${classStatus} text-decoration-none" style="font-size:0.65rem;" 
                       onclick="event.stopPropagation(); toggleKeaktifanHeadlineDirect(${item.id}, ${item.aktif})">
                        ${textStatus}
                    </a>
					${htmlIconSampah}
                            <div class="fw-semibold text-dark text-truncate" style="max-width: 300px;">${item.judul}</div>
                        </div>
                        <span class="text-muted fs-5"><i class="bi bi-grip-vertical"></i></span>
                    </div>
                `;
            }
            sortListContainer.innerHTML = listItemsHtml;

            // FIX: Menggunakan endpoint terpusat dan mengarahkan ke versi SortableJS modern yang stabil
            if (typeof Sortable === "undefined") {
                const scriptSortable = document.createElement("script");
                scriptSortable.src = "https://cdn.jsdelivr.net/npm/sortablejs@1.7.0/Sortable.js";
                scriptSortable.onload = () => inisialisasiSortableEngine(sortListContainer, endpoint);
                document.body.appendChild(scriptSortable);
            } else {
                inisialisasiSortableEngine(sortListContainer, endpoint);
            }

        } else {
            sortListContainer.innerHTML = `<div class="alert alert-danger p-2 small">${res.message}</div>`;
            setTimeout(() => {
 window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error("Gagal menarik data admin headline:", err);
        sortListContainer.innerHTML = `<div class="p-3 text-center text-danger small">Gagal terhubung ke database.</div>`;
    });
}

window.inisialisasiSortableEngine=function(element, endpointUrl) {
    if (!element || typeof Sortable === "undefined") return;

    Sortable.create(element, {
        animation: 150,
        ghostClass: 'bg-success-subtle', // Indikator warna hijau transparan saat kartu digeser
        onEnd: function (evt) {
            const items = element.querySelectorAll(".list-group-item");
            const susunanIdBaru = [];

            // Rekam urutan ID elemen baru hasil reposisi geser
            items.forEach((item, index) => {
                susunanIdBaru.push({
                    id: item.getAttribute("data-id"),
                    urutan_baru: index + 1
                });
            });

            const payloadSort = new FormData();
            payloadSort.append("string_json_urutan", JSON.stringify(susunanIdBaru));

            // Kirim mutasi data indeks ke server MySQL via proses.php
            fetch(endpointUrl + 'proses.php?aksi=update_urutan_headline', {
                method: "POST",
                body: payloadSort
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update visual nomor urutan lencana secara instan
                    items.forEach((item, index) => {
                        const badge = item.querySelector(".badge");
                        if(badge) badge.innerText = `Urutan: ${index + 1}`;
                    });
                    
                    // Trigger refresh otomatis halaman website utama di background jika fungsi tersedia
                    if (typeof window.muatDataHeadlineMasonry === "function") {
                        window.muatDataHeadlineMasonry();
                    }
                } else {
                    alert("Gagal menyimpan posisi: " + data.message);
                    setTimeout(() => {
window.location.reload();
}, 2000);
                }
            })
            .catch(err => console.error("Gagal sinkronisasi urutan ke MySQL:", err));
        }
    });
}

window.toggleKeaktifanHeadlineDirect=function(idBerita, statusSekarang) {
    // Balikkan nilai status: jika 1 jadi 0, jika 0 jadi 1
    const statusBaru = statusSekarang == 1 ? 0 : 1;
    
    const payloadActive = new FormData();
    payloadActive.append("id_berita", idBerita);
    payloadActive.append("status_baru", statusBaru);

    fetch(endpoint + 'proses.php?aksi=update_status_headline', {
        method: "POST",
        body: payloadActive
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            // Segarkan data modal template internal dan website utama di background secara real-time
            if (typeof menuTemplate === "function") menuTemplate();
            if (typeof window.muatDataHeadlineMasonry === "function") window.muatDataHeadlineMasonry();
        } else {
            alert("Gagal mengubah status: " + data.message);
            setTimeout(() => {
 window.location.reload();
}, 2000);
        }
    })
    .catch(err => console.error("Gagal sinkronisasi status ke server:", err));
};

window.bukaFormTambahHeadlineBaru=function()
{
    const htmlFormTambah = `
	    <div class="row g-3">
		<div class="col-md-6">
        <form id="formInsertHeadlineMySQL" class="p-1">
            <div class="row g-3">
                <div class="col-md-8">
                    <div class="mb-3">
                        <label class="form-label fw-semibold text-secondary small">Judul Artikel Pengumuman</label>
                        <input type="text" class="form-control form-control-sm" id="addHJudul" placeholder="Contoh: Jadwal Rapat Pleno Rutin" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label fw-semibold text-secondary small">Kategori Berita</label>
                        <select class="form-select form-select-sm" id="addHKategori" required>
                            <option value="Informasi">Informasi</option>
                            <option value="Youtube">Youtube</option>
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Sosial Media">Sosial Media</option>
                            <option value="Podcast">Podcast</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold text-secondary small">Tanggal Terbit Teks (Label)</label>
                        <input type="text" class="form-control form-control-sm" id="addHTanggal" placeholder="Contsejarah: 28 Feb 2026" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold text-secondary small">Nilai Angka Urutan Tampil</label>
                        <input type="number" class="form-control form-control-sm" id="addHUrutan" value="0" min="0" required>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Isi Ringkasan Pengumuman (Mendukung Enter Line Break)</label>
                <textarea class="form-control form-control-sm" id="addHIsi" rows="4" placeholder="Ketik rincian berita di sini..." required></textarea>
            </div>
                    <!-- BOKS BARU DI BAWAH FORM: TEMPAT COPY MANAL SOURCE TEMPLATE -->
        <div class="mt-4 pt-3 border-top">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold text-dark mb-0"><i class="bi bi-clipboard-plus me-1 text-primary"></i> Source Code Template (Salin Manual)</h6>
				<button type="button" class="btn btn-xs btn-outline-primary px-2 py-1 fw-bold rounded-2" style="font-size:0.7rem;" onclick="insertTemplateToTextareaDirect()">
                    <i class="bi bi-box-arrow-in-up me-1"></i> Insert to Textarea
                </button>
            </div>
            <div class="bg-dark text-light p-3 rounded-3 font-monospace position-relative" style="font-size: 0.75rem; max-height: 280px; overflow-y: auto;">
                <pre class="mb-0" style="white-space: pre-wrap; word-wrap: break-word;"><code id="copyTemplateCodeArea">&lt;div class="masonry-item"&gt;
    &lt;div class="card card-branch border-0 shadow-sm"&gt;
        &lt;div class="card-body p-4"&gt;
            &lt;div class="d-flex justify-content-between align-items-center mb-3"&gt;
                &lt;span class="badge &#36;{badgeClass} text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;"&gt;&#36;{info.kategori}&lt;/span&gt;
                &lt;small class="text-muted" style="font-size: 0.8rem;"&gt;&lt;i class="bi bi-clock me-1"&gt;&lt;/i&gt;&#36;{info.tanggal}&lt;/small&gt;
            &lt;/div&gt;
            &lt;h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;"&gt;&#36;{info.judul}&lt;/h5&gt;
            &lt;p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;"&gt;&#36;{info.isi}&lt;/p&gt;
            &lt;a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center"&gt;
                Selengkapnya &lt;i class="bi bi-arrow-right ms-1"&gt;&lt;/i&gt;
            </a>
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;</code>
</pre>
            </div>
        </div>
            <div class="mb-4">
                <label class="form-label fw-semibold text-secondary small">Struktur Kode Kartu HTML (Template Source)</label>
                <textarea class="form-control form-control-sm font-monospace text-muted" id="addHTemplate" rows="4" style="font-size:0.75rem;" required></textarea>
            </div>

            <div class="text-end pt-2 border-top">
                <button type="submit" class="btn btn-sm btn-success px-4 fw-bold"><i class="bi bi-save2 me-1"></i> Simpan Ke MySQL</button>
				<button type="button" class="btn btn-sm btn-primary px-4 fw-bold" onclick="triggerManualPreviewWithEffect()"><i class="bi bi-eye me-1"></i> Preview</button>

            </div>
        </form>
		</div>
		<div class="col-md-6">
		<div>
                    <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-primary me-1"></i> Live Card Preview</h6>
                    <!-- Kontener penyuntik kartu masonry live preview -->
                    <div id="liveHeadlineCardPreviewArea" class="py-2">
                        <!-- Kartu hasil ketikan form akan dirender di sini -->
                    </div>
                </div>
		</div>
		</div>
    `;
modal3('Add New Headline Content', htmlFormTambah);
// Daftarkan SUBMIT FORM INSERT
    const formInsert = document.getElementById("formInsertHeadlineMySQL");
    formInsert.addEventListener("submit", function(e) {
        e.preventDefault();

        const payloadInsert = new FormData();
        payloadInsert.append("judul", document.getElementById("addHJudul").value.trim());
        payloadInsert.append("kategori", document.getElementById("addHKategori").value);
        payloadInsert.append("tanggal", document.getElementById("addHTanggal").value.trim());
        payloadInsert.append("urutan", document.getElementById("addHUrutan").value);
        payloadInsert.append("isi", document.getElementById("addHIsi").value);
        payloadInsert.append("template", document.getElementById("addHTemplate").value);

        fetch(endpoint + 'proses.php?aksi=insert_headline', {
            method: "POST",
            body: payloadInsert
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.status === 'success') {
                document.getElementById('fsDialog').close(); // Tutup Modal Ketiga
                if(typeof menuTemplate === "function") menuTemplate(); // Refresh Modal Kedua
                if(typeof window.muatDataHeadlineMasonry === "function") window.muatDataHeadlineMasonry(); // Refresh Halaman Depan Website
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal menyimpan headline baru:", err));
    });
}

window.insertTemplateToTextareaDirect=function(){
        const codeArea = document.getElementById("copyTemplateCodeArea");
        const textareaTemplate = document.getElementById("addHTemplate");
        
        if (codeArea && textareaTemplate) {
            // Mengambil teks asli (.innerText) dari boks hitam dan menyuntikkannya ke textarea value
            textareaTemplate.value = codeArea.innerText;
            
            // Memberikan efek kilasan visual fokus agar admin tahu data telah masuk
            textareaTemplate.focus();
            textareaTemplate.classList.add("is-valid");
            setTimeout(() => {
                textareaTemplate.classList.remove("is-valid");
            }, 1000);
        }
    }
	
window.hapusHeadlineDirect=function(idBerita) {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini secara permanen dari database MySQL?")) {
        const payloadDelete = new FormData();
        payloadDelete.append("id_berita", idBerita);

        // Fetch mengirim request hapus data ke proses.php dengan rute baru hapus_headline
        fetch(endpoint + 'proses.php?aksi=hapus_headline', {
            method: "POST",
            body: payloadDelete
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Refresh modal template dan grid utama website di background secara instan
                if (typeof menuTemplate === "function") menuTemplate();
                if (typeof window.muatDataHeadlineMasonry === "function") window.muatDataHeadlineMasonry();
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal melakukan penghapusan data ke server:", err));
    }
};

window.triggerManualPreviewWithEffect=function() {
const previewBox = document.getElementById("liveHeadlineCardPreviewArea");
const textareaTemplate = document.getElementById("addHTemplate");
if (previewBox && textareaTemplate) {
	const judul = document.getElementById("addHJudul").value.trim() || "Judul Pengumuman Tampil di Sini...";
    const kategori = document.getElementById("addHKategori").value;
    const tanggal = document.getElementById("addHTanggal").value.trim() || "31 Agu 2026";
    const isi = document.getElementById("addHIsi").value.trim() || "Ringkasan deskripsi pengumuman berita utama Ikatan Dokter Indonesia Kota Batam akan ter-render otomatis.";
	
	let templateHtmlRaw = textareaTemplate.value;
    previewBox.innerHTML=templateHtmlRaw.replace(/\$/g, '');
	previewBox.innerHTML=previewBox.innerHTML.replace(/{info.tanggal}/g, tanggal);
	previewBox.innerHTML=previewBox.innerHTML.replace(/{info.judul}/g, judul);
	previewBox.innerHTML=previewBox.innerHTML.replace(/{info.isi}/g, isi);
	
	
}
}

window.menuSymposium=function()
{
window.location.href=endpoint+"admin-dashboard.html";
}

window.menuNews=function(kat)
{
const uckat=kat.toLowerCase();
const kontenHtmlInfoManager = `
        <div class="row g-4" id="informasiManagerContainer">
            <div class="col-md-8 border-end">
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="fw-bold text-success mb-0">
                            <i class="bi bi-newspaper me-1"></i> Daftar ${kat}
                        </h6>
                        <button class="btn btn-sm btn-success px-2 py-1 fw-bold rounded-3 shadow-sm" style="font-size:0.75rem;" onclick="window.bukaFormTambahInformasiBaru('${kat}')">
                            <i class="bi bi-plus-circle me-1"></i> Tambah ${kat}
                        </button>
                    </div>
                    
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchInfoInput" placeholder="Cari judul ${kat}..." oninput="window.liveSearchInformasiAdmin('${kat}')">
                    </div>
                </div>
                
                <div class="list-group shadow-sm rounded-3 overflow-auto" id="mysqlInformasiListGroup" style="max-height: 400px;">
                    <div class="text-center py-4 text-muted small">
                        <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                        Menghubungkan ke tabel informasi...
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-eye-fill me-1"></i> Pratinjau Detail ${kat}</h6>
                <div class="p-4 bg-white rounded-4 border shadow-sm" id="informasiDetailPreviewArea" style="min-height: 350px;">
                    <p class="text-muted small text-center my-5 py-5">Silakan pilih atau klik salah satu judul ${uckat} di panel kiri untuk melihat isi pengumuman lengkap.</p>
                </div>
            </div>
        </div>
    `;

    modal2(kat, kontenHtmlInfoManager);
const listGroupContainer = document.getElementById("mysqlInformasiListGroup");

    fetch(endpoint + 'proses.php?aksi=get_headline_admin')
    .then(res => res.json())
    .then(headlineRes => {
        let imageHeadlineTarget = "";
        if(kat==='Informasi')
		{
        if (headlineRes.status === 'success' && headlineRes.data) {

            const headline7 = headlineRes.data.find(h => h.id == 7);
            if (headline7 && headline7.img) {
                imageHeadlineTarget = headline7.img.trim().replace('https://lh3.googleusercontent.com/d/','');
            }
        }
        else
        {
        alert(headlineRes.message)
        window.location.reload();
        }
		}
		if(kat==='Baksos')
		{
        if (headlineRes.status === 'success' && headlineRes.data) {

            const headline7 = headlineRes.data.find(h => h.id == 3);
            if (headline7 && headline7.img) {
                imageHeadlineTarget = headline7.img.trim().replace('https://lh3.googleusercontent.com/d/','');
            }
        }
        else
        {
        alert(headlineRes.message)
        window.location.reload();
        }
		}
    return fetch(endpoint + 'proses.php?aksi=get_informasi_news&kategori='+kat)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const arrayInfo = res.data;
            let listGroupHtml = "";
            if (arrayInfo.length === 0) {
                listGroupContainer.innerHTML = `<div class="p-3 text-muted text-center small"><i class="bi bi-folder-x me-1"></i> Belum ada data ${uckat} terdaftar.</div>`;
                return;
            }

            window.globalInformasiNewsCache = arrayInfo;

            // Render list judul secara vertikal
            for (let i = 0; i < arrayInfo.length; i++) {
                const info = arrayInfo[i];
                
                // Konfigurasi lencana status tayang
				let classWarnaJudul = "text-dark";
				if (info.image && info.image.trim() !== "" && info.image.trim() === imageHeadlineTarget) {
                        classWarnaJudul = "text-danger fw-bold";
						bukaPratinjauDetailInformasi(info.id,kat)
                    }
                const statusBadge = info.status == 1 
        ? `<a href="#" class="badge bg-success-subtle text-success text-decoration-none fw-bold" style="font-size:0.6rem; cursor:pointer;" title="Klik untuk pindahkan berita ini ke Tabel Headline" onclick="event.stopPropagation(); pindahkanInfoKeHeadlineDirect(${info.id},'${kat}')"><i class="bi bi-box-arrow-up-right me-1"></i>Aktif</a>` 
        : `<a href="#" class="badge bg-danger-subtle text-danger text-decoration-none" style="font-size:0.6rem; cursor:pointer;">Draf</a>`;

					 const htmlIconSampah = info.status == 0 
        ? `<a href="#" class="link-danger ms-1" title="Hapus ${kat}" onclick="event.stopPropagation(); window.hapusInformasiDirect(${info.id},'${kat}')">
                <i class="bi bi-trash3-fill" style="font-size: 0.7rem;"></i>
           </a>` 
        : '';
                const htmlIconEdit = `
        <a href="#" class="link-primary ms-1" title="Edit ${kat}" onclick="event.stopPropagation(); window.bukaFormEditInformasiDirect(${info.id},'${kat}')">
            <i class="bi bi-pencil-square" style="font-size: 0.75rem;"></i>
        </a>
    `;
	const htmlIconLinkBaksos = (kat === 'Baksos')
        ? `<a href="${endpoint}admin-baksos.html" class="link-success ms-1" title="Buka Manajemen Tabel Baksos" onclick="event.stopPropagation();">
                <i class="bi bi-list-task" style="font-size: 0.75rem;"></i>
           </a>`
        : '';
                listGroupHtml += `
                    <div class="list-group-item list-group-item-action p-3 click-info-item" 
                         data-id="${info.id}" 
                         style="cursor: pointer; transition: all 0.2s;"
                         onclick="window.bukaPratinjauDetailInformasi(${info.id},'${kat}')">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted" style="font-size:0.65rem;"><i class="bi bi-clock me-1"></i>${info.waktu}</small>
                            ${statusBadge}
							${htmlIconEdit}
							${htmlIconLinkBaksos}
							${htmlIconSampah}
                        </div>
                        <div class="${classWarnaJudul} text-truncate small list-title-text"><b>${info.judul}</b></div>
                    </div>
                `;
            }
            listGroupContainer.innerHTML = listGroupHtml;

        } else {
            listGroupContainer.innerHTML = `<div class="alert alert-danger p-2 small">${res.message}</div>`;
        }
    })
	})
    .catch(err => {
        console.error("Gagal sinkronisasi data tabel informasi:", err);
        listGroupContainer.innerHTML = `<div class="p-3 text-center text-danger small"><i class="bi bi-wifi-off me-1"></i> Gagal terhubung ke database server.</div>`;
    });


}

window.bukaPratinjauDetailInformasi=function(idInfo,kat) {
const uckat=kat.toLowerCase();
const previewBox = document.getElementById("informasiDetailPreviewArea");

    document.querySelectorAll('.click-info-item').forEach(el => el.classList.remove('active', 'bg-light'));
    const activeItem = document.querySelector(`.click-info-item[data-id="${idInfo}"]`);
    if (activeItem) activeItem.classList.add('bg-light');
	if (window.globalInformasiNewsCache && previewBox) {
		const detailData = window.globalInformasiNewsCache.find(x => x.id == idInfo);
        if (detailData) {
			            
            const areaGambar = detailData.image 
                ? `<img src="https://lh3.googleusercontent.com/d/${detailData.image}" class="card-img-top" alt="...">` 
                : '';
			let badgeClass = "bg-secondary";
                if (detailData.kategori === "informasi") badgeClass = "bg-danger";
                if (detailData.kategori === "podcast") badgeClass = "bg-warning text-dark";
                if (detailData.kategori === "youtube") badgeClass = "bg-primary";
                if (detailData.kategori === "baksos") badgeClass = "bg-success";
        const kontenIsiFormat = detailData.isi || 'Tidak ada deskripsi teks.';
		previewBox.innerHTML = `
<div class="card card-branch border-0 shadow-sm">${areaGambar}<div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><span class="badge ${badgeClass}  text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">${detailData.kategori}</span><small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i> ${detailData.waktu}</small></div><h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;">${detailData.judul}</h5><p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;">${kontenIsiFormat}</p><a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center">Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a></div</div>
`;
			
		}
	}
};

window.bukaFormEditInformasiDirect=function(idInfo,kat) {
    if (!window.globalInformasiNewsCache) return;
    
    // Cari data informasi spesifik dari cache global berdasarkan ID yang diklik
    const dataTerpilih = window.globalInformasiNewsCache.find(x => x.id == idInfo);
    if (!dataTerpilih) {
        alert("Data "+kat+" gagal diisolasi dari memori!");
        return;
    }

    // Set variabel pembantu status terpilih untuk komponen select form
    const selectStatusHtml = dataTerpilih.status == 1 
        ? `<option value="1" selected>Aktif / Publikasikan</option><option value="0">0 / Simpan Sebagai Draf</option>`
        : `<option value="1">Aktif / Publikasikan</option><option value="0" selected>0 / Simpan Sebagai Draf</option>`;
    let formattedDateTime = "";
    if (dataTerpilih.waktu) {
        // Mengganti spasi antara tanggal dan jam menjadi huruf 'T' agar dibaca oleh type="datetime-local"
        formattedDateTime = dataTerpilih.waktu.substring(0, 16).replace(" ", "T");
    }
    const htmlFormEdit = `
         <div class="row g-4" id="editInformasiWrapperArea">
            
            <div class="col-md-8 border-end">
                <form id="formUpdateInformasiMySQL" class="p-1">
                    <input type="hidden" id="editIId" value="${dataTerpilih.id}">

                    <div class="row g-2">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Judul ${kat} / Berita</label>
                                <input type="text" class="form-control form-control-sm fw-bold" id="editIJudul" value="${dataTerpilih.judul}" required onkeyup="document.getElementById('xjudul').innerHTML=this.value" >
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Status Publikasi</label>
                                <select class="form-select form-select-sm" id="editIStatus" required onchange="liveTypingEditPreviewInfo(idInfo)">
                                    ${selectStatusHtml}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row g-2">
					    <div class="col-md-4">
                            <!-- INPUT BARU: Kolom Waktu / Tanggal Terbit Berita -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Waktu / Tanggal Terbit</label>
                                <input type="datetime-local" class="form-control form-control-sm font-monospace" id="editIWaktu" value="${formattedDateTime}" required onchange="document.getElementById('xwaktu').innerHTML=this.value.replace('T',' ')">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Kategori Konten</label>
                                <input type="text" class="form-control form-control-sm text-muted bg-light" id="editIKategori" value="${dataTerpilih.kategori}" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Google Drive Image Cloud ID</label>
                                <input type="text" class="form-control form-control-sm font-monospace" id="editIImage" value="${dataTerpilih.image || ''}" placeholder="Kosongkan jika tidak ada foto" onchange="document.getElementById('ximage').src='https://lh3.googleusercontent.com/d/'+this.value">
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold text-secondary small">Isi Konten ${kat} Lengkap</label>
                        <textarea class="form-control form-control-sm" id="editIIsi" rows="8" required onkeyup="document.getElementById('xisi').innerHTML=this.value">${dataTerpilih.isi || ''}</textarea>
                    </div>

                    <!-- AREA ACTION BUTTONS -->
                    <div class="text-end pt-2 border-top d-flex justify-content-end gap-2">
                        <button type="submit" class="btn btn-sm btn-primary px-4 fw-bold"><i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Perubahan Data</button>
                    </div>
                </form>
            </div>

            <div class="col-md-4 bg-light rounded-3 p-3" style="min-height: 400px;">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-success me-1"></i> Live Card Preview</h6>
                
                <!-- Kontener suntik visual masonry card preview -->
                <div id="liveEditInfoCardPreviewArea" style="transition: all 0.3s ease;">
                    <!-- Visual render ketikan otomatis masuk di sini -->
                </div>
            </div>
        </div>

    `;

    modal3('Edit '+kat+' / News Content', htmlFormEdit);
    liveTypingEditPreviewInfo(idInfo,kat);
   
    const formUpdate = document.getElementById("formUpdateInformasiMySQL");
    formUpdate.addEventListener("submit", function(e) {
        e.preventDefault();
        const uckat=kat.toLowerCase();
        const payloadUpdate = new FormData();
        payloadUpdate.append("id", document.getElementById("editIId").value);
        payloadUpdate.append("judul", document.getElementById("editIJudul").value.trim());
        payloadUpdate.append("status", document.getElementById("editIStatus").value);
        payloadUpdate.append("image", document.getElementById("editIImage").value.trim());
        payloadUpdate.append("isi", document.getElementById("editIIsi").value);

        fetch(endpoint + 'proses.php?aksi=update_informasi_news', {
            method: "POST",
            body: payloadUpdate
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                document.getElementById('fsDialog').close(); // Tutup Modal Ketiga
                if (typeof menuNews === "function") menuNews(kat); // Refresh Modal Kedua secara otomatis
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal mengirim pembaruan data "+uckat+":", err));
    });
};

window.liveSearchInformasiAdmin=function(kat) {
    const inputKataKunci = document.getElementById("searchInfoInput").value.toLowerCase().trim();
    const itemsList = document.querySelectorAll(".click-info-item");

    itemsList.forEach(item => {
        const judulTeks = item.querySelector(".list-title-text").innerText.toLowerCase();
        
        if (judulTeks.includes(inputKataKunci)) {
            item.style.setProperty("display", "block", "important");
        } else {
            item.style.setProperty("display", "none", "important");
        }
    });
};

window.hapusInformasiDirect=function(idInfo,kat) {
    if (confirm("Apakah Anda yakin ingin menghapus data berita/"+uckat+" ini secara permanen?")) {
        const payloadDelete = new FormData();
        payloadDelete.append("id", idInfo);

        fetch(endpoint + 'proses.php?aksi=hapus_informasi_news', {
            method: "POST",
            body: payloadDelete
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                if (typeof menuNews === "function") menuNews();
            }
            else
            {
                window.location.reload();
            }
        });
    }
};

window.liveTypingEditPreviewInfo=function(idInfo,kat) {
	const uckat=kat.toLowerCase();
    if (!window.globalInformasiNewsCache) return;
    const dataTerpilih = window.globalInformasiNewsCache.find(x => x.id == idInfo);
    if (!dataTerpilih) {
        alert("Data "+uckat+" gagal diisolasi dari memori!");
        return;
    }
const pBox = document.getElementById("liveEditInfoCardPreviewArea");
const judul = document.getElementById("editIJudul").value.trim() || "Judul Berita...";
const image = document.getElementById("editIImage").value.trim();
const isi = document.getElementById("editIIsi").value.trim() || "Ringkasan teks konten "+uckat+" rapi...";
const kategori = dataTerpilih.kategori || uckat;

    const rawWaktu = document.getElementById("editIWaktu").value; // Hasil: 2026-08-31T22:15
    const waktu    = rawWaktu ? rawWaktu.replace("T", " ") : "Live Preview"; // Hasil: 2026-08-31 22:15
const areaGambar = image 
                ? `<img src="https://lh3.googleusercontent.com/d/${image}" class="card-img-top" alt="..." id="ximage">` 
                : '';
			let badgeClass = "bg-secondary";
                if (kategori === "informasi") badgeClass = "bg-danger";
                if (kategori === "podcast") badgeClass = "bg-warning text-dark";
                if (kategori === "youtube") badgeClass = "bg-primary";
                if (kategori === "baksos") badgeClass = "bg-success";
        const kontenIsiFormat = isi || 'Tidak ada deskripsi teks.';
        if (!pBox) return;
pBox.innerHTML = `<div class="card card-branch border-0 shadow-sm">${areaGambar}<div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><span class="badge ${badgeClass}  text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">${kategori}</span><small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i> <label id="xwaktu">${waktu}</label></small></div><h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;" id="xjudul">${judul}</h5><p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;" id="xisi">${kontenIsiFormat}</p><a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center">Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a></div</div>
        `;
    };

window.bukaFormTambahInformasiBaru=function(kat) {
const uckat=kat.toLowerCase();
    const skrg = new Date();
    skrg.setMinutes(skrg.getMinutes() - skrg.getTimezoneOffset());
    const waktuBawaan = skrg.toISOString().slice(0, 16);

    const htmlFormTambah = `
        <div class="row g-4" id="tambahInformasiWrapperArea">
            <!-- SISI KIRI: FORMULIR INPUT DATA (col-md-8) -->
            <div class="col-md-8 border-end">
                <form id="formInsertInformasiMySQL" class="p-1">
                    <div class="row g-2">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Judul ${kat} / Berita Baru</label>
                                <input type="text" class="form-control form-control-sm fw-bold" id="addIJudul" placeholder="Contoh: Pengumuman Jadwal Vaksinasi" required onkeyup="document.getElementById('yjudul').innerHTML=this.value">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Status Awal</label>
                                <select class="form-select form-select-sm" id="addIStatus" required onchange="window.liveTypingAddPreviewInfo()">
                                    <option value="0" selected>0 / Simpan Sebagai Draf</option>
                                    <option value="1">Aktif / Publikasikan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Waktu / Tanggal Terbit</label>
                                <input type="datetime-local" class="form-control form-control-sm font-monospace" id="addIWaktu" value="${waktuBawaan}" required onchange="document.getElementById('ywaktu').innerHTML=this.value.replace('T',' ')">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Kategori Konten</label>
                                <input type="text" class="form-control form-control-sm text-muted bg-light" id="addIKategori" value="${uckat}" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Google Drive Image Cloud ID</label>
                                <input type="text" class="form-control form-control-sm font-monospace" id="addIImage" placeholder="Contoh: 1hPgpkXab..." onchange="document.getElementById('yimage').src='https://lh3.googleusercontent.com/d/'+this.value">
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold text-secondary small">Isi Konten ${kat} Lengkap</label>
                        <textarea class="form-control form-control-sm" id="addIIsi" rows="8" placeholder="Ketik draf isi pengumuman lengkap di sini..." required onkeyup="document.getElementById('yisi').innerHTML=this.value"></textarea>
                    </div>

                    <div class="text-end pt-2 border-top">
                        <button type="submit" class="btn btn-sm btn-success px-4 fw-bold"><i class="bi bi-save2 me-1"></i> Simpan Data Baru</button>
                    </div>
                </form>
            </div>

            <!-- SISI KANAN: AUTO LIVE PRATINJAU KARTU (col-md-4) -->
            <div class="col-md-4 bg-light rounded-3 p-3" style="min-height: 400px;">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-success me-1"></i> Live Card Preview</h6>
                <div id="liveAddInfoCardPreviewArea">
                <div class="card card-branch border-0 shadow-sm"><img src="https://lh3.googleusercontent.com/d/1E48PphcJgDvyNfBf_5ROF6qLs81P_GkR" class="card-img-top" alt="..." id="yimage"><div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><span class="badge bg-danger  text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">\${kat}</span><small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i> <label id="ywaktu">2026-08-25 08:57</label></small></div><h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;" id="yjudul">${kat} Terbaru Silahkan dibuat</h5><p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;" id="yisi">Isi dengan sekelumit Informasi tentang hal yang akan di informasikan</p><a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center">Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a></div</div>
                </div>
            </div>
        </div>
    `;

    modal3('Add New '+kat, htmlFormTambah);
const formInsert = document.getElementById("formInsertInformasiMySQL");
    formInsert.addEventListener("submit", function(e) {
        e.preventDefault();
const uckat=kat.toLowerCase();
        let waktuValueInput = document.getElementById("addIWaktu").value;
        waktuValueInput = waktuValueInput.replace("T", " ") + ":00";

        const payloadInsert = new FormData();
        payloadInsert.append("judul", document.getElementById("addIJudul").value.trim());
        payloadInsert.append("waktu", waktuValueInput); 
        payloadInsert.append("status", document.getElementById("addIStatus").value);
        payloadInsert.append("image", document.getElementById("addIImage").value.trim());
        payloadInsert.append("isi", document.getElementById("addIIsi").value);
        payloadInsert.append("kategori", document.getElementById("addIKategori").value);

        fetch(endpoint + 'proses.php?aksi=insert_informasi_news', {
            method: "POST",
            body: payloadInsert
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                document.getElementById('fsDialog').close(); 
                if (typeof menuNews === "function") menuNews(kat); 
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal menyimpan data baru:", err));
    });
    
};

window.pindahkanInfoKeHeadlineDirect=function(idInfo,kat) {
if (confirm("Apakah Anda yakin ingin MENYALIN data "+kat+" ini ke Komponen Headline Halaman Depan?")) {
        const payloadMove = new FormData();
        payloadMove.append("id_informasi", idInfo); // FIX: Menggunakan variabel payloadMove yang benar

        fetch(endpoint + 'proses.php?aksi=pindah_info_ke_headline', {
            method: "POST",
            body: payloadMove
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
				alert(data.message);
				menuNews(kat);
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal memindahkan data antar tabel MySQL:", err));
    }
};

window.menuPodcast=function(kat)
{
const uckat=kat.toLowerCase();
const kontenHtmlPodcastManager = `
        <div class="row g-4" id="podcastManagerContainer">
            <!-- PANEL KIRI: FILTER, LIVE SEARCH & DAFTAR JUDUL PODCAST (col-md-4) -->
            <div class="col-md-8 border-end">
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="fw-bold text-success mb-0">
                            <i class="bi bi-mic me-1"></i> Daftar ${kat} IDI
                        </h6>
<button class="btn btn-sm btn-success px-2 py-1 fw-bold rounded-3 shadow-sm" style="font-size:0.75rem;" onclick="bukaFormTambahPodcastBaru('${kat}')">
    <i class="bi bi-plus-circle me-1"></i> Tambah ${kat}
</button>
                    </div>
                    
                    <!-- Komponen Input Pencarian Real-Time -->
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchPodcastInput" placeholder="Cari judul ${kat}..." oninput="window.liveSearchPodcastAdmin('${kat}')">
                    </div>
                </div>
                
                <!-- LIST CONTAINER UNTUK MENAMPUNG KARTU JUDUL DARI MYSQL -->
                <div class="list-group shadow-sm rounded-3 overflow-auto" id="mysqlPodcastListGroup" style="max-height: 400px;">
                    <div class="text-center py-4 text-muted small">
                        <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                        Menghubungkan ke tabel sosial media...
                    </div>
                </div>
            </div>

            <!-- PANEL KANAN: PREVIEW DETAIL ISI KONTEN VIDEO (col-md-8) -->
            <div class="col-md-4">
                <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-eye-fill me-1"></i> Pratinjau Detail ${kat}</h6>
                <div class="p-4 bg-white rounded-4 border shadow-sm" id="podcastDetailPreviewArea">
                    <p class="text-muted small text-center my-5 py-5">Silakan pilih atau klik salah satu judul ${uckat} di panel kiri untuk melihat isi detail deskripsi dan tautan video.</p>
                </div>
            </div>
        </div>
    `;

    // 2. Luncurkan Antarmuka ke dalam Modal Kedua
    modal2(kat+'Control Hub', kontenHtmlPodcastManager);
const listGroupContainer = document.getElementById("mysqlPodcastListGroup");
    
    // 3. FETCH DATA LIVE DARI MYSQL VIA PHP PROSES
	fetch(endpoint + 'proses.php?aksi=get_headline_admin')
    .then(res => res.json())
    .then(headlineRes => {
        let imageHeadlineTarget = "";
        
        if (headlineRes.status === 'success' && headlineRes.data) {
			if(kat==='Podcast')
			{
            // Temukan record headline khusus yang memiliki id = 6
            const headline6 = headlineRes.data.find(h => h.id == 6);
			
			
            if (headline6 && headline6.img) {
                imageHeadlineTarget = headline6.img.trim().replace('https://img.youtube.com/vi/','').replace('/maxresdefault.jpg','');
            }
			}
			
			if(kat==='Youtube')
			{
            // Temukan record headline khusus yang memiliki id = 5
            const headline6 = headlineRes.data.find(h => h.id == 5);
			
			
            if (headline6 && headline6.img) {
                imageHeadlineTarget = headline6.img.trim().replace('https://img.youtube.com/vi/','').replace('/maxresdefault.jpg','');
            }
			}
        }
        else
        {
            alert(headlineRes.message);
            window.location.reload();
        }
		
    return fetch(endpoint + 'proses.php?aksi=get_podcast_admin&kategori='+kat)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const arrayPodcast = res.data;
            let listGroupHtml = "";

            if (arrayPodcast.length === 0) {
                listGroupContainer.innerHTML = `<div class="p-3 text-muted text-center small"><i class="bi bi-folder-x me-1"></i> Belum ada data ${uckat} terdaftar.</div>`;
                return;
            }

            // Simpan data ke dalam cache window global agar fitur pencarian dan preview instan bekerja
            window.globalPodcastCache = arrayPodcast;

            // Render list judul secara vertikal
            for (let i = 0; i < arrayPodcast.length; i++) {
                const pod = arrayPodcast[i];
            let classWarnaJudul = "text-dark";
			
		    if (pod.image && pod.image.trim() !== "" && pod.image.trim() === imageHeadlineTarget) {
                        classWarnaJudul = "text-danger";
						bukaPratinjauDetailPodcast(pod.id,kat)
                    }
                // Konfigurasi lencana status tayang
const statusBadge = pod.status == 1 
        ? `<a href="#" class="badge bg-success-subtle text-success text-decoration-none fw-bold" style="font-size:0.6rem; cursor:pointer;" title="Klik untuk menayangkan foto ini ke Headline Utama" onclick="event.stopPropagation(); pindahkanPodcastKeHeadlineDirect(${pod.id},'${kat}')"><i class="bi bi-box-arrow-up-right me-1"></i>Aktif</a>` 
        : `<a href="#" class="badge bg-danger-subtle text-danger text-decoration-none" style="font-size:0.6rem;">Draf</a>`;



                // Ikon sampah hanya muncul jika status draf/nonaktif (status == 0)
                const htmlIconSampah = pod.status == 0 
    ? `<a href="#" class="link-danger ms-1" title="Hapus ${kat}" onclick="event.stopPropagation(); hapusPodcastDirect(${pod.id},'${kat}')">
            <i class="bi bi-trash3-fill" style="font-size: 0.7rem;"></i>
       </a>` 
    : '';

                // Ikon Pensil Edit selalu muncul di sebelah kanan badge status tayang
                const htmlIconEdit = `
    <a href="#" class="link-primary ms-1" title="Edit ${kat}" onclick="event.stopPropagation(); bukaFormEditPodcastDirect(${pod.id},'${kat}')">
        <i class="bi bi-pencil-square" style="font-size: 0.75rem;"></i>
    </a>
`;

                listGroupHtml += `
                    <div class="list-group-item list-group-item-action p-3 click-podcast-item" 
                         data-id="${pod.id}" 
                         style="cursor: pointer; transition: all 0.2s;"
                         onclick="bukaPratinjauDetailPodcast(${pod.id},'${kat}')">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted" style="font-size:0.65rem;"><i class="bi bi-clock me-1"></i>${pod.waktu}</small>
                            <div class="d-flex align-items-center gap-1">
                                ${statusBadge}
                                ${htmlIconEdit}
                                ${htmlIconSampah}
                            </div>
                        </div>
                        <div class="${classWarnaJudul}  fw-bold text-truncate small list-${uckat}-title">${pod.judul}</div>
                    </div>
                `;
            }
            listGroupContainer.innerHTML = listGroupHtml;

        } else {
            listGroupContainer.innerHTML = `<div class="alert alert-danger p-2 small">${res.message}</div>`;
        }
    })
})
    .catch(err => {
        console.error("Gagal sinkronisasi data tabel sosial_media:", err);
        listGroupContainer.innerHTML = `<div class="p-3 text-center text-danger small"><i class="bi bi-wifi-off me-1"></i> Gagal terhubung ke database server.</div>`;
    });


}

window.bukaPratinjauDetailPodcast=function(idPod,kat) {
const uckat=kat.toLowerCase();
const previewBox = document.getElementById("podcastDetailPreviewArea");

    document.querySelectorAll('.click-'+uckat+'-item').forEach(el => el.classList.remove('bg-light'));
    const activeItem = document.querySelector(`.click-${uckat}-item[data-id="${idPod}"]`);
    if (activeItem) activeItem.classList.add('bg-light');

    if (window.globalPodcastCache && previewBox) {
        const detailData = window.globalPodcastCache.find(x => x.id == idPod);
        if (detailData) {
			            // Player Video Mini responsif dari Youtube berdasarkan kode unik kolom image
            const areaVideoPlayer = detailData.image 
                ? `<img src="https://img.youtube.com/vi/${detailData.image}/maxresdefault.jpg" class="card-img-top" alt="...">` 
                : '';

			let badgeClass = "bg-secondary";
                if (detailData.kategori === "info") badgeClass = "bg-danger";
                if (detailData.kategori === "podcast") badgeClass = "bg-warning text-dark";
                if (detailData.kategori === "youtube") badgeClass = "bg-primary";
                if (detailData.kategori === "sosial Media") badgeClass = "bg-success";
	
        const kontenIsiFormat = detailData.isi || 'Tidak ada deskripsi teks.';
		previewBox.innerHTML = `
<div class="card card-branch border-0 shadow-sm">${areaVideoPlayer}<div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><span class="badge ${badgeClass}  text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">${detailData.kategori}</span><small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i> ${detailData.waktu}</small></div><h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;">${detailData.judul}</h5><p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;">${kontenIsiFormat}</p><a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center">Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a></div</div>
`;
			
		}
	}
};

window.liveSearchPodcastAdmin=function(kat) {
	const uckat=kat.toLowerCase();
    const inputKataKunci = document.getElementById("search"+kat+"Input").value.toLowerCase().trim();
    const itemsList = document.querySelectorAll(".click-"+uckat+"-item");

    itemsList.forEach(item => {
        const judulTeks = item.querySelector(".list-"+uckat+"-title").innerText.toLowerCase();
        
        // Sembunyikan atau munculkan baris berdasarkan kecocokan kata kunci
        if (judulTeks.includes(inputKataKunci)) {
            item.style.setProperty("display", "block", "important");
        } else {
            item.style.setProperty("display", "none", "important");
        }
    });
};

window.bukaFormEditPodcastDirect=function(idPod,kat) {
    if (!window.globalPodcastCache) return;
    
    const dataTerpilih = window.globalPodcastCache.find(x => x.id == idPod);
    if (!dataTerpilih) {
        alert("Data "+kat+" gagal diisolasi dari memori!");
        return;
    }

    const selectStatusHtml = dataTerpilih.status == 1 
        ? `<option value="1" selected>Aktif / Publikasikan</option><option value="0">0 / Simpan Sebagai Draf</option>`
        : `<option value="1">Aktif / Publikasikan</option><option value="0" selected>0 / Simpan Sebagai Draf</option>`;

    // Normalisasi format datetime value dari MySQL (YYYY-MM-DD HH:MM:SS) menjadi (YYYY-MM-DDTHH:MM)
    let formattedDateTime = "";
    if (dataTerpilih.waktu) {
        formattedDateTime = dataTerpilih.waktu.substring(0, 16).replace(" ", "T");
    }

    // LAYOUT SIMETRIS: col-md-8 Form Input & col-md-4 Live Media Preview
    const htmlFormEdit = `
        <div class="row g-4" id="editPodcastWrapperArea">
            <!-- SISI KIRI: FORMULIR INPUT DATA EDIT (col-md-8) -->
            <div class="col-md-8 border-end">
                <form id="formUpdatePodcastMySQL" class="p-1">
                    <input type="hidden" id="editPId" value="${dataTerpilih.id}">

                    <div class="row g-2">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Judul Konten ${kat}</label>
                                <input type="text" class="form-control form-control-sm fw-bold" id="editPJudul" value="${dataTerpilih.judul}" required onkeyup="document.getElementById('zjudul').innerHTML=this.value">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Status Publikasi</label>
                                <select class="form-select form-select-sm" id="editPStatus" required>
                                    ${selectStatusHtml}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Waktu / Tanggal Terbit</label>
                                <input type="datetime-local" class="form-control form-control-sm font-monospace" id="editPWaktu" value="${formattedDateTime}" required onchange="document.getElementById('zwaktu').innerHTML=this.value.replace('T',' ')">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Kategori Konten</label>
                                <input type="text" class="form-control form-control-sm text-muted bg-light" id="editPKategori" value="${dataTerpilih.kategori}" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Youtube Video Code (11 Karakter)</label>
                                <input type="text" class="form-control form-control-sm font-monospace fw-bold text-primary" id="editPImage" value="${dataTerpilih.image || ''}" placeholder="Contoh: Ojv8c9sQtYc" required onchange="document.getElementById('zimage').src='https://img.youtube.com/vi/'+this.value+'/maxresdefault.jpg'">
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold text-secondary small">Isi Deskripsi Sinopsis ${kat}</label>
                        <textarea class="form-control form-control-sm" id="editPIsi" rows="8" required onkeyup="document.getElementById('zisi').innerHTML=this.value">${dataTerpilih.isi || ''}</textarea>
                    </div>

                    <div class="text-end pt-2 border-top">
                        <button type="submit" class="btn btn-sm btn-primary px-4 fw-bold"><i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Perubahan ${kat}</button>
                    </div>
                </form>
            </div>

            <!-- SISI KANAN: LIVE PRATINJAU KARTU DENGAN EMBED VIDEO PLAYER (col-md-4) -->
            <div class="col-md-4 bg-light rounded-3 p-3" style="min-height: 400px;">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-success me-1"></i> Live ${kat} Preview</h6>
                <div id="liveEditPodcastCardPreviewArea">
                    <!-- Visual player dan teks sinopsis otomatis ngerender di sini secara real-time -->
                </div>
            </div>
        </div>
    `;

    modal3('Edit '+kat+' Content', htmlFormEdit);
	liveTypingEditPreviewPodcast(idPod,kat);

    const formUpdate = document.getElementById("formUpdatePodcastMySQL");
    
    formUpdate.addEventListener("submit", function(e) {
        e.preventDefault();
        const uckat=kat.toLowerCase();
        // Normalisasi komponen datetimepicker agar sesuai standard TIMESTAMP (YYYY-MM-DD HH:MM:SS)
        let waktuValueInput = document.getElementById("editPWaktu").value;
        waktuValueInput = waktuValueInput.replace("T", " ") + ":00";

        const payloadUpdate = new FormData();
        payloadUpdate.append("id", document.getElementById("editPId").value);
        payloadUpdate.append("judul", document.getElementById("editPJudul").value.trim());
        payloadUpdate.append("waktu", waktuValueInput); 
        payloadUpdate.append("status", document.getElementById("editPStatus").value);
        payloadUpdate.append("image", document.getElementById("editPImage").value.trim()); // Menyimpan Youtube Video Code
        payloadUpdate.append("isi", document.getElementById("editPIsi").value);

        // Eksekusi AJAX Fetch POST
        fetch(endpoint + 'proses.php?aksi=update_podcast_media', {
            method: "POST",
            body: payloadUpdate
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('fsDialog').close(); // Tutup Modal Ketiga (Fullscreen)
                if (typeof menuPodcast === "function") {
					alert(data.message);
                    menuPodcast(kat); // Segarkan data tabel di Modal Kedua secara asinkron
                }
            }
            else
            {
                alert(data.message)
                window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal melakukan update data kueri "+uckat+":", err);
            alert("Terjadi kesalahan jaringan saat menyimpan data ke database.");
        });
    });


}

window.liveTypingEditPreviewPodcast=function(idPod,kat) {
	const uckat=kat.toLowerCase();
	if (!window.globalPodcastCache) return;
    
    const dataTerpilih = window.globalPodcastCache.find(x => x.id == idPod);
    if (!dataTerpilih) {
        alert("Data "+uckat+" gagal diisolasi dari memori!");
        return;
    }
	
const pBox = document.getElementById("liveEditPodcastCardPreviewArea");
const kategori = dataTerpilih.kategori || uckat;
const judul = document.getElementById("editPJudul").value.trim() || "Judul "+kat+"...";
const rawWaktu = document.getElementById("editPWaktu").value;
const videoCode = document.getElementById("editPImage").value.trim();
const isi = document.getElementById("editPIsi").value.trim() || "Isi keterangan deskripsi "+uckat+"...";
const status = document.getElementById("editPStatus").value;

const waktu = rawWaktu ? rawWaktu.replace("T", " ") : "Live Preview";
const areaGambar = videoCode 
                ? `<img src="https://img.youtube.com/vi/${videoCode}/maxresdefault.jpg" class="card-img-top" alt="..." id="zimage">` 
                : '';
			let badgeClass = "bg-secondary";
                if (kategori === "info") badgeClass = "bg-danger";
                if (kategori === "podcast") badgeClass = "bg-warning text-dark";
                if (kategori === "youtube") badgeClass = "bg-primary";
                if (kategori === "sosial Media") badgeClass = "bg-success";
        const kontenIsiFormat = isi || 'Tidak ada deskripsi teks.';
        if (!pBox) return;
pBox.innerHTML = `<div class="card card-branch border-0 shadow-sm">${areaGambar}<div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><span class="badge ${badgeClass}  text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">${kategori}</span><small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i> <label id="zwaktu">${waktu}</label></small></div><h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;" id="zjudul">${judul}</h5><p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;" id="zisi">${kontenIsiFormat}</p><a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center">Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a></div</div>
        `;      
    };

window.bukaFormTambahPodcastBaru=function(kat) {
	const uckat=kat.toLowerCase();
    // Ambil waktu saat ini untuk mengisi nilai bawaan picker (YYYY-MM-DDTHH:MM)
    const skrg = new Date();
    skrg.setMinutes(skrg.getMinutes() - skrg.getTimezoneOffset());
    const waktuBawaan = skrg.toISOString().slice(0, 16);

    // LAYOUT SIMETRIS: col-md-8 Form Input & col-md-4 Live Media Preview
    const htmlFormTambah = `
        <div class="row g-4" id="tambahPodcastWrapperArea">
            <!-- SISI KIRI: FORMULIR INPUT DATA (col-md-8) -->
            <div class="col-md-8 border-end">
                <form id="formInsertPodcastMySQL" class="p-1">
                    <div class="row g-2">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Judul Konten ${kat} Baru</label>
                                <input type="text" class="form-control form-control-sm fw-bold" id="addPJudul" placeholder="Contoh: Mengenal Bahaya Hipertensi" required onkeyup="document.getElementById('wjudul').innerHTML=this.value">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Status Awal</label>
                                <select class="form-select form-select-sm" id="addPStatus" required onchange="window.liveTypingAddPreviewPodcast(kat)">
                                    <option value="0" selected>0 / Simpan Sebagai Draf</option>
                                    <option value="1">Aktif / Publikasikan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Waktu / Tanggal Terbit</label>
                                <input type="datetime-local" class="form-control form-control-sm font-monospace" id="addPWaktu" value="${waktuBawaan}" required onchange="document.getElementById('wwaktu').innerHTML=this.value.replace('T',' ')">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Kategori Konten</label>
                                <input type="text" class="form-control form-control-sm text-muted bg-light" id="addPKategori" value="${kat}" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Youtube Video Code (11 Karakter)</label>
                                <input type="text" class="form-control form-control-sm font-monospace fw-bold text-primary" id="addPImage" placeholder="Contoh: Ojv8c9sQtYc" required onchange="document.getElementById('wimage').src='https://img.youtube.com/vi/'+this.value+'/maxresdefault.jpg'">
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold text-secondary small">Isi Deskripsi Sinopsis ${kat}</label>
                        <textarea class="form-control form-control-sm" id="addPIsi" rows="8" placeholder="Ketik draf rincian narasumber, host, dan ringkasan pembahasan ${uckat} di sini..." required onkeyup="document.getElementById('wisi').innerHTML=this.value"></textarea>
                    </div>

                    <div class="text-end pt-2 border-top">
                        <button type="submit" class="btn btn-sm btn-success px-4 fw-bold"><i class="bi bi-save2 me-1"></i> Simpan Data Baru</button>
                    </div>
                </form>
            </div>

            <!-- SISI KANAN: AUTO LIVE PRATINJAU KARTU VIDEO (col-md-4) -->
            <div class="col-md-4 bg-light rounded-3 p-3" style="min-height: 400px;">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-success me-1"></i> Live ${kat} Preview</h6>
                <div id="liveAddPodcastCardPreviewArea">
                <div class="card card-branch border-0 shadow-sm"><img src="https://lh3.googleusercontent.com/d/1E48PphcJgDvyNfBf_5ROF6qLs81P_GkR" class="card-img-top" alt="..." id="wimage"><div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><span class="badge bg-danger  text-uppercase px-2 py-1 rounded" style="font-size: 0.75rem;">${kat}</span><small class="text-muted" style="font-size: 0.8rem;"><i class="bi bi-clock me-1"></i> <label id="wwaktu">2026-08-25 08:57</label></small></div><h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;" id="wjudul">${kat} Terbaru Silahkan dibuat</h5><p class="card-text text-muted small mb-3" style="text-align: justify; line-height: 1.6; white-space: pre-line;" id="wisi">Isi dengan sekelumit Informasi tentang hal yang akan di informasikan</p><a href="#" class="link-success fw-semibold text-decoration-none small d-flex align-items-center">Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a></div</div>
                </div>
            </div>
        </div>
		
    `;
	modal3('Add New '+kat+' Content', htmlFormTambah);
	const formInsert = document.getElementById("formInsertPodcastMySQL");
    formInsert.addEventListener("submit", function(e) {
        e.preventDefault();
    const uckat=kat.toLowerCase();
        let waktuValueInput = document.getElementById("addPWaktu").value;
        waktuValueInput = waktuValueInput.replace("T", " ") + ":00";

        const payloadInsert = new FormData();
        payloadInsert.append("judul", document.getElementById("addPJudul").value.trim());
        payloadInsert.append("waktu", waktuValueInput); 
        payloadInsert.append("status", document.getElementById("addPStatus").value);
        payloadInsert.append("image", document.getElementById("addPImage").value.trim()); // Column image menyimpan Kode Youtube
        payloadInsert.append("isi", document.getElementById("addPIsi").value);
        payloadInsert.append("kategori", document.getElementById("addPKategori").value);

        fetch(endpoint + 'proses.php?aksi=insert_podcast_media', {
            method: "POST",
            body: payloadInsert
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                document.getElementById('fsDialog').close(); // Tutup Modal Ketiga
                if (typeof menuPodcast === "function") menuPodcast(kat); // Refresh data Modal Kedua
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal menyimpan "+uckat+" baru:", err));
    });


}
	
window.hapusPodcastDirect=function(idPod,kat) {
	const uckat=kat.toLowerCase();
    if (confirm("Apakah Anda yakin ingin menghapus data konten "+uckat+" ini secara permanen dari database MySQL?")) {
        const payloadDelete = new FormData();
        payloadDelete.append("id", idPod);

        // Mengirimkan request asinkron POST menuju rute aksi hapus_podcast_media di proses.php
        fetch(endpoint + 'proses.php?aksi=hapus_podcast_media', {
            method: "POST",
            body: payloadDelete
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {

                if (typeof menuPodcast === "function") {
                    menuPodcast(kat);
                }
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal mengeksekusi penghapusan data "+uckat+":", err);
            alert("Terjadi kegagalan komunikasi dengan server database.");
        });
    }
};

window.pindahkanPodcastKeHeadlineDirect=function(idPod,kat) {
	const uckat=kat.toLowerCase();
    if (confirm("Apakah Anda yakin ingin MEMINDAHKAN dan MENAYANGKAN video "+uckat+" ini ke Komponen Headline Utama  di Halaman Depan?")) {
        const payloadMove = new FormData();
        payloadMove.append("id_podcast", idPod);
        // Fetch mengirim request eksekusi pemindahan data ke proses.php dengan rute baru pindah__ke_headline
        fetch(endpoint + 'proses.php?aksi=pindah_podcast_ke_headline&kat='+kat, {
            method: "POST",
            body: payloadMove
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                    menuPodcast(kat);   
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal melakukan sinkronisasi pemindahan video "+uckat+":", err));
    }
};

window.menuGallery=function()
{
const kontenHtmlGalleryManager = `
        <div class="row g-4" id="galleryManagerContainer">
            <!-- PANEL KIRI: FILTER, LIVE SEARCH & DAFTAR JUDUL ALBUM (col-md-4) -->
            <div class="col-md-4 border-end">
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="fw-bold text-success mb-0">
                            <i class="bi bi-images me-1"></i> Album Foto Kegiatan
                        </h6>
                        <button class="btn btn-sm btn-success px-2 py-1 fw-bold rounded-3 shadow-sm" style="font-size:0.75rem;" onclick="window.bukaFormTambahAlbumBaru()">
    <i class="bi bi-plus-circle me-1"></i> Tambah Album
</button>
                    </div>
                    
                    <!-- Komponen Input Pencarian Real-Time -->
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchGalleryInput" placeholder="Cari nama album..." oninput="window.liveSearchGalleryAdmin()">
                    </div>
                </div>
                
                <!-- LIST CONTAINER UNTUK MENAMPUNG KARTU JUDUL DARI MYSQL -->
                <div class="list-group shadow-sm rounded-3 overflow-auto" id="mysqlGalleryListGroup" style="max-height: 400px;">
                    <div class="text-center py-4 text-muted small">
                        <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                        Menghubungkan ke tabel galeri...
                    </div>
                </div>
            </div>

            <!-- PANEL KANAN: PREVIEW EMBED FOLDER GOOGLE DRIVE (col-md-8) -->
            <div class="col-md-8">
                <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-eye-fill me-1"></i> Pratinjau Penyimpanan Folder G-Drive</h6>
                <div class="p-4 bg-white rounded-4 border shadow-sm" id="galleryDetailPreviewArea" >
                    <p class="text-muted small text-center my-5 py-5">Silakan pilih atau klik salah satu nama album di panel kiri untuk melihat isi folder dokumentasi Google Drive secara langsung.</p>
                </div>
            </div>
        </div>
    `;

    modal2('Gallery Control Hub', kontenHtmlGalleryManager);
const listGroupContainer = document.getElementById("mysqlGalleryListGroup");

    fetch(endpoint + 'proses.php?aksi=get_headline_admin')
    .then(res => res.json())
    .then(headlineRes => {
		let imageHeadlineTarget = "";
		if (headlineRes.status === 'success' && headlineRes.data) {
			const headline4 = headlineRes.data.find(h => h.id == 4);
			if (headline4 && headline4.img) {
                imageHeadlineTarget = headline4.img.trim();
            }
		}
		else
		{
		    alert(headlineRes.message)
		    window.location.reload();
		}

    return fetch(endpoint + 'proses.php?aksi=get_gallery_admin')
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const arrayGallery = res.data;
            let listGroupHtml = "";

            if (arrayGallery.length === 0) {
                listGroupContainer.innerHTML = `<div class="p-3 text-muted text-center small"><i class="bi bi-folder-x me-1"></i> Belum ada album foto terdaftar.</div>`;
                return;
            }

            // Simpan data ke dalam cache window global agar fitur pencarian dan preview instan bekerja
            window.globalGalleryCache = arrayGallery;

            // Render list judul secara vertikal
            for (let i = 0; i < arrayGallery.length; i++) {
                const gal = arrayGallery[i];
                let classWarnaJudul = "text-dark";
				if (gal.image && gal.image.trim() !== "" && gal.image.trim() === imageHeadlineTarget) {
                        classWarnaJudul = "text-danger";
						bukaPratinjauDetailGallery(gal.id);
                    }
const statusBadge = gal.status == 1 
        ? `<a href="#" class="badge bg-success-subtle text-success text-decoration-none fw-bold" style="font-size:0.6rem; cursor:pointer;" title="Klik untuk menayangkan album ini ke Headline Utama" onclick="event.stopPropagation(); window.pindahkanGalleryKeHeadlineDirect(${gal.id})"><i class="bi bi-box-arrow-up-right me-1"></i>Aktif</a>` 
        : `<a nohref="#" class="badge bg-danger-subtle text-danger text-decoration-none" style="font-size:0.6rem; cursor:pointer;" >Draf</a>`;


                const htmlIconSampah = gal.status == 0 
    ? `<a href="#" class="link-danger ms-1" title="Hapus Album" onclick="event.stopPropagation(); window.hapusGalleryDirect(${gal.id})">
            <i class="bi bi-trash3-fill" style="font-size: 0.7rem;"></i>
       </a>` 
    : '';

                const htmlIconEdit = `
    <a href="#" class="link-primary ms-1" title="Edit Album" onclick="event.stopPropagation(); window.bukaFormEditGalleryDirect(${gal.id})">
        <i class="bi bi-pencil-square" style="font-size: 0.75rem;"></i>
    </a>
`;


                listGroupHtml += `
                    <div class="list-group-item list-group-item-action p-3 click-gallery-item" 
                         data-id="${gal.id}" 
                         style="cursor: pointer; transition: all 0.2s;"
                         onclick="window.bukaPratinjauDetailGallery(${gal.id})">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted" style="font-size:0.65rem;"><i class="bi bi-calendar3 me-1"></i>${gal.waktu.substring(0,10)}</small>
                            <div class="d-flex align-items-center gap-1">
                                ${statusBadge}
                                ${htmlIconEdit}
                                ${htmlIconSampah}
                            </div>
                        </div>
                        <div class="${classWarnaJudul} fw-bold text-truncate small list-gallery-title">${gal.judul}</div>
                    </div>
                `;
            }
            listGroupContainer.innerHTML = listGroupHtml;

        } else {
            listGroupContainer.innerHTML = `<div class="alert alert-danger p-2 small">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error("Gagal sinkronisasi data tabel gallery:", err);
        listGroupContainer.innerHTML = `<div class="p-3 text-center text-danger small"><i class="bi bi-wifi-off me-1"></i> Gagal terhubung ke database server.</div>`;
    });
	})
};

window.bukaPratinjauDetailGallery = function(idGal) {
    const previewBox = document.getElementById("galleryDetailPreviewArea");
    
    document.querySelectorAll('.click-gallery-item').forEach(el => el.classList.remove('bg-light'));
    const activeItem = document.querySelector(`.click-gallery-item[data-id="${idGal}"]`);
    if (activeItem) activeItem.classList.add('bg-light');

    if (window.globalGalleryCache && previewBox) {
        const detailData = window.globalGalleryCache.find(x => x.id == idGal);
        if (detailData) {
            
            // 1. Bersihkan area pratinjau dan tampilkan loading state internal
            previewBox.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <span class="badge bg-success text-uppercase" style="font-size:0.7rem;"><i class="bi bi-folder-fill me-1"></i>${detailData.kategori}</span>
                    <small class="text-muted font-monospace" style="font-size:0.75rem;"><i class="bi bi-clock me-1"></i>${detailData.waktu}</small>
                </div>
                <h5 class="fw-bold text-dark mb-3" style="line-height:1.4; font-size: 1.05rem;">${detailData.judul}</h5>
                <div class="text-center py-5 text-muted small" id="googleImagesLoading">
                    <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    Membaca folder Drive via Google Cloud...
                </div>
                <div id="nativeGalleryGrid" class="row row-cols-3 row-cols-sm-4 g-2 d-none"></div>
            `;

            const loadingEl = document.getElementById("googleImagesLoading");
            const gridEl = document.getElementById("nativeGalleryGrid");

            // 2. Tautan Web App URL Google Apps Script Anda
            const googleAppsScriptWebGroupUrl = "https://script.google.com/macros/s/AKfycbweZdNggwZhe8QhDpeDhyTGcdcKPlAwWJPoUz8qkhAsZjuTbG84r63a80b6Rav14MWYMg/exec";

            // 3. JALANKAN FETCH MENYALURKAN PARAMETER KODE
            fetch(`${googleAppsScriptWebGroupUrl}?kode=${detailData.image}`)
            .then(res => res.json())
            .then(res => {
                if (loadingEl) loadingEl.remove();
                if (!gridEl) return;

                if (res.status === 'success') {
                    const listFoto = res.data;
                    let gridHtml = "";

                    if (listFoto.length === 0) {
                        gridEl.insertAdjacentHTML('beforebegin', `<div class="text-center text-muted py-4 small"><i class="bi bi-images d-block fs-3 mb-1"></i>Folder ini kosong atau tidak berisi file gambar.</div>`);
                        return;
                    }

                    // Loop render struktur gambar asli Bootstrap secara native
                    for (let i = 0; i < listFoto.length; i++) {
                        const foto = listFoto[i];
                        const thumbUrl = "https://lh3.googleusercontent.com/d/" + foto.id;

                        // MODIFIKASI: Aksi klik dialihkan ke fungsi window.popupLightboxImageModal3Direct
                        gridHtml += `
                            <div class="col">
                                <div class="card h-100 border-0 shadow-sm overflow-hidden" style="aspect-ratio: 1/1; cursor: pointer;" 
                                     onclick="window.popupLightboxImageModal3Direct('${foto.id}', '${foto.nama.replace(/'/g, "\\'")}')">
                                    <img src="${thumbUrl}" alt="${foto.nama}" class="w-100 h-100 object-fit-cover" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                </div>
                            </div>
                        `;
                    }
                    
                    gridEl.innerHTML = gridHtml;
                    gridEl.classList.remove("d-none");

                } else {
                    gridEl.insertAdjacentHTML('beforebegin', `<div class="alert alert-danger py-2 small"><i class="bi bi-exclamation-triangle me-1"></i> Gagal memuat folder Google Drive: ${res.message}</div>`);
                }
            })
            .catch(err => {
                console.error("Gagal interaksi API cloud:", err);
                if (loadingEl) loadingEl.remove();
                if (gridEl) gridEl.insertAdjacentHTML('beforebegin', `<div class="alert alert-danger py-2 small"><i class="bi bi-wifi-off me-1"></i> Gagal terhubung ke Google Apps Script API.</div>`);
            });
        }
    }
};

window.popupLightboxImageModal3Direct = function(fileId, namaFile) {
    // Ambil URL gambar ukuran besar resolusi penuh dari CDN Google Drive
    const fullImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    // Susun struktur kontainer gambar responsif Bootstrap yang rapi dan pas di layar modal
    const htmlLightbox = `
        <div class="text-center p-2">
            <div class="bg-dark rounded-3 p-2 d-inline-block border shadow-lg max-w-100" style="max-height: 75vh; overflow: hidden;">
                <img src="${fullImageUrl}" alt="${namaFile}" class="img-fluid rounded-2" style="max-height: 70vh; object-fit: contain;">
            </div>
            <div class="mt-3 text-muted font-monospace small">
                <i class="bi bi-info-circle me-1"></i> File Name: <span class="text-dark fw-semibold">${namaFile}</span>
            </div>
            <div class="mt-2 pt-2 border-top text-center">
                <a href="${fullImageUrl}" target="_blank" class="btn btn-xs btn-outline-success px-3 fw-bold rounded-pill" style="font-size: 0.7rem;">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Open Original Image
                </a>
            </div>
        </div>
    `;

    // Panggil modal3 bawaan untuk merender gambar ukuran penuh
    modal3('Pratinjau', htmlLightbox);
};

window.bukaFormTambahAlbumBaru = function() {
    // Ambil waktu saat ini untuk mengisi nilai bawaan picker (YYYY-MM-DDTHH:MM)
    const skrg = new Date();
    skrg.setMinutes(skrg.getMinutes() - skrg.getTimezoneOffset());
    const waktuBawaan = skrg.toISOString().slice(0, 16);

    // LAYOUT SIMETRIS: col-md-8 Form Input & col-md-4 Live Media Preview
    const htmlFormTambah = `
        <div class="row g-4" id="tambahGalleryWrapperArea">
            <!-- SISI KIRI: FORMULIR INPUT DATA (col-md-8) -->
            <div class="col-md-8 border-end">
                <form id="formInsertGalleryMySQL" class="p-1">
                    <div class="row g-2">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Nama / Judul Album Kegiatan Baru</label>
                                <input type="text" class="form-control form-control-sm fw-bold" id="addGJudul" placeholder="Contoh: Album Foto Bakti Sosial 2026" required oninput="window.liveTypingAddPreviewGallery()">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Status Publikasi</label>
                                <select class="form-select form-select-sm" id="addGStatus" required onchange="window.liveTypingAddPreviewGallery()">
                                    <option value="0" selected>0 / Simpan Sebagai Draf</option>
                                    <option value="1">Aktif / Tampilkan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Waktu / Tanggal Kegiatan</label>
                                <input type="datetime-local" class="form-control form-control-sm font-monospace" id="addGWaktu" value="${waktuBawaan}" required oninput="window.liveTypingAddPreviewGallery()">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Kategori Konten</label>
                                <input type="text" class="form-control form-control-sm text-muted bg-light" id="addGKategori" value="image" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Google Drive Folder ID</label>
                                <input type="text" class="form-control form-control-sm font-monospace fw-bold text-success" id="addGImage" placeholder="Contoh: 1RHNqgI4DC..." required oninput="window.liveTypingAddPreviewGallery()">
                            </div>
                        </div>
                    </div>

                    <div class="text-end pt-3 border-top mt-4">
                        <button type="submit" class="btn btn-sm btn-success px-4 fw-bold"><i class="bi bi-save2 me-1"></i> Simpan Album Baru</button>
                    </div>
                </form>
            </div>

            <!-- SISI KANAN: AUTO LIVE PRATINJAU KARTU ALBUM (col-md-4) -->
            <div class="col-md-4 bg-light rounded-3 p-3" style="min-height: 400px;">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-success me-1"></i> Live Album Preview</h6>
                <div id="liveAddGalleryCardPreviewArea">
                    <!-- Kompilasi teks langsung masuk di sini secara otomatis -->
                </div>
            </div>
        </div>
    `;

    modal3('Add Gallery Album', htmlFormTambah);

    // ENGINE LIVE PREVIEW UNTUK FORM TAMBAH DATA GALERI
    window.liveTypingAddPreviewGallery = function() {
        const pBox = document.getElementById("liveAddGalleryCardPreviewArea");
        if (!pBox) return;

        const judul = document.getElementById("addGJudul").value.trim() || "Nama Album Kegiatan...";
        const rawWaktu = document.getElementById("addGWaktu").value;
        const folderId = document.getElementById("addGImage").value.trim();
        const status = document.getElementById("addGStatus").value;

        const waktuTampil = rawWaktu ? rawWaktu.substring(0, 10) : "YYYY-MM-DD";

        const statusBadge = status == 1 
            ? `<span class="badge bg-success text-uppercase px-2 py-1 rounded" style="font-size: 0.65rem;">Aktif</span>` 
            : `<span class="badge bg-danger text-uppercase px-2 py-1 rounded" style="font-size: 0.65rem;">Draf</span>`;

        // Render penanda visual status koneksi folder cloud drive
        const areaDriveStatus = folderId 
            ? `<div class="p-4 bg-success-subtle text-center rounded-top border-bottom text-success mb-2" style="font-size:0.75rem;">
                    <i class="bi bi-cloud-check display-6 d-block mb-1"></i>Folder G-Drive Terpaku
               </div>` 
            : `<div class="p-4 bg-secondary-subtle text-center rounded-top border-bottom text-muted mb-2" style="font-size:0.75rem;">
                    <i class="bi bi-folder-symlink display-6 d-block mb-1"></i>Menunggu Google Drive ID...
               </div>`;

        pBox.innerHTML = `
            <div class="card card-branch border-0 shadow-sm overflow-hidden">
                ${areaDriveStatus}
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <small class="text-muted" style="font-size: 0.8rem;">
                            <i class="bi bi-calendar3 me-1"></i> ${waktuTampil}
                        </small>
                        ${statusBadge}
                    </div>
                    <h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;">${judul}</h5>
                    <div class="pt-3 border-top mt-3 text-muted font-monospace" style="font-size:0.65rem; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        Folder ID: <span class="text-primary">${folderId || '-'}</span>
                    </div>
                </div>
            </div>
        `;
    };
	window.liveTypingAddPreviewGallery();

    // Event Submit Penyimpanan Album Baru ke MySQL via Fetch POST
    const formInsert = document.getElementById("formInsertGalleryMySQL");
    formInsert.addEventListener("submit", function(e) {
        e.preventDefault();

        let waktuValueInput = document.getElementById("addGWaktu").value;
        waktuValueInput = waktuValueInput.replace("T", " ") + ":00";

        const payloadInsert = new FormData();
        payloadInsert.append("judul", document.getElementById("addGJudul").value.trim());
        payloadInsert.append("waktu", waktuValueInput); 
        payloadInsert.append("status", document.getElementById("addGStatus").value);
        payloadInsert.append("image", document.getElementById("addGImage").value.trim()); // Column image menyimpan Google Drive Folder ID
        payloadInsert.append("kategori", document.getElementById("addGKategori").value);

        fetch(endpoint + 'proses.php?aksi=insert_gallery_album', {
            method: "POST",
            body: payloadInsert
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                document.getElementById('fsDialog').close(); // Tutup Modal Ketiga
                if (typeof menuGallery === "function") menuGallery(); // Refresh list album di Modal Kedua
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal menyimpan album baru:", err));
    });
};
   
window.liveSearchGalleryAdmin = function() {
    const inputKataKunci = document.getElementById("searchGalleryInput").value.toLowerCase().trim();
    const itemsList = document.querySelectorAll(".click-gallery-item");

    itemsList.forEach(item => {
        const judulTeks = item.querySelector(".list-gallery-title").innerText.toLowerCase();
        
        if (judulTeks.includes(inputKataKunci)) {
            item.style.setProperty("display", "block", "important");
        } else {
            item.style.setProperty("display", "none", "important");
        }
    });
};

window.bukaFormEditGalleryDirect = function(idGal) {
    if (!window.globalGalleryCache) return;
    
    const dataTerpilih = window.globalGalleryCache.find(x => x.id == idGal);
    if (!dataTerpilih) {
        alert("Data album gagal diisolasi dari memori!");
        return;
    }

    const selectStatusHtml = dataTerpilih.status == 1 
        ? `<option value="1" selected>Aktif / Tampilkan</option><option value="0">0 / Simpan Sebagai Draf</option>`
        : `<option value="1">Aktif / Tampilkan</option><option value="0" selected>0 / Simpan Sebagai Draf</option>`;

    // Normalisasi format datetime value dari MySQL (YYYY-MM-DD HH:MM:SS) menjadi (YYYY-MM-DDTHH:MM)
    let formattedDateTime = "";
    if (dataTerpilih.waktu) {
        formattedDateTime = dataTerpilih.waktu.substring(0, 16).replace(" ", "T");
    }

    // LAYOUT SIMETRIS: col-md-8 Form Input & col-md-4 Live Media Preview
    const htmlFormEdit = `
        <div class="row g-4" id="editGalleryWrapperArea">
            <!-- SISI KIRI: FORMULIR INPUT DATA EDIT (col-md-8) -->
            <div class="col-md-8 border-end">
                <form id="formUpdateGalleryMySQL" class="p-1">
                    <input type="hidden" id="editGId" value="${dataTerpilih.id}">

                    <div class="row g-2">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Nama / Judul Album Kegiatan</label>
                                <input type="text" class="form-control form-control-sm fw-bold" id="editGJudul" value="${dataTerpilih.judul}" required oninput="window.liveTypingEditPreviewGallery()">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Status Publikasi</label>
                                <select class="form-select form-select-sm" id="editGStatus" required onchange="window.liveTypingEditPreviewGallery()">
                                    ${selectStatusHtml}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Waktu / Tanggal Kegiatan</label>
                                <input type="datetime-local" class="form-control form-control-sm font-monospace" id="editGWaktu" value="${formattedDateTime}" required oninput="window.liveTypingEditPreviewGallery()">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Kategori Konten</label>
                                <input type="text" class="form-control form-control-sm text-muted bg-light" id="editGKategori" value="${dataTerpilih.kategori}" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Google Drive Folder ID</label>
                                <input type="text" class="form-control form-control-sm font-monospace fw-bold text-success" id="editGImage" value="${dataTerpilih.image || ''}" placeholder="Contoh: 1RHNqgI4DC..." required oninput="window.liveTypingEditPreviewGallery()">
                            </div>
                        </div>
                    </div>

                    <div class="text-end pt-3 border-top mt-4">
                        <button type="submit" class="btn btn-sm btn-primary px-4 fw-bold"><i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Perubahan Album</button>
                    </div>
                </form>
            </div>

            <!-- SISI KANAN: AUTO LIVE PRATINJAU KARTU ALBUM (col-md-4) -->
            <div class="col-md-4 bg-light rounded-3 p-3" style="min-height: 400px;">
                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-eye-fill text-success me-1"></i> Live Album Preview</h6>
                <div id="liveEditGalleryCardPreviewArea">
                    <!-- Visual kartu ter-render otomatis di sini secara real-time -->
                </div>
            </div>
        </div>
    `;

    modal3('Edit Gallery Album', htmlFormEdit);

    // =========================================================================
    // Ã°Å¸â€™Â¡ AUTOMATIC LIVE TYPING PREVIEW ENGINE FOR GALLERY
    // =========================================================================
    window.liveTypingEditPreviewGallery = function() {
        const pBox = document.getElementById("liveEditGalleryCardPreviewArea");
        if (!pBox) return;

        const judul = document.getElementById("editGJudul").value.trim() || "Nama Album Kegiatan...";
        const rawWaktu = document.getElementById("editGWaktu").value;
        const folderId = document.getElementById("editGImage").value.trim();
        const status = document.getElementById("editGStatus").value;

        const waktuTampil = rawWaktu ? rawWaktu.substring(0, 10) : "YYYY-MM-DD";

        const statusBadge = status == 1 
            ? `<span class="badge bg-success text-uppercase px-2 py-1 rounded" style="font-size: 0.65rem;">Aktif</span>` 
            : `<span class="badge bg-danger text-uppercase px-2 py-1 rounded" style="font-size: 0.65rem;">Draf</span>`;

        const areaDriveStatus = folderId 
            ? `<div class="p-4 bg-success-subtle text-center rounded-top border-bottom text-success mb-2" style="font-size:0.75rem;">
                    <i class="bi bi-cloud-check display-6 d-block mb-1"></i>Folder G-Drive Terpaku
               </div>` 
            : `<div class="p-4 bg-secondary-subtle text-center rounded-top border-bottom text-muted mb-2" style="font-size:0.75rem;">
                    <i class="bi bi-folder-symlink display-6 d-block mb-1"></i>Menunggu Google Drive ID...
               </div>`;

        pBox.innerHTML = `
            <div class="card card-branch border-0 shadow-sm overflow-hidden">
                ${areaDriveStatus}
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <small class="text-muted" style="font-size: 0.8rem;">
                            <i class="bi bi-calendar3 me-1"></i> ${waktuTampil}
                        </small>
                        ${statusBadge}
                    </div>
                    <h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; line-height: 1.4;">${judul}</h5>
                    <div class="pt-3 border-top mt-3 text-muted font-monospace" style="font-size:0.65rem; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        Folder ID: <span class="text-primary">${folderId || '-'}</span>
                    </div>
                </div>
            </div>
        `;
    };

    // Jalankan inisialisasi render kartu pertama kali saat modal edit terbuka agar langsung tampil
    window.liveTypingEditPreviewGallery();

    // Penanganan Event Submit Kirim Perubahan Ke Database MySQL via AJAX Fetch
    const formUpdate = document.getElementById("formUpdateGalleryMySQL");
    formUpdate.addEventListener("submit", function(e) {
        e.preventDefault();

        let waktuValueInput = document.getElementById("editGWaktu").value;
        waktuValueInput = waktuValueInput.replace("T", " ") + ":00";

        const payloadUpdate = new FormData();
        payloadUpdate.append("id", document.getElementById("editGId").value);
        payloadUpdate.append("judul", document.getElementById("editGJudul").value.trim());
        payloadUpdate.append("waktu", waktuValueInput); 
        payloadUpdate.append("status", document.getElementById("editGStatus").value);
        payloadUpdate.append("image", document.getElementById("editGImage").value.trim()); // Column image menyimpan Google Drive Folder ID

        fetch(endpoint + 'proses.php?aksi=update_gallery_album', {
            method: "POST",
            body: payloadUpdate
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                document.getElementById('fsDialog').close(); 
                if (typeof menuGallery === "function") menuGallery(); // Refresh Modal Kedua secara otomatis
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal melakukan update data kueri album gallery:", err));
    });
};

// =========================================================================
// FUNGSI GLOBAL: HAPUS PERMANEN DATA ALBUM GALERI DARI TABEL GALLERY
// =========================================================================
window.hapusGalleryDirect = function(idGal) {
    if (confirm("Apakah Anda yakin ingin menghapus album foto kegiatan ini secara permanen dari database MySQL?")) {
        const payloadDelete = new FormData();
        payloadDelete.append("id", idGal);

        fetch(endpoint + 'proses.php?aksi=hapus_gallery_album', {
            method: "POST",
            body: payloadDelete
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Refresh daftar album di Modal Kedua secara otomatis tanpa menutup jendela
                if (typeof menuGallery === "function") {
                    menuGallery();
                }
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal mengeksekusi penghapusan data album gallery:", err);
            alert("Terjadi kegagalan komunikasi dengan server database.");
        });
    }
};

window.pindahkanGalleryKeHeadlineDirect = function(idGal) {
    if (confirm("Apakah Anda yakin ingin MEMINDAHKAN dan MENAYANGKAN album foto kegiatan ini ke Komponen Headline Utama di Halaman Depan?")) {
        const payloadMove = new FormData();
        payloadMove.append("id_gallery", idGal);

        fetch(endpoint + 'proses.php?aksi=pindah_gallery_to_headline', {
            method: "POST",
            body: payloadMove
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Berhasil diperbarui! Refresh masonry halaman depan website utama di background secara real-time
                if (typeof window.muatDataHeadlineMasonry === "function") {
                    window.muatDataHeadlineMasonry();
                }
            }
            else
            {
                window.location.reload();
            }
        })
        .catch(err => console.error("Gagal melakukan sinkronisasi pemindahan album galeri:", err));
    }
};

window.menuIuranAdmin = function() {
    const htmlAntreanIuran = `
        <div class="container py-2" id="antreanIuranWrapper">
            <!-- NOTIFIKASI REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                <i class="bi bi-shield-lock-fill text-warning fs-3"></i>
                <div>
                    <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; text-color: #ffc107;">Panel Otorisasi Kas Masuk</span>
                    <span class="small text-white-50">Silakan periksa lampiran berkas fisik kuitansi transfer sebelum menekan tombol pengesahan lunas iuran anggota.</span>
                </div>
                            <div class="ms-auto ms-sm-0">
        <button type="button" 
                class="btn btn-xs btn-primary fw-bold px-3 py-1.5 rounded-pill shadow d-inline-flex align-items-center gap-1.5 font-sans animate-pulse" 
                style="font-size:0.72rem; background-color: #0284c7; border: 0;"
                onclick="loadDataAntreanIuranMySQLvalid()">
            <i class="bi bi-file-earmark-check-fill"></i> Tinjau Validasi
        </button>
    </div>
    <div class="ms-auto ms-sm-0">
        <button type="button" class="btn btn-xs btn-outline-light font-monospace small" style="font-size:0.7rem;" onclick="window.loadDataAntreanIuranMySQL()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Refresh Live
                    </button>
    </div>
            </div>

            <!-- CONTAINER DINAMIS ANTREAN -->
            <div id="mysqlAntreanResultTableArea" class="animate-fade-in">
                <div class="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                    <p class="small mb-0 font-monospace">Mengambil antrean berkas verifikasi</p>
                </div>
            </div>
        </div>
    `;

    // Luncurkan ke dalam komponen Modal 2 (secondAdminModal)
    modal2('Transaksi Iuran', htmlAntreanIuran);

    // Jalankan asinkronus fetch data antrean
    window.loadDataAntreanIuranMySQL();
};


window.loadDataAntreanIuranMySQL = function() {
    const resultArea = document.getElementById("mysqlAntreanResultTableArea");
    if (!resultArea) return;

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_antrean_verifikasi_iuran`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const listData = res.data;

            // KONDISI 1: Jika antrean bersih/kosong
            if (listData.length === 0) {
                resultArea.innerHTML = `
                    <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed my-2 animate-fade-in">
                        <i class="bi bi-check-circle-fill display-5 d-block mb-2 text-success"></i>
                        <h6 class="fw-bold mb-1 text-dark">Antrean Bersih!</h6>
                        <p class="small mb-0 px-3">Tidak ada data iuran berstatus Menunggu Verifikasi Admin atau Upload Bukti saat ini.</p>
                    </div>
                `;
                return;
            }

            // KONDISI 2: Data ada! Susun baris tabel approval
            let tableRowsHtml = "";
            for (let i = 0; i < listData.length; i++) {
                const row = listData[i];

                // Set warna lencana berdasarkan status
                let statusBadge = "";
                if (row.status === "Menunggu Verifikasi Admin") {
                    statusBadge = `<span class="badge bg-info-subtle text-info px-2 py-1 rounded small fw-bold border border-info-subtle"><i class="bi bi-hourglass-split me-1"></i>Verifikasi</span>`;
                } else if (row.status === "Pending") {
    const safeAlasanAdmin = (row.alasan_pending || "Tidak ada catatan koreksi spesifik dari admin.").replace(/'/g, "\\'");
    statusBadge = `
        <a href="#" class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold text-decoration-none border border-danger d-inline-flex align-items-center gap-1 animate-pulse" 
           title="Klik untuk meninjau kembali catatan alasan pending yang pernah Anda berikan"
           onclick="event.preventDefault(); window.bukaModal3LihatAlasanPendingIuranMurni('${safeAlasanAdmin}', '${row.periode || 'Iuran'}', '${row.iuran_id}', '${row.telpon}','Admin')">
            <i class="bi bi-exclamation-circle-fill"></i> Pending (Cek Alasan)
        </a>
    `;

                } else {
                    statusBadge = `<span class="badge bg-warning-subtle text-warning-emphasis px-2 py-1 rounded small fw-bold border border-warning"><i class="bi bi-cloud-arrow-up me-1"></i>Upload Bukti</span>`;
                }

                // Tautan gambar kwitansi modal 2 lightbox
                const htmlAksiBukti = row.img && row.img.trim() !== ""
                    ? `<a href="#" class="btn btn-xs btn-outline-primary px-2 py-1 rounded fw-bold" style="font-size:0.7rem;" 
                          onclick="event.preventDefault(); window.bukaPratinjauBuktiBayarModal2Direct('${row.img}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', '${row.periode}')">
                            <i class="bi bi-image me-1"></i>Lihat Struk
                       </a>`
                    : `<span class="text-muted small"><i>Belum Upload</i></span>`;

const statusTeksLower = (row.status || "").toLowerCase().trim();

// Tombol verifikasi dropdown akan tetap AKTIF jika statusnya: menunggu verifikasi, upload bukti, atau pending
const htmlTombolApproval = (statusTeksLower === "menunggu verifikasi admin" || statusTeksLower === "upload bukti" || statusTeksLower === "pending")
    ? `
        <div class="dropdown d-inline-block">
            <button class="btn btn-sm btn-warning dropdown-toggle fw-bold px-2 py-1 rounded" 
                    type="button" 
                    id="dropdownApprovalIuran${row.iuran_id}" 
                    data-bs-toggle="dropdown" 
                    data-bs-boundary="viewport" 
                    aria-expanded="false" 
                    style="font-size:0.7rem;">
                <i class="bi bi-gear-fill me-1"></i> Verifikasi
            </button>
            <ul class="dropdown-menu shadow rounded-3 border-0 mt-1" aria-labelledby="dropdownApprovalIuran${row.iuran_id}" style="font-size:0.75rem; min-width:110px; z-index:1060;">
                <li>
                    <a class="dropdown-item py-2 fw-bold text-success d-flex align-items-center gap-2" href="#" 
                       onclick="event.preventDefault(); window.eksekusiUbahStatusIuranAdminMurni(${row.iuran_id}, ${row.id_anggota}, 'LUNAS')">
                        <i class="bi bi-check-circle-fill"></i> Sahkan Lunas
                    </a>
                </li>
                <li>
                    <a class="dropdown-item py-2 fw-bold text-danger d-flex align-items-center gap-2" href="#" 
                       onclick="event.preventDefault(); window.bukaFormAlasanPendingIuranModal3(${row.iuran_id}, ${row.id_anggota})">
                        <i class="bi bi-exclamation-circle-fill"></i> Set Pending
                    </a>
                </li>
            </ul>
        </div>
    `
    : `
        <button type="button" class="btn btn-sm btn-secondary px-2 py-1 rounded font-monospace" style="font-size:0.7rem;" disabled>
            <i class="bi bi-lock-fill me-1"></i>Lock
        </button>
    `;


                const nominalMentah = parseFloat(row.jumlah.replace(/[^0-9]/g, '')) || 0;
                const formatRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nominalMentah);

                tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${i + 1}</td>
                        <td class="text-center font-monospace fw-bold text-primary">#${row.iuran_id}</td>
                        <td class="fw-bold text-dark text-uppercase small">${row.nama_anggota}</td>
                        <td class="font-monospace small text-muted">+62 ${row.telpon_anggota || '-'}</td>
                        <td class="small fw-semibold text-secondary">${row.periode}</td>
                        <td class="font-monospace fw-bold text-end text-success" style="font-size:0.85rem;">${formatRupiah}</td>
                        <td class="text-center">${statusBadge}</td>
                        <td class="text-center">${row.keterangan}</td>
                        <td class="text-center">${htmlAksiBukti}</td>
                        <td class="text-center">${htmlTombolApproval}</td>
                    </tr>
                `;
            }

            resultArea.innerHTML = `
            <div class="container">
             <div class="row p-1 mb-2  bg-light rounded-4 px-3">
            <div class="col-md-7 col-sm-12">
            <span class="text-muted small fw-bold">
                <i class="bi bi-clock-history me-1 text-success"></i> MANAJEMEN VERIFIKASI KAS IURAN ANGGOTA
            </span>
            </div>
                <div class="col-md-5 col-sm-12">
                    <div class="input-group shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-end-0 text-muted small"><i class="bi bi-search"></i></span>
                        <input type="text" id="inputCariAntreanIuranAnggota" class="form-control form-control-sm border-start-0 ps-1 font-sans small" 
                               placeholder="Cari nama dokter, nomor STR, atau kata kunci berkas..." 
                               oninput="window.eksekusiLiveSearchTabelAntreaniuran(this.value)" onblur="window.eksekusiLiveSearchTabelAntreaniuran(this.value)" onfocus="window.eksekusiLiveSearchTabelAntreaniuran(this.value)">
                    </div>
                </div>
            </div></div>
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">
        <div class="table-responsive" style="min-height: 280px; overflow-x: auto; overflow-y: visible;">
            <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                <thead class="table-dark text-uppercase font-monospace" style="font-size:0.75rem; letter-spacing:0.5px;">
                    <tr>
                        <th width="3%" class="text-center">No</th>
                        <th width="8%" class="text-center">ID Trans</th>
                        <th width="12%">Nama Anggota Dokter</th>
                        <th width="10%">No Telepon</th>
                        <th width="18%">Siklus Periode Wajib</th>
                        <th width="11%" class="text-end">Jumlah Kas</th>
                        <th width="8%" class="text-center">Status</th>
                        <th width="14%" class="text-center">Keterangan</th>
                        <th width="9%" class="text-center">Struk Berkas</th>
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

        }
        else
        {
        alert(res.message);
        window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal sinkronisasi antrean iuran:", err);
        resultArea.innerHTML = `<div class="alert alert-danger p-3 small"><i class="bi bi-wifi-off me-1"></i> Terjadi kegagalan komunikasi data antrean ke server.</div>`;
    });
};

window.loadDataAntreanIuranMySQLvalid = function() {
    const resultArea = document.getElementById("mysqlAntreanResultTableArea");
    if (!resultArea) return;
    resultArea.innerHTML = `
<div id="mysqlAntreanResultTableArea" class="animate-fade-in">
                <div class="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                    <p class="small mb-0 font-monospace">Mengambil berkas verifikasi valid</p>
                </div>
            </div>
                `;
const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

fetch(`${cleanEndpoint}/proses.php?aksi=get_antrean_verifikasi_iuran_valid`)
.then(res => res.json())
.then(res => {
    if (res.status === 'success') {
        const listData = res.data;
        let tableRowsHtml = "";
        
        for (let i = 0; i < listData.length; i++) {
                const row = listData[i];
                const nominalMentah = parseFloat(row.jumlah.replace(/[^0-9]/g, '')) || 0;
                const formatRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nominalMentah);
                const htmlAksiBukti = row.img && row.img.trim() !== ""
                    ? `<a href="#" class="btn btn-xs btn-outline-primary px-2 py-1 rounded fw-bold" style="font-size:0.7rem;" 
                          onclick="event.preventDefault(); window.bukaPratinjauBuktiBayarModal2Direct('${row.img}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', '${row.periode}')">
                            <i class="bi bi-image me-1"></i>Lihat Struk
                       </a>`
                    : `<span class="text-muted small"><i>Belum Upload</i></span>`;
                        tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${i + 1}</td>
                        <td class="text-center font-monospace fw-bold text-primary">#${row.iuran_id}</td>
                        <td class="fw-bold text-dark text-uppercase small">${row.nama_anggota}</td>
                        <td class="font-monospace small text-muted">+62 ${row.telpon_anggota || '-'}</td>
                        <td class="small fw-semibold text-secondary">${row.periode}</td>
                        <td class="font-monospace fw-bold text-end text-success" style="font-size:0.85rem;">${formatRupiah}</td>
                        <td class="text-center">${row.status}</td>
                        <td class="text-center">${row.keterangan}</td>
                        <td class="text-center">${htmlAksiBukti}</td>
                        <td class="text-center">
                        <a href="${cleanEndpoint}/kuitansi.html?id=${row.iuran_id}" target="newtab" class="badge bg-primary-subtle text-danger px-2 py-1 rounded text-decoration-none small fw-bold">
                                <i class="bi bi-eye"></i> KUITANSI
                            </a>
                            <a href="${cleanEndpoint}//surat_keterangan_anggota.html?id=${row.id_anggota}&amp;id_iuran=${row.iuran_id}" target="newtab" class="badge bg-primary-subtle text-danger px-2 py-1 rounded text-decoration-none small fw-bold">
                                <i class="bi bi-eye"></i> SKA
                            </a>
                        </td>
                    </tr>
                `;
            }
         resultArea.innerHTML = `<div class="container">
             <div class="row p-1 mb-2  bg-light rounded-4 px-3">
            <div class="col-md-7 col-sm-12">
            <span class="text-muted small fw-bold">
                <i class="bi bi-clock-history me-1 text-success"></i> MANAJEMEN VERIFIKASI KAS IURAN ANGGOTA
            </span>
            </div>
                <div class="col-md-5 col-sm-12">
                    <div class="input-group shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-end-0 text-muted small"><i class="bi bi-search"></i></span>
                        <input type="text" id="inputCariAntreanIuranAnggota" class="form-control form-control-sm border-start-0 ps-1 font-sans small" 
                               placeholder="Cari nama dokter, nomor STR, atau kata kunci berkas..." 
                               oninput="window.eksekusiLiveSearchTabelAntreaniuran(this.value)" onblur="window.eksekusiLiveSearchTabelAntreaniuran(this.value)" onfocus="window.eksekusiLiveSearchTabelAntreaniuran(this.value)">
                    </div>
                </div>
            </div></div>
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">
        <div class="table-responsive" style="min-height: 280px; overflow-x: auto; overflow-y: visible;">
            <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                <thead class="table-dark text-uppercase font-monospace" style="font-size:0.75rem; letter-spacing:0.5px;">
                    <tr>
                        <th width="3%" class="text-center">No</th>
                        <th width="8%" class="text-center">ID Trans</th>
                        <th width="12%">Nama Anggota Dokter</th>
                        <th width="10%">No Telepon</th>
                        <th width="11%">Periode Wajib</th>
                        <th width="11%" class="text-end">Jumlah Kas</th>
                        <th width="8%" class="text-center">Status</th>
                        <th width="14%" class="text-center">Keterangan</th>
                        <th width="9%" class="text-center">Struk Berkas</th>
                        <th width="14%" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                ${tableRowsHtml}
                </tbody>
            </table>
        </div>
    </div>`;
    }
}) 
.catch(err => {
    resultArea.innerHTML = `<div class="alert alert-danger p-3 small"><i class="bi bi-wifi-off me-1"></i> Terjadi kegagalan komunikasi data antrean ke server.</div>`;
});
}

window.eksekusiLiveSearchTabelAntreaniuran = function(keywordText) {
    const kataKunci = keywordText.toLowerCase().trim();

    const daftarBarisTabel = document.querySelectorAll("#tempatTabelJurnalLoss tbody tr, #mysqlAntreanTableArea tbody tr, table tbody tr");

    if (daftarBarisTabel.length === 0) return;

    daftarBarisTabel.forEach(tr => {

        if (tr.id === "rowTotalLossJurnalBawah" || tr.classList.contains("table-info")) return;
        const isiTeksBaris = tr.textContent.toLowerCase();
        if (kataKunci === "" || isiTeksBaris.includes(kataKunci)) {
            tr.style.display = ""; 
        } else {
            tr.style.display = "none"; 
        }
    });
};

window.bukaFormAlasanPendingIuranModal3 = function(idIuran, idAnggota) {
    if (!idIuran) return;

    const htmlFormAlasan = `
        <div class="container py-2" id="formAlasanPendingIuranWrapper">
            <form id="formSubmitAlasanPendingIuran" class="p-1">
                <input type="hidden" id="pendingIdIuran" value="${idIuran}">
                <input type="hidden" id="pendingIdAnggota" value="${idAnggota}">
                
                <div class="mb-3">
                    <label class="form-label fw-bold text-danger small">
                        <i class="bi bi-chat-left-dots-fill me-1"></i> Alasan Transaksi Di-Pending / Ditolak
                    </label>
                    <p class="text-muted" style="font-size: 0.75rem;">Tuliskan alasan penangguhan berkas struk iuran ini secara spesifik agar dapat dibaca dan diperbaiki oleh anggota dokter terkait.</p>
                    <textarea class="form-control font-monospace" id="teksAlasanPendingIuran" rows="4" 
                              placeholder="Contoh: Nominal transfer kurang Rp 50.000, atau Bukti transfer blur / tidak terbaca..." required></textarea>
                </div>
                
                <div class="text-end border-top pt-3 mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-3 me-2" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">Batal</button>
                    <button type="submit" class="btn btn-sm btn-danger px-4 fw-bold shadow-sm" id="btnSubmitPendingIuran">
                        <i class="bi bi-exclamation-triangle-fill me-1"></i> Kirim & Set Pending
                    </button>
                </div>
            </form>
        </div>
    `;

    // Bentangkan Formulir Isian ke dalam Jendela Komponen Modal 3 (fsDialog) Bawaan Aplikasi
    if (typeof modal3 === "function") {
        modal3('Catatan Koreksi', htmlFormAlasan);
    } else {
        alert("Fungsi global modal3() tidak terdeteksi di memori aplikasi.");
        return;
    }

    // Listener Interaksi Submit Form Alasan
    const formAlasan = document.getElementById("formSubmitAlasanPendingIuran");
    formAlasan.addEventListener("submit", function(e) {
        e.preventDefault();

        const btnSubmit = document.getElementById("btnSubmitPendingIuran");
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Mengirim...`;
        }

        const idIuranActive = document.getElementById("pendingIdIuran").value;
        const idAnggotaActive = document.getElementById("pendingIdAnggota").value;
        const teksAlasan = document.getElementById("teksAlasanPendingIuran").value.trim();

        // Siapkan form data kiriman multifungsi ke backend
        const payload = new FormData();
        payload.append("id_iuran", idIuranActive);
        payload.append("id_anggota", idAnggotaActive);
        payload.append("status_target", "PENDING");
        payload.append("alasan_pending", teksAlasan);

        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
        const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

        fetch(`${cleanEndpoint}/proses.php?aksi=update_status_verifikasi_iuran`, {
            method: "POST",
            body: payload
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Tutup Modal 3 (Dialog Native HTML5)
                const dialog3 = document.getElementById("fsDialog");
                if (dialog3 && typeof dialog3.close === "function") {
                    dialog3.close();
                }
                
                // Segarkan linimasa riwayat iuran modal hulu
                if (typeof window.eksekusiFetchIuranMurni === "function") {
                    window.eksekusiFetchIuranMurni(telponDokterContext);
                }
            } else {
                window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal mengirim alasan pending iuran:", err);
            alert("Gangguan koneksi ke secure server database.");
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> Kirim & Set Pending`;
            }
        });
    });
};

window.eksekusiUbahStatusIuranAdminMurni = function(idIuran, idAnggota, statusBaru) {
    if (!idIuran) return;

    let pesanKonfirmasi = `Apakah Anda yakin ingin MENGESAHKAN LUNAS transaksi iuran ID #${idIuran}?`;
    if (statusBaru === 'PENDING') {
        pesanKonfirmasi = `Apakah Anda yakin ingin mengubah status transaksi iuran ID #${idIuran} menjadi PENDING (Butuh Koreksi)?`;
    }

    if (!confirm(pesanKonfirmasi)) return;

    // Menyiapkan parameter form data kiriman
    const payload = new FormData();
    payload.append("id_iuran", idIuran);
    payload.append("id_anggota", idAnggota);
    payload.append("status_target", statusBaru);

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const telponDokterContext = localStorage.getItem("idi_user_whatsapp") || "";

    fetch(`${cleanEndpoint}/proses.php?aksi=update_status_verifikasi_iuran`, {
        method: "POST",
        body: payload
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            // Refresh atau muat ulang tabel iuran secara otomatis setelah status berhasil berubah di MySQL
                tutupModalTerbuka();
                initAdmin();
                setTimeout(() => {
menuIuranAdmin()
}, 500);
                
        }
        else
        {
        window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal memperbarui status verifikasi iuran:", err);
        alert("Gagal terhubung dengan peladen proses.php. Periksa koneksi jaringan server Apache Anda.");
    });
};

window.eksekusiSahkanIuranLunasLatarBelakang = function(idIuranTarget,idAnggota) {
    if (!confirm(`Apakah Anda yakin ingin menyetujui dan mengesahkan transaksi ID #${idIuranTarget} menjadi LUNAS?`)) return;

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const payloadApprove = new FormData();
    payloadApprove.append("id", idIuranTarget);
    payloadApprove.append("idAnggota", idAnggota);
	
    fetch(`${cleanEndpoint}/proses.php?aksi=eksekusi_approval_lunas`, {
        method: "POST",
        body: payloadApprove // Sudah sinkron mengirimkan payloadApprove
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            // Segarkan data antrean di dalam modal secara instan
            window.loadDataAntreanIuranMySQL();
        }
        else
        {
            window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal otorisasi kas:", err);
        alert("Gagal berkomunikasi dengan proses.php");
    });
};


window.rekomendasi = function(kategori) {
const uckat=kategori.charAt(0).toUpperCase() + kategori.slice(1);
let kategorix=kategori.toUpperCase();
    const htmlAntreanMutasi = `
        <div class="container py-2" id="antrean${uckat}AdminWrapper">
            <!-- BANNER INFO REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                <i class="bi bi-shield-lock-fill text-warning fs-3"></i>
                <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; color: #ffc107;">Panel ${uckat}</span>
                        <span class="small text-white-50">Memproses antrean berkas pemohon berstatus: <b class="text-info">Verifikasi Admin</b>, <b class="text-warning">Pending</b>, dan <b class="text-danger">Ditolak</b>.</span>
                    </div>
                    <button type="button" class="btn btn-xs btn-primary font-monospace small" style="font-size:0.7rem;" onclick="window.loadDataAntreanMutasiValidAdminMySQL('${kategori}')">
                        <i class="bi bi-arrow-clockwise me-1"></i>View Valid
                    </button>
					<button type="button" class="btn btn-xs btn-outline-light font-monospace small" style="font-size:0.7rem;" onclick="window.loadDataAntreanMutasiAdminMySQL('${kategori}')">
                        <i class="bi bi-arrow-clockwise me-1"></i>Refresh Live
                    </button>
                </div>
            </div>
            <!-- 💡 BARIS TAMBAHAN BARU: PANEL LIVE SEARCH KATA KUNCI -->
            <div class="row p-1 mb-4  bg-light rounded-4 px-3">
            <div class="col-md-7 col-sm-12">
            <span class="text-muted small fw-bold">
                <i class="bi bi-clock-history me-1 text-success"></i> MANAJEMEN VERIFIKASI ${kategorix}
            </span>
            </div>
                <div class="col-md-5 col-sm-12">
                    <div class="input-group shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-end-0 text-muted small"><i class="bi bi-search"></i></span>
                        <input type="text" id="inputCariAntreanMutasiRekomendasi" class="form-control form-control-sm border-start-0 ps-1 font-sans small" 
                               placeholder="Cari nama dokter, nomor STR, atau kata kunci berkas..." 
                               oninput="window.eksekusiLiveSearchTabelAntreanRekomendasi(this.value)" onblur="window.eksekusiLiveSearchTabelAntreanRekomendasi(this.value)" onfocus="window.eksekusiLiveSearchTabelAntreanRekomendasi(this.value)">
                    </div>
                </div>
            </div> 
            
            <!-- KANVAS DINAMIS TABEL AJAX -->
            <div id="mysqlAntrean${uckat}TableArea" class="animate-fade-in pb-5" style="overflow: auto; min-height: 250px;">
                <div class="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                    <p class="small mb-0 font-monospace text-secondary">Sedang memindai antrean ${kategori} aktif</p>
                </div>
            </div>
        </div>
    `;
    

 
    if (typeof modal2 === "function") {
        modal2('Verifikasi '+uckat, htmlAntreanMutasi);
    } else {
        alert("Sistem tidak terdeteksi");
        return;
    }

    // Pemicu otomatis penarik data dari backend proses.php
    window.loadDataAntreanMutasiAdminMySQL(kategori);
};

/**
 * POTONGAN 2: Engine Live-Search Sisi Klien Untuk Memfilter Baris Tabel Rekomendasi
 */
window.eksekusiLiveSearchTabelAntreanRekomendasi = function(keywordText) {
    const kataKunci = keywordText.toLowerCase().trim();

    const daftarBarisTabel = document.querySelectorAll("#tempatTabelJurnalLoss tbody tr, #mysqlAntreanTableArea tbody tr, table tbody tr");

    if (daftarBarisTabel.length === 0) return;

    daftarBarisTabel.forEach(tr => {

        if (tr.id === "rowTotalLossJurnalBawah" || tr.classList.contains("table-info")) return;
        const isiTeksBaris = tr.textContent.toLowerCase();
        if (kataKunci === "" || isiTeksBaris.includes(kataKunci)) {
            tr.style.display = ""; 
        } else {
            tr.style.display = "none"; 
        }
    });
};

window.loadDataAntreanMutasiValidAdminMySQL = function(kategori) {
	const uckat=kategori.charAt(0).toUpperCase() + kategori.slice(1);
    const resultArea = document.getElementById("mysqlAntrean"+uckat+"TableArea");
    if (!resultArea) return;

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_antrean_${kategori}_valid_admin`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const listData = res.data;
            document.getElementById('inputCariAntreanMutasiRekomendasi').focus();
            if (listData.length === 0) {
                resultArea.innerHTML = `
                    <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed my-2 animate-fade-in">
                        <i class="bi bi-folder-check display-5 d-block mb-2 text-success"></i>
                        <h6 class="fw-bold mb-1 text-dark">Antrean Bersih!</h6>
                        <p class="small mb-0 px-3">Tidak ada berkas ${kategori} berstatus Verifikasi Admin, Pending, atau Tolak saat ini.</p>
                    </div>
                `;
                return;
            }

            let tableRowsHtml = "";
            for (let i = 0; i < listData.length; i++) {
                const row = listData[i];
                const tglAjuan = row.waktu ? row.waktu.substring(0, 10) : "-";
                let rotuju="";
                if(kategori==="mutasi" || kategori==="log")
				{
				rotuju=row.tujuan;
				}
				if(kategori==="ppds" || kategori==="ppdssub" || kategori==="fellow")
				{
				rotuju=row.jurusan;
				}
                let statusBadge = "";
                const currentStatus = (row.status || "").toUpperCase().trim();
                 statusBadge = `<span class="badge bg-secondary px-2 py-1 rounded small font-monospace">${row.status}</span>`;
                

                // 2. Handler Akses 4 Berkas Dokumen Wajib Menggunakan Modal 2 Lightbox
                const btnPermohonan = row.permohonan ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.permohonan}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'Permohonan','${kategori}')"><i class="bi bi-file-earmark-text"></i> Surat</button>` : `<span class="text-muted text-opacity-50 small"><i>Permohonan</i></span>`;
                const btnIuran = row.iuranidi ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.iuranidi}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'Iuran','${kategori}')"><i class="bi bi-receipt"></i> Iuran</button>` : `<span class="text-muted text-opacity-50 small"><i>Iuran</i></span>`;
                const btnSTR = row.str ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.str}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'STR','${kategori}')"><i class="bi bi-card-heading"></i> STR</button>` : `<span class="text-muted text-opacity-50 small"><i>STR</i></span>`;
                const btnKTP = row.ktp ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.ktp}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'KTP','${kategori}')"><i class="bi bi-person-bounding-box"></i> KTP</button>` : `<span class="text-muted text-opacity-50 small"><i>KTP</i></span>`;
				
let rtuju=""; let almut="";
if(kategori==="mutasi")
{
rtuju=row.tujuan;
almut=row.alasan_mutasi;
}
if(kategori==="log")
{
rtuju=row.tujuan;
almut=row.alasan_log;
}
if(kategori==="ppds" || kategori==="ppdssub" || kategori==="fellow")
{
rtuju=row.jurusan;
almut=row.universitas;
}
                tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${i + 1}</td>
                        <td class="text-center font-monospace small text-secondary">${tglAjuan}</td>
                        <td class="fw-bold text-dark text-uppercase small" style="font-size:0.8rem;" id="idA_${row.id}"  data-id="${row.id}" data-kategori="${kategori}">${row.nama_anggota}</td>
                        <td class="fw-bold text-success small">${rtuju || '-'}</td>
						<td class="fw-bold text-success small">${almut || '-'}</td>
                        <td class="text-center">${statusBadge}</td>
                        <td class="text-center">
                            <div class="d-flex flex-wrap gap-1 justify-content-center">
                                ${btnPermohonan} ${btnIuran} ${btnSTR} ${btnKTP}
                            </div>
                        </td>
                        <td class="text-center">${row.telpon}</td>
                        <td><a href="${cleanEndpoint}/surat_keterangan_${kategori}.html?id=${row.id}" target="newtab" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;">Rekomendasi</a></td>
                        
                    </tr>
                `;
            }
          let kt=""; let ap="";
		  if(kategori==="mutasi")
		  {
			  kt="Kota Tujuan";
			  ap="Alasan Pindah";
		  }
		  if(kategori==="log")
		  {
			  kt="Kota Tujuan";
			  ap="Alasan Log";
		  }
		  if(kategori==="ppds" || kategori==="ppdssub" || kategori==="fellow")
		  {
			  kt="Jurusan/Kepeminatan";
			  ap="Universitas";
		  }
          resultArea.innerHTML = `
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in">
                    <div class="table-responsive" style="min-height: 280px !important; overflow-x: auto !important; overflow-y: visible !important;">
                        <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                            <thead class="table-dark text-uppercase font-monospace" style="font-size:0.72rem; letter-spacing:0.5px;">
                                <tr>
                                    <th width="3%" class="text-center">No</th>
                                    <th width="10%" class="text-center">Tgl Ajuan</th>
                                    <th width="12%">Nama Anggota Dokter</th>
                                    <th width="8%" class="text-center">${kt}</th>
									<th width="30%" class="text-center">${ap}</th>
                                    <th width="8%" class="text-center">Status</th>
                                    <th width="26%" class="text-center">Dokumen Lampiran Google Drive</th>
                                    <th width="9%" class="text-center">WhatsApp</th>
                                    <th width="9%" class="text-center">Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = `<div class="alert alert-danger p-3 small m-2"><i class="bi bi-exclamation-octagon"></i> Gagal memuat data: ${res.message}</div>`;
            setTimeout(() => {
 window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error("Gagal sinkronisasi data rekomendasi:", err);
        resultArea.innerHTML = `<div class="alert alert-danger p-3 small m-2"><i class="bi bi-wifi-off"></i> Koneksi server bermasalah atau token kedaluwarsa.</div>`;
    });
};

window.loadDataAntreanMutasiAdminMySQL = function(kategori) {
	const uckat=kategori.charAt(0).toUpperCase() + kategori.slice(1);
    const resultArea = document.getElementById("mysqlAntrean"+uckat+"TableArea");
    if (!resultArea) return;

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_antrean_${kategori}_admin`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const listData = res.data;

            if (listData.length === 0) {
                resultArea.innerHTML = `
                    <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed my-2 animate-fade-in">
                        <i class="bi bi-folder-check display-5 d-block mb-2 text-success"></i>
                        <h6 class="fw-bold mb-1 text-dark">Antrean Bersih!</h6>
                        <p class="small mb-0 px-3">Tidak ada berkas ${kategori} berstatus Verifikasi Admin, Pending, atau Tolak saat ini.</p>
                    </div>
                `;
                return;
            }

            let tableRowsHtml = "";
            for (let i = 0; i < listData.length; i++) {
                const row = listData[i];
                const tglAjuan = row.waktu ? row.waktu.substring(0, 10) : "-";
                let rotuju="";
                if(kategori==="mutasi" || kategori==="log")
				{
				rotuju=row.tujuan;
				}
				if(kategori==="ppds" || kategori==="ppdssub" || kategori==="fellow")
				{
				rotuju=row.jurusan;
				}
                let statusBadge = "";
				let opsihide="";
                const currentStatus = (row.status || "").toUpperCase().trim();
                if (currentStatus === "MENUNGGU VERIFICATION ADMIN" || currentStatus === "MENUNGGU VERIFIKASI ADMIN") {
                    statusBadge = `<span class="badge bg-info-subtle text-info-emphasis px-2 py-1 rounded small fw-bold border border-info-subtle"><i class="bi bi-hourglass-split me-1"></i>Verifikasi</span>`;
				}
				else if (currentStatus === "PENDING") {
				    
const catatanAlasanAdmin = row.textvalidasi_permohonan 
    ? String(row.textvalidasi_permohonan).replace(/'/g, "\\'").replace(/"/g, '&quot;') 
    : "{}";

                 const namaDokterTarget = row.nama_anggota ? row.nama_anggota.replace(/'/g, "\\'") : "Anggota Dokter";
                 statusBadge = `<a href="#" class="badge bg-warning-subtle text-warning-emphasis px-2 py-1 rounded small fw-bold border border-warning text-decoration-none d-inline-flex align-items-center gap-1 animate-pulse" title="Klik untuk meninjau detail catatan pending berkas dokter ini" onclick="event.preventDefault(); window.bukaModal3LihatDetailPendingAdminDirect('${catatanAlasanAdmin}', '${rotuju}', '${namaDokterTarget}', '${row.id}','${kategori}')"><i class="bi bi-exclamation-circle-fill"></i> Pending (Cek Detail)</a>`; }
                 else if (currentStatus === "TOLAK") {
				 statusBadge = `<span class="badge bg-danger-subtle text-danger px-2 py-1 rounded small fw-bold"><i class="bi bi-x-circle-fill me-1"></i>Ditolak</span>`; 
				 opsihide="d-none";
				 }
				 else if (currentStatus === "DRAFT") {
                    statusBadge = `<span class="badge bg-secondary px-2 py-1 rounded small font-monospace"><i class="bi-journal-text me-1"></i>Draft</span>`;
					opsihide="d-none";
                } else {
                    statusBadge = `<span class="badge bg-secondary px-2 py-1 rounded small font-monospace">${row.status}</span>`;
                }

                // 2. Handler Akses 4 Berkas Dokumen Wajib Menggunakan Modal 2 Lightbox
                const btnPermohonan = row.permohonan ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.permohonan}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'Permohonan','${kategori}')"><i class="bi bi-file-earmark-text"></i> Surat</button>` : `<span class="text-muted text-opacity-50 small"><i>Permohonan</i></span>`;
                const btnIuran = row.iuranidi ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.iuranidi}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'Iuran','${kategori}')"><i class="bi bi-receipt"></i> Iuran</button>` : `<span class="text-muted text-opacity-50 small"><i>Iuran</i></span>`;
                const btnSTR = row.str ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.str}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'STR','${kategori}')"><i class="bi bi-card-heading"></i> STR</button>` : `<span class="text-muted text-opacity-50 small"><i>STR</i></span>`;
                const btnKTP = row.ktp ? `<button type="button" class="btn btn-xs btn-outline-dark px-1 py-0 rounded font-monospace" style="font-size:0.65rem;" onclick="window.bukaPratinjauBuktiBayarModal2Direct('${row.ktp}', '${row.nama_anggota.replace(/'/g, "\\\\'")}', 'KTP','${kategori}')"><i class="bi bi-person-bounding-box"></i> KTP</button>` : `<span class="text-muted text-opacity-50 small"><i>KTP</i></span>`;
				
let rtuju=""; let almut="";
if(kategori==="mutasi")
{
rtuju=row.tujuan;
almut=row.alasan_mutasi;
}
if(kategori==="log")
{
rtuju=row.tujuan;
almut=row.alasan_log;
}
if(kategori==="ppds" || kategori==="ppdssub" || kategori==="fellow")
{
rtuju=row.jurusan;
almut=row.universitas;
}

const jsonMentahAman = row.textvalidasi_permohonan 
    ? String(row.textvalidasi_permohonan).replace(/'/g, "\\'").replace(/"/g, '&quot;') 
    : "{}";
    
                tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${i + 1}</td>
                        <td class="text-center font-monospace small text-secondary">${tglAjuan}</td>
                        <td class="fw-bold text-dark text-uppercase small idB" style="font-size:0.8rem;"  data-id="${row.id}" data-kategori="${kategori}" data-permohonan="${row.permohonan}" data-iuran="${row.iuranidi}" data-str="${row.str}" data-ktp="${row.ktp}" data-pending="${jsonMentahAman}">${row.nama_anggota}</td>
                        <td class="fw-bold text-success small text-center">${rtuju || '-'}</td>
						<td class="fw-bold text-success small text-center">${almut || '-'}</td>
                        <td class="text-center">${statusBadge}</td>
                        <td class="text-center">
                            <div class="d-flex flex-wrap gap-1 justify-content-center">
                                ${btnPermohonan} ${btnIuran} ${btnSTR} ${btnKTP}
                            </div>
                        </td>
                        <td class="text-center">
                            <!-- ACTION DROPDOWN APPROVAL -->
                            <div class="dropdown d-inline-block">
                                <button class="btn btn-xs btn-success fw-bold dropdown-toggle px-2" type="button" data-bs-toggle="dropdown" data-bs-boundary="window"  aria-expanded="false" style="font-size:0.6rem;">
                                    <i class="bi bi-pencil-square"></i> Aksi
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end shadow border-0 font-monospace small" style="font-size:0.75rem;">
    <li><a class="dropdown-item text-success fw-bold p-2 d-block text-decoration-none ${opsihide}" href="#" onclick="event.preventDefault(); window.eksekusiMutasiStatusAdminOtoritas(${row.id}, 'VALID','${kategori}')"><i class="bi bi-check-circle-fill me-1"></i> Sahkan (VALID)</a></li>
    <li><a class="dropdown-item text-warning fw-bold p-2 d-block text-decoration-none ${opsihide}" href="#" onclick="event.preventDefault(); window.bukaFormAlasanPendingModal3Direct(${row.id}, '${row.nama_anggota.replace(/'/g, "\\\\'")}','${kategori}')"><i class="bi bi-exclamation-circle-fill me-1"></i> Tangguhkan (PENDING)</a></li>
    
    <li><a class="dropdown-item text-danger fw-bold p-2 d-block text-decoration-none ${opsihide}" href="#" onclick="event.preventDefault(); window.eksekusiMutasiStatusAdminOtoritas(${row.id}, 'TOLAK','${kategori}')"><i class="bi bi-x-circle-fill me-1"></i> Tolak</a></li>
	<li><a class="dropdown-item text-danger fw-bold p-2 d-block text-decoration-none" href="#" onclick="event.preventDefault(); window.eksekusiHapusDrafMutasiMySQL(${row.id}, '${rtuju}','${kategori}','admin')"><i class="bi bi-trash3-fill me-1"></i> Hapus</a></li>
	<li><a class="dropdown-item text-danger fw-bold p-2 d-block text-decoration-none" href="#" onclick="event.preventDefault();window.bukaModal3KirimPesanWhatsappDirect(${row.id}, '${row.nama_anggota.replace(/'/g, "\\\\'")}', '${row.telpon}', '${kategori}')""><i class="bi bi-whatsapp text-success me-1"></i> Kirim Pesan</a></li>
	<li><a class="dropdown-item text-danger fw-bold p-2 d-block text-decoration-none" href="#" onclick="event.preventDefault();window.bukaModal3lihatdrive(${row.iduser})"><i class="bi bi-cloud-arrow-up" me-1"></i> Lihat Drive</a></li>
</ul>
                            </div>
                        </td>
                        <td><button class="btn btn-xs btn-warning fw-bold px-2" type="button"  style="font-size:0.6rem;" onclick="window.bukaManajerIuranAnggotaDinamisx('${row.telpon}','${row.nama_anggota}','${kategori}')">
                                    <i class="bi bi-eye"></i> View
                                </button></td>
                    </tr>
                `;
            }
          let kt=""; let ap="";
		  if(kategori==="mutasi")
		  {
			  kt="Kota Tujuan";
			  ap="Alasan Pindah";
		  }
		  if(kategori==="ppds" || kategori==="ppdssub")
		  {
			  kt="Jurusan/Kepeminatan";
			  ap="Universitas"; 
		  }
          resultArea.innerHTML = `
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in" >
                    <div class="table-responsive" style="min-height: 280px !important; overflow-x: auto !important; overflow-y: visible !important;">
                        <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                            <thead class="table-dark text-uppercase font-monospace" style="font-size:0.72rem; letter-spacing:0.5px;">
                                <tr>
                                    <th width="3%" class="text-center">No</th>
                                    <th width="10%" class="text-center">Tgl Ajuan</th>
                                    <th width="15%">Nama Anggota Dokter</th>
                                    <th width="14%" class="text-center">${kt}</th>
									<th width="10%" class="text-center">${ap}</th>
                                    <th width="13%" class="text-center">Status</th>
                                    <th width="21%" class="text-center">Dokumen Lampiran Google Drive</th>
                                    <th width="7%" class="text-center">Opsi</th>
                                    <th width="7%" class="text-center">Cek Iuran</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = `<div class="alert alert-danger p-3 small m-2"><i class="bi bi-exclamation-octagon"></i> Gagal memuat data: ${res.message}</div>`;
            setTimeout(() => {
  window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error("Gagal sinkronisasi data rekomendasi:", err);
        resultArea.innerHTML = `<div class="alert alert-danger p-3 small m-2"><i class="bi bi-wifi-off"></i> Koneksi server bermasalah atau token kedaluwarsa.</div>`;
    });
};

/**
 * Modul Anggota: Cek Tautan Direktori Google Drive (Mode Read-Only / Cek Saja)
 * POTONGAN 1: Inisialisasi Tampilan Pengecekan & Statement Kondisional di Modal 3
 */
window.bukaModal3lihatdrive = function(no_anggota) {
    if (typeof modal3 !== "function") return;
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Gelar jendela loading sementara di layar depan (Modal 3)
    modal3('Google Drive', `
        <div class="container py-2 text-start" id="containerLihatDriveUserModal3">
            <div class="text-center py-5 text-muted">
                <div class="spinner-border text-primary mb-2" role="status"></div>
                <p class="small font-monospace">Memeriksa eksistensi folder awan anggota...</p>
            </div>
        </div>
    `);

    // Tarik data ketersediaan kode folder drive dari database MySQL via proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=cek_folder_drive_anggota&no_anggota=${no_anggota}`)
    .then(res => res.json())
    .then(res => {
        const wrapper = document.getElementById("containerLihatDriveUserModal3");
        if (!wrapper) return;

        if (res.status === 'success') {
            const dataAnggota = res.data;
            const kodeFolder = (dataAnggota.folder || "").trim();

            wrapper.className = "container py-1 text-start animate-fade-in";

            // 💡 LOGIKA CEK KAKU: Memeriksa apakah kolom folder_drive terisi atau kosong
            if (kodeFolder !== "" && kodeFolder !== "-" && kodeFolder !== "null") {
                // Skenario A: Jika folder Google Drive DITEMUKAN
                const urlGoogleDriveResmi = `https://drive.google.com/drive/folders/${kodeFolder}`;
                
                wrapper.innerHTML = `
                    <div class="card bg-success-subtle border-0 p-3 rounded-4 mb-3 shadow-sm">
                        <div class="d-flex align-items-center gap-3">
                            <span class="fs-2">📂</span>
                            <div>
                                <h6 class="fw-bold text-success-emphasis mb-0">Folder Drive Ditemukan</h6>
                                <span class="small text-muted">Anggota atas nama: <b class="text-dark">${dataAnggota.nama}</b></span>
                            </div>
                        </div>
                    </div>

                    <p class="small text-muted mb-3">Tautan penyimpanan digital telah terkonfigurasi secara resmi pada basis data kesekretariatan IDI Batam.</p>

                    <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                        <button type="button" class="btn btn-sm btn-dark rounded-pill px-4" onclick="this.closest('dialog').close();">Tutup</button>
                        <!-- Tombol Buka Tab Baru Menuju Google Drive -->
                        <a href="${urlGoogleDriveResmi}" target="_blank" class="btn btn-sm btn-success px-4 fw-bold rounded-pill shadow-sm d-inline-flex align-items-center gap-1.5">
                            👁️ Lihat Isi Folder Drive
                        </a>
                    </div>
                `;
            } else {
                // Skenario B: 💡 STATEMENT TEGAS JIKA BELUM MEMBUAT FOLDER
                wrapper.innerHTML = `
                    <div class="card bg-danger-subtle border-0 p-3 rounded-4 mb-3 shadow-sm">
                        <div class="d-flex align-items-center gap-3">
                            <span class="fs-2">⚠️</span>
                            <div>
                                <h6 class="fw-bold text-danger-emphasis mb-0">Belum Membuat Folder</h6>
                                <span class="small text-muted">Anggota atas nama: <b class="text-dark">${dataAnggota.nama}</b></span>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 bg-light rounded-4 border text-center my-3 text-muted font-monospace" style="font-size: 0.82rem;">
                        [ Keterangan: Anggota bersangkutan belum membuat / mendaftarkan kode folder Google Drive resmi ke dalam sistem. ]
                    </div>

                    <div class="d-flex justify-content-end pt-3 border-top mt-4">
                        <button type="button" class="btn btn-sm btn-danger rounded-pill px-4 fw-bold" onclick="this.closest('dialog').close();">
                            Kembali
                        </button>
                    </div>
                `;
            }
        } else {
            wrapper.innerHTML = `<div class="alert alert-danger small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("containerLihatDriveUserModal3").innerHTML = `<div class="alert alert-danger small text-center m-2">Gagal terhubung ke peladen database.</div>`;
    });
};

window.bukaModal3KirimPesanWhatsappDirect = function(idRow, namaDokter, nomorWA, kategori) {
    if (!nomorWA || nomorWA.trim() === "" || nomorWA === "null") {
        alert("Gagal memproses: Nomor WhatsApp anggota dokter ini tidak ditemukan di database!");
        return;
    }

    const uckat = kategori.toUpperCase();
    
    // 1. Definisikan 3 Opsi Kumpulan Teks Pesan Baku Resmi IDI Batam
    const pesanBaku3= `Yth. dr. ${namaDokter},\n\nSehubungan dengan pengajuan Rekomendasi ${uckat} Anda di sistem IDI Batam. Silahkan lengkapi syarat dan buat pengajuan, jika dalam 1 minggu belum ada respon, berkas permohonan anda akan kami hapus, silakan buat pengajuan ulang.\n\nTerima Kasih,\nSekretariat IDI Cabang Batam`;
    const pesanBaku2 = `Yth. dr. ${namaDokter},\n\nBerkas permohonan Rekomendasi ${uckat} Anda masih berstatus PENDING/TANGGUH karena dokumen pendukung belum lengkap atau buram. Mohon segera login ke dasbor IDI Batam dan periksa catatan koreksi admin.\n\nTerima Kasih,\nSekretariat IDI Cabang Batam`;
    const pesanBaku1 = `Yth. dr. ${namaDokter},\n\nKabar baik, permohonan pengajuan Rekomendasi ${uckat} Anda sudah selesai di verifikasi oleh tim pengurus dan dinyatakan VALID. Silakan login ke akun dasbor Anda pada situs https://idi-batam.com untuk langsung mengunduh dan mencetak dokumen resmi Anda.\n\nTerima Kasih,\nSekretariat IDI Cabang Batam`;

    // 2. Normalisasi Format Nomor Handphone ke Kode Negara Internasional (+62)
    let waMurni = nomorWA.replace(/\s/g, "");
    if (waMurni.startsWith("0")) {
        waMurni = "62" + waMurni.substring(1);
    } else if (waMurni.startsWith("+")) {
        waMurni = waMurni.substring(1);
    } else if (!waMurni.startsWith("62")) {
        waMurni = "62" + waMurni;
    }

    // 3. Susun Tampilan Antarmuka Dokumen Pilihan di Modal 3
    const htmlFormPesan = `
        <div class="container py-2" id="kirimPesanWaWrapper">
            <div class="mb-3 bg-light p-3 rounded-4 border">
                <label class="form-label fw-bold text-success small mb-2">
                    <i class="bi bi-chat-square-quote-fill me-1"></i> Pilih Templat Pesan Resmi (Otomatis Generate Link)
                </label>
                
                <div class="form-check p-3 border rounded-3 bg-white mb-2 shadow-sm border-danger bg-danger bg-opacity-10">
                    <input class="form-check-input ms-0 me-2" type="radio" name="pilihanTeksWa" id="waOpt3" value="${encodeURIComponent(pesanBaku3)}" data-phone="${waMurni}" onchange="window.hitungUlangTautanHrefLinkWaMurni()">
                    <label class="form-check-label small text-dark fw-semibold" for="waOpt3" style="cursor:pointer; display: block; padding-left: 20px;">
                        <span class="badge bg-danger text-white mb-2 font-monospace"><i class="bi bi-patch-check-fill me-1"></i> Pemberitahuan Batas Waktu 1 Minggu</span>
                        <p class="mb-0 font-sans text-muted bg-white p-2 rounded border" style="white-space: pre-line; line-height:1.4;">${pesanBaku3}</p>
                    </label>
                </div>

                <div class="form-check p-3 border rounded-3 bg-white mb-2 shadow-sm">
                    <input class="form-check-input ms-0 me-2" type="radio" name="pilihanTeksWa" id="waOpt1" value="${encodeURIComponent(pesanBaku1)}" data-phone="${waMurni}" onchange="window.hitungUlangTautanHrefLinkWaMurni()">
                    <label class="form-check-label small text-dark fw-semibold" for="waOpt1" style="cursor:pointer; display: block; padding-left: 20px;">
                        <span class="badge bg-success-subtle text-success mb-2 font-monospace"><i class="bi bi-patch-check-fill me-1"></i>  Pengajuan Selesai & Valid</span>
                        <p class="mb-0 font-sans text-muted bg-light p-2 rounded border" style="white-space: pre-line; line-height:1.4;">${pesanBaku1}</p>
                    </label>
                </div>

                <!-- OPSI 3: BERKAS PENDING -->
                <div class="form-check p-3 border rounded-3 bg-white mb-0 shadow-sm">
                    <input class="form-check-input ms-0 me-2" type="radio" name="pilihanTeksWa" id="waOpt2" value="${encodeURIComponent(pesanBaku2)}" data-phone="${waMurni}" onchange="window.hitungUlangTautanHrefLinkWaMurni()">
                    <label class="form-check-label small text-dark fw-semibold" for="waOpt2" style="cursor:pointer; display: block; padding-left: 20px;">
                        <span class="badge bg-warning-subtle text-warning-emphasis mb-2 font-monospace">Pengingat Berkas Pending</span>
                        <p class="mb-0 font-sans text-muted bg-light p-2 rounded border" style="white-space: pre-line; line-height:1.4;">${pesanBaku2}</p>
                    </label>
                </div>
            </div>

            <!-- 4. 🔥 AREA UTAMA: href target="_blank" Murni tanpa window.open -->
            <div class="text-end border-top pt-3 mt-4">
                <button type="button" class="btn btn-sm btn-dark rounded-pill px-4 me-2" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">Batal</button>
                <a href="#" target="_blank" class="btn btn-sm btn-success px-4 fw-bold shadow-sm d-inline-flex align-items-center gap-1" id="btnRedirectWaEngineLinkNative" onclick="setTimeout(() => { const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close(); }, 500);">
                    <i class="bi bi-whatsapp"></i> Buka WhatsApp & Kirim
                </a>
            </div>
        </div>
    `;

    // Bentangkan kerangka pilihan ke dalam Modal 3
    if (typeof modal3 === "function") {
        modal3(`Kirim Pesan: ${namaDokter}`, htmlFormPesan);
        
        // Jalankan kalkulasi suntikan tautan pertama kali saat form terbuka lebar
        window.hitungUlangTautanHrefLinkWaMurni();
    } else {
        alert("Fungsi penampil modal3v tidak ditemukan di dalam sistem DOM global.");
    }
};

/**
 * Utility Engine: Menghitung & Mengubah Atribut href secara Real-Time Saat Radio Button Dipilih
 */
window.hitungUlangTautanHrefLinkWaMurni = function() {
    const radioAktif = document.querySelector('input[name="pilihanTeksWa"]:checked');
    const komponenLinkA = document.getElementById("btnRedirectWaEngineLinkNative");
    
    if (radioAktif && komponenLinkA) {
        const phone = radioAktif.getAttribute("data-phone");
        
        // Mengambil teks asli yang sudah di-decode satu kali untuk mencegah penumpukan enkripsi (%2520)
        const rawMessage = decodeURIComponent(radioAktif.value);
        
        // Enkripsi ulang secara bersih murni satu kali saja
        const cleanMessageEncoded = encodeURIComponent(rawMessage);
        
        // 🔒 KUNCI UTAMA: Menggunakan format resmi global https://whatsapp.com
        komponenLinkA.href = `https://api.whatsapp.com/send/?phone=${phone}&text=${cleanMessageEncoded}`;
        
        console.log("[WhatsApp URL Generator] Tautan sukses dikompilasi murni:", komponenLinkA.href);
    }
};
 

window.bukaManajerIuranAnggotaDinamisx = function(nomorTelponAnggota,namaAnggota,kategori) 
{
  
    if (!nomorTelponAnggota || nomorTelponAnggota.trim() === "" || nomorTelponAnggota === "null") {
        alert("Gagal memproses: Nomor telepon/WhatsApp anggota ini kosong atau tidak valid!");
        return;
    }
     const telponSteril = nomorTelponAnggota.replace(/\s/g, "");

    // 2. Tutup dialog atau modal data induk yang sedang terbuka agar layar bersih
    if (typeof window.tutupModalTerbuka === "function") {
        window.tutupModalTerbuka();
    }
     if (typeof window.menuIuran === "function") {
         
        window.menuIuran();
      setTimeout(function() {
            window.eksekusiFetchIuranMurni(telponSteril);
			document.getElementById('namapemilikiuran').innerHTML=`<h5 class="fw-bold text-success mb-1"><i class="bi bi-person-badge-fill me-1"></i> Halo, ${namaAnggota}</h5>
                                <p class="text-muted small mb-0 font-monospace">Histori rincian mutasi kas iuran wajib Anda yang terdaftar pada nomor +62 ${nomorTelponAnggota}</p>
                            </div>`;
        }, 350);
		document.getElementById('btnadmin').innerHTML=`<button class="btn btn-sm btn-warning" onclick="backtomemberrekom('${kategori}')" style="font-size:10px">Back to Rekom ${kategori}</button>`
     } else {
        console.error("Fungsi global 'window.menuIuran' tidak terdaftar di sistem DOM.");
    }
}

window.backtomemberrekom=function(kategori)
{
window.tutupModalTerbuka();
setTimeout(function() {
initAdmin();
}, 350);
setTimeout(function() {
document.getElementById('btnadmin').innerHTML='';
rekomendasi(kategori)
}, 700);
}

window.eksekusiMutasiStatusAdminOtoritas = function(idMutasi, statusBaruTeks, kategori) {
	const uckat=kategori.charAt(0).toUpperCase() + kategori.slice(1);
    if (!confirm(`Apakah Anda yakin ingin mengubah status ${kategori} ID #${idMutasi} menjadi ${statusBaruTeks}?`)) return;

    const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
    const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

    // Ã°Å¸â€™Â¡ REVISI FIX 1: Gunakan satu nama penampung variabel FormData yang konsisten
    const payloadStatus = new FormData();
    payloadStatus.append("id", idMutasi); 
    payloadStatus.append("status", statusBaruTeks);

    // Ã¢Å¡Â¡ FIX CONCATENATE: Memasang backtick (`) pembungkus string URL fetch secara valid
    fetch(`${cleanEndpoint}/proses.php?aksi=update_status_${kategori}_admin`, {
        method: "POST",
        body: payloadStatus // Sudah sinkron mengirimkan payloadStatus
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status " + res.status);
        return res.json();
    })
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            // Segarkan data tabel antrean mutasi di layar secara live & real-time
            if (typeof window.loadDataAntreanMutasiAdminMySQL === "function") {
                window.loadDataAntreanMutasiAdminMySQL(kategori); 
            }
        }
        else
        {
            window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal mengubah otoritas status "+kategori+":", err);
        alert("Gagal berkomunikasi dengan sistim. Periksa koneksi jaringan Anda.");
    });
};

/**
 * Modul Otorisasi: Form Entri Multi-Alasan Pending Terstruktur Berbasis JSON
 * BYPASS SOLUTION: Mengambil data langsung dari atribut DOM HTML untuk menghindari escape string rusak
 */
window.bukaFormAlasanPendingModal3Direct = function(idMutasiTarget, namaDokterPemohon, kategori) {
    const uckat = kategori.charAt(0).toUpperCase() + kategori.slice(1);

    // 1. Inisialisasi awal variabel penampung teks kosong default untuk 4 kategori
    let alasanPermohonan = "";
    let alasanIuran = "";
    let alasanStr = "";
    let alasanKtp = "";

    // 💡 LIVE DOM SCANNER: Cari baris data-id yang cocok di dalam tabel utama Anda
    // Mencari elemen td yang memiliki data-id sama dengan idMutasiTarget
    const targetElementTd = document.querySelector(`td[data-id="${idMutasiTarget}"]`);
    let stringJsonMentah = "";

    if (targetElementTd) {
        // Ambil data pending yang tersimpan bersih di dalam memory atribut HTML asli
        stringJsonMentah = targetElementTd.getAttribute("data-pending") || "";
    }

    // 💡 PARSER LOGIC ENGINE: Bongkar string JSON bersih
    try {
        if (stringJsonMentah && stringJsonMentah !== "" && stringJsonMentah !== "null" && stringJsonMentah !== "-") {
            
            // Konversi teks string murni menjadi objek JavaScript
            const objekJson = JSON.parse(stringJsonMentah);
            
            if (objekJson) {
                // Masukkan teks hasil urai secara rapi ke masing-masing bidang input text
                alasanPermohonan = objekJson.Permohonan || "";
                alasanIuran      = objekJson.Iuran || "";
                alasanStr        = objekJson.Str || "";
                alasanKtp        = objekJson.Ktp || "";
            }
        }
    } catch (errParse) {
        console.error("Gagal membaca struktur biner data-pending via DOM:", errParse);
        
        // PENGAMAN KEDUA (Recursive Fallback): Jika data terbungkus string dua kali
        try {
            const objekJsonS2 = JSON.parse(JSON.parse(stringJsonMentah));
            alasanPermohonan = objekJsonS2.Permohonan || "";
            alasanIuran      = objekJsonS2.Iuran || "";
            alasanStr        = objekJsonS2.Str || "";
            alasanKtp        = objekJsonS2.Ktp || "";
        } catch(e) {
            alasanPermohonan = stringJsonMentah || "";
        }
    }

    // 2. Gelar tata letak komponen form 4 kolom di dalam Modal 3 dengan nilai bawaan yang DIJAMIN SUDAH TERURAI BERSIH
    const htmlFormAlasanPending = `
        <div class="container py-2" id="alasanPendingWrapper">
            <div class="alert bg-warning-subtle text-warning-emphasis border border-warning-subtle p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill fs-3"></i>
                <div>
                    <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Konfirmasi Penangguhan Berkas Terstruktur</span>
                    <span class="small">Pengajuan berkas milik <b>${namaDokterPemohon}</b> (ID #${idMutasiTarget}) akan ditangguhkan. Sistem otomatis memuat catatan koreksi lama di bawah ini.</span>
                </div>
            </div>

            <form id="formSubmitAlasanPendingMySQL">
                <input type="hidden" id="pendingId${uckat}" value="${idMutasiTarget}">
                
                <div class="row g-3 mb-4">
                    <!-- 1. KATEGORI PERMOHONAN -->
                    <div class="col-12">
                        <label class="form-label fw-bold text-dark small mb-1 d-flex align-items-center gap-1.5">
                            📄 Alasan Kategori Permohonan ${kategori.toLowerCase() === 'permohonan' ? '<span class="badge bg-warning text-dark px-1.5 py-0.5 rounded font-monospace" style="font-size:0.6rem;">ACTIVE</span>' : ''}
                        </label>
                        <input type="text" class="form-control form-control-sm font-sans text-dark fw-semibold" id="inputAlasanPermohonan" value="${alasanPermohonan}" placeholder="Berkas lengkap.">
                    </div>

                    <!-- 2. KATEGORI IURAN -->
                    <div class="col-12">
                        <label class="form-label fw-bold text-dark small mb-1 d-flex align-items-center gap-1.5">
                            💰 Alasan Kategori Iuran ${kategori.toLowerCase() === 'iuran' ? '<span class="badge bg-warning text-dark px-1.5 py-0.5 rounded font-monospace" style="font-size:0.6rem;">ACTIVE</span>' : ''}
                        </label>
                        <input type="text" class="form-control form-control-sm font-sans text-dark fw-semibold" id="inputAlasanIuran" value="${alasanIuran}" placeholder="Berkas lengkap.">
                    </div>

                    <!-- 3. KATEGORI STR -->
                    <div class="col-12">
                        <label class="form-label fw-bold text-dark small mb-1 d-flex align-items-center gap-1.5">
                            🪪 Alasan Kategori STR ${kategori.toLowerCase() === 'str' ? '<span class="badge bg-warning text-dark px-1.5 py-0.5 rounded font-monospace" style="font-size:0.6rem;">ACTIVE</span>' : ''}
                        </label>
                        <input type="text" class="form-control form-control-sm font-sans text-dark fw-semibold" id="inputAlasanStr" value="${alasanStr}" placeholder="Berkas lengkap.">
                    </div>

                    <!-- 4. KATEGORI KTP -->
                    <div class="col-12">
                        <label class="form-label fw-bold text-dark small mb-1 d-flex align-items-center gap-1.5">
                            🆔 Alasan Kategori KTP ${kategori.toLowerCase() === 'ktp' ? '<span class="badge bg-warning text-dark px-1.5 py-0.5 rounded font-monospace" style="font-size:0.6rem;">ACTIVE</span>' : ''}
                        </label>
                        <input type="text" class="form-control form-control-sm font-sans text-dark fw-semibold" id="inputAlasanKtp" value="${alasanKtp}" placeholder="Berkas lengkap.">
                    </div>
                </div>

                <div class="text-end pt-3 border-top mt-4">
                    <button type="submit" class="btn btn-sm btn-warning fw-bold text-dark px-4 shadow-sm rounded-pill" id="btnSubmitSimpanAlasanPending">
                        <i class="bi bi-save2-fill me-1"></i> Perbarui JSON & Set Pending
                    </button>
                </div>
            </form>
        </div>
    `;

    // Bentangkan langsung ke jendela Modal 3 bawaan sistem Anda
    if (typeof modal3 === "function") {
        modal3('Input Alasan' + uckat, htmlFormAlasanPending);
    } else {
        alert("Modul penampil tingkat modal3 tidak terkonfigurasi!");
        return;
    }

    window.inisialisasiSubmitFormKompilerJsonPendingGlobal(idMutasiTarget, kategori, uckat);
};




/**
 * POTONGAN 2 (TERBARU): Handler Serializer Klien - Format Objek JSON Langsung Data Kategori
 */
window.inisialisasiSubmitFormKompilerJsonPendingGlobal = function(idMutasiTarget, kategori, uckat) {
    const formPending = document.getElementById("formSubmitAlasanPendingMySQL");
    if (!formPending) return;

    formPending.addEventListener("submit", function(event) {
        event.preventDefault();

        const btnSimpanPending = document.getElementById("btnSubmitSimpanAlasanPending");
        if (btnSimpanPending) {
            btnSimpanPending.disabled = true;
            btnSimpanPending.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Menyimpan JSON...`;
        }

        // Ambil semua nilai teks dari 4 input bidang secara rapi
        const txtPermohonan = document.getElementById("inputAlasanPermohonan").value.trim();
        const txtIuran      = document.getElementById("inputAlasanIuran").value.trim();
        const txtStr        = document.getElementById("inputAlasanStr").value.trim();
        const txtKtp        = document.getElementById("inputAlasanKtp").value.trim();

        // 💡 BINDING STRUKTUR: Langsung memetakan data kategori kaku murni tanpa bungkus status
        const objekPaketJson = {
            "Permohonan": txtPermohonan,
            "Iuran": txtIuran,
            "Str": txtStr,
            "Ktp": txtKtp
        };

        // Konversi objek menjadi string teks JSON jurnalan tunggal yang padat
        const stringJsonFinal = JSON.stringify(objekPaketJson);

        const payloadPending = new FormData();
        payloadPending.append("id", idMutasiTarget);
        payloadPending.append("status", "PENDING");
        payloadPending.append("textvalidasipermohonan", stringJsonFinal); 

        const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
        const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

        fetch(`${cleanEndpoint}/proses.php?aksi=update_status_${kategori}_admin`, {
            method: "POST",
            body: payloadPending
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error status " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                const dialog3 = document.getElementById("fsDialog");
                if (dialog3 && typeof dialog3.close === "function") {
                    dialog3.close();
                }

                if (typeof window.loadDataAntreanMutasiAdminMySQL === "function") {
                    window.loadDataAntreanMutasiAdminMySQL(kategori);
                }
            } else {
window.location.reload();
            }
        })
        .catch(err => {
            console.error("Gagal melakukan penundaan berkas " + kategori + ":", err);
            alert("Gagal berkomunikasi dengan Sistem. Koneksi database terputus.");
            if (btnSimpanPending) {
                btnSimpanPending.disabled = false;
                btnSimpanPending.innerHTML = `<i class="bi bi-save2-fill me-1"></i> Satukan Jadi JSON & Set Pending`;
            }
        });
    });
};

/**
 * Modul Otorisasi: Pratinjau Detil Berkas Tertangguh Berbasis Objek JSON
 * UPDATE: Mengurai JSON 4 Kategori dengan mempertahankan info Kota Tujuan / Jurusan PPDS
 */
window.bukaModal3LihatDetailPendingAdminDirect = function(teksCatatanKoreksi, kotaTujuanMutasi, namaDokterPemohon, idMutasiTarget, kategori) {
    const uckat = kategori.charAt(0).toUpperCase() + kategori.slice(1);
// Variabel penampung default untuk teks alasan masing-masing kategori dokumen
    let alasanPermohonan = "";
    let alasanIuran = "";
    let alasanStr = "";
    let alasanKtp = "";

    // 💡 PARSER ENGINE: Bongkar string JSON bersih hasil kiriman dari database MySQL
    try {
        if (teksCatatanKoreksi && teksCatatanKoreksi !== "" && teksCatatanKoreksi !== "null" && teksCatatanKoreksi !== "-") {
            const objekJson = JSON.parse(teksCatatanKoreksi);
            
            // Ekstrak data langsung dari struktur key-value murni kaku
            alasanPermohonan = objekJson.Permohonan || "";
            alasanIuran      = objekJson.Iuran || "";
            alasanStr        = objekJson.Str || "";
            alasanKtp        = objekJson.Ktp || "";
        }
    } catch (errParse) {
        console.error("Gagal mengurai biner JSON textvalidasipermohonan:", errParse);
        // Fallback: Jika ternyata isi kolom database masih teks biasa (data lama sebelum migrasi)
        alasanPermohonan = teksCatatanKoreksi || "";
    }

    let cb = "";
    if (kategori === "mutasi") {
        cb = `menuju <b>IDI Cabang ${kotaTujuanMutasi}</b>`;
    }
    if (kategori === "ppds" || kategori === "ppdssub") {
        cb = `mengambil Jurusan <b>${kotaTujuanMutasi}</b>`;
    }

    const htmlDetailPendingModal3 = `
        <div class="container py-2" id="detailPendingAdminModal3Wrapper">
            <div class="row justify-content-center">
                <div class="col-lg-12">
                    
                    <!-- KEPALA INFO NOTIFIKASI -->
                    <div class="alert bg-warning-subtle text-warning-emphasis border border-warning-subtle p-3 rounded-4 mb-4 small d-flex align-items-start gap-3 shadow-sm">
                        <i class="bi bi-exclamation-triangle-fill fs-4 mt-0 text-warning"></i>
                        <div>
                            <span class="small d-block fw-bold text-uppercase text-dark" style="letter-spacing:0.5px;">Log Histori Berkas Ditangguhkan (Pending)</span>
                            <span class="small text-dark-emphasis">Pengajuan ${kategori} ID <b>#M-${idMutasiTarget}</b> atas nama <b>dr. ${namaDokterPemohon}</b> ${cb} ditangguhkan sementara dengan alasan koreksi administrasi terstruktur berikut:</span>
                        </div>
                    </div>

                    <!-- KANVAS PAPAN CATATAN KOREKSI AKTUAL BERBASIS 4 KATEGORI JSON -->
                    <div class="row g-3 mb-4">
                        <!-- 1. KATEGORI PERMOHONAN -->
                        <div class="col-12">
                            <div class="p-3 rounded-4 border shadow-sm ${kategori.toLowerCase() === 'permohonan' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                                <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                                    📄 Catatan Kategori Permohonan ${kategori.toLowerCase() === 'permohonan' ? '<span class="badge bg-warning text-dark font-monospace mx-1" style="font-size:0.58rem;">ACTIVE</span>' : ''}
                                </label>
                                <div class="font-monospace fs-7 text-dark-emphasis p-2 bg-white rounded border border-light-subtle" style="min-height:38px; white-space: pre-line; font-size:0.8rem; font-weight: 600;">
                                    ${alasanPermohonan || '<span class="text-muted italic small">- Tidak ada catatan penundaan -</span>'}
                                </div>
                            </div>
                        </div>

                        <!-- 2. KATEGORI IURAN -->
                        <div class="col-12">
                            <div class="p-3 rounded-4 border shadow-sm ${kategori.toLowerCase() === 'iuran' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                                <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                                    💰 Catatan Kategori Iuran ${kategori.toLowerCase() === 'iuran' ? '<span class="badge bg-warning text-dark font-monospace mx-1" style="font-size:0.58rem;">ACTIVE</span>' : ''}
                                </label>
                                <div class="font-monospace fs-7 text-dark-emphasis p-2 bg-white rounded border border-light-subtle" style="min-height:38px; white-space: pre-line; font-size:0.8rem; font-weight: 600;">
                                    ${alasanIuran || '<span class="text-muted italic small">- Tidak ada catatan penundaan -</span>'}
                                </div>
                            </div>
                        </div>

                        <!-- 3. KATEGORI STR -->
                        <div class="col-12">
                            <div class="p-3 rounded-4 border shadow-sm ${kategori.toLowerCase() === 'str' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                                <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                                    🪪 Catatan Kategori STR ${kategori.toLowerCase() === 'str' ? '<span class="badge bg-warning text-dark font-monospace mx-1" style="font-size:0.58rem;">ACTIVE</span>' : ''}
                                </label>
                                <div class="font-monospace fs-7 text-dark-emphasis p-2 bg-white rounded border border-light-subtle" style="min-height:38px; white-space: pre-line; font-size:0.8rem; font-weight: 600;">
                                    ${alasanStr || '<span class="text-muted italic small">- Tidak ada catatan penundaan -</span>'}
                                </div>
                            </div>
                        </div>

                        <!-- 4. KATEGORI KTP -->
                        <div class="col-12">
                            <div class="p-3 rounded-4 border shadow-sm ${kategori.toLowerCase() === 'ktp' ? 'bg-warning-subtle border-warning' : 'bg-white'}">
                                <label class="form-label fw-bold small text-dark mb-1 font-monospace" style="font-size:0.75rem;">
                                    🆔 Catatan Kategori KTP ${kategori.toLowerCase() === 'ktp' ? '<span class="badge bg-warning text-dark font-monospace mx-1" style="font-size:0.58rem;">ACTIVE</span>' : ''}
                                </label>
                                <div class="font-monospace fs-7 text-dark-emphasis p-2 bg-white rounded border border-light-subtle" style="min-height:38px; white-space: pre-line; font-size:0.8rem; font-weight: 600;">
                                    ${alasanKtp || '<span class="text-muted italic small">- Tidak ada catatan penundaan -</span>'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center bg-light p-2 rounded-3 border mb-4">
                        <small class="text-muted" style="font-size:0.75rem;"><i class="bi bi-info-circle"></i> Berkas ini otomatis dikembangkan ke akun dokter yang bersangkutan untuk direvisi ulang sesuai catatan di atas.</small>
                    </div>

                    <!-- TOMBOL NAVIGASI CLOSE DIBAWAH MODAL 3 -->
                    <div class="text-end pt-3 border-top mt-2">
                        <!-- Menggunakan penutup selektor lokal terdekat agar aman dan tidak menutup modal back-screen -->
                        <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" 
                                onclick="const d3 = document.getElementById('fsDialog') || document.getElementById('thirdAdminModal'); if(d3 && d3.close) d3.close();">
                            Tutup Detail Log
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    // Bentangkan langsung ke komponen Modal 3 (modal3) hulu sistem Anda
    if (typeof modal3 === "function") {
        modal3('Detail Keterangan', htmlDetailPendingModal3);
    } else {
        alert("Sistem modul dialog tingkat modal3 tidak terkonfigurasi di website!");
    }
   
};

window.menuMembers= function()
{
    // 1. Variabel state internal untuk manajemen data frontend
    window.stateMembers = {
        rawData: [],
        filteredData: [],
        currentPage: 1,
        perPage: 50,
        currentSortColumn: 'id',
        currentSortDirection: 'desc'
    };

    const kontentHtml = `
        <div class="p-2 font-monospace small">
            <h6 class="fw-bold text-success mb-3 font-sans"><i class="bi bi-people-fill me-1"></i>Sistem Manajemen Data Induk Anggota</h6>
            
            <!-- PANEL KONTROL: SEARCHING & SORTING -->
            <div class="row g-2 mb-3">
                <div class="col-md-7">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchMemberInput" placeholder="Ketik Nama, NPA, atau Email Dokter...">
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-muted"><i class="bi bi-sort-alpha-down"></i> Urut</span>
                        <select class="form-select text-dark fw-bold" id="sortMemberSelect">
                            <option value="id_desc">ID Anggota (Terbaru - Terlama)</option>
                            <option value="id_asc">ID Anggota (Terlama - Terbaru)</option>
                            <option value="nama_asc">Nama Lengkap Dokter (A - Z)</option>
                            <option value="nama_desc">Nama Lengkap Dokter (Z - A)</option>
                            <option value="npa_asc">Nomor NPA (Kecil - Besar)</option>
                            <option value="status_aktif">Anggota Cabang</option>
    <option value="status_user">Anggota Biasa (Baru Daftar)</option>
    <option value="status_bukan">Anggota Luar</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- TABEL VIEW UTAMA -->
            <div class="table-responsive border rounded-3 shadow-sm mb-3 bg-white">
                <table class="table table-sm table-striped table-hover align-middle mb-0" style="font-size: 0.8rem;">
                    <thead class="table-dark">
                        <tr class="text-center text-uppercase fs-7">
                            <th width="4%">No</th>
                            <th width="6%">UID</th>
                            <th width="6%">Registrasi</th>
                            <th class="text-start" width="20%">Nama Lengkap Dokter</th>
                            <th width="6%">Nomor NPA</th>
                            <th width="15%">No WhatsApp</th>
                            <th class="text-start" width="20%">Alamat Akun Email</th>
                            <th width="2%">Folder</th>
                            <th width="21%">Aksi Modul</th>
                        </tr>
                    </thead>
                    <tbody id="membersTableBody">
                        <tr>
                            <td colspan="8" class="text-center text-muted py-5">
                                <div class="spinner-border spinner-border-sm text-success mb-2 d-block mx-auto" role="status"></div>
                                Melakukan penarikan berkas data dari MySQL server...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

                        <!-- PANEL PAGINATION FOOTER WITH RESPONSIVE WRAPPING -->
            <div class="d-flex flex-column gap-3 pt-3 border-top mt-2">
                <!-- Info baris data -->
                <div id="paginationInfoArea" class="text-muted small fw-bold text-center text-sm-start">
                    Menampilkan 0 sampai 0 dari 0 data
                </div>
                
                <!-- Pembungkus kontrol paging agar otomatis wrap dan bisa di-scroll horizontal pada layar mobile -->
                <div class="w-100 overflow-auto pb-1" style="max-width: 100%;">
                    <nav class="d-flex justify-content-center justify-content-sm-start">
                        <ul class="pagination pagination-sm mb-0 shadow-sm flex-wrap gap-1" id="paginationControlsArea" style="min-width: max-content;">
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    `;
		
    modal2('Master Member', kontentHtml); 



    // 2. Fungsi Internal: Render baris data ke dalam tabel DOM berdasarkan kelipatan 50
    window.renderMembersTableView = function() {
        const tBody = document.getElementById("membersTableBody");
        const infoArea = document.getElementById("paginationInfoArea");
        const nextControls = document.getElementById("paginationControlsArea");
        
        if (!tBody) return;

        const dataArr = window.stateMembers.filteredData;
        const totalRows = dataArr.length;
        
        if (totalRows === 0) {
            tBody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted"><i class="bi bi-folder-x display-6 d-block mb-2 text-secondary"></i> Tidak ditemukan data dokter yang cocok dengan kriteria.</td></tr>`;
            infoArea.innerText = "Menampilkan 0 data";
            nextControls.innerHTML = "";
            return;
        }

        const idxStart = (window.stateMembers.currentPage - 1) * window.stateMembers.perPage;
        const idxEnd = Math.min(idxStart + window.stateMembers.perPage, totalRows);
        const totalPages = Math.ceil(totalRows / window.stateMembers.perPage);
        
        const pageData = dataArr.slice(idxStart, idxEnd);
        let rowsHtml = "";
let editanggota="";  let signin="";
let adminLevelUser = localStorage.getItem("admin_level");

let folder="";
                for (let i = 0; i < pageData.length; i++) {
            const dktr = pageData[i];
            const noUrut = idxStart + i + 1;
if(dktr.folder.trim() !== null && dktr.folder.trim() !== undefined)
{
folder='<a href="https://drive.google.com/drive/folders/'+dktr.folder+'" target="newtab">'+dktr.folder+'</a>';   
}
            // Konfigurasi label NPA dengan badge warna jika belum diisi
            const npaLabel = dktr.npa 
                ? `<span class="fw-bold font-monospace text-dark">${dktr.npa}</span>` 
                : `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded" style="font-size:0.65rem;">Belum Set</span>`;

                        if(adminLevelUser==='1')
                        {
                                 editanggota=`<button class="btn btn-xs btn-primary py-0 px-2 fw-bold rounded shadow-sm" style="font-size: 0.7rem; line-height: 1.5;" onclick="prosesEditAnggota(${dktr.id},'admin')">
                            <i class="bi bi-pencil-square me-1" style="font-size: 0.68rem;"></i>Edit
                        </button>`;
                        signin=`<button class="btn btn-xs btn-warning py-0 px-2 fw-bold rounded shadow-sm" style="font-size: 0.7rem; line-height: 1.5;" onclick="eksekusiBypassLoginSebagaiAnggota(${dktr.id},'${dktr.nama}')">
                            <i class="bi bi-person-check me-1" style="font-size: 0.68rem;"></i>
                        </button>`
                        }
                            
            rowsHtml += `
                <tr>
                    <td class="text-center fw-bold text-secondary">${noUrut}</td>
                    <td class="text-center font-monospace text-primary fw-bold">#${dktr.id}</td>
                    <td class="text-center font-monospace" nowrap>${dktr.uregistrasi.split(' ')[0]}</td>
                    <td class="text-start fw-bold text-dark font-sans py-2">${dktr.nama}</td>
                    <td class="text-center">${npaLabel}</td>
                    <td class="text-center">
                        <a href="https://wa.me/62${dktr.telpon}" target="_blank" class="btn btn-xs btn-outline-success py-1 w-100 font-monospace" style="font-size: 0.72rem;">
                            <i class="bi bi-whatsapp me-1"></i>+62 ${dktr.telpon}
                        </a>
                    </td>
                    <td class="text-start text-muted text-truncate" style="max-width: 180px;" title="\${dktr.email}">${dktr.email}</td>
                    <td class="text-start text-muted text-truncate">${folder}</td>
                    <td class="text-center">
                        ${signin}
                        ${editanggota}
						<button type="button" class="btn btn-xs btn-success py-0 px-2 fw-bold rounded shadow-sm " style="font-size: 0.7rem; line-height: 1.5;" onclick="event.preventDefault(); window.bukaManajerIuranAnggotaDinamis('${dktr.telpon}','${dktr.nama}')">
                        <i class="bi bi-wallet2 me-1" style="font-size: 0.65rem;"></i> Iuran
                    </button>
                    </td>
                </tr>
            `;
        }

        tBody.innerHTML = rowsHtml;
        infoArea.innerText = `Menampilkan ${idxStart + 1} - ${idxEnd} dari ${totalRows} Dokter Anggota`;

                // [GANTI BAGIAN GENERATE LOOP PAGINATION DI POTONGAN 2 ANDA DENGAN KODE INI]
        let paginationHtml = "";
        
        // Tombol halaman sebelumnya (PREV)
        paginationHtml += `<li class="page-item ${window.stateMembers.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link px-2 py-1 rounded" href="#" onclick="event.preventDefault(); window.changeMemberPageStep(${window.stateMembers.currentPage - 1})">Prev</a>
        </li>`;

        const range = 2; // Menampilkan 2 halaman ke kiri dan 2 halaman ke kanan dari halaman aktif
        let penandaTitikKiri = false;
        let penandaTitikKanan = false;

        for (let p = 1; p <= totalPages; p++) {
            // Selalu tampilkan halaman pertama, halaman terakhir, dan halaman di sekitar halaman aktif
            if (p === 1 || p === totalPages || (p >= window.stateMembers.currentPage - range && p <= window.stateMembers.currentPage + range)) {
                paginationHtml += `<li class="page-item \${window.stateMembers.currentPage === p ? 'active' : ''} mb-1">
                    <a class="page-link px-2 py-1" href="#" onclick="event.preventDefault(); window.changeMemberPageStep(${p})">${p}</a>
                </li>`;
            } 
            // Tampilkan titik-titik di sisi kiri jika ada halaman yang disembunyikan
            else if (p < window.stateMembers.currentPage - range && !penandaTitikKiri) {
                paginationHtml += `<li class="page-item disabled mb-1"><span class="page-link px-2 py-1">...</span></li>`;
                penandaTitikKiri = true;
            } 
            // Tampilkan titik-titik di sisi kanan jika ada halaman yang disembunyikan
            else if (p > window.stateMembers.currentPage + range && !penandaTitikKanan) {
                paginationHtml += `<li class="page-item disabled mb-1"><span class="page-link px-2 py-1">...</span></li>`;
                penandaTitikKanan = true;
            }
        }

        // Tombol halaman berikutnya (NEXT)
        paginationHtml += `<li class="page-item ${window.stateMembers.currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link px-2 py-1 rounded" href="#" onclick="event.preventDefault(); window.changeMemberPageStep(${window.stateMembers.currentPage + 1})">Next</a>
        </li>`;

        nextControls.innerHTML = paginationHtml;

    };

    window.changeMemberPageStep = function(targetPage) {
        window.stateMembers.currentPage = targetPage;
        window.renderMembersTableView();
    };
	


window.bukaManajerIuranAnggotaDinamis = function(nomorTelponAnggota,namaAnggota) {
    if (!nomorTelponAnggota || nomorTelponAnggota.trim() === "" || nomorTelponAnggota === "null") {
        alert("Gagal memproses: Nomor telepon/WhatsApp anggota ini kosong atau tidak valid!");
        return;
    }

    // 1. Bersihkan karakter spasi tak sengaja pada string nomor telepon menggunakan metode steril
    const telponSteril = nomorTelponAnggota.replace(/\s/g, "");

    // 2. Tutup dialog atau modal data induk yang sedang terbuka agar layar bersih
    if (typeof window.tutupModalTerbuka === "function") {
        window.tutupModalTerbuka();
    }

    // 3. Panggil fungsi menuIuran utama untuk merender layout pencarian iuran
    if (typeof window.menuIuran === "function") {
        window.menuIuran();
        
        // 4. Beri jeda transisi animasi (350ms) lalu jalankan fetch timeline iuran secara otomatis
        setTimeout(function() {
            window.eksekusiFetchIuranMurni(telponSteril);
			document.getElementById('namapemilikiuran').innerHTML=`<h5 class="fw-bold text-success mb-1"><i class="bi bi-person-badge-fill me-1"></i> Halo, ${namaAnggota}</h5>
                                <p class="text-muted small mb-0 font-monospace">Histori rincian mutasi kas iuran wajib Anda yang terdaftar pada nomor +62 ${nomorTelponAnggota}</p>
                            </div>`;
        }, 350);
		document.getElementById('btnadmin').innerHTML="<button class='btn btn-sm btn-warning' onclick='backtomemberarea()' style='font-size:10px'>Back to Member Area</button>"
    } else {
        console.error("Fungsi global 'window.menuIuran' tidak terdaftar di sistem DOM.");
    }
};

window.backtomemberarea=function()
{
window.tutupModalTerbuka();
setTimeout(function() {
initAdmin();
}, 350);
setTimeout(function() {
document.getElementById('btnadmin').innerHTML='';
menuMembers();
}, 700);	
}

    // 3. Engine Penyaringan Data Lokal & Pengurutan Kolom Dinamis
    window.processLocalMemberFilterAndSort = function() {
        const querySearch = document.getElementById("searchMemberInput").value.toLowerCase().trim();
        const sortVal = document.getElementById("sortMemberSelect").value.split('_');
        
        const col = sortVal[0];
        const dir = sortVal[1];

        let dataFiltered = window.stateMembers.rawData.filter(item => {
            const matchingNama = (item.nama || '').toLowerCase().includes(querySearch);
            const matchingNpa  = (item.npa || '').toLowerCase().includes(querySearch);
            const matchingEmail = (item.email || '').toLowerCase().includes(querySearch);
            const isTextMatch = matchingNama || matchingNpa || matchingEmail;
            //return matchingNama || matchingNpa || matchingEmail;
            
        let isStatusMatch = true; 
        if (col === 'status') {
            const currentStatusDb = (item.status_keanggotaan || '').toLowerCase().trim();
            
            if (dir === 'aktif') {
                isStatusMatch = (currentStatusDb === 'aktif');
            } else if (dir === 'user') {
                isStatusMatch = (currentStatusDb === 'user');
            } else if (dir === 'bukan') {
                isStatusMatch = (currentStatusDb === 'bukan anggota');
            }
        }
            return isTextMatch && isStatusMatch;
        });
        
        
        
        dataFiltered.sort((alpha, beta) => {
            let targetCol = col;
            let targetDir = dir;
            
            if (col === 'status') {
            targetCol = 'id';
            targetDir = 'desc';
            }

            let valAlpha = alpha[targetCol];
            let valBeta  = beta[targetCol];

            if (targetCol === 'id') {
                valAlpha = parseInt(valAlpha, 10) || 0;
                valBeta  = parseInt(valBeta, 10) || 0;
            } else {
                valAlpha = (valAlpha || '').toString().toLowerCase();
                valBeta  = (valBeta || '').toString().toLowerCase();
            }

            if (valAlpha < valBeta) return targetDir === 'asc' ? -1 : 1;
        if (valAlpha > valBeta) return targetDir === 'asc' ? 1 : -1;
            return 0;
        });

        window.stateMembers.filteredData = dataFiltered;
        window.stateMembers.currentPage = 1;
        window.renderMembersTableView();
    };

    // AJAX FETCH: Hubungkan langsung ke endpoint members.php MySQL
    fetch(endpoint + 'members.php?aksi=list_members')
    .then(response => {
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return response.json();
    })
    .then(res => {
        if (res.status === 'success') {
            window.stateMembers.rawData = res.data;
            window.stateMembers.filteredData = res.data;
            
            window.renderMembersTableView();

            document.getElementById("searchMemberInput").addEventListener("input", window.processLocalMemberFilterAndSort);
            document.getElementById("sortMemberSelect").addEventListener("change", window.processLocalMemberFilterAndSort);
        } 
        else if(res.status==='error')
        {
        alert(res.message);
        window.location.reload();
        }
        else 
        {
            
            document.getElementById("membersTableBody").innerHTML = `<tr><td colspan="6" class="text-center text-danger py-3"><b>Gagal mengambil data:</b> ${res.message}</td></tr>`;
        }
    })
    .catch(error => {
        console.error("Error Fetch Master Members:", error);
        document.getElementById("membersTableBody").innerHTML = `<tr><td colspan="6" class="text-center text-danger py-3"><i class="bi bi-wifi-off me-1"></i> Gagal terhubung ke pangkalan data server.</td></tr>`;
    });

} // <-- INI ADALAH PENUTUP DARI FUNGSI UTAMA function menuMembers()

window.prosesEditAnggota = function(idAnggota,Anggota) {
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    // 1. LUNCURKAN FORMULIR DENGAN INDIKATOR LOADING PADA MODAL 3
    if (typeof modal3 === "function") {
        modal3('Manajemen Profil Anggota', `
            <div class="d-flex justify-content-center align-items-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                <h6 class="ms-3 text-muted mb-0 font-monospace">Mengunci data ID #${idAnggota} dari database...</h6>
            </div>
        `);
    } else {
        alert("Komponen modal3 tidak terkonfigurasi!");
        return;
    }

    fetch(`${cleanEndpoint}/members.php?aksi=get_detail_member&id=${idAnggota}&statuslogin=${Anggota}`)
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(res => {
        if (res.status === 'success') {
            const member = res.data;
            const sBody = document.getElementById("bodimodal3");
            if (!sBody) return;

            // Atur pilihan opsi dropdown status keanggotaan
            const optStatus = `
                <option value="Aktif" ${member.status_keanggotaan === 'Aktif' ? 'selected' : ''}>Anggota Cabang</option>
                <option value="Bukan Anggota" ${member.status_keanggotaan === 'Bukan Anggota' ? 'selected' : ''}>Anggota Luar</option>
				<option value="User" ${member.status_keanggotaan === 'User' ? 'selected' : ''}>Anggota Biasa</option>
            `;

            // Atur pilihan opsi dropdown jender
            const optGender = `
                <option value="Laki-laki" ${member.gender === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
                <option value="Perempuan" ${member.gender === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
            `;
             const optNikah = `
                <option value="Belum Menikah" ${(member.status_nikah?.trim() === 'Belum Menikah' || member.status_nikah?.trim() === 'Tidak Menikah') ? 'selected' : ''}>Belum Menikah</option>
                <option value="Menikah" ${member.status_nikah?.trim() === 'Menikah' ||  member.status_nikah?.trim() === 'Sudah Menikah' ? 'selected' : ''}>Menikah</option>
                <option value="Cerai Hidup" ${member.status_nikah?.trim() === 'Cerai Hidup' ? 'selected' : ''}>Cerai Hidup</option>
                <option value="Cerai Mati" ${member.status_nikah?.trim() === 'Cerai Mati' ? 'selected' : ''}>Cerai Mati</option>
            `;
			const daftarAgama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu'];
let optAgama = '<option value="">-- Pilih Agama --</option>';

// 1. Ambil data agama member, bersihkan spasi, dan ubah ke huruf kecil semua
// Jika datanya null/undefined, otomatis jadi string kosong
let agamaMember = (member.agama?.trim() || '').toLowerCase();

// 2. Normalisasi: Jika tertulis "budha", ubah menjadi "buddha" agar sinkron dengan array
if (agamaMember === 'budha') {
    agamaMember = 'buddha';
}

if (agamaMember === 'Protestan') {
    agamaMember = 'Kristen'; 
}

daftarAgama.forEach(ag => {
    // 3. Bandingkan data nilai array (yang diubah ke huruf kecil) dengan data member yang sudah dinormalisasi
    const isSelected = ag.toLowerCase() === agamaMember ? 'selected' : '';
    
    optAgama += `<option value="${ag}" ${isSelected}>${ag}</option>`;
});

			let arrPekerjaan = [];
            let arrTempatKerja = [];
            try { if (member.pekerjaan) arrPekerjaan = JSON.parse(member.pekerjaan); } catch(e) { console.error(e); }
            try { if (member.tempatkerja) arrTempatKerja = JSON.parse(member.tempatkerja); } catch(e) { console.error(e); }

let kewajibanuser="";
if(member.status_keanggotaan==="User")
{
kewajibanuser=`<div class="alert alert-danger mb-4" role="alert">*Update status keanggotaan anda menjadi <b>Anggota Cabang</b> untuk mendapatkan akses mengajukan rekomendasi Mutasi, PPDS, PPDS Subspesialis, Fellowship
atau Letter of Goodstanding (LOG)</div>`;   
}
           // Render isi Form Data Lengkap Anggota
            sBody.innerHTML = `
                <div class="container-fluid py-2 font-monospace small">
                    <div class="alert bg-light border p-3 rounded-3 mb-2 d-flex align-items-center gap-3">
                        <img src="https://lh3.googleusercontent.com/d/${member.fotoprofil ? member.fotoprofil : '138_TC12u5QkNRHo6Za2hDMzihwPl51AT'}" 
                             class="rounded-circle border shadow-sm" style="width:60px; height:60px; object-fit:cover;">
                        <div>
                            <span class="fw-bold d-block text-dark font-sans" style="font-size:1rem;">${member.nama}</span>
                            <span class="text-muted">UID: #${member.id} | Terdaftar: ${member.uregistrasi}</span>
                            
                        </div>
                        
                    </div>
${kewajibanuser}
                     <form id="formUpdateMemberMySQL">
                        <input type="hidden" id="editMemberId" value="${member.id}">
                        <input type="hidden" id="statuseditor" value="${Anggota}">
                        <h6 class="fw-bold text-success border-bottom pb-1 mb-3"><i class="bi bi-person-badge-fill me-1"></i> I. BIODATA PRIBADI</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Nama Lengkap & Gelar</label>
                                <input type="text" class="form-control form-control-sm fw-bold font-sans" id="editMemberNama" value="${member.nama || ''}" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Nomor Pokok Anggota (NPA)</label>
                                <input type="text" class="form-control form-control-sm fw-bold text-primary" id="editMemberNpa" value="${member.npa || ''}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">NIK KTP (16 Digit)</label>
                                <input type="text" class="form-control form-control-sm" id="editMemberNik" value="${member.nik || ''}" maxlength="16">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Tempat Lahir</label>
                                <input type="text" class="form-control form-control-sm" id="editMemberTempatLahir" value="${member.tempat_lahir || ''}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Tanggal Lahir</label>
                                <input type="date" class="form-control form-control-sm font-sans" id="editMemberTglLahir" value="${member.tgl_lahir || ''}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Jenis Kelamin</label>
                                <select class="form-select form-select-sm" id="editMemberGender">${optGender}</select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Status Pernikahan</label>
                                <select class="form-select form-select-sm" id="editMemberStatusNikah">${optNikah}</select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Agama</label>
                                <select class="form-select form-select-sm" id="editMemberAgama">${optAgama}</select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Surat Tanda Registrasi (STR)</label>
                                <input type="text" class="form-control form-control-sm font-sans" id="editMemberStr" value="${member.str || ''}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary">Alamat Rumah Tinggal (KTP/Domisili)</label>
                                <input type="text" class="form-control form-control-sm" id="editMemberAlamat" value="${member.alamat || ''}">
                            </div>
                            <div class="col-md-3">
    <label class="form-label fw-bold text-secondary">No Telepon / WA</label>
    <div class="input-group input-group-sm">
        <span class="input-group-text bg-light text-muted fw-bold font-monospace">+62</span>
        <input type="tel" class="form-control font-sans fw-semibold" id="editMemberTelpon" value="${member.telpon || ''}" readonly style="letter-spacing: 0.5px;">
    </div>
</div>
                            <div class="col-md-3">
                                <label class="form-label fw-bold text-secondary">Alamat E-mail</label>
                                <input type="email" class="form-control form-control-sm" id="editMemberEmail" value="${member.email || ''}" required>
                            </div>
                        </div>
                        <h6 class="fw-bold text-success border-bottom pb-1 mb-3"><i class="bi bi-mortarboard-fill me-1"></i> II. PENDIDIKAN & PEKERJAAN UTAMA</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Riwayat Pendidikan Terakhir</label>
                                <input type="text" class="form-control form-control-sm" id="editMemberPendidikan" value="${member.pendidikan || ''}" placeholder="Contoh: Spesialis Bedah Umum - Universitas Indonesia">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Profesi Utama / Kompetensi</label>
                                <input type="text" class="form-control form-control-sm" id="editMemberProfesi" value="${member.profesiutama?.trim() || ''}" placeholder="Contoh: Dokter Spesialis Bedah">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary">Status Keanggotaan</label>
                                <select class="form-select form-select-sm fw-bold text-success" id="editMemberStatus" onchange="if(this.value==='Aktif') { ubahstatusanggota() }">${optStatus}</select>
                            </div>
                        </div>

                        <h6 class="fw-bold text-dark border-bottom pb-1 mb-3 d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-briefcase-fill text-primary me-1"></i> III. DAFTAR RIWAYAT PEKERJAAN (JSON Boks Dinamis)</span>
                            <button type="button" class="btn btn-xs btn-outline-primary px-2 py-0 fw-bold" id="btnAddRowPekerjaan"><i class="bi bi-plus-circle-fill"></i> Tambah Baris</button>
                        </h6>
                        <div id="containerJsonPekerjaanDynamic" class="mb-4"></div>

                        <h6 class="fw-bold text-dark border-bottom pb-1 mb-3 d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-building-fill text-warning me-1"></i> IV. TEMPAT PRAKTIK KERJA AKTIF (JSON Boks Dinamis)</span>
                            <button type="button" class="btn btn-xs btn-outline-warning px-2 py-0 fw-bold text-dark" id="btnAddRowTempatKerja"><i class="bi bi-plus-circle-fill"></i> Tambah Baris</button>
                        </h6>
                        <div id="containerJsonTempatKerjaDynamic" class="mb-4"></div>

                        <h6 class="fw-bold text-success border-bottom pb-1 mb-3"><i class="bi bi-share-fill me-1"></i> V. TAUTAN JEJARING MEDIA SOSIAL</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-3">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-light text-primary"><i class="bi bi-facebook"></i></span>
                                    <input type="text" class="form-control" id="editMemberFB" value="${member.facebook || ''}" placeholder="Username Facebook">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-light text-danger"><i class="bi bi-instagram"></i></span>
                                    <input type="text" class="form-control" id="editMemberIG" value="${member.instagram || ''}" placeholder="Username Instagram">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-dark text-white"><i class="bi bi-tiktok"></i></span>
                                    <input type="text" class="form-control" id="editMemberTiktok" value="${member.tiktok || ''}" placeholder="Username TikTok">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-light text-danger"><i class="bi bi-youtube"></i></span>
                                    <input type="text" class="form-control" id="editMemberYT" value="${member.youtube || ''}" placeholder="ID Channel Youtube">
                                </div>
                            </div>
                        </div>

                        <div class="text-end pt-3 border-top mt-4">
                            <button type="button" class="btn btn-sm btn-outline-secondary px-3 me-2" onclick="document.getElementById('fsDialog').close();">Batal</button>
                            <button type="submit" class="btn btn-sm btn-success px-4 fw-bold shadow-sm" id="btnSubmitUpdateMember">
                                <i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Kompilasi Profil
                            </button>
                        </div>
                    </form>
                </div>
            `;
             
			 const boxPekerjaan = document.getElementById("containerJsonPekerjaanDynamic");
            const boxTempatKerja = document.getElementById("containerJsonTempatKerjaDynamic");

            // Fungsi menyuntikkan baris input Pekerjaan
            window.injectRowPekerjaanHtml = function(nilaiBawaan = "") {
                const div = document.createElement("div");
                div.className = "input-group input-group-sm mb-2 row-pekerjaan-item";
                div.innerHTML = `
                    <span class="input-group-text bg-light"><i class="bi bi-arrow-right-short"></i></span>
                    <input type="text" class="form-control value-pekerjaan-input" value="${nilaiBawaan}" placeholder="Tulis nama perusahaan, jabatan atau riwayat instansi penugasan...">
                    <button type="button" class="btn btn-danger" onclick="this.parentElement.remove();"><i class="bi bi-trash"></i></button>
                `;
                boxPekerjaan.appendChild(div);
            };
           // Fungsi menyuntikkan baris input Tempat Kerja
            window.injectRowTempatKerjaHtml = function(nilaiBawaan = "") {
                const div = document.createElement("div");
                div.className = "input-group input-group-sm mb-2 row-tempatkerja-item";
                div.innerHTML = `
                    <span class="input-group-text bg-light"><i class="bi bi-geo-alt-fill text-danger"></i></span>
                    <input type="text" class="form-control value-tempatkerja-input" value="${nilaiBawaan}" placeholder="Tulis alamat rumah sakit, klinik, atau tempat praktik medis aktif saat ini...">
                    <button type="button" class="btn btn-danger" onclick="this.parentElement.remove();"><i class="bi bi-trash"></i></button>
                `;
                boxTempatKerja.appendChild(div);
            };

            // Daftarkan aksi tombol tambah baris baru
            document.getElementById("btnAddRowPekerjaan").addEventListener("click", () => window.injectRowPekerjaanHtml(""));
            document.getElementById("btnAddRowTempatKerja").addEventListener("click", () => window.injectRowTempatKerjaHtml(""));

            // Loop merender data bawaan database (jika ada) ke baris input dinamis
            if (arrPekerjaan.length > 0) { arrPekerjaan.forEach(val => window.injectRowPekerjaanHtml(val)); } 
            else { window.injectRowPekerjaanHtml(""); } // Beri 1 baris kosong default jika database null
            
            if (arrTempatKerja.length > 0) { arrTempatKerja.forEach(val => window.injectRowTempatKerjaHtml(val)); } 
            else { window.injectRowTempatKerjaHtml(""); }

            const formUpdate = document.getElementById("formUpdateMemberMySQL");
			const formUpdatex = document.getElementById("formUpdateMemberMySQLx");
			
            formUpdate.addEventListener("submit", function(e) {
                e.preventDefault();

                const btnSimpan = document.getElementById("btnSubmitUpdateMember");
                btnSimpan.disabled = true;
                btnSimpan.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Menyimpan...`;

                // Kompilasi kumpulan input dinamis menjadi array teks murni murni
                const dataPekerjaanKompilasi = [];
                document.querySelectorAll(".value-pekerjaan-input").forEach(inp => {
                    if (inp.value.trim() !== "") dataPekerjaanKompilasi.push(inp.value.trim());
                });

                const dataTempatKerjaKompilasi = [];
                document.querySelectorAll(".value-tempatkerja-input").forEach(inp => {
                    if (inp.value.trim() !== "") dataTempatKerjaKompilasi.push(inp.value.trim());
                });

                // Bungkus variabel menuju payload FormData
                const payloadUpdate = new FormData();
                payloadUpdate.append("id", document.getElementById("editMemberId").value);
                payloadUpdate.append("nama", document.getElementById("editMemberNama").value.trim());
                payloadUpdate.append("npa", document.getElementById("editMemberNpa").value.trim());
                payloadUpdate.append("nik", document.getElementById("editMemberNik").value.trim());
                payloadUpdate.append("tempat_lahir", document.getElementById("editMemberTempatLahir").value.trim());
                payloadUpdate.append("tgl_lahir", document.getElementById("editMemberTglLahir").value);
                payloadUpdate.append("gender", document.getElementById("editMemberGender").value);
                payloadUpdate.append("status_nikah", document.getElementById("editMemberStatusNikah").value);
                payloadUpdate.append("agama", document.getElementById("editMemberAgama").value);
                payloadUpdate.append("str", document.getElementById("editMemberStr").value.trim());
                payloadUpdate.append("alamat", document.getElementById("editMemberAlamat").value.trim());
                payloadUpdate.append("telpon", document.getElementById("editMemberTelpon").value.trim());
                payloadUpdate.append("email", document.getElementById("editMemberEmail").value.trim());
                payloadUpdate.append("pendidikan", document.getElementById("editMemberPendidikan").value.trim());
                payloadUpdate.append("profesiutama", document.getElementById("editMemberProfesi").value.trim());
                payloadUpdate.append("status_keanggotaan", document.getElementById("editMemberStatus").value);
                payloadUpdate.append("facebook", document.getElementById("editMemberFB").value.trim());
                payloadUpdate.append("instagram", document.getElementById("editMemberIG").value.trim());
                payloadUpdate.append("tiktok", document.getElementById("editMemberTiktok").value.trim());
                payloadUpdate.append("youtube", document.getElementById("editMemberYT").value.trim());
                
                // Konversi array ke format teks JSON terenkripsi untuk kolom longtext database
                payloadUpdate.append("pekerjaan", JSON.stringify(dataPekerjaanKompilasi));
                payloadUpdate.append("tempatkerja", JSON.stringify(dataTempatKerjaKompilasi));

let statuseditor=document.getElementById('statuseditor').value;
let updatedetailmember='';
if(statuseditor==='anggota')
{
updatedetailmember='update_detail_member_sementara';
}
if(statuseditor==='admin')
{
updatedetailmember='update_detail_member';	
}

                fetch(`${cleanEndpoint}/members.php?aksi=${updatedetailmember}`, {
                    method: "POST",
                    body: payloadUpdate
                })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    if (data.status === 'success') {
                        document.getElementById('fsDialog').close();
						if(statuseditor==='admin')
						{
                        if (typeof menuMembers === "function") menuMembers();
						}
						if(statuseditor==='anggota')
						{
						prosesEditAnggota(document.getElementById('editMemberId').value,'anggota')
						}
                    } else {
                        btnSimpan.disabled = false;
                        btnSimpan.innerHTML = `<i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Kompilasi Profil`;
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Koneksi gagal terputus saat menyimpan.");
                    btnSimpan.disabled = false;
                    btnSimpan.innerHTML = `<i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Kompilasi Profil`;
                });
            });

        } else {
            document.getElementById("bodimodal3").innerHTML = `<div class="alert alert-danger p-3 small"><i class="bi bi-exclamation-triangle"></i> Gagal memuat profil: ${res.message}</div>`;
            window.location.reload(); 
        }
    })
    .catch(error => {
        console.error(error);
        document.getElementById("bodimodal3").innerHTML = `<div class="alert alert-danger p-3 small"><i class="bi bi-wifi-off"></i> Gangguan peladen sistem internal database.</div>`;
    });
};

window.ubahstatusanggota=function()
{
	tutupModalTerbuka();
	menuIuran();
}
 
window.menuNotifikasi = function() {
    bukaPanelNotifikasiKategori();
};


window.bukaPanelNotifikasiKategori=function() {
    // 1. Bentuk kerangka tata letak awal (Loading State) di dalam string HTML
    const htmlKontenNotif = `
        <div class="p-2">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <small class="text-muted"><i class="bi bi-info-circle me-1"></i> Klik pada kategori untuk melihat riwayat</small>
                <button class="btn btn-sm btn-light py-1 px-2 border rounded-3 text-secondary" style="font-size:0.75rem;" onclick="bukaPanelNotifikasiKategori()">
                    <i class="bi bi-arrow-clockwise me-1"></i>Segarkan
                </button>
            </div>
            <!-- Wadah Accordion Bootstrap -->
            <div class="accordion accordion-flush border rounded-3 overflow-hidden shadow-sm" id="accordionNotifikasi">
                <div class="text-center py-5">
                    <span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
                    <span class="small text-muted">Memilah database MySQL...</span>
                </div>
            </div>
        </div> 
    `;

    // 2. Panggil fungsi global bawaan sistem Anda untuk memicu pemuatan Modal Kedua
    if (typeof modal2 === "function") {
        modal2('Notifikasi', htmlKontenNotif);
    } else {
        console.warn("FUNGSI GLOBAL modal2x() TIDAK TERDETEKSI DI DOM WINDOW");
        return;
    }
	
	const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
	fetch(`${cleanEndpoint}/proses.php?aksi=get_all_notifikasi`)
    .then(res => res.json())
    .then(res => {
        const accordionBox = document.getElementById("accordionNotifikasi");
        if (!accordionBox) return;

        if (res.status === 'success') {
            const dataNotif = res.data;
            // Kamus definisi kategori, ikon, dan label teks
            const kamusKategori = {
                'upload_foto': { label: 'Unggah Foto Profil', icon: 'bi-image text-danger' },
                'update_iuran': { label: 'Iuran Anggota', icon: 'bi bi-receipt text-secondary' },
                'update_profil': { label: 'Pembaruan Data Profil', icon: 'bi-person-gear text-primary' },
                'update_mutasi': { label: 'Mutasi Anggota', icon: 'bi-arrow-left-right text-success' },
                'update_ppds': { label: 'Program PPDS', icon: 'bi-mortarboard text-warning' },
                'update_ppdssub': { label: 'Program PPDS Subspesialis', icon: 'bi-award text-info' },
                'update_fellow': { label: 'Fellowship', icon: 'bi-briefcase text-secondary' },
                'update_log': { label: 'Letter Of Good standing', icon: 'bi-terminal text-dark' }
            };

            let accordionHtml = "";

            // 4. Petakan data mentah ke masing-masing kantong Accordion
            Object.keys(kamusKategori).forEach((key) => {
                const listFiltered = dataNotif.filter(n => n.jenis === key);
                const jumlahBelum = listFiltered.filter(n => n.status_baca === 'belum').length;
                
                let badgeItem = jumlahBelum > 0 ? `
        <span class="badge rounded-pill bg-danger ms-auto me-2 shadow-sm font-monospace" 
              id="badge-kat-${key}" 
              style="font-size: 0.75rem; padding: 0.35em 0.6em; min-width: 22px;">${jumlahBelum}
        </span>
    ` : '';
    
                let isiListGroup = "";

                // Ganti bagian perulangan item khusus di dalam fungsi bukaPanelNotifikasiKategori() Anda:
if (listFiltered.length === 0) {
    isiListGroup = `<div class="p-4 text-center text-muted small"><i class="bi bi-inbox-fill d-block fs-4 text-muted mb-1"></i>Tidak ada data notifikasi aktif.</div>`;
} else {
    isiListGroup = `<div class="list-group list-group-flush" style="max-height: 280px; overflow-y: auto;">`;
    listFiltered.forEach(item => {
        const bgBeda = item.status_baca === 'belum' ? 'bg-light-subtle fw-medium border-start border-danger border-3 text-dark' : 'text-secondary';
        const tgl = item.created_at ? item.created_at.substring(0, 16) : '';
        
        // Pemicu Klik: Mendukung kategori upload_foto dan update_profile ke Modal 3
let tautanAksi = "";
let namaDokter=item.pesan.split('baru')[0];
if (key === 'upload_foto') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiFotoKeModal3(${item.user_id}, '${item.id}','${namaDokter}')"`;
} else if (key === 'update_iuran') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiIuranKeModal3(${item.user_id}, '${item.id}')"`;
} else if (key === 'update_profil') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiProfilKeModal3(${item.user_id}, '${item.id}')"`;
} else if (key === 'update_mutasi') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiRekomKeModal3(${item.user_id}, '${item.id}','mutasi','${namaDokter}')"`;
} else if (key === 'update_ppds') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiRekomKeModal3(${item.user_id}, '${item.id}','ppds','${namaDokter}')"`;
} else if (key === 'update_ppdssub') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiRekomKeModal3(${item.user_id}, '${item.id}','ppdssub','${namaDokter}')"`;
} else if (key === 'update_fellow') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiRekomKeModal3(${item.user_id}, '${item.id}','fellow','${namaDokter}')"`;
} else if (key === 'update_log') {
    tautanAksi = `style="cursor:pointer;" onclick="event.preventDefault(); window.bukaValidasiRekomKeModal3(${item.user_id}, '${item.id}','log','${namaDokter}')"`;
}
// Berikan indikator visual teks di bawah pesan notifikasi
let teksAksiTambahan = "";
if (key === 'upload_foto') teksAksiTambahan = '<span class="text-primary d-block mt-1 small fw-semibold"><i class="bi bi-image me-1"></i>Periksa Foto & Validasi</span>';
if (key === 'update_profil' || key === 'update_mutasi' || key === 'update_ppds' || key === 'update_ppdssub' || key === 'update_fellow' || key === 'update_log' || key === 'update_iuran') teksAksiTambahan = '<span class="text-primary d-block mt-1 small fw-semibold"><i class="bi bi-person-lines-fill me-1"></i>Periksa Perubahan Data & Validasi</span>';

isiListGroup += `
    <div class="list-group-item p-2.5 small border-bottom ${bgBeda}">
        <!-- STRUKTUR UTAMA: Flexbox Membagi Area Pesan (Kiri) dan Tombol Hapus (Kanan) -->
        <div class="d-flex align-items-start justify-content-between gap-2">
            
            <!-- SISI KIRI: KONTEN UTAMA NOTIFIKASI (Bisa Diklik Menuju Tautan Aksi) -->
            <div ${tautanAksi} style="cursor: pointer; flex-grow: 1;">
                <div class="d-flex justify-content-between align-items-center mb-1" style="font-size:0.7rem;">
                    <span class="text-muted"><i class="bi bi-clock me-1"></i>${tgl}</span>
                    ${item.status_baca === 'belum' ? '<span class="badge bg-danger-subtle text-danger" style="font-size:0.55rem; padding: 0.15em 0.4em;">BARU</span>' : '<span class="badge bg-light text-muted" style="font-size:0.55rem; padding: 0.15em 0.4em;">DIBACA</span>'}
                </div>
                <div style="line-height:1.4;" class="text-dark">${item.pesan} ${teksAksiTambahan}</div>
            </div>

            <!-- SISI KANAN: TOMBOL HAPUS INDEPENDEN (BERBENTUK IKON TRASH) -->
            <div class="pt-1">
                <button type="button" class="btn btn-sm btn-link text-danger border-0 p-1 m-0 rounded-circle d-flex align-items-center justify-content-center" 
                        style="background: transparent; transition: all 0.2s;"
                        title="Hapus pemberitahuan ini"
                        onclick="event.stopPropagation(); window.eksekusiHapusNotifikasiMySQL(${item.id}, '${key}')">
                    <i class="bi bi-trash3-fill" style="font-size: 0.85rem;"></i>
                </button>
            </div>

        </div>
    </div>
`;

    });
    isiListGroup += `</div>`;
}


                // 5. Susun struktur HTML per baris item
                 // 5. Susun struktur HTML per baris item
    accordionHtml += `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <!-- PERBAIKAN BUTTON: Ditambahkan class w-100 dan d-flex agar badge bisa terdorong presisi ke kanan -->
                <button class="accordion-button collapsed py-3 px-3 d-flex align-items-center w-100 text-dark fw-semibold" 
                        style="font-size:0.85rem;" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapse-${key}" 
                        aria-expanded="false" 
                        aria-controls="collapse-${key}"
                        onclick="tandaiKategoriSudahDibaca('${key}')">
                    
                    <!-- Sisi Kiri: Ikon dan Teks Menu -->
                    <div class="d-flex align-items-center">
                        <i class="bi ${kamusKategori[key].icon} me-2.5 fs-5" style="transform: translateY(-1px);"></i> 
                        <span>${kamusKategori[key].label}</span>
                    </div>
                    
                    <!-- Sisi Kanan: Badge Angka (Otomatis presisi di kanan sebelum panah accordion) -->
                    ${badgeItem}
                    
            </h2>
            <div id="collapse-${key}" class="accordion-collapse collapse" data-bs-parent="#accordionNotifikasi">
                <div class="accordion-body p-0 bg-white">
                    ${isiListGroup}
                </div>
            </div>
        </div>
    `;
            });

            accordionBox.innerHTML = accordionHtml;
        } else {
            accordionBox.innerHTML = `<div class="alert alert-danger p-2 small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        const accordionBox = document.getElementById("accordionNotifikasi");
        if(accordionBox) accordionBox.innerHTML = `<div class="alert alert-danger p-2 small m-2"><i class="bi bi-wifi-off me-1"></i>Gagal melakukan komunikasi data.</div>`;
    });
}

/**
 * Fungsi Eksekutor Penghapusan Notifikasi Log dari MySQL
 * @param {number} idNotifikasi - ID unik baris pemberitahuan
 * @param {string} kategoriKey - Jenis/kategori notifikasi terkait
 */
window.eksekusiHapusNotifikasiMySQL = function(idNotifikasi) {
    if (!idNotifikasi) return;

    if (!confirm("Apakah Anda yakin ingin menghapus permanen pemberitahuan log ini dari daftar?")) {
        return;
    }

    const payload = new FormData();
    payload.append("id", idNotifikasi);
   

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_notifikasi_log`, {
        method: "POST",
        body: payload
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === 'success') {
menuNotifikasi();
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error("Gagal menghapus log pemberitahuan:", err);
        alert("Koneksi ke server database gagal atau terputus.");
    });
};

window.tandaiKategoriSudahDibaca= function(jenisKategori) {
    const badgeKategori = document.getElementById(`badge-kat-${jenisKategori}`);
    
    // Jika tidak ada badge merah / 0, abaikan hit ke server untuk menghemat bandwidth
    if (!badgeKategori) return;

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const payload = new FormData();
    payload.append("jenis", jenisKategori);

    fetch(`${cleanEndpoint}/proses.php?aksi=baca_notifikasi_kategori`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            // Hilangkan badge merah di kategori tersebut secara instan tanpa reload halaman
            badgeKategori.remove();
            
            // Mutakhirkan juga angka badge navigasi utama di pojok menu
            if (typeof muatBadgeNotifikasiAdmin === "function") {
                muatBadgeNotifikasiAdmin();
            }
        }
    })
    .catch(err => console.error("Gagal memperbarui status baca kategori:", err));
}

function muatBadgeNotifikasiAdmin() {
    const badgeEl = document.getElementById("badge-notif-admin");
    if (!badgeEl) return; // Proteksi jika elemen belum dirender di DOM

    // Gunakan konfigurasi URL global aplikasi Anda
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_jumlah_notif`)
    .then(response => {
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return response.json();
    })
    .then(res => {
        if (res.status === 'success') {
            const jumlahBelumBaca = parseInt(res.jumlah, 10);
            
            if (jumlahBelumBaca > 0) {
                badgeEl.innerText = jumlahBelumBaca;
                badgeEl.classList.remove("d-none"); // Tampilkan badge merah jika ada data
            } else {
                badgeEl.classList.add("d-none");    // Sembunyikan jika kosong (0)
            }
        }
    })
    .catch(error => {
        console.error("Gagal sinkronisasi counter badge admin:", error);
    });
}

// Jalankan fungsi sesaat setelah susunan menu admin selesai dirender ke layar
setTimeout(muatBadgeNotifikasiAdmin, 500);

// Pilihan tambahan: Lakukan sinkronisasi otomatis tiap 30 detik secara background (polling)
setInterval(muatBadgeNotifikasiAdmin, 30000);

// =========================================================================
// INTERFAS VALIDASI UPLOAD FOTO DI MODAL 3
// =========================================================================
window.bukaValidasiFotoKeModal3 = function(idUser, idNotif, namaDokter) {
    if (typeof modal3 !== "function") {
        console.warn("FUNGSI GLOBAL modal3() TIDAK TERDETEKSI DI SYSTEM WINDOW");
        return;
    }

    // 1. Tampilkan status loading awal di dalam kanvas Modal 3
    modal3("Validasi", `
        <div class="text-center py-5" id="konten-modal3-validasi">
            <span class="spinner-border text-success mb-2"></span>
            <p class="text-muted small">Menghubungkan antrean foto sementara...</p>
        </div>
    `);
    
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    // 2. Tarik data ID berkas drive temporer dari MySQL lewat PHP
    fetch(`${cleanEndpoint}/proses.php?aksi=get_foto_sementara&id_user=${idUser}`)
    .then(res => res.json())
    .then(res => {
        const boxModal = document.getElementById("konten-modal3-validasi");
        if (!boxModal) return;

        if (res.status === "success") {
            const fileIdDriveSementara = res.data.fotoprofil;
            const nama_Dokter = res.data.nama;
            if(nama_Dokter!==null)
			{
			namaDokter=nama_Dokter;
			}
            // Render antarmuka pratinjau foto beserta 3 tombol keputusan utama
            boxModal.innerHTML = `
                <div class="p-2 text-center">
                    <div class="mb-3 mx-auto shadow-sm rounded-circle overflow-hidden border border-secondary" style="width: 180px; height: 180px; background: #000;">
                        <img src="https://lh3.googleusercontent.com/d/${fileIdDriveSementara}" class="w-100 h-100 object-fit-cover" alt="Pratinjau Foto Dokter">
                    </div>
                    <h6 class="fw-bold text-dark mb-1">${namaDokter}</h6>
                    <p class="text-muted font-monospace mb-4" style="font-size:0.75rem;">ID Anggota: #${idUser} | Temp ID File: ${fileIdDriveSementara}</p>
                    
                    <!-- Wadah informasi pemrosesan AJAX -->
                    <div id="alertAksiStatus" class="mb-3 small"></div>

                    <!-- Pilihan Tombol Opsi Aksi untuk Admin -->
                    <div class="d-grid gap-2 d-sm-flex justify-content-center">
                        <button class="btn btn-success btn-sm px-3 fw-bold" onclick="eksekusiKeputusanValidasi(${idUser}, '${fileIdDriveSementara}', 'terima', ${idNotif})">
                            <i class="bi bi-check-circle me-1"></i> Terima & Pindahkan
                        </button>
                        <button class="btn btn-warning btn-sm px-3 fw-bold text-dark" onclick="eksekusiKeputusanValidasi(${idUser}, '${fileIdDriveSementara}', 'pending', ${idNotif})">
                            <i class="bi bi-hourglass-split me-1"></i> Pending
                        </button>
                        <button class="btn btn-danger btn-sm px-3 fw-bold" onclick="eksekusiKeputusanValidasi(${idUser}, '${fileIdDriveSementara}', 'tolak', ${idNotif})">
                            <i class="bi bi-x-circle me-1"></i> Tolak
                        </button>
                    </div>
                </div>
            `;
        } else {
            boxModal.innerHTML = `<div class="alert alert-danger py-2 small"><i class="bi bi-exclamation-triangle me-1"></i> ${res.message}</div>`;
            window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal menarik data dari server:", err);
        const boxModal = document.getElementById("konten-modal3-validasi");
        if(boxModal) boxModal.innerHTML = `<div class="alert alert-danger py-2 small"><i class="bi bi-wifi-off me-1"></i> Koneksi server lokal bermasalah.</div>`;
    });
};

window.bukaValidasiProfilKeModal3 = function(idUser, idNotif) {
    if (typeof modal3 !== "function") return;

    modal3("Validasi", `
        <div class="text-center py-5" id="konten-modal3-validasi">
            <span class="spinner-border text-primary mb-2"></span>
            <p class="text-muted small">Menarik komparasi data lengkap MySQL...</p>
        </div>
    `);

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_komparasi_profil&id_user=${idUser}`)
    .then(res => res.json())
    .then(res => {
        const boxModal = document.getElementById("konten-modal3-validasi");
        if (!boxModal) return;

        if (res.status === "success") {
            const dataAsli = res.data_asli || {};
            const dataBaru = res.data_baru || {};
            
            // 1. HELPER PARSER JSON: Mengubah data array JSON DB (pekerjaan/tempat kerja) menjadi teks biasa/list
            const formatJsonKeTeks = (jsonString) => {
                if (!jsonString || jsonString.trim() === "" || jsonString === "[]") return "";
                try {
                    const parsed = JSON.parse(jsonString);
                    if (Array.isArray(parsed)) {
                        return parsed.map(item => `- ${item}`).join('<br>');
                    }
                    return String(jsonString);
                } catch (e) {
                    return String(jsonString); // Fallback jika string teks biasa
                }
            };

            // 2. HELPER KOMPARASI: Mendeteksi perubahan teks lama vs baru secara presisi
            const cekBeda = (oldVal, newVal, isJsonField = false) => {
                let vOld = isJsonField ? formatJsonKeTeks(oldVal) : (oldVal || '').trim();
                let vNew = isJsonField ? formatJsonKeTeks(newVal) : (newVal || '').trim();

                if (!vOld && !vNew) return `<span class="text-muted"><i>Kosong</i></span>`;
                if (vOld === vNew) return `<span class="text-dark">${vNew}</span>`;
                
                return `
                    <div class="text-danger text-decoration-line-through small" style="opacity: 0.85;">${vOld || '(Kosong)'}</div>
                    <div class="text-success fw-bold mt-0.5"><i class="bi bi-arrow-right me-1"></i>${vNew || '(Dihapus)'}</div>
                `;
            };

            // 3. Suntikkan visual tabel komparasi komprehensif ke dalam Modal 3
            boxModal.innerHTML = `
                <div class="p-1">
                    <h6 class="fw-bold text-secondary text-start mb-2"><i class="bi bi-arrow-left-right me-1"></i> Perbandingan Atribut Biodata (Lama vs Usulan Baru)</h6>
                    
                    <div style="max-height: 400px; overflow-y: auto;" class="border rounded-3 mb-3 bg-white shadow-sm">
                        <table class="table table-sm table-striped align-middle mb-0 small text-start">
                            <thead class="table-dark" style="position: sticky; top: 0; z-index: 10;">
                                <tr>
                                    <th width="35%" class="ps-3 py-2">Atribut Kelompok</th>
                                    <th class="py-2">Status Perubahan Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- SEKTOR 1: IDENTITAS UTAMA -->
                                <tr class="table-secondary fw-bold"><td colspan="2" class="ps-2 text-dark">1. Identitas Pokok & Legitimasi</td></tr>
                                <tr><th class="ps-3">Nama Lengkap & Gelar</th><td>${cekBeda(dataAsli.nama, dataBaru.nama)}</td></tr>
                                <tr><th class="ps-3">Nomor Anggota (NPA)</th><td>${cekBeda(dataAsli.npa, dataBaru.npa)}</td></tr>
                                <tr><th class="ps-3">NIK KTP</th><td>${cekBeda(dataAsli.nik, dataBaru.nik)}</td></tr>
                                <tr><th class="ps-3">Surat Tanda Registrasi (STR)</th><td>${cekBeda(dataAsli.str, dataBaru.str)}</td></tr>
                                
                                <!-- SEKTOR 2: BIODATA PRIBADI -->
                                <tr class="table-secondary fw-bold"><td colspan="2" class="ps-2 text-dark">2. Profil Pribadi</td></tr>
                                <tr><th class="ps-3">Tempat Lahir</th><td>${cekBeda(dataAsli.tempat_lahir, dataBaru.tempat_lahir)}</td></tr>
                                <tr><th class="ps-3">Tanggal Lahir</th><td>${cekBeda(dataAsli.tgl_lahir, dataBaru.tgl_lahir)}</td></tr>
                                <tr><th class="ps-3">Jenis Kelamin (Gender)</th><td>${cekBeda(dataAsli.gender, dataBaru.gender)}</td></tr>
                                <tr><th class="ps-3">Agama</th><td>${cekBeda(dataAsli.agama, dataBaru.agama)}</td></tr>
                                <tr><th class="ps-3">Status Pernikahan</th><td>${cekBeda(dataAsli.status_nikah, dataBaru.status_nikah)}</td></tr>
                                <tr><th class="ps-3">Alamat Rumah Kediaman</th><td>${cekBeda(dataAsli.alamat, dataBaru.alamat)}</td></tr>
                                
                                <!-- SEKTOR 3: PROFESI & PEKERJAAN -->
                                <tr class="table-secondary fw-bold"><td colspan="2" class="ps-2 text-dark">3. Pendidikan & Karir Klinik</td></tr>
                                <tr><th class="ps-3">Riwayat Pendidikan</th><td>${cekBeda(dataAsli.pendidikan, dataBaru.pendidikan)}</td></tr>
                                <tr><th class="ps-3">Profesi Utama</th><td>${cekBeda(dataAsli.profesiutama, dataBaru.profesiutama)}</td></tr>
                                <tr><th class="ps-3">Riwayat Pekerjaan</th><td>${cekBeda(dataAsli.pekerjaan, dataBaru.pekerjaan, true)}</td></tr>
                                <tr><th class="ps-3">Tempat Praktik Kerja</th><td>${cekBeda(dataAsli.tempatkerja, dataBaru.tempatkerja, true)}</td></tr>
                                
                                <!-- SEKTOR 4: MEDIA SOSIAL -->
                                <tr class="table-secondary fw-bold"><td colspan="2" class="ps-2 text-dark">4. Tautan Jejaring Sosial</td></tr>
                                <tr><th class="ps-3"><i class="bi bi-facebook text-primary me-1"></i> Facebook</th><td>${cekBeda(dataAsli.facebook, dataBaru.facebook)}</td></tr>
                                <tr><th class="ps-3"><i class="bi bi-instagram text-danger me-1"></i> Instagram</th><td>${cekBeda(dataAsli.instagram, dataBaru.instagram)}</td></tr>
                                <tr><th class="ps-3"><i class="bi bi-tiktok text-dark me-1"></i> Tiktok</th><td>${cekBeda(dataAsli.tiktok, dataBaru.tiktok)}</td></tr>
                                <tr><th class="ps-3"><i class="bi bi-youtube text-danger me-1"></i> Youtube</th><td>${cekBeda(dataAsli.youtube, dataBaru.youtube)}</td></tr>
                                
                                <!-- SEKTOR 5: KONTAK -->
                                <tr class="table-secondary fw-bold"><td colspan="2" class="ps-2 text-dark">5. Jalur Kontak Telekomunikasi</td></tr>
                                <tr><th class="ps-3">Alamat Email</th><td>${cekBeda(dataAsli.email, dataBaru.email)}</td></tr>
                                <tr><th class="ps-3">No. Telepon / WhatsApp</th><td>${cekBeda(dataAsli.telpon, dataBaru.telpon)}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div id="alertAksiStatusProfil" class="mb-3 small"></div>

                    <div class="d-grid gap-2 d-sm-flex justify-content-center pt-1">
                        <button class="btn btn-success btn-sm px-4 fw-bold" onclick="eksekusiKeputusanProfil(${idUser}, 'terima', ${idNotif})">
                            <i class="bi bi-check-circle me-1"></i> Setujui & Terapkan
                        </button>
                        <button class="btn btn-warning btn-sm px-4 fw-bold text-dark" onclick="eksekusiKeputusanProfil(${idUser}, 'pending', ${idNotif})">
                            <i class="bi bi-hourglass-split me-1"></i> Lewati
                        </button>
                        <button class="btn btn-danger btn-sm px-4 fw-bold" onclick="eksekusiKeputusanProfil(${idUser}, 'tolak', ${idNotif})">
                            <i class="bi bi-trash3 me-1"></i> Tolak Perubahan
                        </button>
                    </div>
                </div>
            `;
        } else {
            boxModal.innerHTML = `<div class="alert alert-danger py-2 small"><i class="bi bi-exclamation-triangle me-1"></i> ${res.message}</div>`;
            setTimeout(() => {
  window.location.reload()
}, 2000);
        }
    })
    .catch(err => {
        console.error("Gagal melakukan render komparasi profil:", err);
        const boxModal = document.getElementById("konten-modal3-validasi");
        if(boxModal) boxModal.innerHTML = `<div class="alert alert-danger py-2 small"><i class="bi bi-wifi-off me-1"></i> Gagal memuat data dari gateway lokal.</div>`;
    });
};

window.bukaValidasiRekomKeModal3 = function(idUser, idNotif, rekom, namaDokter) {
rekomendasi(rekom);
setTimeout(() => {
 document.getElementById('inputCariAntreanMutasiRekomendasi').value=namaDokter.trim();
 document.getElementById('inputCariAntreanMutasiRekomendasi').focus();
}, 500);
};

window.bukaValidasiIuranKeModal3 = function(idUser, idNotif) {
menuIuranAdmin()
};

window.eksekusiKeputusanValidasi = function(idUser, fileId, opsi, idNotif) {
    const alertBox = document.getElementById("alertAksiStatus");
    const containerTombol = document.querySelector("#konten-modal3-validasi .d-sm-flex");
    
    // Kunci tombol agar admin tidak melakukan klik ganda (double submit)
    if (containerTombol) containerTombol.classList.add("d-none"); 
    alertBox.innerHTML = `<div class="text-primary font-monospace"><span class="spinner-border spinner-border-sm me-2"></span>Memproses opsi: [${opsi.toUpperCase()}] menuju cloud...</div>`;

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
	
    const payload = new FormData();
    payload.append("id_user", idUser);
    payload.append("file_id", fileId);
    payload.append("opsi", opsi);
    payload.append("id_notif", idNotif);
  
    fetch(`${cleanEndpoint}/proses.php?aksi=proses_keputusan_foto`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(res => {
		
        if (res.status === "success") {
            alertBox.innerHTML = `<div class="alert alert-success py-2 mb-0 small"><i class="bi bi-check-circle-fill me-1"></i> ${res.message}</div>`;
            setTimeout(() => {
                // Tutup dialog modal 3 secara otomatis menggunakan sistem tombol close Anda
                document.getElementById('closeBtn')?.click(); 
                // Segarkan data modal 2 agar badge merah dan statusnya diperbarui
                if (typeof bukaPanelNotifikasiKategori === "function") bukaPanelNotifikasiKategori(); 
            }, 1500);
        } else {
            // Jika gagal, munculkan kembali tombol interaksi
            if (containerTombol) containerTombol.classList.remove("d-none");
            alertBox.innerHTML = `<div class="alert alert-danger py-2 mb-0 small"><i class="bi bi-exclamation-octagon-fill me-1"></i> Gagal: ${res.message}</div>`;
            setTimeout(() => {
            window.location.reload();
            }, 2000);
            
        }
    })
    .catch(err => {
        if (containerTombol) containerTombol.classList.remove("d-none");
        alertBox.innerHTML = `<div class="alert alert-danger py-2 mb-0 small"><i class="bi bi-wifi-off me-1"></i> Jaringan data internal terputus </div>`;
    });
};

window.eksekusiKeputusanProfil = function(idUser, opsi, idNotif) {
    const alertBox = document.getElementById("alertAksiStatusProfil");
    const containerTombol = document.querySelector("#konten-modal3-validasi .d-sm-flex");
    
    if (containerTombol) containerTombol.classList.add("d-none");
    alertBox.innerHTML = `<div class="text-primary font-monospace"><span class="spinner-border spinner-border-sm me-2"></span>Menyinkronkan keputusan: [${opsi.toUpperCase()}]...</div>`;

    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const payload = new FormData();
    payload.append("id_user", idUser);
    payload.append("opsi", opsi);
    payload.append("id_notif", idNotif);

    fetch(`${cleanEndpoint}/proses.php?aksi=proses_keputusan_profil`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alertBox.innerHTML = `<div class="alert alert-success py-2 mb-0 small"><i class="bi bi-check-circle-fill me-1"></i> ${data.message}</div>`;
            setTimeout(() => {
                document.getElementById('closeBtn')?.click(); // Tutup Modal 3
                if (typeof bukaPanelNotifikasiKategori === "function") bukaPanelNotifikasiKategori(); // Refresh Modal 2
            }, 1500);
        } else {
            if (containerTombol) containerTombol.classList.remove("d-none");
            alertBox.innerHTML = `<div class="alert alert-danger py-2 mb-0 small"><i class="bi bi-exclamation-octagon-fill me-1"></i> Error: ${data.message}</div>`;
            setTimeout(() => {
  window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        if (containerTombol) containerTombol.classList.remove("d-none");
        alertBox.innerHTML = `<div class="alert alert-danger py-2 mb-0 small"><i class="bi bi-wifi-off me-1"></i> Gangguan internal fetch gateway.</div>`;
    });
};

window.fetchLiveUserOnlineAdminSync = function() {
    const labelCount = document.getElementById("badge-useronline-admin");
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    
    fetch(`${cleanEndpoint}/proses.php?aksi=get_user_online`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            console.log(res.total_online);
            if (labelCount) labelCount.innerText = res.total_online;
            
            if (res.data.length === 0) {
                labelCount?.classList.add('d-none');
            }
            else
            {
                 labelCount?.classList.remove('d-none');
            }
        }
    })
    .catch(err => console.error("Gagal sinkronisasi panel user online:", err));
};

/**
 * Fungsi Membuka Jendela Modal 2 Untuk Memantau User Online Secara Detail
 */
window.useronline= function() {
    // 1. Siapkan Layouting Kerangka Awal di Dalam Modal 2 (Fullscreen Component)
    const htmlLayoutDasar = `
        <div class="container py-2" id="modal2UserOnlineWrapper">
            <div class="row justify-content-center">
                <div class="col-lg-12">
                    <!-- INFORMASI STATUS HEADLINE -->
                    <div class="alert bg-success-subtle text-success border-0 p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between gap-3 shadow-sm">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-broadcast fs-3 text-success animate-pulse"></i>
                            <div>
                                <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Live Aktivitas Keanggotaan</span>
                                <span class="small">Menampilkan daftar sejawat dokter yang terdeteksi aktif beraktivitas di dalam sistem dalam rentang 5 menit terakhir.</span>
                            </div>
                        </div>
                        <div class="fw-bold font-monospace bg-white text-success border border-success border-opacity-25 px-3 py-1 rounded-pill small">
                            Total: <span id="textTotalOnlineModal2">0</span> Online
                        </div>
                    </div>

                    <!-- AREA PENERIMA DATA TABEL MYSQL (DYNAMIC CONTAINER) -->
                    <div id="mysqlUserOnlineTableAreaModal2" class="animate-fade-in">
                        <div class="text-center py-5 text-muted bg-white rounded-4 border">
                            <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                            <p class="small mb-0 font-monospace text-secondary">Sedang memindai peladen awan IDI Batam...</p>
                        </div>
                    </div>
                    
                </div> 
            </div>
        </div>
    `;

    // 2. Luncurkan kerangka awal ke dalam jendela modal2v bawaan aplikasi Anda
    if (typeof modal2 === "function") {
        modal2('Monitor Anggota Online', htmlLayoutDasar);
        
        // Panggil fungsi penarik data live setelah jeda transisi render modal (200ms)
        setTimeout(function() {
            window.eksekusiFetchUserOnlineModal2Murni();
        }, 200);
    } else {
        alert("Fungsi global modal2v tidak ditemukan di DOM Window.");
    }
};

/**
 * Core Engine Ajax Fetch Untuk Sinkronisasi Tabel User Online
 */
window.eksekusiFetchUserOnlineModal2Murni = function() {
    const tableArea = document.getElementById("mysqlUserOnlineTableAreaModal2");
    const countLabel = document.getElementById("textTotalOnlineModal2");
    if (!tableArea) return;

    // Normalisasi url endpoint hulu dari config.js
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_user_online`)
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status " + res.status);
        return res.json();
    })
    .then(res => {
        if (res.status === 'success') {
            // Update lencana total angka online di bagian atas alert banner
            if (countLabel) countLabel.innerText = res.total_online;

            const listDb = res.data;

            // Penanganan jika data online murni kosong (0)
            if (!listDb || listDb.length === 0) {
                tableArea.innerHTML = `
                    <div class="text-center py-5 text-muted rounded-4 bg-white border border-dashed animate-fade-in">
                        <i class="bi bi-people display-4 d-block mb-2 text-secondary-subtle"></i>
                        <h6 class="fw-bold text-secondary">Peladen Kosong</h6>
                        <p class="small mb-0 px-3 text-muted">Saat ini tidak ada anggota dokter yang sedang membuka aplikasi (0 Online).</p>
                    </div>
                `;
                return;
            }

            let tableRowsHtml = "";
            let counterNo = 1;

            // Merakit susunan baris tabel berdasarkan data relasional MySQL
            for (let i = 0; i < listDb.length; i++) {
                const row = listDb[i];

                tableRowsHtml += `
                    <tr class="animate-fade-in">
                        <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                        <td class="fw-bold text-dark small text-uppercase"> ${row.nama}</td>
                        <td class="font-monospace text-secondary small">${row.npa}</td>
                        <td class="font-monospace text-idi small" nowrap>
                            <div class="d-flex align-items-center gap-1">
                                <span class="text-muted font-monospace">+62</span>
                                <b>${row.telpon}</b>
                            </div>
                        </td>
                        <td class="small text-muted fw-semibold">${row.profesi}</td>
                        <td class="text-center font-monospace text-success fw-bold" style="font-size:0.85rem;" nowrap>
                            <i class="bi bi-clock-fill me-1 small"></i>${row.waktu_aktif} WIB
                        </td>
                    </tr>
                `;
            }

            // Suntikkan Tabel Responsif Lengkap ke dalam Container Modal 2
            tableArea.innerHTML = `
                <div class="table-responsive rounded-4 border overflow-hidden shadow-sm bg-white animate-fade-in">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                        <thead class="table-dark text-uppercase font-monospace" style="font-size:0.75rem; letter-spacing:0.5px;">
                            <tr>
                                <th width="4%" class="text-center">No</th>
                                <th width="28%">Nama Anggota Dokter</th>
                                <th width="15%">NPA IDI</th>
                                <th width="18%">No Telepon / WA</th>
                                <th width="18%">Profesi / Spesialis</th>
                                <th width="17%" class="text-center">Aktivitas Terakhir</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            tableArea.innerHTML = `<div class="alert alert-danger p-3 small"><i class="bi bi-exclamation-octagon me-1"></i> Gagal sinkronisasi data: ${res.message}</div>`;
            setTimeout(() => {
  window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error("Gagal melacak data monitor online:", err);
        tableArea.innerHTML = `
            <div class="alert alert-danger p-3 small mb-0 text-center rounded-4 shadow-sm animate-fade-in">
                <i class="bi bi-wifi-off display-6 d-block mb-2"></i> Koneksi data awan terputus. Pastikan file proses.php aktif di localhost Anda.
            </div>
        `;
    });
};

/**
 * Modul Aplikasi Pembuat Invoice Umum / Sponsor Dana Acara IDI Batam
 * FIX: Menambahkan tombol pintas penampil arsip riwayat langsung ke Jendela Modal 3
 */
window.bukaFormInvoiceUmumSponsorModal2 = function() {
    if (typeof modal2 !== "function") return;

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*$/, '') : '';

    // Tampilkan loading screen sementara mengambil nomor surat berjalan dari MySQL
    modal2('Buat Invoice Sponsor', `
        <div class="p-5 text-center text-muted animate-fade-in">
            <div class="spinner-border text-success mb-2" role="status"></div>
            <p class="small font-monospace">Mengurai buku nomor surat sekretariat IDI Batam...</p>
        </div>
    `);

    // 1. Ambil nomor surat otomatis dari proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_nomor_invoice_terakhir`)
    .then(res => res.json())
    .then(res => {
        if (res.status !== 'success') throw new Error("Gagal mengalokasikan nomor surat baru.");

        // 2. GELAR FORM ENTRI INVOICE UMUM SPONSOR DI MODAL 2
        const htmlFormSponsor = `
            <div class="container py-2" id="wrapperInvoiceUmum">
                <div class="alert bg-success-subtle text-success border-0 p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between gap-3 shadow-sm">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-file-earmark-medical-fill fs-3 text-success"></i>
                        <div>
                            <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px;">Penerbitan Nota Tagihan</span>
                            <span class="small">Isi parameter di bawah ini untuk menerbitkan surat invoice sponsor resmi.</span>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-success fw-bold px-3 rounded-pill bg-white shadow-sm d-flex align-items-center gap-1" style="font-size:0.75rem;"
                            onclick="window.bukaModal3LihatRiwayatInvoiceSponsorDinamis()">
                        <i class="bi bi-collection-play-fill"></i> Lihat Riwayat Invoice
                    </button>
                </div>

                <form id="formSimpanInvoiceUmumMySQL" class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary">Nomor Surat Invoice (Otomatis)</label>
                        <input type="text" class="form-control font-monospace fw-bold bg-light text-primary" id="invNoSurat" value="${res.nomor_baru}" readonly style="letter-spacing:0.3px;">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Tanggal Invoice</label>
                        <input type="date" class="form-control font-monospace" id="invTanggal" value="${new Date().toISOString().substring(0, 10)}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nama Perusahaan / Sponsor</label>
                        <input type="text" class="form-control font-sans fw-semibold" id="invSponsor" placeholder="Contoh: PT Kalbe Farma Tbk" required autocomplete="off">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nama Agenda Kegiatan</label>
                        <input type="text" class="form-control font-sans fw-semibold" id="invKegiatan" placeholder="Contoh: HBDI Funrun 5K Cabang Batam" required autocomplete="off">
                    </div>

                    <!-- 💡 KOLOM BARU: NAMA CABANG -->
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nama Cabang Organisasi</label>
                        <input type="text" class="form-control font-sans fw-semibold text-uppercase" id="invCabang" value="CABANG BATAM" required autocomplete="off">
                    </div>
                    <!-- 💡 KOLOM BARU: NAMA BANK -->
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Bank Tujuan Pembayaran</label>
                        <input type="text" class="form-control font-sans fw-semibold" id="invNamaBank" value="BANK MANDIRI" required autocomplete="off">
                    </div>

                    <!-- 💡 KOLOM BARU: NOMOR REKENING -->
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nomor Rekening Bank</label>
                        <input type="text" class="form-control font-monospace fw-bold" id="invNoRekening" value="109-00-1050206-0" required autocomplete="off">
                    </div>
                    <!-- 💡 KOLOM BARU: ATAS NAMA REKENING -->
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Rekening Atas Nama (Beneficiary)</label>
                        <input type="text" class="form-control font-sans fw-semibold text-uppercase" id="invAtasNama" value="IDI CABANG BATAM" required autocomplete="off">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nominal Nilai Tagihan (Rp)</label>
                        <div class="input-group shadow-sm rounded-3 overflow-hidden">
                            <span class="input-group-text bg-light fw-bold text-muted small">Rp</span>
                            <input type="number" class="form-control fw-bold text-success font-monospace" id="invNominal" placeholder="Contoh: 15000000" min="1" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Status Awal Invoice</label>
                        <select class="form-select fw-bold text-dark" id="invStatus">
                            <option value="Draf">Draf (Belum Dikirim)</option>
                            <option value="Dikirim" selected>Dikirim ke Sponsor</option>
                            <option value="Lunas">Lunas (Dana Masuk Rekening)</option>
                        </select>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Rincian / Deskripsi Paket Tagihan Sponsor</label>
                        <textarea class="form-control small font-sans p-3" id="invDeskripsi" rows="3" placeholder="Masukkan rincian paket kerjasama sponsor..." required></textarea>
                    </div>

                    <div class="col-12 text-end pt-3 border-top mt-4">
                        <button type="button" class="btn btn-sm btn-dark rounded-pill px-4 me-2 shadow-sm" onclick="window.closeSecondAdminModal()">Batal</button>
                        <button type="submit" class="btn btn-sm btn-success px-4 fw-bold shadow-sm rounded-pill" id="btnSubmitInvoiceUmum">
                            <i class="bi bi-send-check-fill me-1"></i> Terbitkan & Simpan Invoice
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        modal2('Buat Invoice', htmlFormSponsor);
        window.inisialisasiSubmitFormInvoiceUmumMurni();
    })
    .catch(err => {
        console.error("Gagal sinkronisasi nomor surat otomatis:", err);
        modal2v('Error', '<div class="alert alert-danger m-3 small border-0">Gagal memuat pangkalan data nomor surat otomatis.</div>');
    });
};


/**
 * 💡 LAYER INTERAKTIF BARU: Fungsi Membuka Visualisasi Tabel Riwayat Khusus di Jendela Modal 3
 */
window.bukaModal3LihatRiwayatInvoiceSponsorDinamis = function() {
    if (typeof modal3 !== "function") {
        alert("Fungsi penampung modal3v tidak terdefinisi di DOM!");
        return;
    }

    // 1. Gelar layout loading state awal di Modal 3
    modal3('Arsip', `
        <div class="container py-2 text-start" id="modal3InvoiceSponsorWrapper">
            <div class="table-responsive rounded-4 border bg-white shadow-sm" id="tempatDataTabelInvoiceSponsorModal3" style="max-height: 400px; min-height: 250px; overflow-y: auto !important; display: block;">
                <div class="text-center py-5 text-muted">
                    <div class="spinner-border text-success mb-2" role="status" style="width: 1.8rem; height: 1.8rem;"></div>
                    <p class="small mb-0 font-monospace text-secondary">Sedang memindai arsip kuitansi komersial...</p>
                </div>
            </div>
            <div class="text-end pt-3 border-top mt-4">
                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">
                    Tutup Jendela Arsip
                </button>
            </div>
        </div>
    `);

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*$/, '') : '';

    // 2. Fetch data arsip invoice umum untuk disuntikkan ke dalam Modal 3
    fetch(`${cleanEndpoint}/proses.php?aksi=list_invoice_umum`)
    .then(res => res.json())
    .then(res => {
        const containerTabel3 = document.getElementById("tempatDataTabelInvoiceSponsorModal3");
        if (!containerTabel3) return;

        if (res.status === 'success') {
            const listDb = res.data;

            if (!listDb || listDb.length === 0) {
                containerTabel3.innerHTML = `
                    <div class="text-center py-5 text-muted border border-dashed rounded-4 m-2">
                        <i class="bi bi-file-earmark-x display-5 d-block mb-2 text-secondary-subtle"></i>
                        <h6 class="fw-bold text-secondary mb-0">Arsip Kosong</h6>
                    </div>
                `;
                return;
            }

                        let tableRowsHtml = "";
            let counterNo = 1;

            listDb.forEach(row => {
                let statusBadge = "";
                const st = (row.status_invoice || "").toLowerCase().trim();
                
                if (st === 'lunas') {
                    statusBadge = `<span class="badge bg-success-subtle text-success px-2 py-0.5 rounded small fw-bold">Lunas</span>`;
                } else if (st === 'dikirim') {
                    statusBadge = `<span class="badge bg-primary-subtle text-primary px-2 py-0.5 rounded small fw-bold">Dikirim</span>`;
                } else if (st === 'batal') {
                    statusBadge = `<span class="badge bg-danger-subtle text-danger px-2 py-0.5 rounded small fw-bold">Batal</span>`;
                } else {
                    statusBadge = `<span class="badge bg-secondary-subtle text-secondary px-2 py-0.5 rounded small fw-bold">Draf</span>`;
                }

                const nominalFormat = parseFloat(row.nominal_total).toLocaleString('id-ID');
                const linkCetakPdf = `${cleanEndpoint}/cetak_invoice_sponsor.php?id=${row.id}`;
                
                tableRowsHtml += `
                    <tr id="baris_invoice_${row.id}">
                        <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                        <td class="font-monospace fw-bold text-primary small text-nowrap">${row.no_surat_invoice}</td>
                        <td class="small font-monospace text-muted text-nowrap">${row.tanggal_invoice_indo || row.tanggal_invoice}</td>
                        <td class="fw-bold text-dark-emphasis small text-uppercase text-truncate" style="max-width:130px;" title="${row.perusahaan_sponsor}">${row.perusahaan_sponsor}</td>
                        <td class="small text-muted fw-semibold text-truncate" style="max-width:130px;" title="${row.nama_kegiatan}">${row.nama_kegiatan}</td>
                        <td class="text-end font-monospace fw-bold text-success small text-nowrap">Rp ${nominalFormat}</td>
                        <td class="text-center text-nowrap">${statusBadge}</td>
                        <td class="text-center text-nowrap">
                            <div class="d-flex align-items-center justify-content-center gap-1">
                                <!-- Tombol Cetak -->
                                <a href="${linkCetakPdf}" target="_blank" class="btn btn-xs btn-outline-danger px-1.5 py-0 rounded" title="Cetak PDF" style="font-size:0.65rem;">
                                    <i class="bi bi-file-pdf-fill"></i>
                                </a>
                                <!-- 💡 TOMBOL EDIT BARU -->
                                <button type="button" class="btn btn-xs btn-warning text-dark px-1.5 py-0 rounded" title="Edit Status / Data" style="font-size:0.65rem;"
                                        onclick="window.bukaModalEditInvoiceSponsor(${row.id})">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <!-- 💡 TOMBOL HAPUS BARU -->
                                <button type="button" class="btn btn-xs btn-danger px-1.5 py-0 rounded" title="Hapus Permanen" style="font-size:0.65rem;"
                                        onclick="window.eksekusiHapusInvoiceSponsorPermanen(${row.id}, '${row.no_surat_invoice.replace(/'/g, "\\'")}')">
                                    <i class="bi bi-trash3-fill"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            containerTabel3.innerHTML = `
                <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.8rem;">
                    <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.68rem; letter-spacing:0.3px; z-index:10;">
                        <tr>
                            <th width="4%" class="text-center">No</th>
                            <th width="18%">No. Surat</th>
                            <th width="12%" class="text-center">Tanggal</th>
                            <th width="20%">Nama Sponsor</th>
                            <th width="20%">Agenda</th>
                            <th width="11%" class="text-end">Total</th>
                            <th width="7%" class="text-center">Status</th>
                            <th width="12%" class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            `;
        } else { 
            containerTabel3.innerHTML = `<div class="alert alert-danger p-2 small m-2">Gagal memuat: ${res.message}</div>`; 
        } 
    }) 
    .catch(err => { 
        console.error("Gagal sinkronisasi arsip modal 3:", err); 
        const containerTabel3 = document.getElementById("tempatDataTabelInvoiceSponsorModal3"); 
        if (containerTabel3) { 
            containerTabel3.innerHTML = `<div class="alert alert-danger p-3 small text-center m-2 fw-semibold">Gagal terhubung ke peladen.</div>`;
        }
    });
};


/**
 * ⚡ CORE AUTOMATOR: Eksekusi Hapus Invoice Sponsor Massal dari MySQL
 */
window.eksekusiHapusInvoiceSponsorPermanen = function(idInv, nomorSuratText) {
    if (!confirm(`⚠️ PERINGATAN HAPUS DATA PERMANEN!\nApakah Anda yakin ingin menghapus berkas Invoice Sponsor nomor [ ${nomorSuratText} ] secara permanen?\nTindakan ini tidak dapat dibatalkan.`)) {
        return;
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    const payload = new FormData();
    payload.append("id", idInv);
    payload.append("hapus",  nomorSuratText);
    
    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_invoice_umum`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            // Hapus baris tabel secara visual tanpa merestart modal
            const barisTarget = document.getElementById(`baris_invoice_${idInv}`);
            if (barisTarget) barisTarget.remove();
            
            // Refresh tabel di halaman dashboard utama jika ada
            if (typeof window.eksekusiFetchDaftarInvoiceSponsorMurni === "function") {
                window.eksekusiFetchDaftarInvoiceSponsorMurni();
            }
        }
    })
    .catch(err => {
        console.error(err);
        alert("Gagal memproses penghapusan, periksa koneksi server.");
    });
};

window.bukaModalEditInvoiceSponsor = function(idInv) {
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*$/, '') : '';

    // 1. 🔥 KUNCI UTAMA: Bersihkan dan tutup dahulu semua modal (Modal 2 & Modal 3) yang sedang mengapung
    if (typeof tutupModalTerbuka === "function") {
        tutupModalTerbuka();
    } else {
        // Fallback jika nama fungsi penutup di sistem Anda sedikit berbeda
        const dialogNative = document.getElementById("fsDialog");
        if (dialogNative && dialogNative.close) dialogNative.close();
    }

    // 2. Berikan jeda transisi singkat (350ms) agar DOM bersih sebelum Modal 2 Edit digelar
    setTimeout(() => {
        if (typeof modal2 !== "function") return;

        // Gelar layar loading awal di dalam Modal 2 murni sendirian
        modal2('Edit Invoice Sponsor', `
            <div class="p-4 text-center text-muted">
                <div class="spinner-border text-warning mb-2" role="status"></div>
                <p class="small font-monospace">Mengambil rincian berkas invoice dari server...</p>
            </div>
        `);

        // 3. Tarik data detail kuitansi lama dari database MySQL
        fetch(`${cleanEndpoint}/proses.php?aksi=get_detail_invoice_umum&id=${idInv}`)
        .then(res => res.json())
        .then(res => {
            if (res.status !== 'success') throw new Error(res.message);
            
            const dataInv = res.data;

            // 4. Bangun Formulir Edit tunggal di dalam Modal 2
            const htmlFormEdit = `
                <div class="container py-2" id="wrapperEditInvoiceUmum">
                    <form id="formUpdateInvoiceUmumMySQL" class="row g-3">
                        <input type="hidden" id="editInvId" value="${dataInv.id}">
                        
                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary">Nomor Surat Invoice</label>
                            <input type="text" class="form-control font-monospace fw-bold bg-light" id="editInvNoSurat" value="${dataInv.no_surat_invoice}" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Tanggal Invoice</label>
                            <input type="date" class="form-control font-monospace" id="editInvTanggal" value="${dataInv.tanggal_invoice}" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nama Perusahaan / Sponsor</label>
                            <input type="text" class="form-control font-sans fw-semibold" id="editInvSponsor" value="${dataInv.perusahaan_sponsor}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nama Agenda Kegiatan</label>
                            <input type="text" class="form-control font-sans fw-semibold" id="editInvKegiatan" value="${dataInv.nama_kegiatan}" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nama Cabang Organisasi</label>
                            <input type="text" class="form-control font-sans fw-semibold text-uppercase" id="editInvCabang" value="${dataInv.nama_cabang}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Bank Tujuan Pembayaran</label>
                            <input type="text" class="form-control font-sans fw-semibold" id="editInvNamaBank" value="${dataInv.nama_bank}" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nomor Rekening Bank</label>
                            <input type="text" class="form-control font-monospace fw-bold" id="editInvNoRekening" value="${dataInv.no_rekening}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Rekening Atas Nama (Beneficiary)</label>
                            <input type="text" class="form-control font-sans fw-semibold text-uppercase" id="editInvAtasNama" value="${dataInv.atas_nama}" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Nominal Nilai Tagihan (Rp)</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light fw-bold text-muted small">Rp</span>
                                <input type="number" class="form-control fw-bold text-success font-monospace" id="editInvNominal" value="${parseInt(dataInv.nominal_total, 10)}" min="1" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Status Invoice</label>
                            <select class="form-select fw-bold text-dark" id="editInvStatus">
                                <option value="Draf" ${dataInv.status_invoice === 'Draf' ? 'selected' : ''}>Draf (Belum Dikirim)</option>
                                <option value="Dikirim" ${dataInv.status_invoice === 'Dikirim' ? 'selected' : ''}>Dikirim ke Sponsor</option>
                                <option value="Lunas" ${dataInv.status_invoice === 'Lunas' ? 'selected' : ''}>Lunas (Dana Masuk Rekening)</option>
                                <option value="Batal" ${dataInv.status_invoice === 'Batal' ? 'selected' : ''}>Batal (Dibatalkan)</option>
                            </select>
                        </div>

                        <div class="col-md-12">
                            <label class="form-label fw-bold small text-secondary"><span class="text-danger">*</span> Rincian / Deskripsi Paket Tagihan Sponsor</label>
                            <textarea class="form-control small font-sans p-2" id="editInvDeskripsi" rows="3" required>${dataInv.deskripsi_tagihan}</textarea>
                        </div>

                        <div class="col-12 text-end pt-3 border-top mt-4">
                            <!-- Tombol Batal Sekarang Mengarahkan Kembali Membuka Riwayat Modal 3 -->
                            <button type="button" class="btn btn-sm btn-dark rounded-pill px-4 me-2 shadow-sm" 
                                    onclick="window.closeSecondAdminModal(); setTimeout(() => { window.bukaModal3LihatRiwayatInvoiceSponsorDinamis(); }, 300);">
                                <i class="bi bi-arrow-left-short"></i> Kembali ke Arsip
                            </button>
                            <button type="submit" class="btn btn-sm btn-warning px-4 fw-bold shadow-sm rounded-pill text-dark" id="btnUpdateInvoiceUmum">
                                <i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            `;
            
            modal2('Edit Invoice', htmlFormEdit);
            window.inisialisasiSubmitFormUpdateInvoiceUmum();
        })
        .catch(err => {
            console.error(err);
            modal2('Error', `<div class="alert alert-danger m-3 small">${err.message}</div>`);
        });
    }, 350);
};
/**
 * ⚡ HANDLER SUBMIT UPDATE INVOICE
 */
window.inisialisasiSubmitFormUpdateInvoiceUmum = function() {
    const form = document.getElementById("formUpdateInvoiceUmumMySQL");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const btn = document.getElementById("btnUpdateInvoiceUmum");
        if (btn) btn.disabled = true;

        const payload = new FormData();
        payload.append("id", document.getElementById("editInvId").value);
        payload.append("tanggal", document.getElementById("editInvTanggal").value);
        payload.append("sponsor", document.getElementById("editInvSponsor").value.trim());
        payload.append("kegiatan", document.getElementById("editInvKegiatan").value.trim());
        payload.append("cabang", document.getElementById("editInvCabang").value.trim());
        payload.append("nama_bank", document.getElementById("editInvNamaBank").value.trim());
        payload.append("no_rekening", document.getElementById("editInvNoRekening").value.trim());
        payload.append("atas_nama", document.getElementById("editInvAtasNama").value.trim());
        payload.append("nominal", document.getElementById("editInvNominal").value);
        payload.append("status", document.getElementById("editInvStatus").value);
        payload.append("deskripsi", document.getElementById("editInvDeskripsi").value.trim());

        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

        fetch(`${cleanEndpoint}/proses.php?aksi=update_invoice_umum`, {
            method: "POST",
            body: payload
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                window.closeSecondAdminModal();
                
                // Refresh list riwayat di Modal 3 secara otomatis
                if (typeof window.bukaModal3LihatRiwayatInvoiceSponsorDinamis === "function") {
                    window.bukaModal3LihatRiwayatInvoiceSponsorDinamis();
                }
                // Refresh list di dashboard utama jika ada
                if (typeof window.eksekusiFetchDaftarInvoiceSponsorMurni === "function") {
                    window.eksekusiFetchDaftarInvoiceSponsorMurni();
                }
            } else {
                if (btn) btn.disabled = false;
            }
        })
        .catch(err => {
            console.error(err);
            alert("Koneksi bermasalah.");
            if (btn) btn.disabled = false;
        });
    });
};


window.inisialisasiSubmitFormInvoiceUmumMurni = function() {
    const form = document.getElementById("formSimpanInvoiceUmumMySQL");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const btn = document.getElementById("btnSubmitInvoiceUmum");
        if (btn) btn.disabled = true;

        const tglInput = document.getElementById("invTanggal").value;
        const pecahTanggal = tglInput.split("-"); // [YYYY, MM, DD]
        
        const payload = new FormData();
        payload.append("no_surat", document.getElementById("invNoSurat").value);
        payload.append("tanggal", tglInput);
        payload.append("sponsor", document.getElementById("invSponsor").value.trim());
        payload.append("kegiatan", document.getElementById("invKegiatan").value.trim());
        
        // 💡 SUNTIKKAN 4 PARAMETER BARU KE DALAM POST PAYLOAD AJAX
        payload.append("cabang", document.getElementById("invCabang").value.trim());
        payload.append("nama_bank", document.getElementById("invNamaBank").value.trim());
        payload.append("no_rekening", document.getElementById("invNoRekening").value.trim());
        payload.append("atas_nama", document.getElementById("invAtasNama").value.trim());
        
        payload.append("nominal", document.getElementById("invNominal").value);
        payload.append("status", document.getElementById("invStatus").value);
        payload.append("deskripsi", document.getElementById("invDeskripsi").value.trim());
        
        payload.append("bulan_log", parseInt(pecahTanggal[1], 10));
        payload.append("tahun_log", parseInt(pecahTanggal[0], 10));
		        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/+\$/, '') : '';

        // 💡 FIX: Menambahkan pembungkus backtick (`) yang valid pada endpoint URL
        fetch(`${cleanEndpoint}/proses.php?aksi=insert_invoice_umum`, {
            method: "POST",
            body: payload
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                window.closeSecondAdminModal();
                if (typeof window.bukaModal3LihatRiwayatInvoiceSponsorDinamis === "function") {
                    window.bukaModal3LihatRiwayatInvoiceSponsorDinamis();
                }
                if (typeof window.eksekusiFetchDaftarInvoiceSponsorMurni === "function") {
                    window.eksekusiFetchDaftarInvoiceSponsorMurni();
                }
            } else {
                if (btn) btn.disabled = false;
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
 * Modul Utama: Manajemen Pengguna Akun Administrator IDI Batam
 * POTONGAN 1: Menampilkan Tabel List Riwayat Admin dari Tabel 'admin'
 */
window.menuAdmin = function() {
    if (typeof modal2 !== "function") return;

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Tampilkan Loading State awal saat memilah data dari MySQL
    modal2('Manajemen Akun Admin', `
        <div class="text-center py-5 text-muted animate-fade-in" id="adminMasterTableWrapper">
            <div class="spinner-border text-danger mb-2" role="status"></div>
            <p class="small font-monospace">Mengamankan enkripsi pangkalan data pengguna...</p>
        </div>
    `);

    // Ambil daftar user admin dari proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=list_master_admin`)
    .then(res => res.json())
    .then(res => {
        const wrapper = document.getElementById("adminMasterTableWrapper");
        if (!wrapper) return;
        if (res.status === 'success') {
            const listAdmin = res.data;
            let tableRowsHtml = "";
            let counterNo = 1;

            listAdmin.forEach(row => {
                const badgeLevel = row.level == 1 
                    ? `<span class="badge bg-danger-subtle text-danger fw-bold rounded-pill px-2">Level 1 (Super Admin)</span>`
                    : `<span class="badge bg-primary-subtle text-primary fw-bold rounded-pill px-2">Level 2 (Staff)</span>`;

                tableRowsHtml += `
                    <tr id="baris_master_admin_${row.id}">
                        <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                        <!-- Menggunakan row.username yang ditarik dari field 'wa' database -->
                        <td class="fw-bold text-dark font-monospace small">${row.username}</td>
                        <td class="small text-muted fw-semibold">${row.nama || '-'}</td>
                        <td class="text-center">${badgeLevel}</td>
                        <td class="text-center">
                            <div class="d-flex align-items-center justify-content-center gap-1">
                                <button type="button" class="btn btn-xs btn-warning text-dark px-2 py-0.5 rounded fw-bold" style="font-size:0.7rem;"
                                        onclick="window.bukaFormEditAdminDirect(${row.id}, '${row.username}', '${row.nama || ''}', ${row.level})">
                                    <i class="bi bi-pencil-square"></i> Edit
                                </button>
                                <button type="button" class="btn btn-xs btn-danger px-2 py-0.5 rounded fw-bold" style="font-size:0.7rem;"
                                        onclick="window.eksekusiHapusAdminMaster(${row.id}, '${row.username}')">
                                    <i class="bi bi-trash3-fill"></i> Hapus
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            wrapper.className = "container py-1 text-start animate-fade-in";
            wrapper.innerHTML = `
                <div class="d-flex align-items-center justify-content-between mb-4 border-b pb-2">
                    <span class="small text-muted">Total terdaftar: <b class="text-dark">${listAdmin.length} Administrator</b></span>
                    <button type="button" class="btn btn-sm btn-success px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-1" onclick="window.bukaFormTambahAdminMasterDirect()">
                        <i class="bi bi-person-plus-fill"></i> Tambah Admin Baru
                    </button>
                </div>
                <div class="table-responsive rounded-4 border bg-white shadow-sm" style="max-height: 380px; overflow-y: auto;">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                        <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.7rem; z-index:10;">
                            <tr>
                                <th width="5%" class="text-center">No</th>
                                <th width="30%">No. WhatsApp / User</th>
                                <th width="30%">Nama Lengkap Pengurus</th>
                                <th width="20%" class="text-center">Akses Otoritas</th>
                                <th width="15%" class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>${tableRowsHtml}</tbody>
                    </table>
                </div>
            `;
        } else {
            wrapper.innerHTML = `<div class="alert alert-danger small m-2">${res.message}</div>`;
            window.location.reload();
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("adminMasterTableWrapper").innerHTML = `<div class="alert alert-danger small text-center m-2">Gagal terhubung ke pangkalan data user.</div>`;
    });
};

/**
 * Modul Utama: Manajemen Pengguna Akun Administrator IDI Batam
 * POTONGAN 1: Menampilkan Tabel List Riwayat Admin dari Tabel 'admin'
 */
window.menuAdmin = function() {
    if (typeof modal2 !== "function") return;

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Tampilkan Loading State awal saat memilah data dari MySQL
    modal2('Manajemen Akun Admin', `
        <div class="text-center py-5 text-muted animate-fade-in" id="adminMasterTableWrapper">
            <div class="spinner-border text-danger mb-2" role="status"></div>
            <p class="small font-monospace">Mengamankan enkripsi pangkalan data pengguna...</p>
        </div>
    `);


    fetch(`${cleanEndpoint}/proses.php?aksi=list_master_admin`)
    .then(res => res.json())
    .then(res => {
        const wrapper = document.getElementById("adminMasterTableWrapper");
        if (!wrapper) return;

        if (res.status === 'success') {
            const listAdmin = res.data;
            let tableRowsHtml = "";
            let counterNo = 1;

            listAdmin.forEach(row => {
                const badgeLevel = row.level == 1 
                    ? `<span class="badge bg-danger-subtle text-danger fw-bold rounded-pill px-2">Level 1 (Super Admin)</span>`
                    : `<span class="badge bg-primary-subtle text-primary fw-bold rounded-pill px-2">Level 2 (Staff)</span>`;

let tombolhapusadmin="";
if(row.level!=='1')
{
tombolhapusadmin=`<button type="button" class="btn btn-xs btn-danger px-2 py-0.5 rounded fw-bold" style="font-size:0.7rem;"
                                        onclick="window.eksekusiHapusAdminMaster(${row.id}, '${row.username}')">
                                    <i class="bi bi-trash3-fill"></i> Hapus
                                </button>`;   
}
                tableRowsHtml += `
                    <tr id="baris_master_admin_${row.id}">
                        <td class="text-center font-monospace small fw-bold">${counterNo++}</td>
                        <!-- Menggunakan row.username yang ditarik dari field 'wa' database -->
                        <td class="fw-bold text-dark font-monospace small">${row.username}</td>
                        <td class="small text-muted fw-semibold">${row.nama || '-'}</td>
                        <td class="text-center">${badgeLevel}</td>
                        <td class="text-center">
                            <div class="d-flex align-items-center justify-content-center gap-1">
                                <button type="button" class="btn btn-xs btn-warning text-dark px-2 py-0.5 rounded fw-bold" style="font-size:0.7rem;"
                                        onclick="window.bukaFormEditAdminDirect(${row.id}, '${row.username}', '${row.nama || ''}', ${row.level})">
                                    <i class="bi bi-pencil-square"></i> Edit
                                </button>
                                ${tombolhapusadmin}
                            </div>
                        </td>
                    </tr>
                `;
            });

            wrapper.className = "container py-1 text-start animate-fade-in";
            wrapper.innerHTML = `
                <div class="d-flex align-items-center justify-content-between mb-4 border-b pb-2">
                    <span class="small text-muted">Total terdaftar: <b class="text-dark">${listAdmin.length} Administrator</b></span>
                    <button type="button" class="btn btn-sm btn-success px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-1" onclick="window.bukaFormTambahAdminMasterDirect()">
                        <i class="bi bi-person-plus-fill"></i> Tambah Admin Baru
                    </button>
                </div>
                <div class="table-responsive rounded-4 border bg-white shadow-sm" style="max-height: 380px; overflow-y: auto;">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                        <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.7rem; z-index:10;">
                            <tr>
                                <th width="5%" class="text-center">No</th>
                                <th width="30%">No. WhatsApp / User</th>
                                <th width="30%">Nama Lengkap Pengurus</th>
                                <th width="20%" class="text-center">Akses Otoritas</th>
                                <th width="15%" class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>${tableRowsHtml}</tbody>
                    </table>
                </div>
            `;
        } else {
            wrapper.innerHTML = `<div class="alert alert-danger small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("adminMasterTableWrapper").innerHTML = `<div class="alert alert-danger small text-center m-2">Gagal terhubung ke pangkalan data user.</div>`;
    });
};


window.bukaFormTambahAdminMasterDirect = function() {
    if (typeof modal3 !== "function") return;
    modal3('Tambah Akun Admin', `
        <div class="container py-5 text-muted animate-fade-in" id="adminMasterTableWrapper2">
            <div class="spinner-border text-danger mb-2" role="status"></div>
            <p class="small font-monospace">Mengamankan enkripsi pangkalan data pengguna...</p>
        </div>
    `);
    
    const wrapper = document.getElementById("adminMasterTableWrapper2");
    if (!wrapper) return;
   
    wrapper.innerHTML = `
        <div class="card border-0 p-2 animate-fade-in">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3"><i class="bi bi-person-plus-fill text-success me-1"></i> Form Registrasi Administrator Baru</h6>
            <form id="formInsertMasterAdminMySQL" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">No. WhatsApp Admin (Username)</label>
                    <input type="text" class="form-control form-control-sm font-monospace fw-bold" id="admUser" placeholder="Contoh: 0812776xxxxx" required autocomplete="off">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">Kata Sandi / Password</label>
                    <input type="password" class="form-control form-control-sm" id="admPass" placeholder="••••••••" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">Nama Lengkap Pengurus</label>
                    <input type="text" class="form-control form-control-sm fw-semibold" id="admNama" placeholder="Contoh: dr. Ahmad" required autocomplete="off">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">Level Otoritas Sistem</label>
                    <select class="form-select form-select-sm fw-bold text-dark" id="admLevel">
                        <option value="1">Level 1 (Super Admin - Akses Semua Menu)</option>
                        <option value="2" selected>Level 2 (Staff Lapangan - Member & Invoice)</option>
                    </select>
                </div>
                <div class="col-12 text-end pt-3 border-top mt-4">
                    <button type="submit" class="btn btn-sm btn-success px-4 fw-bold shadow-sm rounded-pill" id="btnSubmitAddAdmin"><i class="bi bi-save-fill me-1"></i> Daftarkan Admin</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById("formInsertMasterAdminMySQL").addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = document.getElementById("btnSubmitAddAdmin");
        btn.disabled = true;

        const payload = new FormData();
        payload.append("username", document.getElementById("admUser").value.trim());
        payload.append("password", document.getElementById("admPass").value);
        payload.append("nama", document.getElementById("admNama").value.trim());
        payload.append("level", document.getElementById("admLevel").value);

        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
        fetch(`${cleanEndpoint}/proses.php?aksi=insert_master_admin`, { method: "POST", body: payload })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                window.tutupModalTerbuka();
                setTimeout(() => {
             window.menuAdmin();
             }, 1000);
                
            }
            else 
            { 
                btn.disabled = false;
                window.location.reload();
            }
        })
        .catch(err => { alert("Koneksi gagal."); btn.disabled = false; });
    });
};

window.bukaFormEditAdminDirect = function(id, username, nama, level) {
    if (typeof modal3 !== "function") return;
    modal3('Edit Akun Admin', `
        <div class="container py-5 text-muted animate-fade-in" id="adminMasterTableWrapper3">
            <div class="spinner-border text-danger mb-2" role="status"></div>
            <p class="small font-monospace">Mengamankan enkripsi pangkalan data pengguna...</p>
        </div>
    `);
    const wrapper = document.getElementById("adminMasterTableWrapper3");
    if (!wrapper) return;
    
    wrapper.innerHTML = `
        <div class="card border-0 p-2 animate-fade-in">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3"><i class="bi bi-pencil-square text-warning me-1"></i> Form Update Administrator: <b>${nama}</b></h6>
            <form id="formUpdateMasterAdminMySQL" class="row g-3">
                <input type="hidden" id="editAdmId" value="${id}">
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">No. WhatsApp (Kunci Sesi)</label>
                    <input type="text" class="form-control form-control-sm font-monospace bg-light fw-bold" value="${username}" readonly> 
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">Ubah Password <small class="text-muted">(Kosongkan jika tidak diganti)</small></label>
                    <input type="password" class="form-control form-control-sm" id="editAdmPass" placeholder="Ketik password baru jika ingin mengubah">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">Nama Lengkap Pengurus</label>
                    <input type="text" class="form-control form-control-sm fw-semibold" id="editAdmNama" value="${nama}" required autocomplete="off">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">Level Otoritas</label>
                    <select class="form-select form-select-sm fw-bold text-dark" id="editAdmLevel">
                        <option value="1" ${level == 1 ? 'selected' : ''}>Level 1 (Super Admin)</option>
                        <option value="2" ${level == 2 ? 'selected' : ''}>Level 2 (Staff Lapangan)</option>
                    </select>
                </div>
                <div class="col-12 text-end pt-3 border-top mt-4">
                    <button type="submit" class="btn btn-sm btn-warning px-4 fw-bold shadow-sm rounded-pill text-dark" id="btnSubmitUpdateAdmin"><i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan Perubahan</button>
                </div>
            </form>
        </div>
    `;
 
    document.getElementById("formUpdateMasterAdminMySQL").addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = document.getElementById("btnSubmitUpdateAdmin");
        btn.disabled = true;

        const payload = new FormData();
        payload.append("id", document.getElementById("editAdmId").value);
        payload.append("password", document.getElementById("editAdmPass").value);
        payload.append("nama", document.getElementById("editAdmNama").value.trim());
        payload.append("level", document.getElementById("editAdmLevel").value);

        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
        fetch(`${cleanEndpoint}/proses.php?aksi=update_master_admin`, { method: "POST", body: payload })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
               window.tutupModalTerbuka();
                setTimeout(() => {
             window.menuAdmin();
             }, 1000);
            }
            else 
            {
                btn.disabled = false;
                window.location.reload();
            }
        })
        .catch(err => { alert("Koneksi gagal."); btn.disabled = false; });
    });
};

window.eksekusiHapusAdminMaster = function(idAdmin, usernameText) {
    if (!confirm(`⚠️ WARNING HAPUS USER!\nApakah Anda yakin ingin menghapus akun administrator dengan No. WA [ ${usernameText} ] secara permanen?`)) {
        return;
    }
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    const payload = new FormData();
    payload.append("id", idAdmin);

    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_master_admin`, { method: "POST", body: payload })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            window.tutupModalTerbuka();
                setTimeout(() => {
             window.menuAdmin();
             }, 1000);
        }
        else
        {
            window.location.reload();
        }
    })
    .catch(err => alert("Gagal memproses penghapusan user."));
};

/**
 * Modul Keuangan: Neraca Pendapatan Iuran Bulanan Berbasis Tahunan
 * UPDATE: Mengganti select tanggal menjadi Tombol Pintas penampil Jurnal Kronologis Harian (Modal 3)
 */
window.menuNeracaPendapatan = function(tahunPilihan) {
    if (typeof modal2 !== "function") return;

    const tahunBukuAktif = tahunPilihan || new Date().getFullYear();
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // 1. Gelar Struktur Neraca Bulanan di Modal 2 dengan Tombol Kalender Baru di Sisi Kiri
    modal2(`Neraca Pendapatan Iuran - Tahun ${tahunBukuAktif}`, `
        <div class="container py-2 text-start" id="wrapperNeracaUtama">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 border-bottom pb-3">
                <div class="d-flex align-items-center gap-2">
                    <!-- 💡 TOMBOL BARU: Menggantikan select tanggal lama untuk membuka List Jurnal Kronologis -->
                    <button type="button" class="btn btn-sm btn-warning fw-bold px-3 rounded-pill shadow-sm d-flex align-items-center gap-1.5"
                            onclick="window.bukaModal3JurnalKronologisLoss()">
                        📅 Lihat List Berdasarkan Tanggal Bay
                    </button>
                </div>
                
                <!-- Filter Tahun Buku Tetap di Sisi Kanan -->
                <div class="d-flex align-items-center gap-2">
                    <span class="small text-muted fw-semibold">Tahun Buku:</span>
                    <select class="form-select form-select-sm fw-bold font-monospace" id="filterTahunNeraca" style="width:150px;" onchange="window.menuNeracaPendapatan(this.value)">
                        <option value="2024" ${tahunBukuAktif == 2024 ? 'selected' : ''}>Tahun Buku 2024</option>
                        <option value="2025" ${tahunBukuAktif == 2025 ? 'selected' : ''}>Tahun Buku 2025</option>
                        <option value="2026" ${tahunBukuAktif == 2026 ? 'selected' : ''}>Tahun Buku 2026</option>
                        <option value="2027" ${tahunBukuAktif == 2027 ? 'selected' : ''}>Tahun Buku 2027</option>
                    </select>
                </div>
            </div>

            <!-- Wadah Tabel Data Real-time Rekap Bulanan -->
            <div id="tempatTabelDataNeraca">
                <div class="text-center py-5 text-muted">
                    <div class="spinner-border text-success mb-2" role="status"></div>
                    <p class="small font-monospace">Mengakumulasi saldo kas masuk buku besar...</p>
                </div>
            </div>
        </div>
    `);

    // 2. Ambil data rekapitulasi bulanan seperti biasa
    fetch(`${cleanEndpoint}/proses.php?aksi=get_neraca_bulanan&tahun=${tahunBukuAktif}`)
    .then(res => res.json())
    .then(res => {
        const kontainerData = document.getElementById("tempatTabelDataNeraca");
        if (!kontainerData) return;

        if (res.status === 'success') {
            const dataBulan = res.data;
            let tableRowsHtml = "";
            let grandTotalPendapatan = 0;

            const namaBulanIndo = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            for (let m = 1; m <= 12; m++) {
                const totalUangMasuk = parseInt(dataBulan[m] ? dataBulan[m].total_pendapatan : 0, 10);
                const jumlahTransaksi = parseInt(dataBulan[m] ? dataBulan[m].jumlah_transaksi : 0, 10);
                grandTotalPendapatan += totalUangMasuk;

                const tombolDetailAksi = jumlahTransaksi > 0
                    ? `<button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5 rounded fw-bold d-inline-flex align-items-center gap-1" style="font-size:0.7rem;"
                               onclick="window.bukaModal3RincianNeracaPerBulan(${m}, '${namaBulanIndo[m]}', ${tahunBukuAktif})">
                           👁️ Detail
                       </button>`
                    : `<button type="button" class="btn btn-xs btn-light text-muted px-2 py-0.5 rounded border small" style="font-size:0.7rem;" disabled>Nihil</button>`;

                tableRowsHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${m}</td>
                        <td class="fw-bold text-dark-emphasis small">${namaBulanIndo[m]}</td>
                        <td class="text-center font-monospace text-muted small">${jumlahTransaksi} Transaksi</td>
                        <td class="text-end font-monospace fw-bold text-success">Rp ${totalUangMasuk.toLocaleString('id-ID')}</td>
                        <td class="text-center">${tombolDetailAksi}</td>
                    </tr>
                `;
            }

            kontainerData.innerHTML = `
                <div class="table-responsive rounded-4 border bg-white shadow-sm mb-3">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                        <thead class="table-dark text-uppercase font-monospace">
                            <tr>
                                <th width="6%" class="text-center">No</th>
                                <th width="34%">Periode Bulan</th>
                                <th width="20%" class="text-center">Volume Berkas</th>
                                <th width="25%" class="text-end">Jumlah Pendapatan Kas</th>
                                <th width="15%" class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                            <tr class="table-success fw-bold border-top border-dark" style="font-size:0.9rem;">
                                <td colspan="3" class="text-end text-uppercase text-dark font-monospace" style="padding: 12px;">GRAND TOTAL PENDAPATAN :</td>
                                <td class="text-end text-success font-monospace" style="padding: 12px; font-size: 1rem;">Rp ${grandTotalPendapatan.toLocaleString('id-ID')}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="text-end mt-4 pt-2 border-top">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-4 shadow-sm" onclick="window.closeSecondAdminModal()">Tutup Neraca</button>
                </div>
            `;
        } else {
            kontainerData.innerHTML = `<div class="alert alert-danger p-3 small">${res.message}</div>`;
            setTimeout(() => {
  window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("tempatTabelDataNeraca").innerHTML = `<div class="alert alert-danger p-3 small text-center">Gagal memuat rekap bulanan.</div>`;
    });
};


/**
 * Modul Keuangan Jurnal Transaksi Kronologis - Menggunakan Filter Teks Angka 4 Digit
 * POTONGAN 2: Inisialisasi Tampilan Modal 3 Luar
 */
window.bukaModal3JurnalKronologisLoss = function() {
    if (typeof modal3 !== "function") return;
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    modal3('Jurnal', `
        <div class="container py-2 text-start" id="wrapperJurnalTransaksiModal3">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3 border-bottom pb-3">
                <div class="col-md-5">
                    <div class="input-group shadow-sm">
                        <span class="input-group-text bg-white border-end-0 text-muted small">🔍</span>
                        <input type="text" id="cariJurnalLossInput" class="form-control form-control-sm border-start-0 ps-1" placeholder="Cari nama dokter, nomor, atau keterangan...">
                    </div>
                </div>
                
                <div class="d-flex align-items-center gap-2">
                    <span class="small text-muted fw-bold text-nowrap">Filter Tahun Bayar:</span>
                    <select class="form-select form-select-sm fw-bold font-monospace text-success" id="filterTahunJurnalLoss" style="width: 140px;">
                        <option value="semua">-- Semua Tahun --</option>
                        <option value="2024">Tahun 2024</option>
                        <option value="2025">Tahun 2025</option>
                        <option value="2026">Tahun 2026</option>
                        <option value="2027">Tahun 2027</option>
                    </select>
                </div>
            </div>
            
            <div id="tempatTabelJurnalLoss" class="table-responsive rounded-4 border bg-white shadow-sm" style="max-height: 380px; min-height: 250px; overflow-y: auto;">
                <div class="text-center py-5 text-muted">
                    <div class="spinner-border text-warning mb-2" role="status"></div>
                    <p class="small font-monospace">Mengurai pangkalan data berdasarkan 4 digit angka tahun...</p>
                </div>
            </div>
            <div class="text-end mt-4 pt-2 border-top">
                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">Tutup List Tanggal</button>
            </div>
        </div>
    `);

    fetch(`${cleanEndpoint}/proses.php?aksi=get_jurnal_transaksi_loss`)
    .then(res => res.json())
    .then(res => {
        const tempatTabel = document.getElementById("tempatTabelJurnalLoss");
        if (!tempatTabel) return;

        if (res.status === 'success') {
            window.prosesRenderDanSaringJurnalLossDOM(res.data, cleanEndpoint);
        } else {
            tempatTabel.innerHTML = `<div class="alert alert-danger p-2 small m-2">Gagal: ${res.message}</div>`;
            setTimeout(() => {
window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("tempatTabelJurnalLoss").innerHTML = `<div class="alert alert-danger p-2 small m-2 text-center">Gagal terhubung ke peladen.</div>`;
    });
};

/**
 * POTONGAN 3: Loop Array JSON Menjadi Baris Tabel Jurnal Kronologis
 */
window.prosesRenderDanSaringJurnalLossDOM = function(listDataJurnal, cleanEndpoint) {
    const tempatTabel = document.getElementById("tempatTabelJurnalLoss");
    if (!tempatTabel) return;

    let barisHtml = "";
    let nomorUrut = 1;

    listDataJurnal.forEach(row => {
        const nominalBaris = parseInt(row.jumlah, 10) || 0;
        let tombolStruk = (row.img || "").trim() !== "" && row.img !== "-" && row.img !== "null"
            ? `<a href="${cleanEndpoint}/uploads/${row.img}" target="_blank" class="btn btn-xs btn-outline-primary px-1.5 py-0 rounded" style="font-size:0.65rem;"><i class="bi bi-camera-fill"></i> Struk</a>`
            : `<span class="text-muted font-monospace" style="font-size:0.65rem;">-</span>`;
        
        // Membaca string tahun_bayar 4 digit yang sudah diisolasi murni oleh PHP hulu
        const tahunBayarMurni = String(row.tahun_bayar).trim();

        barisHtml += `
            <tr class="baris-jurnal-loss-murni" data-tahun-bayar="${tahunBayarMurni}">
                <td class="text-center font-monospace small" style="font-size:0.75rem;"><span class="indeks-nomor-urut-jurnal">${nomorUrut++}</span></td>
                <td class="text-center font-monospace small" style="font-size:0.75rem;"><span class="indeks-nomor-urut-jurnal">${row.id}</span></td>
                <td class="small font-monospace text-dark fw-bold text-nowrap">📅 ${row.tanggal_bayar_indo}</td>
                <td class="small font-monospace text-dark fw-bold text-nowrap">📅 ${row.periode}</td>
                <td class="fw-bold text-dark-emphasis small text-uppercase text-truncate" style="max-width:150px;" title="${row.nama_anggota}">${row.nama_anggota}</td>
                <td class="font-monospace small text-secondary">${row.no_anggota || '-'}</td>
                <td class="font-monospace text-center small text-primary fw-bold">${row.tahun}</td>
                <td class="font-monospace fw-bold text-end text-success nominal-nilai-uang-baris" data-nominal="${nominalBaris}">Rp ${nominalBaris.toLocaleString('id-ID')}</td>
                <td class="text-muted small text-truncate" style="max-width:130px;" title="${row.keterangan || '-'}">${row.keterangan || '-'}</td>
                <td class="text-center text-nowrap">${tombolStruk}</td>
            </tr>
        `;
    });

    tempatTabel.innerHTML = `
        <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.8rem;">
            <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.68rem; z-index:10;">
                <tr>
                    <th width="4%" class="text-center">No</th>
                    <th width="10%" class="text-center">Invoice</th>
                    <th width="10%">Tgl Bayar</th>
                    <th width="10%">Periode</th>
                    <th width="15%">Nama Dokter</th>
                    <th width="8%">No. Anggota</th>
                    <th width="10%" class="text-center">Th Buku</th>
                    <th width="15%" class="text-end">Nominal</th>
                    <th width="12%">Keterangan</th>
                    <th width="6%" class="text-center">Bukti</th>
                </tr>
            </thead>
            <tbody>
                ${barisHtml}
                <tr class="table-info fw-bold border-top border-dark" id="rowTotalLossJurnalBawah" style="font-size:0.85rem; position: sticky; bottom: 0; z-index:5;">
                    <td colspan="7" class="text-end text-uppercase text-dark font-monospace" style="padding: 10px;">TOTAL KAS MASUK FILTERED :</td>
                    <td class="text-end text-success font-monospace" id="teksTotalKasJurnalDinamis" style="padding: 10px;">Rp 0</td>
                    <td colspan="2"></td>
                </tr>
            </tbody>
        </table>
    `;

    window.inisialisasiDualFilterJurnalLossEngine();
};

/**
 * POTONGAN 4: Sinkronisasi Otomatis Dropdown Berdasarkan Tahun 4 Digit Tertinggi Dari Database
 */
window.inisialisasiDualFilterJurnalLossEngine = function() {
    const inputCari = document.getElementById("cariJurnalLossInput");
    const selectTahunBayar = document.getElementById("filterTahunJurnalLoss");
    const labelTotal = document.getElementById("labelTotalRowsJurnal");

    // Scan otomatis untuk melacak angka 4 digit tahun tertinggi/terakhir di database Anda
    const rowsKolektif = document.querySelectorAll(".baris-jurnal-loss-murni");
    let tahunTerakhirDitemukan = 0;

    rowsKolektif.forEach(tr => {
        const tglBayarTahun = parseInt(tr.getAttribute("data-tahun-bayar"), 10) || 0;
        if (tglBayarTahun > tahunTerakhirDitemukan && tglBayarTahun !== 0) {
            tahunTerakhirDitemukan = tglBayarTahun; // Menyimpan tahun terbaru (ex: 2026)
        }
    });

    // Otomatis arahkan nilai dropdown awal ke tahun terakhir hasil temuan murni tersebut
    if (selectTahunBayar && tahunTerakhirDitemukan > 0) {
        selectTahunBayar.value = String(tahunTerakhirDitemukan);
    } else if (selectTahunBayar) {
        selectTahunBayar.value = "semua";
    }

    function jalankanSaringanKombinasiDinamis() {
        const keyword = inputCari ? inputCari.value.toLowerCase().trim() : "";
        const tahunBayarTerpilih = selectTahunBayar ? String(selectTahunBayar.value).trim() : "semua";
        
        const rows = document.querySelectorAll(".baris-jurnal-loss-murni");
        let akumulasiUangTerfilter = 0;
        let nomorUrutBaru = 1;

        rows.forEach(tr => {
            const tahunBayarBaris = String(tr.getAttribute("data-tahun-bayar")).trim();
            const teksBaris = tr.textContent.toLowerCase();

            const matchTahunBayar = (tahunBayarTerpilih === "semua" || tahunBayarBaris === tahunBayarTerpilih);
            const matchKeyword = (keyword === "" || teksBaris.includes(keyword));

            if (matchTahunBayar && matchKeyword) {
                tr.style.display = ""; // Munculkan baris
                
                const cellUang = tr.querySelector(".nominal-nilai-uang-baris");
                const nilaiUang = cellUang ? parseInt(cellUang.getAttribute("data-nominal"), 10) || 0 : 0;
                akumulasiUangTerfilter += nilaiUang;

                const cellNo = tr.querySelector(".indeks-nomor-urut-jurnal");
                if (cellNo) cellNo.textContent = nomorUrutBaru++;
            } else {
                tr.style.display = "none"; // Sembunyikan baris
            }
        });

        const labelTotalKas = document.getElementById("teksTotalKasJurnalDinamis");
        if (labelTotalKas) {
            labelTotalKas.textContent = `Rp ${akumulasiUangTerfilter.toLocaleString('id-ID')}`;
        }
        if (labelTotal) {
            labelTotal.innerHTML = `Volume: <b>${nomorUrutBaru - 1} Transaksi Terbuka</b>`;
        }
    }

    if (inputCari) inputCari.addEventListener("input", jalankanSaringanKombinasiDinamis);
    if (selectTahunBayar) selectTahunBayar.addEventListener("change", jalankanSaringanKombinasiDinamis);

    // Jalankan penyaringan kalkulasi perdana
    jalankanSaringanKombinasiDinamis();
};


window.renderTabelNeracaUtamaKeDOM = function(res, tahunBukuAktif, tanggalAktif, cleanEndpoint) {
    const kontainerData = document.getElementById("tempatTabelDataNeraca");
    if (!kontainerData) return;

    if (res.status === 'success') {
        const dataBulan = res.data;
        let tableRowsHtml = "";
        let grandTotalPendapatan = 0;

        const namaBulanIndo = [
            "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        for (let m = 1; m <= 12; m++) {
            const totalUangMasuk = parseInt(dataBulan[m] ? dataBulan[m].total_pendapatan : 0, 10);
            const jumlahTransaksi = parseInt(dataBulan[m] ? dataBulan[m].jumlah_transaksi : 0, 10);
            
            grandTotalPendapatan += totalUangMasuk;

            const tombolDetailAksi = jumlahTransaksi > 0
                ? `<button type="button" class="btn btn-xs btn-outline-success px-2 py-0.5 rounded fw-bold d-inline-flex align-items-center gap-1" style="font-size:0.7rem;"
                           onclick="window.bukaModal3RincianNeracaPerBulan(${m}, '${namaBulanIndo[m]}', ${tahunBukuAktif}, '${tanggalAktif}')">
                       <i class="bi bi-eye-fill"></i> Detail
                   </button>`
                : `<button type="button" class="btn btn-xs btn-light text-muted px-2 py-0.5 rounded border small" style="font-size:0.7rem;" disabled>Nihil</button>`;

            tableRowsHtml += `
                <tr>
                    <td class="text-center font-monospace small fw-bold">${m}</td>
                    <td class="fw-bold text-dark-emphasis small">${namaBulanIndo[m]}</td>
                    <td class="text-center font-monospace text-muted small">${jumlahTransaksi} Transaksi</td>
                    <td class="text-end font-monospace fw-bold text-success">Rp ${totalUangMasuk.toLocaleString('id-ID')}</td>
                    <td class="text-center">${tombolDetailAksi}</td>
                </tr>
            `;
        }

        kontainerData.innerHTML = `
            <div class="table-responsive rounded-4 border bg-white shadow-sm mb-3">
                <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.85rem;">
                    <thead class="table-dark text-uppercase font-monospace">
                        <tr>
                            <th width="6%" class="text-center">No</th>
                            <th width="34%">Periode Bulan</th>
                            <th width="20%" class="text-center">Volume Berkas</th>
                            <th width="25%" class="text-end">Jumlah Pendapatan Kas</th>
                            <th width="15%" class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                        <tr class="table-success fw-bold border-top border-dark" style="font-size:0.9rem;">
                            <td colspan="3" class="text-end text-uppercase text-dark font-monospace" style="padding: 12px;">GRAND TOTAL PENDAPATAN :</td>
                            <td class="text-end text-success font-monospace" style="padding: 12px; font-size: 1rem;">Rp ${grandTotalPendapatan.toLocaleString('id-ID')}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="text-end mt-4 pt-2 border-top">
                <button type="button" class="btn btn-sm btn-dark rounded-pill px-4 shadow-sm" onclick="window.closeSecondAdminModal()">Tutup Neraca</button>
            </div>
        `;
    } else {
        kontainerData.innerHTML = `<div class="alert alert-danger p-3 small">${res.message}</div>`;
    }
};

window.bukaModal3RincianNeracaPerBulan = function(angkaBulan, namaBulanStr, tahunBuku, tanggalAktif) {
    if (typeof modal3 !== "function") return;
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    modal3(`Rincian Iuran: ${namaBulanStr} ${tahunBuku}`, `
        <div class="container py-2 text-start" id="modal3RincianNeracaWrapper">
            <div class="table-responsive rounded-4 border bg-white shadow-sm" id="tempatDataRincianBulananModal3" style="max-height: 380px; min-height: 200px; overflow-y: auto;">
                <div class="text-center py-5 text-muted">
                    <div class="spinner-border text-success mb-2" role="status"></div>
                    <p class="small mb-0 font-monospace text-secondary">Mengurai arsip setoran iuran...</p>
                </div>
            </div>
            <div class="text-end pt-3 border-top mt-4">
                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">Tutup Rincian</button>
            </div>
        </div>
    `);

    fetch(`${cleanEndpoint}/proses.php?aksi=get_rincian_neraca_bulan&bulan=${angkaBulan}&tahun=${tahunBuku}&tanggal=${tanggalAktif}`)
    .then(res => res.json())
    .then(res => {
        const kontainerTabel3 = document.getElementById("tempatDataRincianBulananModal3");
        if (!kontainerTabel3) return;

        if (res.status === 'success') {
            let barisRincianHtml = "";
            let nomorUrut = 1;

            res.data.forEach(row => {
                const nominalBaris = parseInt(row.jumlah, 10) || 0;
                let tombolBuktiBayar = "";
                const namaFileGambar = (row.img || "").trim();

                if (namaFileGambar !== "" && namaFileGambar !== "-" && namaFileGambar !== "null") {
                    const tautanGambarStruk = `${cleanEndpoint}/uploads/${namaFileGambar}`;
                    tombolBuktiBayar = `<a href="${tautanGambarStruk}" target="_blank" class="btn btn-xs btn-outline-primary px-1.5 py-0 rounded d-inline-flex align-items-center gap-1" style="font-size:0.68rem;"><i class="bi bi-camera-fill"></i> Struk</a>`;
                } else {
                    tombolBuktiBayar = `<span class="text-muted font-monospace" style="font-size:0.68rem;">-</span>`;
                }
                
                barisRincianHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${nomorUrut++}</td>
                        <td class="small font-monospace text-muted text-nowrap">${row.tanggal_bayar_indo || row.tanggal_bayar}</td>
                        <td class="small font-monospace text-muted text-nowrap">${row.periode}</td>
                        <td class="fw-bold text-dark-emphasis small text-uppercase text-truncate" style="max-width:140px;">${row.nama_anggota}</td>
                        <td class="font-monospace small text-secondary">${row.no_anggota || '-'}</td>
                        <td class="font-monospace fw-bold text-end text-success">Rp ${nominalBaris.toLocaleString('id-ID')}</td>
                        <td class="text-muted small text-truncate" style="max-width:130px;">${row.keterangan || '-'}</td>
                        <td class="text-center text-nowrap">${tombolBuktiBayar}</td>
                    </tr>
                `;
            });

            kontainerTabel3.innerHTML = `
                <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.8rem;">
                    <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.68rem; letter-spacing:0.3px; z-index:10;">
                        <tr>
                            <th width="4%" class="text-center">No</th>
                            <th width="10%">Tgl Bayar</th>
                            <th width="10%">Periode</th>
                            <th width="20%">Nama Dokter</th>
                            <th width="13%">No. Anggota</th>
                            <th width="15%" class="text-end">Nominal</th>
                            <th width="16%">Keterangan</th>
                            <th width="12%" class="text-center">Bukti</th>
                        </tr>
                    </thead>
                    <tbody>${barisRincianHtml}</tbody>
                </table>
            `;
        } else {
            kontainerTabel3.innerHTML = `<div class="alert alert-danger p-2 small m-2">Gagal: ${res.message}</div>`;
            setTimeout(() => {
  window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        document.getElementById("tempatDataRincianBulananModal3").innerHTML = `<div class="alert alert-danger p-2 small m-2 text-center">Gagal terhubung ke peladen.</div>`;
    });
};

window.bukaModal3RincianNeracaPerBulan = function(angkaBulan, namaBulanStr, tahunBuku) {
    if (typeof modal3 !== "function") return;

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Gelar jendela loading sementara di layar depan (Modal 3)
    modal3(`Rincian Iuran: ${namaBulanStr} ${tahunBuku}`, `
        <div class="container py-2 text-start" id="modal3RincianNeracaWrapper">
            <div class="table-responsive rounded-4 border bg-white shadow-sm" id="tempatDataRincianBulananModal3" style="max-height: 380px; min-height: 200px; overflow-y: auto;">
                <div class="text-center py-5 text-muted">
                    <div class="spinner-border text-success mb-2" role="status"></div>
                    <p class="small mb-0 font-monospace text-secondary">Mengurai arsip setoran iuran bulan ${namaBulanStr}...</p>
                </div>
            </div>
            <div class="text-end pt-3 border-top mt-4">
                <button type="button" class="btn btn-sm btn-dark fw-bold rounded-pill px-4 shadow-sm" onclick="const d3 = document.getElementById('fsDialog'); if(d3 && d3.close) d3.close();">
                    Tutup Rincian
                </button>
            </div>
        </div>
    `);

    // Ambtil rincian baris dari database via proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_rincian_neraca_bulan&bulan=${angkaBulan}&tahun=${tahunBuku}`)
    .then(res => res.json())
    .then(res => {
        const kontainerTabel3 = document.getElementById("tempatDataRincianBulananModal3");
        if (!kontainerTabel3) return;

        if (res.status === 'success') {
            const listDataRincian = res.data;
            let barisRincianHtml = "";
            let nomorUrut = 1;

                        listDataRincian.forEach(row => {
                const nominalBaris = parseInt(row.jumlah, 10) || 0;
                
                // 💡 LOGIKA BARU: Validasi ketersediaan file gambar di kolom 'img' database
                let tombolBuktiBayar = "";
                const namaFileGambar = (row.img || "").trim();

                if (namaFileGambar !== "" && namaFileGambar !== "-" && namaFileGambar !== "null") {

                    const tautanGambarStruk = `${namaFileGambar}`;
                    
                    tombolBuktiBayar = `
                        <a href="https://lh3.googleusercontent.com/d/${tautanGambarStruk}?authuser=1/view" target="_blank" class="btn btn-xs btn-outline-primary px-1.5 py-0 rounded d-inline-flex align-items-center gap-1" style="font-size:0.68rem;" title="Buka gambar bukti transfer di tab baru">
                            <i class="bi bi-camera-fill"></i> Struk
                        </a>
                    `;
                } else {
                    tombolBuktiBayar = `<span class="text-muted font-monospace" style="font-size:0.68rem;">-</span>`;
                }
                
                barisRincianHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${nomorUrut++}</td>
                        <td class="small font-monospace text-muted text-nowrap">${row.tanggal_bayar_indo || row.tanggal_bayar}</td>
                        <td class="small font-monospace text-muted text-nowrap">${row.periode}</td>
                        <td class="fw-bold text-dark-emphasis small text-uppercase text-truncate" style="max-width:140px;" title="${row.nama_anggota || 'Dokter Anggota'}">${row.nama_anggota || 'Dokter Anggota'}</td>
                        <td class="font-monospace small text-secondary">${row.no_anggota || '-'}</td>
                        <td class="font-monospace fw-bold text-end text-success">Rp ${nominalBaris.toLocaleString('id-ID')}</td>
                        <td class="text-muted small text-truncate" style="max-width:130px;" title="${row.keterangan || '-'}">${row.keterangan || '-'}</td>
                        <!-- 💡 SUNTIKKAN KOLOM BUKTI BAYAR BARU -->
                        <td class="text-center text-nowrap">${tombolBuktiBayar}</td>
                    </tr>
                `;
            });

            // Isikan struktur tabel yang sudah diperluas kolomnya (ditambahkan th Bukti)
            kontainerTabel3.innerHTML = `
                <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.8rem;">
                    <thead class="table-dark text-uppercase font-monospace sticky-top" style="font-size:0.68rem; letter-spacing:0.3px; z-index:10;">
                        <tr>
                            <th width="4%" class="text-center">No</th>
                            <th width="10%">Tgl Bayar</th>
                            <th width="10%">Periode</th>
                            <th width="20%">Nama Dokter</th>
                            <th width="13%">No. Anggota</th>
                            <th width="15%" class="text-end">Nominal</th>
                            <th width="16%">Keterangan</th>
                            <!-- 💡 HEADER KOLOM BUKTI BAYAR -->
                            <th width="12%" class="text-center">Bukti</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${barisRincianHtml}
                    </tbody>
                </table>
            `;

        } else {
            kontainerTabel3.innerHTML = `<div class="alert alert-danger p-2 small m-2">Gagal: ${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        const kontainerTabel3 = document.getElementById("tempatDataRincianBulananModal3");
        if (kontainerTabel3) kontainerTabel3.innerHTML = `<div class="alert alert-danger p-2 small m-2 text-center">Gagal terhubung ke peladen.</div>`;
    });
};

/**
 * 📨 MODUL MANAJEMEN SURAT MASUK KESEKRETARIATAN IDI BATAM
 * POTONGAN 2: Inisialisasi Tampilan Dashboard & Kotak Live Search Kata Kunci
 */
window.menuSuratMasuk = function() {
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    const htmlSuratMasuk = `
        <div class="container py-2 text-start" id="suratMasukAdminWrapper">
            <!-- BANNER INFO REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-3 d-flex align-items-center gap-3 shadow-sm">
                <span class="fs-2">📥</span>
                <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; color: #ffc107;">Arsip Surat Masuk</span>
                        <span class="small text-white-50">Mendokumentasikan korespondensi masuk dari instansi eksternal (Dinkes, RS, BPJS, dll) secara terpusat.</span>
                    </div>
                    <button type="button" class="btn btn-xs btn-outline-light font-monospace small" style="font-size:0.7rem;" onclick="window.menuSuratMasuk()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Refresh Data
                    </button>
                </div>
            </div>

            <!-- PANEL LIVE SEARCH & TOMBOL ENTRI -->
            <div class="row g-2 mb-4 justify-content-between align-items-center">
                <div class="col-md-5 col-sm-8">
                    <div class="input-group shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-end-0 text-muted small"><i class="bi bi-search"></i></span>
                        <input type="text" id="cariSuratMasukInput" class="form-control form-control-sm border-start-0 ps-1 font-sans small" 
                               placeholder="Cari instansi, perihal, atau nomor surat..." 
                               oninput="window.eksekusiLiveSearchSuratMasuk(this.value)">
                    </div>
                </div>
                <div class="col-md-auto text-end">
                    <button type="button" class="btn btn-sm btn-success fw-bold rounded-pill px-3 shadow-sm" onclick="window.bukaModal3FormSuratMasukBaru()">
                        <i class="bi bi-plus-circle-fill me-1"></i> Registrasi Surat Baru
                    </button>
                </div>
            </div>

            <!-- KANVAS DINAMIS TABEL AJAX -->
            <div id="tableAreaSuratMasuk" class="animate-fade-in pb-5" style="overflow: auto; min-height: 250px;">
                <div class="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                    <p class="small mb-0 font-monospace text-secondary">Sedang memindai arsip surat masuk...</p>
                </div>
            </div>
        </div>
    `;

    // Bentangkan halaman kerja menuju komponen Modal Utama Tingkat 1 (modal2)
    if (typeof modal2 === "function") {
        modal2('Arsip', htmlSuratMasuk);
    } else {
        alert("Sistem tidak terdeteksi");
        return;
    }

    // Jalankan pemicu otomatis penarik data dari server
    window.loadDataSuratMasukMySQL();
};

/**
 * POTONGAN 3: Engine Live-Search Sisi Klien Khusus Baris Surat Masuk
 */
window.eksekusiLiveSearchSuratMasuk = function(keywordText) {
    const kataKunci = keywordText.toLowerCase().trim();
    const daftarBarisTabel = document.querySelectorAll("#tableAreaSuratMasuk tbody tr");

    daftarBarisTabel.forEach(tr => {
        const isiTeksBaris = tr.textContent.toLowerCase();
        if (kataKunci === "" || isiTeksBaris.includes(kataKunci)) {
            tr.style.display = ""; 
        } else {
            tr.style.display = "none"; 
        }
    });
};

/**
 * POTONGAN 4: AJAX Loader & Generator Baris HTML Tabel Surat Masuk (Responsif Dropdown)
 */
window.loadDataSuratMasukMySQL = function() {
    const tempatKanvasTabel = document.getElementById("tableAreaSuratMasuk");
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    if (!tempatKanvasTabel) return;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_data_surat_masuk`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const listData = res.data;
            
            if (listData.length === 0) {
                tempatKanvasTabel.innerHTML = `<div class="alert alert-info text-center p-3 small rounded-4 m-2">Nihil, belum ada rekaman surat masuk yang tercatat.</div>`;
                return;
            }

            let barisTabelHtml = "";
            let nomorUrut = 1;

            listData.forEach((row, index) => {
                const posisiDropdownKondisional = (listData.length === 1 || index === listData.length - 1) ? 'dropup' : 'dropdown';
                
                let tombolFile = (row.file_pdf || "").trim() !== "" && row.file_pdf !== "-"
                    ? `<a href="https://drive.google.com/file/d/${row.file_pdf}" target="_blank" class="btn btn-xs btn-outline-danger px-1.5 py-0.5 rounded fw-bold" style="font-size:0.65rem;"><i class="bi bi-file-pdf-fill"></i> PDF</a>`
                    : `<span class="text-muted small italic">-</span>`;

                barisTabelHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${nomorUrut++}</td>
                        <td class="font-monospace small text-primary fw-bold text-nowrap">${row.no_agenda}</td>
                        <td class="small fw-semibold text-dark text-wrap" style="max-width:140px;">${row.no_surat}<br><small class="text-muted">📅 ${row.tanggal_surat_indo}</small></td>
                        <td class="fw-bold text-success text-uppercase small text-wrap" style="max-width:150px;">🏢 ${row.asal_instansi}</td>
                        <td class="small text-dark text-wrap" style="max-width:200px;"><span class="fw-bold text-dark-emphasis d-block">${row.perihal}</span><small class="text-muted font-sans">${row.keterangan || '-'}</small></td>
                        <td class="text-center">${tombolFile}</td>
                        <td class="text-center">
                            <div class="${posisiDropdownKondisional}">
                                <button class="btn btn-xs btn-outline-dark dropdown-toggle px-2 py-0.5 fw-bold rounded" type="button" data-bs-toggle="dropdown" data-bs-boundary="window" style="font-size:0.68rem;">
                                    Opsi
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end shadow" style="font-size:0.8rem; z-index: 1050;">
                                    <li><a class="dropdown-item fw-bold text-danger" href="#" onclick="window.hapusSuratMasukRecord(${row.id})"><i class="bi bi-trash3-fill me-1"></i> Hapus Arsip</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                `;
            });

            tempatKanvasTabel.innerHTML = `
                <div class="table-responsive rounded-4 border bg-white shadow-sm mb-2 pb-5" style="min-height: 280px !important; overflow-x: auto !important; overflow-y: visible !important;">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                        <thead class="table-dark text-uppercase font-monospace">
                            <tr>
                                <th width="4%" class="text-center">No</th>
                                <th width="10%">Agenda</th>
                                <th width="20%">No. Surat</th>
                                <th width="22%">Instansi Pengirim</th>
                                <th width="30%">Perihal & Keterangan</th>
                                <th width="8%" class="text-center">Berkas</th>
                                <th width="6%" class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${barisTabelHtml}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            tempatKanvasTabel.innerHTML = `<div class="alert alert-danger p-2 small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        tempatKanvasTabel.innerHTML = `<div class="alert alert-danger p-3 small text-center m-2">Gagal terhubung ke peladen data.</div>`;
    });
};

/**
 * 📨 MODUL SURAT MASUK: FORM REGISTRASI SURAT BARU (SUB-MODAL LAYER 3)
 * POTONGAN 1: Inisialisasi Tampilan Formulir Input & Penargetan Dialog Mandiri
 */
window.bukaModal3FormSuratMasukBaru = function() {
    if (typeof modal3 !== "function") {
        alert("Modul penampil tingkat modal3 tidak terkonfigurasi!");
        return;
    }

    // Ambil tanggal hari ini dengan format YYYY-MM-DD standar HTML input
    const hariIni = new Date().toISOString().split('T')[0];

    // Gelar kerangka formulir entri di dalam Modal 3
    modal3('Registrasi', `
        <div class="container py-1 text-start animate-fade-in" id="wrapperFormSuratMasukBaru">
            <form id="formRegistrasiSuratMasukMySQL" enctype="multipart/form-data">
                <div class="row g-2.5">
                    <!-- 1. NOMOR AGENDA & NOMOR SURAT -->
                    <div class="col-sm-5">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> No. Agenda Intern</label>
                        <input type="text" class="form-control form-control-sm font-monospace fw-bold" id="smNoAgenda" required placeholder="Contoh: 001/SM/IDI/2026">
                    </div>
                    <div class="col-sm-7">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Nomor Surat Resmi</label>
                        <input type="text" class="form-control form-control-sm font-sans fw-semibold" id="smNoSurat" required placeholder="Contoh: 120/DINKES-KOTA/IX/2026">
                    </div>

                    <!-- 2. ASAL INSTANSI PENGIRIM -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Asal Instansi / Pengirim</label>
                        <input type="text" class="form-control form-control-sm text-uppercase fw-bold text-success" id="smAsalInstansi" required placeholder="Contoh: DINAS KESEHATAN KOTA BATAM">
                    </div>

                    <!-- 3. PERIHAL SURAT -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Perihal / Intisari Surat</label>
                        <input type="text" class="form-control form-control-sm fw-bold text-dark-emphasis" id="smPerihal" required placeholder="Contoh: Undangan Koordinasi Pelaksanaan Vaksinasi Booster">
                    </div>

                    <!-- 4. TANGGAL SURAT & TANGGAL TERIMA -->
                    <div class="col-sm-6 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1">📅 Tanggal pada Surat</label>
                        <input type="date" class="form-control form-control-sm font-monospace fw-bold" id="smTanggalSurat" value="${hariIni}">
                    </div>
                    <div class="col-sm-6 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1">📥 Tanggal Diterima Sekretariat</label>
                        <input type="date" class="form-control form-control-sm font-monospace fw-bold" id="smTanggalTerima" value="${hariIni}">
                    </div>

                    <!-- 5. UNGHAH BERKAS DOKUMEN FISIK PDF -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-danger mb-1"><i class="bi bi-file-earmark-pdf-fill"></i> Unggah Dokumen Surat (Format PDF / Gambar)</label>
                        <input type="file" class="form-control form-control-sm" id="smFilePdf" accept="application/pdf,image/*">
                        <div class="form-text text-muted" style="font-size:0.7rem;">Opsional. Dianjurkan dalam format PDF atau foto hasil scan dokumen bersih maksimal ukuran 5MB.</div>
                    </div>

                    <!-- 6. CATATAN KETERANGAN TAMBAHAN -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1">Catatan Tambahan / Keterangan Disposisi</label>
                        <textarea class="form-control form-control-sm small p-2" id="smKeterangan" rows="2" placeholder="Contoh: Diteruskan ke Ketua IDI untuk dipelajari lebih lanjut."></textarea>
                    </div>
                </div>

                <!-- TOMBOL NAVIGASI SUBMIT FORM -->
                <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-4" onclick="this.closest('dialog').close();">Batal</button>
                    <button type="submit" class="btn btn-sm btn-success fw-bold rounded-pill px-4 shadow-sm" id="btnSubmitSuratMasukBaru">
                        <i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan & Arsipkan Surat
                    </button>
                </div>
            </form>
        </div>
    `);

    // Daftarkan fungsi penangkap submit data AJAX ke Potongan 2
    window.inisialisasiSubmitFormSuratMasukBaruEngine();
};

/**
 * 📨 MODUL SURAT MASUK: HANDLER SUBMIT MULTI-STAGE AUTOMATOR (admin.js)
 * PROSES: Unggah Berkas Fisik ke Google Drive GAS → Ambil File ID → Kirim ke MySQL
 */
window.inisialisasiSubmitFormSuratMasukBaruEngine = function() {
    const form = document.getElementById("formRegistrasiSuratMasukMySQL");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const btn = document.getElementById("btnSubmitSuratMasukBaru");
        const progressLabel = document.getElementById("wrapperStatusProgressDrive"); // Pastikan ada di bodi HTML Form atau buat dinamis
        
        // Buat label status sementara jika belum ada pembungkusnya
        let statusBox = progressLabel;
        if (!statusBox) {
            statusBox = document.createElement("div");
            statusBox.id = "wrapperStatusProgressDrive";
            statusBox.className = "small mt-2 font-monospace text-primary fw-bold";
            form.insertBefore(statusBox, form.lastElementChild);
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Memproses Arsip...`;
        }

        const inputFileInput = document.getElementById("smFilePdf");
        const noAgendaRaw = document.getElementById("smNoAgenda").value.trim();

        // 💡 STRATEGI INTERSEPTOR: Saring jika admin melampirkan berkas fisik dokumen
        if (inputFileInput && inputFileInput.files.length > 0) {
            statusBox.className = "small mt-2 font-monospace text-primary d-block fw-bold";
            statusBox.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Mengonversi dokumen ke Base64...`;

            const fileTarget = inputFileInput.files[0];
            const ekstensiFile = fileTarget.name.substring(fileTarget.name.lastIndexOf('.'));
            
            // Baca biner file lokal menggunakan FileReader
            const reader = new FileReader();
            reader.readAsDataURL(fileTarget);
            reader.onload = function() {
                const base64DataRaw = reader.result.split(',')[1]; // Mengambil bodi enkripsi bersih Base64
                
                statusBox.innerHTML = `<span class="spinner-border spinner-border-sm text-warning me-1"></span> Menembak biner berkas ke Google Drive via GAS...`;

                const payloadDrive = new URLSearchParams();
                payloadDrive.append("fileData", base64DataRaw);
                // Judul nama file di Drive dikunci berdasarkan No Agenda (ex: SM_001_SM_IDI_2026.pdf)
                payloadDrive.append("fileName", `SM_${noAgendaRaw.replace(/[^a-zA-Z0-9]/g, '_')}${ekstensiFile}`);
                payloadDrive.append("mimeType", fileTarget.type);

                // 🟢 PENTING: Ganti URL di bawah dengan URL Web App Google Apps Script kesekretariatan IDI Anda
                const targetGoogleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbz1fjbr_N87MR-_KGhRPdDwKFwRxHFPjfZE0MTUZWdluDAnnk8-1-sMK4t2DAwZcOIy/exec";

                // LANGKAH 1: Kirim biner file ke Google Drive
                fetch(targetGoogleAppsScriptUrl, {
                    method: "POST",
                    mode: "cors",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: payloadDrive
                })
                .then(res => res.json())
                .then(resDrive => {
                    if (resDrive.status !== 'success') throw new Error(resDrive.message || "Gagal mengunggah ke Google Drive.");

                    statusBox.innerHTML = `<span class="spinner-border spinner-border-sm text-success me-1"></span> Sukses Drive! Mengunci ID berkas ke database MySQL...`;
                    
                    // Teruskan ID Berkas dari Google Drive ke fungsi penyimpan MySQL
                    window.eksekusiSimpanDataSuratMasukMySQL(resDrive.fileId, statusBox);
                })
                .catch(err => {
                    console.error(err);
                    alert("Proses arsip awan gagal: " + err.message);
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = `<i class="bi bi-cloud-arrow-up-fill me-1"></i> Simpan & Arsipkan Surat`;
                    }
                    statusBox.innerHTML = `❌ Gagal memproses unggahan Google Drive.`;
                });
            };
        } else {
            // Skenario jika admin tidak melampirkan berkas file, langsung simpan teks ke MySQL
            window.eksekusiSimpanDataSuratMasukMySQL('', statusBox);
        }
    });
};

/**
 * SUB-FUNCTION: Mengirim data teks dan ID Google Drive menuju proses.php
 */
window.eksekusiSimpanDataSuratMasukMySQL = function(googleFileId, statusLabel) {
    const payload = new FormData();
    payload.append("no_agenda", document.getElementById("smNoAgenda").value.trim());
    payload.append("no_surat", document.getElementById("smNoSurat").value.trim());
    payload.append("asal_instansi", document.getElementById("smAsalInstansi").value.trim());
    payload.append("perihal", document.getElementById("smPerihal").value.trim());
    payload.append("tanggal_surat", document.getElementById("smTanggalSurat").value);
    payload.append("tanggal_terima", document.getElementById("smTanggalTerima").value);
    payload.append("keterangan", document.getElementById("smKeterangan").value.trim());
    payload.append("google_file_id", googleFileId); // Kirim File ID Drive murni

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    fetch(`${cleanEndpoint}/proses.php?aksi=simpan_registrasi_surat_masuk`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            statusLabel.innerHTML = `✔️ SUKSES TOTAL! Surat masuk dan ID Google Drive berhasil diarsipkan.`;
            
            // Tutup Modal 3 secara native
            const form = document.getElementById("formRegistrasiSuratMasukMySQL");
            if (form) {
                const dialog = form.closest('dialog');
                if (dialog && typeof dialog.close === 'function') dialog.close();
            }

            // Refresh tabel arsip utama di latar belakang secara real-time
            if (typeof window.loadDataSuratMasukMySQL === "function") {
                window.loadDataSuratMasukMySQL();
            }
        } else {
setTimeout(() => {
 window.location.reload();
}, 2000);
        }
    })
    .catch(err => {
        console.error("Gagal sinkronisasi MySQL:", err);
        alert("🚨 Gagal terhubung ke peladen pangkalan data MySQL.");
    });
};


window.hapusSuratMasukRecord = function(idSuratTarget) {
    // 1. Tampilkan banner konfirmasi tegas demi menjaga integritas data arsip
    let konfirm = confirm("⚠️ PERINGATAN SISTEM KHUSUS ADMIN!\n\nApakah Anda yakin ingin menghapus rekaman arsip surat masuk ini secara permanen dari database?\n\nTindakan ini tidak dapat dibatalkan kembali.");
    
    if (!konfirm) {
        return false; // Gagalkan fungsi jika admin menekan tombol 'Batal'
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Siapkan bodi payload FormData untuk dikirim via POST
    const payloadHapus = new FormData();
    payloadHapus.append("id", idSuratTarget);

    // 2. Eksekusi tembakan AJAX menuju gerbang proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_arsip_surat_masuk`, {
        method: "POST",
        body: payloadHapus
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status " + res.status);
        return res.json();
    })
    .then(data => {
        // Tampilkan pesan notifikasi feedback sukses dari peladen MySQL
        alert(data.message);
        
        if (data.status === 'success') {
            // Segarkan dan jalankan panggil ulang list tabel arsip surat masuk secara real-time
            if (typeof window.loadDataSuratMasukMySQL === "function") {
                window.loadDataSuratMasukMySQL();
            }
        }
        else
        {
            window.location.reload();
        }
    })
    .catch(err => {
        console.error("Gagal menghapus rekaman surat masuk ID #" + idSuratTarget + ":", err);
        alert("🚨 Gagal berkomunikasi dengan sistem server. Koneksi database cPanel terputus.");
    });
};

window.menuAgenda = function() {
    // Tentukan bulan dan tahun saat ini sebagai default render awal
    const tanggalSekarang = new Date();
    window.currentAgendaMonth = tanggalSekarang.getMonth(); // 0 - 11
    window.currentAgendaYear = tanggalSekarang.getFullYear();


let tambahagenda="";
if(localStorage.getItem('admin_is_logged')==="true")
{
tambahagenda=`<button type="button" class="btn btn-sm btn-success fw-bold rounded-pill px-3 shadow-sm" onclick="window.bukaModal3FormAgendaBaru()">
                        <i class="bi bi-plus-circle-fill me-1"></i> Tambah Agenda
                    </button>`;
}
    const htmlAgenda = `
        <div class="container py-2 text-start" id="agendaAdminWrapper">
            <!-- BANNER INFO REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-3 d-flex align-items-center gap-3 shadow-sm">
                <span class="fs-2">📅</span>
                <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; color: #ffc107;">Kalender Agenda Kegiatan</span>
                        <span class="small text-white-50">Manajemen jadwal rapat, pelantikan, seminar, dan agenda resmi pengurus IDI Cabang Batam.</span>
                    </div>
                    ${tambahagenda}
                </div>
            </div>

            <!-- NAVIGASI KONTROL BULAN KALENDER -->
            <div class="card border-0 bg-light p-3 rounded-4 mb-4 shadow-sm">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div class="d-flex gap-1.5">
                        <button class="btn btn-sm btn-outline-dark rounded-pill px-2.5" onclick="window.geserBulanKalenderAgenda(-1)">◀ Prev</button>
                        <button class="btn btn-sm btn-dark rounded-pill px-3 fw-bold" onclick="window.setBulanKalenderAgendaHariIni()">Hari Ini</button>
                        <button class="btn btn-sm btn-outline-dark rounded-pill px-2.5" onclick="window.geserBulanKalenderAgenda(1)">Next ▶</button>
                    </div>
                    <h5 class="fw-bold text-dark mb-0 font-monospace text-uppercase" id="labelBulanTahunAgenda">---</h5>
                </div>
            </div>

            <!-- KANVAS MATRIKS KALENDER UTAMA -->
            <div class="card border rounded-4 p-3 bg-white shadow-sm overflow-hidden animate-fade-in">
                <!-- Header Nama Hari Grid -->
                <div class="row g-1 text-center fw-bold text-uppercase font-monospace text-muted mb-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                    <div class="col" style="width: 14.28%;">Min</div>
                    <div class="col" style="width: 14.28%;">Sen</div>
                    <div class="col" style="width: 14.28%;">Sel</div>
                    <div class="col" style="width: 14.28%;">Rab</div>
                    <div class="col" style="width: 14.28%;">Kam</div>
                    <div class="col" style="width: 14.28%;">Jum</div>
                    <div class="col" style="width: 14.28%;">Sab</div>
                </div>
                <!-- Grid Kotak-Kotak Hari Kalender -->
                <div class="row g-1" id="gridKotakHariKalenderAgenda" style="min-height: 380px;"></div>
            </div>
        </div>
    `;

    // Bentangkan halaman kerja menuju komponen Modal Utama Tingkat 1 (modal2)
if(localStorage.getItem('admin_is_logged')==="true")
{
        modal2('Kalender Kegiatan', htmlAgenda);
}
else
{
        modal1('Kalender Kegiatan', htmlAgenda);
}
    // Jalankan render data perdana
    window.loadDanRenderMatriksKalenderAgenda();
};

window.geserBulanKalenderAgenda = function(arah) {
    window.currentAgendaMonth += arah;
    if (window.currentAgendaMonth < 0) {
        window.currentAgendaMonth = 11;
        window.currentAgendaYear--;
    } else if (window.currentAgendaMonth > 11) {
        window.currentAgendaMonth = 0;
        window.currentAgendaYear++;
    }
    window.loadDanRenderMatriksKalenderAgenda();
};

window.setBulanKalenderAgendaHariIni = function() {
    const tgl = new Date();
    window.currentAgendaMonth = tgl.getMonth();
    window.currentAgendaYear = tgl.getFullYear();
    window.loadDanRenderMatriksKalenderAgenda();
};

/**
 * POTONGAN 3: Engine Kalkulator Kalender & Sinkronisasi Array Kegiatan MySQL
 */
window.loadDanRenderMatriksKalenderAgenda = function() {
    const gridHari = document.getElementById("gridKotakHariKalenderAgenda");
    const labelBulan = document.getElementById("labelBulanTahunAgenda");
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    if (!gridHari || !labelBulan) return;

    const namaBulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    labelBulan.textContent = `${namaBulanIndo[window.currentAgendaMonth]} ${window.currentAgendaYear}`;

    // Tarik data agenda terdaftar dari proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_data_agenda_kegiatan&bulan=${window.currentAgendaMonth + 1}&tahun=${window.currentAgendaYear}`)
    .then(res => res.json())
    .then(res => {
        const listAgenda = res.status === 'success' ? res.data : [];

        // Hitung matematika tanggal kalender bulanan
        const hariPertamaBulan = new Date(window.currentAgendaYear, window.currentAgendaMonth, 1).getDay();
        const jumlahHariBulanIni = new Date(window.currentAgendaYear, window.currentAgendaMonth + 1, 0).getDate();
        
        let gridHtml = "";

        // 1. Buat kotak kosong untuk kompensasi hari bulan sebelumnya
        for (let i = 0; i < hariPertamaBulan; i++) {
            gridHtml += `<div class="col bg-light border border-light-subtle rounded-3 p-1 opacity-25" style="width: 14.28%; min-height: 75px;"></div>`;
        }

        // 2. Buat kotak tanggal riil bulan berjalan
        const hariIniTgl = new Date();
        for (let tgl = 1; tgl <= jumlahHariBulanIni; tgl++) {
            const isHariIni = (tgl === hariIniTgl.getDate() && window.currentAgendaMonth === hariIniTgl.getMonth() && window.currentAgendaYear === hariIniTgl.getFullYear());
            
            // Format string pembanding tanggal YYYY-MM-DD
            const stringTanggalCocok = `${window.currentAgendaYear}-${String(window.currentAgendaMonth + 1).padStart(2, '0')}-${String(tgl).padStart(2, '0')}`;
            
            // Saring agenda yang terdaftar tepat di tanggal ini
            let agendaHariIniHtml = "";
            listAgenda.forEach(item => {
                if (item.tanggal_mulai === stringTanggalCocok) {
                    agendaHariIniHtml += `
                        <div class="text-white small rounded px-1.5 py-0.5 mb-1 text-truncate font-sans fw-bold cursor-pointer" 
                             style="background-color: ${item.warna_label}; font-size: 0.65rem;" 
                             title="${item.judul_agenda} (${item.jam_mulai_indo})"
                             onclick="window.bukaModal3LihatDetailAgendaDirect(${item.id})">
                            ⏰ ${item.jam_mulai} ${item.judul_agenda}
                        </div>
                    `;
                }
            });

            gridHtml += `
                <div class="col border rounded-3 p-1 position-relative d-flex flex-column justify-content-between ${isHariIni ? 'bg-info-subtle border-info border-2' : 'bg-white'}" style="width: 14.28%; min-height: 75px; max-height: 90px; overflow-y: auto;">
                    <span class="small fw-bold font-monospace ${isHariIni ? 'text-info-emphasis' : 'text-secondary'} d-block mb-1">${tgl}</span>
                    <div class="flex-grow-1 w-100">${agendaHariIniHtml}</div>
                </div>
            `;
        }

        // 3. Lengkapi kotak sisa pembungkus baris kelipatan grid 7 agar tetap simetris
        const totalKotakGelar = hariPertamaBulan + jumlahHariBulanIni;
        const sisaKotakGelar = (7 - (totalKotakGelar % 7)) % 7;
        for (let i = 0; i < sisaKotakGelar; i++) {
            gridHtml += `<div class="col bg-light border border-light-subtle rounded-3 p-1 opacity-25" style="width: 14.28%; min-height: 75px;"></div>`;
        }

        gridHari.innerHTML = gridHtml;
    })
    .catch(err => {
        console.error(err);
        gridHari.innerHTML = `<div class="alert alert-danger p-3 small text-center w-100 m-2">Gagal menyinkronkan kalender agenda.</div>`;
    });
};

window.bukaModal3FormAgendaBaru = function() {
    if (typeof modal3 !== "function") return;
    const hariIni = new Date().toISOString().split('T')[0];

    modal3('Tambah', `
        <div class="container py-1 text-start animate-fade-in" id="wrapperFormAgendaBaru">
            <form id="formRegistrasiAgendaMySQL">
                <div class="row g-2.5">
                    <!-- JUDUL AGENDA KEGIATAN -->
                    <div class="col-md-8">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Judul Agenda / Nama Kegiatan</label>
                        <input type="text" class="form-control form-control-sm fw-bold text-dark-emphasis" id="agJudul" required placeholder="Contoh: Rapat Pleno Pengurus Bulanan IDI Batam">
                    </div>
                    
                    <!-- 💡 SELEKTOR KATEGORI BARU -->
                    <div class="col-md-4">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Kategori Agenda</label>
                        <select class="form-select form-select-sm fw-bold text-dark" id="agKategori" required>
                            <option value="Rapat">👥 Rapat Internal</option>
                            <option value="Seminar">🔬 Seminar / Ilmiah</option>
                            <option value="Pelantikan">🪪 Pelantikan</option>
                            <option value="Sosial">🎗️ Kegiatan Sosial</option>
                            <option value="Lainnya">📌 Lain-lain</option>
                        </select>
                    </div>

                    <!-- TANGGAL, JAM, & WARNA LABEL -->
                    <div class="col-sm-5 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Tanggal Kegiatan</label>
                        <input type="date" class="form-control form-control-sm font-monospace fw-bold" id="agTanggal" value="${hariIni}" required>
                    </div>
                    <div class="col-sm-4 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Jam Mulai</label>
                        <input type="time" class="form-control form-control-sm font-monospace fw-bold" id="agJam" value="09:00" required>
                    </div>
                    <div class="col-sm-3 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1">🎨 Warna Label</label>
                        <input type="color" class="form-control form-control-sm form-control-color w-100" id="agWarna" value="#0d6efd">
                    </div>

                    <!-- LOKASI / TEMPAT KEGIATAN -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Lokasi / Tempat Pelaksanaan</label>
                        <input type="text" class="form-control form-control-sm fw-semibold" id="agLokasi" required placeholder="Contoh: Sekretariat IDI Batam">
                    </div>

                    <!-- DESKRIPSI / NOTULENSI RINGKAS -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1">Deskripsi Ringkas / Detail Acara</label>
                        <textarea class="form-control form-control-sm small p-2" id="agDeskripsi" rows="3"></textarea>
                    </div>
                </div>

                <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-4" onclick="this.closest('dialog').close();">Batal</button>
                    <button type="submit" class="btn btn-sm btn-success fw-bold rounded-pill px-4 shadow-sm" id="btnSubmitAgendaBaru">
                        <i class="bi bi-calendar-plus-fill me-1"></i> Simpan & Jadwalkan
                    </button>
                </div>
            </form>
        </div>
    `);

    window.inisialisasiSubmitFormAgendaBaruEngine();
};


/**
 * POTONGAN 2: Handler Submit FormData Sisi Klien Untuk Menyimpan Agenda Kegiatan
 */
window.inisialisasiSubmitFormAgendaBaruEngine = function() {
    const form = document.getElementById("formRegistrasiAgendaMySQL");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const btn = document.getElementById("btnSubmitAgendaBaru");
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Menyimpan Jadwal...`;
        }

        const payload = new FormData();
        payload.append("judul_agenda", document.getElementById("agJudul").value.trim());
        payload.append("tanggal_mulai", document.getElementById("agTanggal").value);
        payload.append("jam_mulai", document.getElementById("agJam").value);
        payload.append("warna_label", document.getElementById("agWarna").value);
        payload.append("lokasi", document.getElementById("agLokasi").value.trim());
        payload.append("deskripsi", document.getElementById("agDeskripsi").value.trim());
        payload.append("kategori", document.getElementById("agKategori").value);
        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

        // Tembak menuju aksi server proses.php
        fetch(`${cleanEndpoint}/proses.php?aksi=simpan_agenda_kegiatan_baru`, {
            method: "POST",
            body: payload
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error status " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Tutup Modal 3 secara terisolasi mandiri aman
                this.closest('dialog').close();

                // Segarkan dan jalankan panggil ulang matriks kalender agenda di latar belakang secara real-time
                if (typeof window.loadDanRenderMatriksKalenderAgenda === "function") {
                    window.loadDanRenderMatriksKalenderAgenda();
                }
            } else {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = `<i class="bi bi-calendar-plus-fill me-1"></i> Simpan & Jadwalkan`;
                }
            }
        })
        .catch(err => {
            console.error("Gagal menyimpan agenda kegiatan baru:", err);
            alert("🚨 Gagal terhubung ke peladen pangkalan data MySQL.");
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i class="bi bi-calendar-plus-fill me-1"></i> Simpan & Jadwalkan`;
            }
        });
    });
};

/**
 * 📅 MODUL AGENDA: DETAIL RINCIAN KEGIATAN & PENGHAPUSAN (SUB-MODAL LAYER 3)
 * POTONGAN 1: Inisialisasi Tampilan Rincian Data di Modal 3
 */
window.bukaModal3LihatDetailAgendaDirect = function(idAgendaTarget) {
    if (typeof modal3 !== "function") {
        alert("Modul penampil tingkat modal3v tidak terkonfigurasi!");
        return;
    }
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // Gelar jendela loading sementara di layar depan (Modal 3)
    modal3('Detail', `
        <div class="container-fluid py-1 text-start" id="containerDetailAgendaModal3">
            <div class="text-center py-5 text-muted">
                <div class="spinner-border text-primary mb-2" role="status"></div>
                <p class="small font-monospace">Mengurai kompilasi manifes jadwal...</p>
            </div>
        </div>
    `);

    // Tarik data detail agenda dari database MySQL via proses.php
    fetch(`${cleanEndpoint}/proses.php?aksi=get_detail_agenda_spesifik&id=${idAgendaTarget}`)
    .then(res => res.json())
    .then(res => {
        const wrapper = document.getElementById("containerDetailAgendaModal3");
        if (!wrapper) return;

        if (res.status === 'success') {
            const data = res.data;
            const katS = String(data.kategori).toLowerCase();
            const isKategoriRapat = (katS.includes("rapat") || data.kategori === "Rapat");

            wrapper.className = "container-fluid py-1 text-start animate-fade-in";
            let tanggalx=data.tanggal_mulai.replace(/-/g,'');
            let spd = data.spreadsheet_peserta_drive ?? '';
            
            let notulen="";
            if(localStorage.getItem('admin_is_logged')==="true")
            {
            notulen=`<div class="card bg-info-subtle border-0 p-3 rounded-4 mb-3 shadow-sm">
             <h6 class="fw-bold text-info-emphasis mb-1 small"><i class="bi bi-cloud-arrow-up-fill me-1"></i> ARSIP DOKUMEN NOTULEN RAPAT (GOOGLE DRIVE)</h6>
                        <div class="row g-2 align-items-center mt-1">
                            <div class="col-sm-8">
                                <input type="file" class="form-control form-control-sm" id="uploadNotulenDriveInput" accept="application/pdf,image/*">
                            </div>
                            <div class="col-sm-4">
                                <button type="button" class="btn btn-sm btn-info text-white fw-bold w-100" id="btnUploadNotulen" onclick="window.eksekusiUploadNotulenKeDrive(${data.id})">Upload File</button>
                            </div>
                        </div>
                        <div id="progressNotulenDrive" class="small mt-1.5 font-monospace text-secondary d-none"></div>
                        
                        <!-- Link Tautan Download Dokumen Notulen Berbasis File ID Google Drive -->
                        <div class="mt-2.5 pt-2 border-top border-info-subtle" id="boxLinkNotulenDrive">
                            ${data.file_notulen_drive && data.file_notulen_drive !== '-' ? `
                                <a href="https://drive.google.com/file/d/${data.file_notulen_drive}" target="_blank" class="btn btn-xs btn-primary fw-bold px-2 py-0.5" style="font-size:0.7rem;"><i class="bi bi-file-ear$mark-text-fill"></i> Lihat Berkas Notulen Terarsip</a> 
                            ` : '<span class="text-muted font-monospace small" style="font-size:0.7rem;">⚠️ Belum ada file berkas notulensi rapat yang diunggah.</span>'}
                        </div>
             </div>`;
            }
            
            let pesertarapat="";
            if(localStorage.getItem('admin_is_logged')==="true")
            {
                pesertarapat=`<div class="row g-1.5 mb-2">
                        <div class="col-sm-9">
                            <input type="text" class="form-control form-control-sm font-sans" id="inputNamaPesertaBaru" placeholder="Ketik nama dokter/pengurus yang hadir...">
                        </div>
                        <div class="col-sm-3"> 
                            <button type="button" class="btn btn-sm btn-success fw-bold w-100" onclick="window.eksekusiTambahPresensiPeserta(${data.id},${tanggalx},'${spd}')">➕ Tambah</button>
                        </div>
                    </div>`;
            }
            
            let hapusagenda="";
            if(localStorage.getItem('admin_is_logged')==="true")
            {
            hapusagenda=`<button type="button" class="btn btn-sm btn-danger fw-bold rounded-pill px-3 shadow-sm" onclick="window.eksekusiHapusAgendaRecord(${data.id})">Hapus Jadwal</button>`;
            }
            wrapper.innerHTML = `
            <div class="row g-4">
            <div class="${isKategoriRapat ? 'col-md-5 border-end' : 'col-md-12'}">
                    <div class="card border-0 p-3 rounded-4 mb-3 text-white shadow-sm" style="background-color: ${data.warna_label || '#0d6efd'}">
                        <h6 class="fw-bold mb-0 text-wrap"><i class="bi bi-bookmark-star-fill me-1"></i> [${data.kategori}] ${data.judul_agenda}</h6>
                    </div>
                    <div class="bg-light p-3 rounded-4 border mb-3 small font-monospace text-dark" style="line-height: 1.8;">
                        <table class="table table-sm table-borderless mb-0" style="font-size:0.83rem;">
                            <tr><td class="text-muted p-0" width="30%">📅 Tanggal</td><td class="fw-bold p-0">: ${data.tanggal_mulai}</td></tr>
                            <tr><td class="text-muted p-0">⏰ Waktu</td><td class="fw-bold text-primary p-0">: Jam ${data.jam_mulai} WIB</td></tr>
                            <tr><td class="text-muted p-0">📍 Lokasi</td><td class="fw-bold text-success p-0">: ${data.lokasi}</td></tr>
                        </table>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold small text-secondary mb-1">📝 Memo Acara:</label>
                        <div class="p-3 bg-white border rounded-4 font-sans text-dark shadow-sm text-justify mb-3" style="font-size: 0.85rem; min-height: 60px; line-height: 1.5; white-space: pre-line;">
                            ${data.deskripsi || '<span class="text-muted italic small">- Nihil -</span>'}
                        </div>
                    </div>

                    <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                        <button type="button" class="btn btn-sm btn-dark rounded-pill px-3" onclick="this.closest('dialog').close();">Tutup</button>
                        ${hapusagenda}
                    </div>
            </div>
            ${isKategoriRapat ? `
             <div class="col-md-7">
             ${notulen}
             <h6 class="fw-bold text-dark mb-1 small"><i class="bi bi-people-fill me-1"></i> Daftar Hadir Peserta Rapat:</h6>
                    ${pesertarapat}
                    <div class="border rounded-4 bg-light p-2 overflow-y-auto" style="min-height: 135px;" id="boxListDaftarHadirRapat">
                        <!-- List nama-nama peserta akan di-render otomatis di sini via loop AJAX -->
                    </div>
             </div>
            `: ''}
            </div>
            `;
            if (isKategoriRapat) {
            window.loadDataPresensiPesertaRapatAjax(data.id);
        }
        } 
    })
    .catch(err => {
        console.error(err);
        document.getElementById("containerDetailAgendaModal3").innerHTML = `<div class="alert alert-danger small text-center m-2">Gagal memuat arsip memo dari server cPanel.</div>`;
    });
};

/**
 * POTONGAN 2: Sub-Fungsi Penarik Daftar Hadir & Upload File Notulen Ke Drive via GAS
 */
window.loadDataPresensiPesertaRapatAjax = function(idAgenda) {
    const box = document.getElementById("boxListDaftarHadirRapat");
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    if (!box) return;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_list_peserta_rapat&id_agenda=${idAgenda}`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success' && res.data.length > 0) {
            let listHtml = "";
            res.data.forEach(p => {
                listHtml += `
                    <div class="d-flex justify-content-between align-items-center bg-white border rounded p-1.5 mb-1 small shadow-sm animate-fade-in">
                        <span class="fw-bold text-dark-emphasis font-sans text-uppercase"><i class="bi bi-person-check text-success me-1"></i> ${p.nama_peserta}</span>
                        <button type="button" id="btn_hapus_absen_${p.id}" class="btn btn-xs btn-outline-danger px-1 py-0 border-0" onclick="window.eksekusiHapusPresensiPeserta(${p.id}, ${idAgenda},'${p.idspd}')">❌</button>
                    </div>
                `;
            });
            box.innerHTML = listHtml;
        } else {
            box.innerHTML = `<span class="text-muted italic d-block text-center py-3 small font-monospace">[ Belum ada absen pengurus masuk ]</span>`;
        }
    });
};


window.eksekusiTambahPresensiPeserta = function(idAgenda, judulRapatLokal,spd) {
    const input = document.getElementById("inputNamaPesertaBaru");
    const labelBox = document.getElementById("boxListDaftarHadirRapat");
    
    if (!input || input.value.trim() === "") return;

    if (labelBox) {
        labelBox.innerHTML = `<div class="text-center py-3 text-success font-monospace small"><span class="spinner-border spinner-border-sm me-1"></span> Mengunci baris nama ke Google Spreadsheet...</div>`;
    }

    const payloadGAS = new URLSearchParams();
    payloadGAS.append("aksi_drive", "tambah_peserta");
    payloadGAS.append("spreadsheet_id", spd); // Melempar ID lama (jika ada)
    payloadGAS.append("nama_peserta", input.value.trim());
    payloadGAS.append("judul_rapat", judulRapatLokal);

    const targetGoogleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbzuCer7A99VtRHulPhuejvy12MO7tdcZBLbfhew5DqWjVvKuhW_on3Scacn0CFOVaORVg/exec";

  
    fetch(targetGoogleAppsScriptUrl, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payloadGAS
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status peladen GAS: " + res.status);
        return res.json();
    })
    .then(resGAS => {
        if (resGAS.status !== 'success') {
            throw new Error(resGAS.message || "Google Apps Script menolak penulisan baris.");
        }

     const payloadMySQL = new FormData();
     payloadMySQL.append("id", idAgenda);
     payloadMySQL.append("google_spreadsheet_id", resGAS.spreadsheetId);
     const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
     
     return fetch(`${cleanEndpoint}/proses.php?aksi=sync_spreadsheet_id_agenda_peserta`, {
        method: "POST",
        body: payloadMySQL
    });
        
    })
    .then(resSqlMentah => {
    if (!resSqlMentah.ok) throw new Error("HTTP error dari server MySQL: " + resSqlMentah.status);
    return resSqlMentah.json(); // 3. Ubah respons mentah MySQL menjadi objek JSON bersih
})
.then(resSql => {
    // Tangkap hasil akhir keputusan eksekusi dari peladen MySQL
    if (resSql.status === 'success') {
        // Bersihkan kolom kotak input teks nama setelah sukses terarsip dua sisi
        input.value = "";
        
        if (typeof window.loadDataPresensiPesertaRapatAjax === "function") {
            alert("berhasil Tambah Peserta Rapat")
            window.loadDataPresensiPesertaRapatAjax(idAgenda);
        }
        
           if (!spd || spd === "" || spd === "null" || spd === "-") {
            // Berikan jeda 1 detik agar proses sinkronisasi server Google tenang, lalu panggil ulang detail modal
            setTimeout(() => {
                if (typeof window.bukaModal3LihatDetailAgendaDirect === "function") {
                    window.bukaModal3LihatDetailAgendaDirect(idAgenda);
                }
            }, 1000);
        }
    }

})
    .catch(err => {
        console.error(err);
        alert("Proses sinkronisasi manifest awan terganggu: " + err.message);
        window.loadDataPresensiPesertaRapatAjax(idAgenda);
    });
};


/**
 * 📅 MODUL AGENDA: PENGHAPUS BARIS KEHADIRAN CLOUD SPREADSHEET (admin.js)
 * SINKRONISASI: Menembak proses.php untuk meneruskan perintah DELETE ROW ke GAS
 */
window.eksekusiHapusPresensiPeserta = function(nomorBarisExcel, idAgenda, spd) {
    if (!spd || spd === "" || spd === "null" || spd === "-") {
        alert("⚠️ Gagal memproses: ID Google Spreadsheet untuk rapat ini tidak terdeteksi!");
        return false;
    }

    // 1. Tampilkan konfirmasi pengaman demi menghindari salah klik oleh pengurus
    let konfirm = confirm(`Apakah Anda yakin ingin membatalkan kehadiran pengurus pada baris ke-${nomorBarisExcel} langsung dari dokumen Google Spreadsheet?`);
    if (!konfirm) return false;
    const btnHapus = document.getElementById(`btn_hapus_absen_${nomorBarisExcel}`);
    if (btnHapus) {
        btnHapus.disabled = true; // Kunci tombol agar admin tidak melakukan klik ganda
        // Ubah isi tombol menjadi spinner bootstrap mini yang menawan
        btnHapus.innerHTML = `<span class="spinner-border spinner-border-sm text-danger" role="status" style="width: 0.75rem; height: 0.75rem;"></span>`;
    }
    // Siapkan FormData kaku menuju proses.php
    const payloadMySQL = new FormData();
    payloadMySQL.append("nomor_baris", nomorBarisExcel);
    payloadMySQL.append("spd",spd);

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // 2. 🔥 EKSEKUSI UTAMA: Tembak proxy server lokal untuk mendelete baris awan secara riil
    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_presensi_peserta_rapat`, {
        method: "POST",
        body: payloadMySQL
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error dari peladen lokal: " + res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === 'success') {
            // 3. REFRESH VISUAL: Segarkan manifes list daftar hadir secara live memindai ulang dari Google Drive
            alert('Berhasil hapus peserta');
            if (typeof window.loadDataPresensiPesertaRapatAjax === "function") {
                window.loadDataPresensiPesertaRapatAjax(idAgenda);
            }
        } else {
            alert("Gagal menghapus baris Spreadsheet: " + data.message);
        }
    })
    .catch(err => {
        console.error("Gagal melakukan kontak eliminasi baris:", err);
        alert("🚨 Gangguan koneksi saat menghapus data di Google Drive.");
        
        // Fallback: Tetap paksa panggil refresh UI agar lingkaran loading hilang
        if (typeof window.loadDataPresensiPesertaRapatAjax === "function") {
            window.loadDataPresensiPesertaRapatAjax(idAgenda);
        }
    });
};


/**
 * 📅 MODUL AGENDA: FIX FILE OBJECT FILELIST INDEX REFERENCE (admin.js)
 * PROSES: Mengunci fileTarget[0] agar pembacaan properti .name dan .type kebal dari error undefined
 */
window.eksekusiUploadNotulenKeDrive = function(idAgenda) {
    const fileInput = document.getElementById("uploadNotulenDriveInput");
    const labelProgress = document.getElementById("progressNotulenDrive");
    const btn = document.getElementById("btnUploadNotulen");

    if (!fileInput || fileInput.files.length === 0) {
        alert("⚠️ Pilih file berkas notulen rapat terlebih dahulu!");
        return;
    }

    // 💡 FIX 1: Ambil bodi array index ke-0 murni untuk mengisolasi 1 objek file tunggal yang dipilih admin
    const fileTarget = fileInput.files[0]; 

    if (labelProgress) {
        labelProgress.className = "small mt-1.5 font-monospace text-primary d-block fw-bold";
        labelProgress.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Mengonversi dokumen ke Base64...`;
    }
    if (btn) btn.disabled = true;

    const reader = new FileReader();
    reader.readAsDataURL(fileTarget); // Membaca objek fileTarget tunggal
// =========================================================================
// 🔒 SOLUSI MUTLAK: KUNCI INDEKS ARRAY STRIP BASE64 SECARA VALID (admin.js)
// =========================================================================
// Cari blok reader.onload = function() { ... } lama Anda, lalu ganti menjadi:

reader.onload = function() {
    
    const base64StringClean = reader.result.split(',')[1]; 
    
    if (labelProgress) {
        labelProgress.innerHTML = `<span class="spinner-border spinner-border-sm text-warning me-1" role="status"></span> Mengarsipkan berkas ke Google Drive via Proxy Server...`;
    }

    const payloadMySQL = new FormData();
    payloadMySQL.append("id", idAgenda);
    payloadMySQL.append("fileData", base64StringClean); // Kirim string biner padat 100%
    payloadMySQL.append("fileName", `Notulen_Rapat_ID_${idAgenda}_${new Date().getTime()}.${fileTarget.name.split('.').pop()}`);
    payloadMySQL.append("mimeType", fileTarget.type);

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    fetch(`${cleanEndpoint}/proses.php?aksi=proxy_upload_notulen_google_drive`, {
        method: "POST",
        body: payloadMySQL
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error dari peladen lokal: " + res.status);
        return res.json();
    })
    .then(dataSql => {
        alert(dataSql.message);
        
        if (dataSql.status === 'success') {
            if (labelProgress) {
                labelProgress.className = "small mt-1.5 font-monospace text-success d-block fw-bold";
                labelProgress.innerHTML = `✔️ Berkas Notulensi sukses diarsipkan ke Google Drive.`;
            }
            
            const linkBox = document.getElementById("boxLinkNotulenDrive");
            if (linkBox) {
                linkBox.innerHTML = `<a href="https://drive.google.com/file/d/${dataSql.fileId}" target="_blank" class="btn btn-xs btn-primary fw-bold px-2 py-0.5" style="font-size:0.7rem;"><i class="bi bi-file-earmark-text-fill"></i> Lihat Berkas Notulen Terarsip</a>`;
            }
            
            if (fileInput) fileInput.value = ""; // Bersihkan form
        } else {
            if (labelProgress) labelProgress.className = "small mt-1.5 font-monospace text-danger d-block";
        }
        if (btn) btn.disabled = false;
    })
    .catch(err => {
        console.error("Mata rantai upload terputus:", err);
        alert("🚨 Proses arsip awan gagal: " + err.message);
        if (btn) btn.disabled = false;
        if (labelProgress) {
            labelProgress.className = "small mt-1.5 font-monospace text-danger d-block";
            labelProgress.innerHTML = `❌ Gagal memproses pemindahan dua sisi.`;
        }
    });
};

};




window.eksekusiHapusAgendaRecord = function(idAgenda) {
    let konfirm = confirm("⚠️ PERINGATAN SISTEM KHUSUS ADMIN!\n\nApakah Anda yakin ingin membatalkan dan menghapus jadwal agenda kegiatan ini secara permanen dari kalender internal?\n\nTindakan ini tidak dapat dibatalkan.");
    
    if (!konfirm) return false;

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    const payload = new FormData();
    payload.append("id", idAgenda);

    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_agenda_kegiatan_record`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            // Tutup Modal 3 secara mandiri aman
            const d3 = document.getElementById('fsDialog'); 
            if (d3 && d3.close) d3.close();

            // Segarkan matriks kalender agenda di latar belakang secara instan
            if (typeof window.loadDanRenderMatriksKalenderAgenda === "function") {
                window.loadDanRenderMatriksKalenderAgenda();
            }
        }
    })
    .catch(err => {
        console.error(err);
        alert("🚨 Gagal terhubung ke peladen pangkalan data MySQL.");
    });
};


window.eksekusiBypassLoginSebagaiAnggota = function(noAnggotaTarget, namaDokter) {
    // 1. Berikan banner konfirmasi demi akuntabilitas audit internal
    let konfirm = confirm(`Apakah Anda yakin ingin masuk (Sign In) ke dalam dashboard akun:\n\n${namaDokter} (${noAnggotaTarget})\n\ntanpa menggunakan kata sandi?`);
    if (!konfirm) return false;
    const urlJalanPulangAdmin = window.location.href;
    const payload = new FormData();
    payload.append("no_anggota_target", String(noAnggotaTarget).trim());
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // 2. Tembak gerbang proses.php untuk menukar token session
    fetch(`${cleanEndpoint}/proses.php?aksi=admin_impersonate_anggota`, {
        method: "POST",
        body: payload
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error status peladen: " + res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === 'success') {
            
            localStorage.setItem("idi_id_user", data.token_id);
            localStorage.setItem("idi_nama_dokter", data.nama_dokter);
			localStorage.setItem("idi_user_whatsapp", data.whatsapp);
            localStorage.setItem("idi_is_logged_in", "true");
            localStorage.setItem("admin_review_mode", urlJalanPulangAdmin); 
            
            alert(`Sukses! Mengalihkan halaman kerja menuju Dasbor ${namaDokter}...`);
            
            // 3. Muat ulang halaman atau arahkan langsung ke file dashboard index utama Anggota Dokter
            window.location.href = "index.html"; 
        } else {
            alert("Gagal melakukan bypass login: " + data.message);
        }
    })
    .catch(err => {
        console.error("Gagal interseptor impersonate:", err);
        alert("🚨 Gangguan koneksi peladen lokal cPanel.");
    });
};


window.eksekusiAdminPulangKePanelUtama = function() {
    const urlTujuanPulang = localStorage.getItem("admin_review_mode");
    
    if (!urlTujuanPulang || urlTujuanPulang === "" || urlTujuanPulang === "null") {
        alert("Sesi tinjauan tidak valid atau koordinat jalan pulang admin kedaluwarsa.");
        return false;
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // 2. 🔥 INISIALISASI PENGHANCURAN SESSION SERVER: Tembak proses.php di latar belakang
    fetch(`${cleanEndpoint}/proses.php?aksi=hapus_session_impersonate_server`, {
        method: "POST"
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error dari server: " + res.status);
        return res.json();
    })
    .then(data => {

        localStorage.removeItem("admin_review_mode");
        localStorage.removeItem("idi_id_user");
        localStorage.removeItem("idi_is_logged_in");
        localStorage.removeItem("idi_nama_dokter");
        localStorage.removeItem("idi_user_whatsapp");
        localStorage.removeItem("idi_user_whatsapp");

        alert("Menutup sesi tinjauan secara total (Browser & Server). Berpindah kembali ke Panel Utama Admin...");
        window.location.href = urlTujuanPulang;
    })
    .catch(err => {
        console.error("Gagal menghapus session di server:", err);
        
        // Fallback Keamanan: Jika internet mendadak putus/server drop, tetap paksa admin pulang di sisi browser
        localStorage.removeItem("admin_review_mode");
        window.location.href = urlTujuanPulang;
    });
};

/**
 * 📇 MODUL MANAJEMEN KONTAK PERSONIL SEKRETARIAT (IDI CABANG BATAM)
 * POTONGAN 1: Antarmuka Utama & Render List Kontak Berbasis Parsing JSON MySQL
 */
window.menuContact = function() {
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    const htmlContact = `
        <div class="container py-2 text-start" id="contactAdminWrapper">
            <!-- BANNER INFO REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                <span class="fs-2">📇</span>
                <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; color: #ffc107;">Daftar Kontak Personil</span>
                        <span class="small text-white-50">Kelola nomor kontak pengurus dan staf sekretariat yang muncul di halaman akun login Anggota Dokter.</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-success fw-bold rounded-pill px-3 shadow-sm" onclick="window.bukaModal3FormKontakPersonilBaru()">
                        <i class="bi bi-plus-circle-fill me-1"></i> Tambah Personil
                    </button>
                </div>
            </div>

            <!-- KANVAS DINAMIS TABEL KONTAK PERSONIL -->
            <div id="tableAreaKontakPersonil" class="animate-fade-in pb-5" style="overflow: auto; min-height: 250px;">
                <div class="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status" style="width:2rem; height:2rem;"></div>
                    <p class="small mb-0 font-monospace text-secondary">Sedang memindai daftar kontak aktif...</p>
                </div>
            </div>
        </div>
    `;

    // Bentangkan halaman kerja menuju komponen Modal Utama Tingkat 1 (modal2)
    if (typeof modal2 === "function") {
        modal2('Manajemen', htmlContact);
    } else {
        alert("Sistem tidak terdeteksi");
        return;
    }

    // Jalankan pemicu otomatis penarik data live dari database MySQL
    window.loadDataKontakPersonilMySQL();
};

/**
 * AJAX LOADER: Membaca isi daftar_kontak_json dari tabel kontak_person
 */
window.loadDataKontakPersonilMySQL = function() {
    const tempatKanvasTabel = document.getElementById("tableAreaKontakPersonil");
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    if (!tempatKanvasTabel) return;

    fetch(`${cleanEndpoint}/proses.php?aksi=get_data_kontak_personil_json`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            // Tangkap array objek hasil uraian biner JSON di proses.php
            const listKontak = res.data;
            
            if (!listKontak || listKontak.length === 0) {
                tempatKanvasTabel.innerHTML = `<div class="alert alert-info text-center p-3 small rounded-4 m-2">Nihil, belum ada nomor kontak personil pengurus yang terdaftar.</div>`;
                return;
            }

            let barisTabelHtml = "";
            
            // Loop array JSON menggunakan indeks baris virtual (i) sebagai penunjuk koordinat mutlak
            listKontak.forEach((row, index) => {
                // Konversi teks agar kebal terhadap error tanda petik saat dilempar ke fungsi edit
                const namaAman = String(row.nama || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                const jabatanAman = String(row.jabatan || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                const waAman = String(row.wa || '').trim();

                barisTabelHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${index + 1}</td>
                        <td class="fw-bold text-dark text-uppercase small">${row.nama}</td>
                        <td class="font-monospace small text-primary fw-bold">🟢 +62 ${waAman}</td>
                        <td class="small fw-semibold text-secondary"><span class="badge bg-light text-dark border">${row.jabatan}</span></td>
                        <td class="text-center">
                            <div class="d-flex justify-content-center gap-1.5">
                                <!-- Tombol Aksi Edit -->
                                <button type="button" class="btn btn-xs btn-outline-dark px-2 py-0.5 rounded fw-bold" style="font-size:0.7rem;" 
                                        onclick="window.bukaModal3FormKontakPersonilBaru(${index}, '${namaAman}', '${waAman}', '${jabatanAman}')">
                                    <i class="bi bi-pencil-square"></i> Edit
                                </button>
                                <!-- Tombol Aksi Hapus -->
                                <button type="button" class="btn btn-xs btn-outline-danger px-1.5 py-0.5 rounded fw-bold" style="font-size:0.7rem;" 
                                        onclick="window.eksekusiHapusKontakPersonil(${index}, '${namaAman}')">
                                    ✕ Hapus
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            tempatKanvasTabel.innerHTML = `
                <div class="table-responsive rounded-4 border bg-white shadow-sm mb-2">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                        <thead class="table-dark text-uppercase font-monospace">
                            <tr>
                                <th width="6%" class="text-center">No</th>
                                <th width="35%">Nama Personil</th>
                                <th width="25%">No. WhatsApp</th>
                                <th width="22%">Jabatan Struktur</th>
                                <th width="12%" class="text-center">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${barisTabelHtml}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            tempatKanvasTabel.innerHTML = `<div class="alert alert-danger p-2 small m-2">${res.message}</div>`;
        }
    })
    .catch(err => {
        console.error(err);
        tempatKanvasTabel.innerHTML = `<div class="alert alert-danger p-3 small text-center m-2">Gagal menyinkronkan daftar kontak sekretariat.</div>`;
    });
};

/**
 * POTONGAN 2: Formulir Dinamis Dual-Mode (Tambah/Edit) di Modal 3 & Handler AJAX Compiler
 */
window.bukaModal3FormKontakPersonilBaru = function(indexBaris = null, namaLama = "", waLama = "", jabatanLama = "") {
    if (typeof modal3 !== "function") return;

    // Deteksi Mode Operasi berdasarkan eksistensi indexBaris parameter klik
    const isEditMode = (indexBaris !== null);

    modal3(isEditMode ? 'Edit Kontak Personil' : 'Registrasi Personil Sekretariat Baru', `
        <div class="text-end px-1" style="margin-top: -15px; margin-bottom: 10px;">
            <button type="button" class="btn-close" aria-label="Close" onclick="this.closest('dialog').close();"></button>
        </div>

        <div class="container py-1 text-start animate-fade-in" id="wrapperFormKontakPersonil">
            <form id="formSubmitKontakPersonilMySQL">
                <!-- Lempar koordinat indeks array ke input hidden jika dalam mode edit -->
                <input type="hidden" id="kpIndexMode" value="${isEditMode ? indexBaris : ''}">

                <div class="row g-2.5">
                    <div class="col-12">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Nama Lengkap & Gelar</label>
                        <input type="text" class="form-control form-control-sm fw-bold text-dark-emphasis text-uppercase" id="kpNama" required placeholder="Contoh: NASRIL, S.KOM" value="${namaLama}">
                    </div>
                    <div class="col-sm-7 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Nomor WhatsApp Aktif</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light font-monospace fw-bold small">+62</span>
                            <input type="number" class="form-control font-monospace fw-bold text-primary" id="kpWa" required placeholder="Contoh: 8127762261" value="${waLama}">
                        </div>
                        <div class="form-text text-muted" style="font-size:0.68rem;">Tuliskan digit kelanjutan angka langsung tanpa menyertakan angka 0 di depan.</div>
                    </div>
                    <div class="col-sm-5 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Jabatan Struktur</label>
                        <input type="text" class="form-control form-control-sm fw-semibold" id="kpJabatan" required placeholder="Contoh: Staff Sekretariat" value="${jabatanLama}">
                    </div>
                </div>

                <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-4" onclick="this.closest('dialog').close();">Batal</button>
                    <button type="submit" class="btn btn-sm btn-success fw-bold rounded-pill px-4 shadow-sm" id="btnSubmitKontakPersonil">
                        <i class="bi bi-check-circle-fill me-1"></i> ${isEditMode ? 'Perbarui Data Kontak' : 'Simpan Personil Baru'}
                    </button>
                </div>
            </form>
        </div>
    `);

    // Pemicu listener submit
    window.inisialisasiSubmitFormKontakPersonilEngine(isEditMode);
};

// =========================================================================
// 🔒 FIX ENGINE FRONTEND: STABILISASI ENDPOINT & SCOPE CLOSURE (admin.js)
// =========================================================================
window.inisialisasiSubmitFormKontakPersonilEngine = function(isEditMode) {
    const form = document.getElementById("formSubmitKontakPersonilMySQL");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const btn = document.getElementById("btnSubmitKontakPersonil");
        if (btn) btn.disabled = true;

        const payload = new FormData();
        payload.append("mode_operasi", isEditMode ? "EDIT" : "TAMBAH");
        payload.append("index_koordinat", document.getElementById("kpIndexMode").value);
        payload.append("nama", document.getElementById("kpNama").value.trim());
        payload.append("wa", document.getElementById("kpWa").value.trim());
        payload.append("jabatan", document.getElementById("kpJabatan").value.trim());

        const currentEndpoint = typeof endpoint !== 'undefined' ? endpoint : '';
        // 💡 FIX 1: Potong garis miring di ujung jika ada agar standarisasi rute aman
        const cleanEndpoint = currentEndpoint.endsWith('/') ? currentEndpoint.slice(0, -1) : currentEndpoint;

        // 💡 FIX 2: Selipkan tanda karakter garis miring (/) tunggal kaku sebelum kata proses.php
        fetch(`${cleanEndpoint}/proses.php?aksi=mutasi_array_json_kontak_personil`, {
            method: "POST",
            body: payload
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error dari peladen lokal: " + res.status);
            return res.json();
        })
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // 💡 FIX 3: Mengganti 'this.closest' menjadi 'form.closest' secara kaku 
                // agar referensi penutupan bodi Modal 3 terisolasi dijamin sukses 100%
                const dialog3 = form.closest('dialog');
                if (dialog3 && typeof dialog3.close === 'function') {
                    dialog3.close(); 
                }
                
                // Segarkan data baris tabel utama kesekretariatan
                window.loadDataKontakPersonilMySQL(); 
            } else {
                if (btn) btn.disabled = false;
            }
        })
        .catch(err => {
            console.error("Mata rantai pertukaran token terputus:", err);
            alert("🚨 Gagal terhubung ke peladen pangkalan data MySQL.");
            if (btn) btn.disabled = false;
        });
    });
};


/**
 * FUNGSI EKSEKUSI HAPUS (DELETE INDEKS REKOR)
 */
window.eksekusiHapusKontakPersonil = function(indexBaris, namaPersonil) {
    let konfirm = confirm(`Apakah Anda yakin ingin menghapus pengurus:\n\n${namaPersonil}\n\ndari daftar kontak helpdesk kesekretariatan?`);
    if (!konfirm) return false;

    const payload = new FormData();
    payload.append("mode_operasi", "HAPUS");
    payload.append("index_koordinat", indexBaris);

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    fetch(`${cleanEndpoint}/proses.php?aksi=mutasi_array_json_kontak_personil`, {
        method: "POST",
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            window.loadDataKontakPersonilMySQL();
        }
    })
    .catch(err => console.error(err));
};


window.menuDokumenPenting = function(status) {
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    let disa="block";
            if(status==="user") { disa="none" }
    const htmlDokumen = `
        <div class="container py-2 text-start" id="dokumenPentingAdminWrapper">
            <!-- BANNER INFO REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                <span class="fs-2">📂</span>
                <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; color: #ffc107;">Arsip Dokumen Penting</span>
                        <span class="small text-white-50">Penyimpanan dokumen digital internal organisasi (SK Pengurus, AD/ART, SOP) langsung di Cloud Google Drive.</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-success fw-bold rounded-pill px-3 shadow-sm" onclick="window.bukaModal3FormDokumenPentingBaru()" style="display:${disa}">
                        <i class="bi bi-plus-circle-fill me-1"></i> Unggah Dokumen Baru
                    </button>
                </div>
            </div>

            <!-- AREA TABEL ARSIP -->
            <div id="tableAreaDokumenPenting" class="animate-fade-in pb-5" style="overflow: auto; min-height: 250px;">
                <div class="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                    <div class="spinner-border text-success mb-2" role="status"></div>
                    <p class="small mb-0 font-monospace text-secondary">Memindai brankas dokumen penting...</p>
                </div>
            </div>
        </div>
    `;

        if(status==="admin")
        {
        modal2('Brankas Dokumen Penting', htmlDokumen);
        }
        if(status==="user")
        {
        modal1('Brankas Dokumen Penting', htmlDokumen);
        }

    window.loadDataDokumenPentingMySQL(status);
};


window.loadDataDokumenPentingMySQL = function(status) {
    const kanvas = document.getElementById("tableAreaDokumenPenting");
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    if (!kanvas) return;

    fetch(`${cleanEndpoint}/members.php?aksi=get_list_dokumen_penting`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            const listData = res.data;
            if (listData.length === 0) {
                kanvas.innerHTML = `<div class="alert alert-info text-center p-3 small rounded-4 m-2">Belum ada dokumen penting terarsip.</div>`;
                return;
            }

            let trHtml = "";
            let disa="";
            if(status==="user") { disa="none" }
            listData.forEach((row, index) => {
                trHtml += `
                    <tr>
                        <td class="text-center font-monospace small fw-bold">${index + 1}</td>
                        <td class="fw-bold text-dark text-uppercase small">${row.judul}</td>
                        <td class="font-monospace small text-muted">${row.tanggal_indo}</td>
                        <td class="text-center">
                            <a href="https://drive.google.com/file/d/${row.kode_dokumen_drive}" target="_blank" class="btn btn-xs btn-outline-danger px-2 py-0.5 rounded fw-bold" style="font-size:0.65rem;">
                                <i class="bi bi-file-earmark-pdf-fill"></i> Buka Drive
                            </a>
                        </td>
                        <td class="text-center hdp" style="display:${disa}">
                            <button type="button" class="btn btn-xs btn-outline-danger px-2 py-0.5 rounded fw-bold" style="font-size:0.65rem;" onclick="window.eksekusiHapusDokumenPenting(${row.id})">
                                ✕ Hapus
                            </button>
                        </td>
                    </tr>
                `;
            });

            kanvas.innerHTML = `
                <div class="table-responsive rounded-4 border bg-white shadow-sm mb-2">
                    <table class="table table-striped table-hover align-middle mb-0" style="font-size:0.83rem;">
                        <thead class="table-dark text-uppercase font-monospace">
                            <tr>
                                <th width="6%" class="text-center">No</th>
                                <th width="50%">Judul / Nama Dokumen</th>
                                <th width="20%">Tanggal Arsip</th>
                                <th width="12%" class="text-center">Berkas</th>
                                <th width="12%" class="text-center" style="display:${disa}">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>${trHtml}</tbody>
                    </table>
                </div>
            `;
        }
    })
    .catch(err => { console.error(err); kanvas.innerHTML = `<div class="alert alert-danger small p-2 m-2">Gagal memuat berkas.</div>`; });
};

/**
 * POTONGAN 2: Sub-Formulir Input Modal 3 & Handler File-Reader Base64 Stream
 */
window.bukaModal3FormDokumenPentingBaru = function() {
    if (typeof modal3 !== "function") return;
    
    const hariIni = new Date().toISOString().split('T')[0];

    modal3('Unggah Dokumen', `
        <div class="text-end px-1" style="margin-top: -15px; margin-bottom: 10px;">
            <button type="button" class="btn-close" aria-label="Close" onclick="this.closest('dialog').close();"></button>
        </div>

        <div class="container py-1 text-start animate-fade-in" id="wrapperFormDokumenPenting">
            <form id="formSubmitDokumenPentingMySQL">
                <div class="row g-2.5">
                    <div class="col-12">
                        <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Judul / Keterangan Dokumen</label>
                        <input type="text" class="form-control form-control-sm fw-bold text-dark-emphasis text-uppercase" id="dpJudul" Gold required placeholder="Contoh: SK KEPENGURUSAN IDI PERIODE 2026-2029">
                    </div>
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-secondary mb-1">📅 Tanggal Dokumen Resmi</label>
                        <input type="date" class="form-control form-control-sm font-monospace fw-bold" id="dpTanggal" value="${hariIni}" required>
                    </div>
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold small text-danger mb-1"><span class="text-danger">*</span> Pilih File Berkas Dokumen</label>
                        <input type="file" class="form-control form-control-sm" id="dpFileInput" accept="application/pdf,image/*" required>
                    </div>
                </div>
                <div id="progressDokumenPentingDrive" class="small mt-2 font-monospace text-secondary d-none"></div>

                <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-4" onclick="this.closest('dialog').close();">Batal</button>
                    <button type="submit" class="btn btn-sm btn-success fw-bold rounded-pill px-4 shadow-sm" id="btnSubmitDokumenPenting">
                        <i class="bi bi-cloud-arrow-up-fill me-1"></i> Mulai Unggah & Simpan
                    </button>
                </div>
            </form>
        </div>
    `);

    // Pemicu Listener Submit
    const form = document.getElementById("formSubmitDokumenPentingMySQL");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const fileInput = document.getElementById("dpFileInput");
        const labelProgress = document.getElementById("progressDokumenPentingDrive");
        const btn = document.getElementById("btnSubmitDokumenPenting");

        if (!fileInput || fileInput.files.length === 0) return;

        const fileTarget = fileInput.files[0];
        if (labelProgress) {
            labelProgress.className = "small mt-2 font-monospace text-primary d-block fw-bold";
            labelProgress.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Mengonversi dokumen...`;
        }
        if (btn) btn.disabled = true;

        const reader = new FileReader();
        reader.readAsDataURL(fileTarget);
        reader.onload = function() {
            const base64StringClean = reader.result.split(',')[1]; // Ambil murni string bodi Base64

            if (labelProgress) labelProgress.innerHTML = `<span class="spinner-border spinner-border-sm text-warning me-1"></span> Mengunggah langsung ke Cloud Google Drive...`;

            const payloadMySQL = new FormData();
            payloadMySQL.append("judul", document.getElementById("dpJudul").value.trim());
            payloadMySQL.append("tanggal", document.getElementById("dpTanggal").value);
            payloadMySQL.append("fileData", base64StringClean);
            payloadMySQL.append("fileName", `DK_${new Date().getTime()}.${fileTarget.name.split('.').pop()}`);
            payloadMySQL.append("mimeType", fileTarget.type);

            const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

            fetch(`${cleanEndpoint}/members.php?aksi=proxy_upload_dokumen_penting_drive`, { method: "POST", body: payloadMySQL })
            .then(res => res.json())
            .then(dataSql => {
                alert(dataSql.message);
                if (dataSql.status === 'success') {
                    form.closest('dialog').close();
                    window.loadDataDokumenPentingMySQL();
                } else {
                    if (btn) btn.disabled = false;
                }
            })
            .catch(err => {
                console.error(err);
                alert("🚨 Gangguan koneksi peladen.");
                if (btn) btn.disabled = false;
            });
        };
    });
};

/**
 * FUNGSI HAPUS REKAMAN ARSIP
 */
window.eksekusiHapusDokumenPenting = function(idTarget) {
    if (!confirm("Apakah Anda yakin ingin menghapus arsip dokumen penting ini secara permanen dari database?")) return false;
    const payload = new FormData();
    payload.append("id", idTarget);
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    fetch(`${cleanEndpoint}/members.php?aksi=hapus_dokumen_penting_record`, { method: "POST", body: payload })
    .then(res => res.json())
    .then(data => { alert(data.message); if (data.status === 'success') window.loadDataDokumenPentingMySQL(); });
};

/**
 * 🔗 MODUL MANAJEMEN LINK TERKAIT: SINGLE-CATEGORY PARAMETER PANEL MODE
 * POTONGAN 1: Merender Panel Tunggal Kondisional Sesuai Nilai Argumen 'kategori'
 */
window.menuLinkTerkait = function(kategorix) {
    let kategori=kategorix.split('#')[0];
    if (!kategori || kategori === "") {
        alert("⚠️ Gagal memuat portal: Parameter kluster kategori wajib ditentukan!");
        return;
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    
    // 💡 LIVE BINDING LABEL: Tentukan judul kepala dan warna tema secara kondisional
    const isSarana = (kategori === "sarana_kesehatan");
    const labelJudulPanel = isSarana ? "🏥 SARANA KESEHATAN (FASKES/RS)" : "🔬 LINK KESEHATAN / JURNAL RESMI";
    const temaColorClass = isSarana ? "success" : "primary";
    const subDeskripsiText = isSarana 
        ? "Mengelola daftar link tautan luar fasilitas kesehatan, rumah sakit, klinik, dan faskes rujukan dokter Batam." 
        : "Mengelola daftar link tautan luar portal instansi resmi (Kemkes, KKI, BPJS) atau situs jurnal ilmiah kedokteran.";

    const htmlLinkPortalTunggal = `
        <div class="container py-2 text-start" id="linkTerkaitAdminWrapper">
            <!-- BANNER INFO REGULASI -->
            <div class="alert bg-dark text-white border-0 p-3 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                <span class="fs-2">${isSarana ? '🏥' : '🔬'}</span>
                <div class="w-100">
                    <span class="small d-block fw-bold text-uppercase" style="letter-spacing:0.5px; color: #ffc107;">Konfigurasi Portal Link Eksternal</span>
                    <span class="small text-white-50">${subDeskripsiText}</span>
                </div>
            </div>

            <!-- PANEL TUNGGAL KAKU SESUAI PARAMETER -->
            <div class="row pb-5">
                <div class="col-12">
                    <div class="card rounded-4 shadow-sm border p-3 bg-white">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h6 class="fw-bold text-${temaColorClass} mb-0">${labelJudulPanel}</h6>
                            <!-- Kirimkan kategori aktif ke dalam modal formulir tambah baru -->
                            <button type="button" id="ttb" class="btn btn-sm btn-${temaColorClass} fw-bold rounded-pill px-3 py-0.5 animate-pulse" style="font-size:0.7rem;" 
                                    onclick="window.bukaModal3FormLinkTerkaitBaru('${kategori}')">
                                ➕ Tambah Tautan Baru
                            </button>
                        </div>
                        
                        <!-- Kanvas Tempat Render List Baris JSON -->
                        <div id="areaListLinkTerkaitDinamis" class="small font-sans" style="min-height:150px;">
                            <div class="text-center py-5 text-muted">
                                <div class="spinner-border spinner-border-sm text-${temaColorClass} me-1" role="status"></div>
                                <p class="small font-monospace mt-1 mb-0 text-secondary">Sedang memindai database link kluster ${kategori}...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

let statuslogin=kategorix.split('#')[1];
if(statuslogin==="1")
{
        modal2(isSarana ? 'Portal Sarana' : 'Portal Ilmiah', htmlLinkPortalTunggal);
}
if(statuslogin==="2")
{
        modal1(isSarana ? 'Portal Sarana Kesehatan' : 'Portal Tautan Ilmiah', htmlLinkPortalTunggal);
}   
    window.loadDataKoleksiLinkTerkaitCategory(kategori, 'areaListLinkTerkaitDinamis',statuslogin);
};

/**
 * 🔗 MODUL PORTAL LINK: LOADER DATA DINAMIS BERBASIS ROW ID (admin.js)
 */
window.loadDataKoleksiLinkTerkaitCategory = function(kategoriAktif, targetContainerId,statuslogin) {
    const box = document.getElementById(targetContainerId);
    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    if (!box) return;

    // Ambil data dari server berdasarkan filter kategori
    fetch(`${cleanEndpoint}/members.php?aksi=get_data_link_terkait_json&kategori=${kategoriAktif}`)
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success' && res.data && res.data.length > 0) {
            let containerHtml = `<div class="list-group rounded-3 shadow-xs">`;
            
            res.data.forEach((row) => {
                const namaAman = String(row.nama_link || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                const urlAman  = String(row.url_tujuan || '').trim();

let edithapus="";
if(statuslogin==="1")
{
edithapus=`    <div class="d-flex gap-1">
                            <!-- 💡 SINKRONISASI: Mengirimkan row.id database asli, bukan indeks array -->
                            <button type="button" class="btn btn-xs btn-outline-dark px-1.5 py-0 border-0 ttt"
                                    onclick="window.bukaModal3FormLinkTerkaitBaru('${kategoriAktif}', ${row.id}, '${namaAman}', '${urlAman}')">✏️</button>
                            <button type="button" class="btn btn-xs btn-outline-danger px-1.5 py-0 border-0 fw-bold tts" 
                                    onclick="window.eksekusiHapusLinkTerkaitRecord('${kategoriAktif}', ${row.id})">✕</button>
                        </div>`;
}
                containerHtml += `
                    <div class="list-group-item d-flex justify-content-between align-items-center p-2.5">
                        <div class="text-truncate" style="max-width: 75%;">
                            <strong class="text-dark d-block text-uppercase" style="font-size:0.78rem;">${row.nama_link}</strong>
                            <a href="${urlAman}" target="_blank" class="text-muted small text-decoration-none font-monospace" style="font-size:0.68rem;">${urlAman}</a>
                        </div>
                    ${edithapus}
                    </div>
                `;
            });
            
            containerHtml += `</div>`;
            box.innerHTML = containerHtml;
        } else {
            box.innerHTML = `<div class="text-center py-4 text-muted font-monospace small border border-dashed rounded-3">[ Belum ada link tautan terdaftar ]</div>`;
        }
    })
    .catch(err => { console.error(err); box.innerHTML = `<span class="text-danger small">Gagal memuat data dari server.</span>`; });
};

window.bukaModal3FormLinkTerkaitBaru = function(kategoriAktif, indexBaris = null, namaLama = "", urlLama = "") {
    if (typeof modal3 !== "function") return;

    const isEditMode = (indexBaris !== null);
    const labelLabel = kategoriAktif === 'sarana_kesehatan' ? '🏥 Sarana Kesehatan' : '🔬 Link/Jurnal Kesehatan';

    modal3(isEditMode ? 'Edit Tautan URL' : 'Tambah Tautan URL Baru', `

        <div class="container py-1 text-start animate-fade-in" id="wrapperFormLinkTerkait">
            <span class="badge bg-secondary font-monospace mb-2 text-uppercase" style="font-size:0.6rem;">Group: ${labelLabel}</span>
            <form id="formSubmitLinkTerkaitMySQL">
                <input type="hidden" id="lkKategori" value="${kategoriAktif}">
                <input type="hidden" id="lkIndexMode" value="${isEditMode ? indexBaris : ''}">

                <div class="mb-2">
                    <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Nama / Label Link Tautan</label>
                    <input type="text" class="form-control form-control-sm fw-bold text-dark-emphasis" id="lkNamaLink" required placeholder="Contoh: WEBSITE RSUD EMBUNG FATIMAH" value="${namaLama}">
                </div>
                <div class="mb-2">
                    <label class="form-label fw-bold small text-secondary mb-1"><span class="text-danger">*</span> Alamat URL Tujuan (Wajib Awalan http:// atau https://)</label>
                    <input type="url" class="form-control form-control-sm font-monospace text-primary fw-semibold" id="lkUrlTujuan" required placeholder="Contoh: https://batam.go.id" value="${urlLama}">
                </div>

                <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                    <button type="button" class="btn btn-sm btn-dark rounded-pill px-4" onclick="this.closest('dialog').close();">Batal</button>
                    <button type="submit" class="btn btn-sm btn-success fw-bold rounded-pill px-4 shadow-sm" id="btnSubmitLinkTerkait">
                        <i class="bi bi-check-circle-fill me-1"></i> Simpan Tautan
                    </button>
                </div>
            </form>
        </div>
    `);

    // Handler Submit Form
    const form = document.getElementById("formSubmitLinkTerkaitMySQL");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = document.getElementById("btnSubmitLinkTerkait");
        if (btn) btn.disabled = true;

        const payload = new FormData();
        payload.append("mode_operasi", isEditMode ? "EDIT" : "TAMBAH");
        payload.append("kategori", document.getElementById("lkKategori").value);
        payload.append("index_koordinat", document.getElementById("lkIndexMode").value);
        payload.append("nama_link", document.getElementById("lkNamaLink").value.trim());
        payload.append("url_tujuan", document.getElementById("lkUrlTujuan").value.trim());

        const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

        fetch(`${cleanEndpoint}/members.php?aksi=mutasi_array_json_link_terkait`, { method: "POST", body: payload })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                form.closest('dialog').close();
                window.menuLinkTerkait(document.getElementById("lkKategori").value+'#1'); 
            } else { if (btn) btn.disabled = false; }
        })
        .catch(err => { console.error(err); if (btn) btn.disabled = false; });
    });
};

window.eksekusiHapusLinkTerkaitRecord = function(kategoriAktif, idTarget) {
    if (!confirm("Apakah Anda yakin ingin menghapus tautan luar ini secara permanen dari pangkalan data?")) return false;
    
    const payload = new FormData();
    payload.append("mode_operasi", "HAPUS");
    payload.append("id_target", idTarget); // Melempar ID baris murni

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';
    fetch(`${cleanEndpoint}/members.php?aksi=mutasi_array_json_link_terkait`, { method: "POST", body: payload })
    .then(res => res.json())
    .then(data => { 
        alert(data.message); 
        if (data.status === 'success') window.menuLinkTerkait(kategoriAktif+'#1'); 
    });
};


function initAdmin() {
    if(localStorage.getItem("admin_is_logged") === "true") {
         renderDasborSuksesAdmin(localStorage.getItem("admin_nama_user"));
         setTimeout(() => {
            window.fetchLiveUserOnlineAdminSync();
        }, 500);
        setInterval(() => {
            window.fetchLiveUserOnlineAdminSync();
        }, 30000);
        const urlJalanPulang = localStorage.getItem("admin_review_mode");

    if (urlJalanPulang && urlJalanPulang !== "" && urlJalanPulang !== "null") {
        const bannerContainer = document.getElementById("bannerModeTinjauAdminGlobal");
        if (bannerContainer) {
            bannerContainer.classList.remove("d-none"); // Tampilkan banner
        }
    }
         return;
    }

    function renderDasborSuksesAdmin(namaAdmin) {
        const myModal = new bootstrap.Modal(document.getElementById('generalFullscreenModal'));
        myModal.show();
        const titleElement = document.getElementById("generalModalTitle");
        const bodyElement = document.getElementById("generalModalBody");
        let sesidokter=localStorage.getItem('idi_nama_dokter')
        const adminlogin = `
            <div class="col-12">
                <!-- HEADER DASBOR -->
                <div class="p-4 bg-white rounded-4 shadow-sm border-start border-4 border-success mb-4">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h4 class="fw-bold text-success mb-1"><i class="bi bi-speedometer2 me-2"></i>Sistem Pusat Kendali Administrator</h4>
                            <p class="text-muted small mb-0">Selamat datang kembali, <strong>${namaAdmin}</strong>. Hak akses Anda: <span class="badge bg-dark">Admin (Level ${localStorage.getItem('admin_level')})</span></p>
                            <div id="bannerModeTinjauAdminGlobal" class="d-none">
    <div class="w-100  p-2.5 text-center small d-flex align-items-center justify-content-center gap-3 animate-flash" style="z-index: 99999; position: relative; font-size:0.85rem;">
        <span>REVIEW MODE: Anda sedang menginspeksi dashboard <b><u>${sesidokter}</u></b> </span>
        <!-- Tombol Pemicu Pulang Instan -->
        <button type="button" class="btn btn-xs btn-light text-danger fw-bold rounded-pill px-3 py-0.5 border-0 shadow-sm" style="font-size:0.72rem;" onclick="window.eksekusiAdminPulangKePanelUtama()">
            🏃 Selesai Tinjau & Kembali ke Admin
        </button>
    </div>
</div>
                             
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-danger px-3 py-2 fw-bold rounded-3" id="btnLogOutAdmin">
                                <i class="bi bi-power me-1"></i> Keluar Sistem
                            </button>
                        </div>
                    </div>
                </div>

                <!-- APPLICATION DRAWER CONTAINER DARI MYSQL -->
                <div class="card border-0 shadow-sm rounded-4 p-4">
                    <h5 class="fw-bold text-dark mb-4"><i class="bi bi-grid-3x3-gap-fill me-2 text-success"></i>Application Drawer Menu</h5>
                    <div id="mysqlDynamicDrawerArea">
                        <div class="text-center py-3 text-muted small"><div class="spinner-border spinner-border-sm me-2"></div>Sinkronisasi tabel mainmenu...</div>
                    </div>
                </div>
            </div>
        `;
			
        titleElement.innerHTML = `<i class="bi bi-shield-lock me-2"></i>Akses Administrator`;
        bodyElement.innerHTML = adminlogin;

document.getElementById("btnLogOutAdmin").addEventListener("click", function(e) { 
    e.preventDefault(); 
    
    if (!confirm("Apakah Anda yakin ingin keluar dari sistem dashboard IDI Batam?")) {
        return false;
    }

    const cleanEndpoint = typeof endpoint !== 'undefined' ? endpoint.replace(/\/*\$/, '') : '';

    // 1. Tembak backend proses.php untuk menghancurkan session di dalam server Apache
    fetch(`${cleanEndpoint}/proses.php?aksi=logout_destroy_session`)
    .then(res => res.json())
    .then(data => {
        // 2. Bersihkan seluruh jejak login lokal di dalam peramban browser
        localStorage.clear();
        localStorage.clear();

        // 3. Muat ulang halaman atau lempar paksa ke halaman login utama
        alert("Sukses! Sesi Anda telah dihapus secara aman.");
        window.location.reload();
    })
    .catch(err => {
        console.error("Gagal kontak server untuk logout:", err);
        // Fallback jika internet putus, tetap paksa clear sisi browser
        localStorage.clear();
        localStorage.clear();
        window.location.reload();
    });
});

        const drawerArea = document.getElementById("mysqlDynamicDrawerArea");
        
        drawerArea.addEventListener("click", function(e) {
            const item = e.target.closest('.admin-drawer-item');
            if (item) {
                e.preventDefault();
                const actionString = item.getAttribute('data-action'); // Contoh: "menuNews('Informasi')" atau "menuPengurus()"
                
                if (actionString) {
                    try {
                        // Regex untuk memisahkan nama fungsi dan parameternya
                        const match = actionString.match(/^(\w+)\((.*)\)$/);
                        
                        if (match) {
                            const functionName = match[1]; // Mengambil "menuNews"
                            const rawArgs = match[2].trim(); // Mengambil "'Informasi'" atau kosong
                            const adminLevelUser = parseInt(localStorage.getItem("admin_level"), 10) || 0;
                            if (adminLevelUser === 2) {
                                const daftarMenuDiizinkan = [
                                    'menuMembers', 
                                    'bukaFormInvoiceUmumSponsorModal2'
                                ];

                                // Jika fungsi yang diklik TIDAK ada dalam daftar diizinkan, BATALKAN EKSEKUSI!
                                if (!daftarMenuDiizinkan.includes(functionName)) {
                                    alert(`⚠️ AKSES DITOLAK!\n\nAkun Anda terdaftar sebagai Admin Level 2.\nOtoritas Anda terbatas hanya diizinkan untuk mengelola:\n1. Data Anggota\n2. Penerbitan Invoice Sponsor \n\nMenu lainnya hanya dapat diakses oleh Admin Level 1.`);
                                    return false; // Hentikan proses klik seketika
                                }
                            }
                            if (typeof window[functionName] === 'function') {
                                if (rawArgs) {
                                    // Bersihkan tanda petik tunggal atau ganda di dalam argumen
                                    const cleanArg = rawArgs.replace(/['"]/g, '');
                                    window[functionName](cleanArg); // Jalankan fungsi dengan parameter
                                } else {
                                    window[functionName](); // Jalankan fungsi tanpa parameter
                                }
                            } else {
                                console.error(`Fungsi ${functionName} tidak ditemukan di window.`);
                            }
                        }
                    } catch (err) {
                        console.error("Gagal menjalankan aksi menu:", err);
                    }
                }
            }
        });

        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
         
        fetch(cleanEndpoint + "/admin.php?aksi=get_mainmenu")
        .then(res => res.json())
        .then(res => {
			alert(res.status);
            if (res.status === 'success') {
                const kelompokMenu = res.data;
                let htmlDrawer = "";

                for (const kategori in kelompokMenu) {
                    htmlDrawer += `
                        <h6 class="text-secondary fw-bold text-uppercase fs-7 mb-3 mt-2" style="letter-spacing: 1px;">${kategori}</h6>
                        <div class="row g-3 mb-4">
                    `;

                    const listSubmenu = kelompokMenu[kategori];
                    for (let i = 0; i < listSubmenu.length; i++) {
                        const menu = listSubmenu[i];
                        htmlDrawer += `
                            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                                <a class="admin-drawer-item" data-action="${menu.menu_action}" style="cursor:pointer">
                                    <div class="admin-icon-box ${menu.bg_color} ${menu.text_color}"><i class="bi ${menu.icon}"></i></div>
                                     <span class="admin-drawer-text d-inline-flex align-items-center gap-1 mt-2">
            ${menu.nama}
            
            <!-- Kondisi khusus: Badge eksklusif nempel di teks menu 'Notifikasi' saja -->
            ${menu.nama === "Notifikasi" ? `
                <span id="badge-notif-admin" class="badge rounded-pill bg-danger d-none" style="font-size: 0.7rem; padding: 0.35em 0.5em;">
                    0
                </span>
            ` : ''}
            
            ${menu.nama === "User Online" ? `
                <span id="badge-useronline-admin" class="badge rounded-pill bg-danger d-none" style="font-size: 0.7rem; padding: 0.35em 0.5em;">
                    0
                </span>
            ` : ''}
        </span>
                                </a>
                            </div>
                        `;
                    }

                    htmlDrawer += `</div>`;
                }
                
                drawerArea.innerHTML = htmlDrawer;
            } else {
                drawerArea.innerHTML = `<div class="alert alert-danger py-2 small">Gagal memuat menu: ${res.message}, halaman akan reload dalam 2 detik</div>`;
                setTimeout(() => {
                    //localStorage.clear();
                    //window.location.reload();
}, 2000);
            }
        })
        .catch(err => {
            console.error("Gagal menarik data tabel mainmenu:", err);
            drawerArea.innerHTML = `<div class="alert alert-danger py-2 small">Terjadi kegagalan komunikasi database.</div>`;
        });
    }

    window.renderDasborSuksesAdmin = renderDasborSuksesAdmin;
}

initAdmin();
