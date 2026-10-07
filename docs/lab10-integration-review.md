# Lab 10 - Tổng kết tích hợp CRS Microservices

Ngày kiểm tra: 07/10/2026. Môi trường: localhost, MySQL 8.4.8, Java 25, React/Vite.
Phạm vi: các mục A-F của `Buoi_10_Huong_dan_chi_tiet.pdf`; Docker Compose là phần tự học tùy chọn.

## Thành phần và cơ sở dữ liệu

| Thành phần | Cổng | Database | Phản hồi xác nhận |
| --- | --- | --- | --- |
| auth-service | 8081 | auth_db | GET /auth/login: 405; POST đăng nhập: 200 |
| course-service | 8082 | course_db | GET /courses: 200 |
| registration-service | 8083 | registration_db | GET /registrations/my không JWT: 401 |
| api-gateway | 8080 | Không có | GET /api/courses: 200, content khớp Course Service |
| crs-frontend | 5173 | Không có | /courses hiển thị bảng dữ liệu |

Frontend sử dụng một Axios instance trỏ tới Gateway. Các service có database riêng.
CORS được khai báo ở Gateway, cho origin `http://localhost:5173`; không tìm thấy cấu hình CORS riêng trong các service Java.

## Luồng đầu-cuối trên trình duyệt

| Bước | Kết quả đã quan sát |
| --- | --- |
| Đăng nhập student1 | POST /api/auth/login: 200; có token, userId và role STUDENT |
| Xem môn học | GET /api/courses: 200; không gửi Authorization cho route công khai |
| Tìm kiếm Lab10 | Kết quả lọc đúng môn thử; tham số page=0 |
| Đăng ký | POST /api/registrations: 201, có Bearer token; Toast xanh; số chỗ 3 -> 2 |
| Môn học đã đăng ký | GET /api/registrations/my và GET /api/courses/{id}: 200; tên môn ghép đúng |
| Hủy đăng ký | DELETE /api/registrations/{id}: 200; dòng biến mất; số chỗ 2 -> 3 |
| Đăng xuất | Xóa crs_token và crs_user, không gọi API; /register-course chuyển về /login |

Các request/status/header được đối chiếu bằng ghi nhận Network trên trình duyệt thật.
Không lưu token hoặc mật khẩu thực tế vào báo cáo. Môn thử đã được hủy đăng ký và xóa sau kiểm tra.

## Lỗi phụ thuộc service và phục hồi

1. Tải sẵn trang đăng ký khi Course Service đang chạy.
2. Dừng Course Service; giữ Auth Service, Registration Service, Gateway và frontend hoạt động.
3. Bấm đăng ký môn còn chỗ trên trang đang mở: POST /api/registrations trả 409.
4. Toast đỏ hiển thị `Khong the ket noi toi course service, vui long thu lai sau`.
5. Bật lại riêng Course Service và bấm đăng ký lại: trả 201, danh sách và số chỗ cập nhật bình thường.

Lỗi xảy ra theo đường: Frontend -> Gateway -> Registration Service -> CourseClient -> Course Service.
Khi kết nối bị từ chối, CourseClient chuyển lỗi mạng thành lỗi nghiệp vụ; GlobalExceptionHandler trả JSON message để Toast hiển thị.

## Bảo mật tổng hợp: 7/7 đạt

| Kịch bản | Kết quả |
| --- | --- |
| POST đăng ký không JWT | 401 tại Gateway |
| STUDENT gọi POST môn học | 403 |
| ADMIN gọi POST môn học | 201 |
| Sửa ký tự chữ ký JWT, gọi API riêng tư | 401 |
| Route đối tác thiếu X-API-KEY | 403 |
| Route đối tác có API Key đúng | 200 |
| Gọi trực tiếp internal reserve-seat ở 8082 | 200 theo thiết kế hiện tại; gọi release-seat để hoàn lại chỗ |

Tổng cộng 16 kiểm tra HTTP tự động đạt, ngoài các thao tác đầu-cuối và dừng/phục hồi trên giao diện.
Phân quyền route ADMIN/STUDENT và bốn trạng thái Loading/Success/Empty/Error đã được rà soát cùng kết quả các Lab 6-9.

## Hai chỉnh sửa khi tổng kết

- GET vào endpoint đăng nhập vốn chỉ hỗ trợ POST được trả 405 thay vì bị generic exception handler biến thành 500.
- Axios không đính JWT vào GET danh sách/chi tiết môn học công khai; API đăng ký và quản trị vẫn có JWT.

Frontend production build và lint src đạt. Auth Service được biên dịch và chạy lại sau chỉnh sửa.
Lịch sử Git giữ các commit theo từng lab; mốc phát hành cuối khóa dùng annotated tag `v1.0`.

## Giới hạn đã biết và phần tự học

- `/internal/**` vẫn permitAll ở Course Service. Gateway không định tuyến đường này, nhưng truy cập trực tiếp cổng 8082 vẫn gọi được. Đây là giới hạn được yêu cầu ghi nhận ở Lab 10, không phải bảo vệ nội bộ bằng xác thực.
- RestTemplate chưa có timeout tường minh/circuit breaker. Service bị treo có thể giữ thread của Registration Service lâu và gây lỗi dây chuyền (cascading failure).
- Reserve/release chỗ và lưu đăng ký nằm ở hai service; chưa có giao dịch phân tán hoặc cơ chế bù trừ khi một bước lỗi sau bước kia.
- Trang môn đã đăng ký ghép tên bằng nhiều GET chi tiết: với N đăng ký đang hoạt động, cần 1 + N request.
- Docker Compose chưa triển khai trong phạm vi bắt buộc. Khi tự học, mỗi ứng dụng/database chạy trong container riêng; các service gọi nhau bằng tên service trên mạng Compose thay vì localhost. Cần Dockerfile, cấu hình URL qua biến môi trường, health check và volume MySQL trước khi chạy thử toàn bộ luồng.

Ảnh minh chứng lưu cục bộ tại `output/playwright/lab10-course-service-down.png`, `lab10-system-recovered.png` và `lab10-cancel-success.png`.
Các script kiểm tra, ảnh và dữ liệu tạm không được đưa vào commit phát hành.
