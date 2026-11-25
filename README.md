# Inventory API: Inventaris Peralatan Laboratorium

Proyek individu Cloud Computing Week 12 oleh Faaid Sakhaa (NIU 539398). Proyek ini menggunakan **Track B: EC2, Docker, dan Amazon ECR**, bukan Track A (EC2 dan RDS MySQL).

## Gambaran proyek

Inventory API adalah aplikasi awal untuk mengelola barang laboratorium melalui operasi create, read, update, dan delete (CRUD). Petugas nantinya direncanakan menggunakan Inventory Web untuk mengakses API. Saat ini baru API yang tersedia; Inventory Web masih berupa rencana.

```text
Petugas → Inventory Web (rencana) → Inventory API → penyimpanan sementara di memori
Git → Docker build → Amazon ECR → EC2 + Docker (rencana deployment)
```

**Batasan:** data disimpan di memori dan hilang ketika aplikasi dihentikan atau dimulai ulang. Belum ada database, autentikasi, maupun antarmuka web. Gunakan data contoh, bukan inventaris asli.

## Struktur repository

| File | Fungsi |
| --- | --- |
| `api.mjs` | Implementasi HTTP API dan penyimpanan sementara. |
| `api.test.mjs` | Pengujian otomatis API. |
| `Dockerfile` | Konfigurasi image aplikasi. |
| `README.md` | Gambaran proyek dan panduan penggunaan. |

## Model data dan endpoint

Sebuah item memiliki `itemId` (UUID), `name` (teks, maksimal 120 karakter), dan `quantity` (bilangan bulat tidak negatif).

| Metode | Endpoint | Kegunaan | Respons sukses |
| --- | --- | --- | --- |
| GET | `/health` | Memeriksa bahwa API merespons. | 200 |
| POST | `/items` | Menambahkan barang. | 201 |
| GET | `/items/{id}` | Membaca barang berdasarkan ID. | 200 |
| PUT | `/items/{id}` | Mengganti nama dan jumlah barang. | 200 |
| DELETE | `/items/{id}` | Menghapus barang. | 204 |

ID barang diperoleh dari respons POST. Endpoint daftar semua barang belum tersedia.

## Menjalankan secara lokal

**Prasyarat:** Node.js yang mendukung ES modules dan `node --test`. Proyek menggunakan modul bawaan Node.js dan tidak memerlukan instalasi paket tambahan.

1. Buka terminal pada folder repository.
2. Jalankan pengujian: `node --test api.test.mjs`.
3. Jalankan aplikasi: `node api.mjs`.
4. Di terminal lain, periksa `curl http://localhost:8080/health`. Respons yang diharapkan: `{"status":"ok"}`.

Contoh membuat barang dengan PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/items -ContentType 'application/json' -Body '{"name":"Laptop","quantity":2}'
```

Gunakan `itemId` dari respons sebagai pengganti `ID_ITEM` untuk membaca, memperbarui, atau menghapusnya:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/items/ID_ITEM
Invoke-RestMethod -Method Put -Uri http://localhost:8080/items/ID_ITEM -ContentType 'application/json' -Body '{"name":"Laptop","quantity":3}'
Invoke-RestMethod -Method Delete -Uri http://localhost:8080/items/ID_ITEM
```

## Menjalankan dengan Docker

Pastikan Docker sudah aktif, lalu jalankan:

```sh
docker build -t inventory-api:week12 .
docker run --rm -p 127.0.0.1:8080:8080 inventory-api:week12
```

Pada terminal lain, buka `http://localhost:8080/health`. Tekan Ctrl+C pada terminal container untuk menghentikannya. Pemetaan ke `127.0.0.1` membatasi akses port ke komputer tempat Docker berjalan.

## Rencana deployment AWS

1. Build image Docker dan push ke repository Amazon ECR privat di region lab.
2. Siapkan EC2 sesuai izin dan anggaran Learner Lab, lalu pasang Docker.
3. Berikan EC2 izin minimum yang diperlukan untuk menarik image ECR, menggunakan mekanisme yang tersedia di lab.
4. Pull dan jalankan image di EC2, lalu uji endpoint health dan CRUD dari host EC2.
5. Catat hasil pengujian dan tangkapan layar aktual. Batasi akses jaringan dan hindari membuka port aplikasi ke internet tanpa kebutuhan.

Rencana tersebut bukan pernyataan bahwa seluruh langkah sudah berhasil. Image `week12` pernah terlihat pada repository ECR lab; konektivitas dan deployment pada EC2 perlu dibuktikan terpisah. Jangan sertakan password, access key, session token, atau data sensitif dalam repository dan screenshot. Periksa biaya lab serta hentikan resource yang tidak lagi diperlukan sesuai ketentuan lab.

## Membuka file Git bundle

Jika proyek diterima sebagai file `.bundle`, clone dari folder yang berisi bundle:

```sh
git clone 539398_CC_Repository_updated.bundle inventory-project
cd inventory-project
git log --oneline
```

Sesuaikan nama file jika nama bundle berbeda. Bundle menyertakan riwayat Git yang tersedia saat dibuat; jalankan panduan lokal di atas setelah clone.
