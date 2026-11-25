# Inventaris Peralatan Laboratorium

Faaid Sakhaa · 539398 · Week 12 · Track B

Inventory API menangani CRUD barang. Inventory Web direncanakan sebagai layanan terpisah untuk petugas dan belum dibangun pada tahap ini. Starter API menyimpan data di memori; data hilang saat proses dimulai ulang. Jangan masukkan inventaris asli.

```text
Petugas -> Inventory Web (rencana) -> Inventory API -> Item (memori untuk uji)
Git -> Docker build -> ECR private -> Docker pull di EC2
```

Item: `itemId` (UUID), `name` (1–120 karakter), `quantity` (bilangan bulat nonnegatif).

| Metode | Rute | Sukses |
|---|---|---|
| POST | /items | 201 |
| GET | /items/{id} | 200 |
| PUT | /items/{id} | 200 |
| DELETE | /items/{id} | 204 |

Jalankan `node --test api.test.mjs`. Dengan Docker aktif:

```sh
docker build -t inventory-api:week12 .
docker run --rm -p 127.0.0.1:8080:8080 inventory-api:week12
curl -i http://127.0.0.1:8080/health
```

Rencana AWS: buat satu repositori ECR privat di region lab, tag dan push image, lalu pull image pada EC2 proyek menggunakan izin lab yang tersedia. Batasi uji ke localhost pada host EC2, tanpa membuka port 8080 ke internet. Jangan ubah instance contoh course. Simpan screenshot ECR, EC2, dan output pengujian aktual; jangan sertakan kredensial. Jadwalkan penggunaan EC2 hanya saat uji untuk menghemat kredit.

Status: starter code. Bukti Docker dan AWS belum tersedia.
