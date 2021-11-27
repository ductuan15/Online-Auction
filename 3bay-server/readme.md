## Thiết lập project lần đầu

**1. Cài đặt npm dependency**
```bash
npm ci
```

**2. Config prisma**

2.1. Mở file `.env`
Thay đổi giá trị `DATABASE_URL` tương ứng với thông tin database tại máy cục bộ.
```
 DATABASE_URL="mysql://username:password@localhost:port/3bay"
```

Ví dụ config kết nối đến database:
* có username là `admin`.
* mật khẩu `admin`.
* port `3306`.
* schema `3bay`.

Giá trị của `DATABASE_URL` sẽ là:
```
 DATABASE_URL="mysql://admin:admin@localhost:3306/3bay"
```
Nhớ giữ file này ở local, không commit lên git.

2.2. Đọc file schema và generate prisma client library
```bash
npx prisma generate 
```

2.3. Đẩy model từ prisma vào database:
```bash
npx prisma db push 
```
Sau đó, database sẽ cập nhật lại cấu trúc schema cho khớp với model trong prisma. 

Thêm data mẫu: xem tại folder `prisma/sample_data`

Xem thêm tại: 
https://www.prisma.io/docs/guides/database/prototyping-schema-db-push
https://www.prisma.io/docs/concepts/components/prisma-migrate