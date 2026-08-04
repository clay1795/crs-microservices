# BLUEPRINT API – CRS MICROSERVICES

## 1. auth-service

Cổng trực tiếp: 8081

Tiền tố qua Gateway: `/api/auth`

| Method | Endpoint | Mô tả | Yêu cầu |
|---|---|---|---|
| POST | /auth/login | Đăng nhập, trả về JWT | Public |
| POST | /auth/register | Đăng ký tài khoản | Public |

## 2. course-service

Cổng trực tiếp: 8082

Tiền tố qua Gateway: `/api/courses`

| Method | Endpoint | Mô tả | Yêu cầu |
|---|---|---|---|
| GET | /courses | Danh sách môn học, tìm kiếm và phân trang | Public |
| GET | /courses/{id} | Chi tiết môn học | Public |
| POST | /courses | Thêm môn học | ADMIN |
| PUT | /courses/{id} | Sửa môn học | ADMIN |
| DELETE | /courses/{id} | Xóa môn học | ADMIN |

## 3. API nội bộ course-service

| Method | Endpoint | Mô tả |
|---|---|---|
| PATCH | /internal/courses/{id}/reserve-seat | Kiểm tra còn chỗ và trừ một chỗ |
| PATCH | /internal/courses/{id}/release-seat | Hoàn trả một chỗ khi hủy đăng ký |

## 4. registration-service

Cổng trực tiếp: 8083

Tiền tố qua Gateway: `/api/registrations`

| Method | Endpoint | Mô tả | Yêu cầu |
|---|---|---|---|
| POST | /registrations | Đăng ký học phần | STUDENT |
| GET | /registrations/my | Danh sách đăng ký của tôi | STUDENT |
| DELETE | /registrations/{id} | Hủy đăng ký | STUDENT hoặc ADMIN |
