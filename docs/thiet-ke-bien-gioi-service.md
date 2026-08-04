# THIẾT KẾ BIÊN GIỚI SERVICE

## 1. Danh sách Service

| Service | Cổng | Database | Trách nhiệm chính |
|---|---:|---|---|
| api-gateway | 8080 | Không có DB | Điểm vào duy nhất, định tuyến, xác thực sơ bộ và CORS |
| auth-service | 8081 | auth_db | Quản lý User, Student, đăng nhập, sinh và xác thực JWT |
| course-service | 8082 | course_db | Quản lý Course, tìm kiếm, phân trang và quản lý số chỗ |
| registration-service | 8083 | registration_db | Quản lý Registration, gọi course-service để đăng ký |

## 2. Nguyên tắc sở hữu dữ liệu

- Mỗi service có database riêng.
- Không service nào được truy cập trực tiếp database của service khác.
- Muốn lấy hoặc thay đổi dữ liệu của service khác phải gọi REST API.
- registration-service không có bảng Course.
- registration-service chỉ lưu courseId.
- courseId không phải khóa ngoại thật tới course_db.

## 3. Bảng định tuyến Gateway dự kiến

| Route | Forward tới | Ghi chú |
|---|---|---|
| /api/auth/** | http://localhost:8081 | Login public, phần còn lại cần JWT |
| /api/courses/** | http://localhost:8082 | GET public; POST, PUT, DELETE cần ADMIN |
| /api/registrations/** | http://localhost:8083 | Cần JWT với role STUDENT hoặc ADMIN |
| /api/public/courses | http://localhost:8082 | Dùng API Key cho đối tác ngoài |