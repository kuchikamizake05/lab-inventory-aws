# Inventory API: Inventaris Peralatan Laboratorium

Proyek individu Cloud Computing Week 12 oleh Faaid Sakhaa (NIU 539398). **Track B: EC2, Docker, dan Amazon ECR.**

## Gambaran proyek

Inventory API adalah aplikasi awal untuk mengelola barang laboratorium melalui operasi create, read, update, dan delete (CRUD). Petugas nantinya direncanakan menggunakan Inventory Web untuk mengakses API. Saat ini baru API yang tersedia; Inventory Web masih berupa rencana.

```text
Petugas → Inventory Web (rencana) → Inventory API → penyimpanan sementara di memori
Git → Docker build → ECR privat → EC2 Cloud9 → pengujian lewat localhost
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

## Deployment AWS dan hasil pengujian

Image `week12` dibuat dengan Docker dan diunggah ke ECR privat di `us-east-1`. Pada 26 November 2026, image ditarik dan dijalankan di EC2 `t3.small` melalui Cloud9 (mode SSH), menggunakan kredensial sesi lab. Port aplikasi hanya dipetakan ke loopback EC2.

Untuk mengulang dari EC2 dengan Docker dan izin pull ECR:

```bash
REGISTRY="<account-id>.dkr.ecr.us-east-1.amazonaws.com"
IMAGE="$REGISTRY/inventory-api-539398:week12"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$REGISTRY"
docker pull "$IMAGE"
docker run --rm -p 127.0.0.1:8080:8080 "$IMAGE"
```

Ganti `<account-id>` dengan ID akun lab yang punya akses ke image. Gunakan terminal EC2 lain untuk menjalankan tes. Hasil yang terverifikasi: `GET /health` mengembalikan `{"status":"ok"}`; create **201**, read **200**, update **200**, delete **204**, dan read setelah item dihapus **404**.

Repository berisi starter API; Inventory Web dan pipeline CI/CD belum diimplementasikan. Tangkapan layar AWS ada di laporan tugas, bukan di repository publik.

## Membuka file Git bundle

Git bundle adalah arsip repository Git yang bisa diklon tanpa internet. Ekstrak ZIP pengumpulan terlebih dahulu, lalu buka terminal di folder yang berisi file `.bundle`:

```sh
git clone 539398_CC_Repository_updated.bundle inventory-project
cd inventory-project
git log --oneline
node --test api.test.mjs
```

Sesuaikan nama file jika nama bundle berbeda. Bundle menyertakan riwayat Git yang tersedia saat dibuat; jalankan panduan lokal di atas setelah clone.
