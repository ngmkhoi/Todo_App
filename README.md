🚀 Todo App - Vanilla JavaScript & JSON-Server
Đây là một dự án ứng dụng Ghi Chú (Todo App) được xây dựng hoàn toàn bằng Vanilla JavaScript, HTML, và CSS. Dự án này thể hiện quá trình phát triển từ một ứng dụng đơn giản sử dụng localStorage thành một ứng dụng Client-Server hoàn chỉnh với đầy đủ các chức năng CRUD, mô phỏng hoạt động của một ứng dụng web thực tế.

✨ Tính năng nổi bật
Quản lý công việc đầy đủ (CRUD):

- **Create**: Thêm công việc mới thông qua một form modal.
- **Read**: Hiển thị danh sách công việc một cách trực quan.
- **Update**: Chỉnh sửa thông tin công việc hoặc đánh dấu hoàn thành/chưa hoàn thành.
- **Delete**: Xóa công việc với một modal xác nhận để tránh xóa nhầm.

Lọc và Tìm kiếm mạnh mẽ:

- Tìm kiếm công việc theo tiêu đề hoặc mô tả.
- Lọc công việc theo trạng thái (hoàn thành/chưa hoàn thành), danh mục, độ ưu tiên, và màu sắc.
- Nút "Clear Filters" để nhanh chóng xóa tất cả bộ lọc.

Trải nghiệm người dùng (UX) thân thiện:

- Sử dụng modal để thêm/sửa công việc mà không cần tải lại trang.
- Cảnh báo khi người dùng cố gắng đóng form mà chưa lưu thay đổi.
- Có thể đóng form bằng cách nhấn ra vùng nền bên ngoài.
- Giao diện được thiết kế hiện đại, responsive và có các hiệu ứng chuyển động mượt mà.

Mô hình Client-Server:

- Sử dụng `json-server` để giả lập một RESTful API backend.
- Tất cả các thao tác CRUD đều được thực hiện thông qua các lệnh gọi API bất đồng bộ (`fetch`, `async/await`).

🛠️ Công nghệ sử dụng
- **Frontend**: HTML5, CSS3, JavaScript (ES6+ với `async/await`, Modules).
- **Backend (Giả lập)**: `json-server`.
- **Icons**: Font Awesome.

📈 Quá trình phát triển
Dự án này bắt đầu như một ứng dụng Todo đơn giản, lưu trữ toàn bộ dữ liệu trên `localStorage` của trình duyệt. Quá trình phát triển sau đó tập trung vào việc tái cấu trúc lớn (refactor) để chuyển đổi sang mô hình client-server:

1.  **Thay thế `localStorage`**: Toàn bộ logic đọc/ghi dữ liệu từ `localStorage` đã được thay thế bằng các hàm gọi API bất đồng bộ sử dụng `fetch`.
2.  **Áp dụng `async/await`**: Giúp cho code xử lý bất đồng bộ trở nên gọn gàng, dễ đọc và dễ bảo trì hơn so với `Promise.then()`.
3.  **Hoàn thiện CRUD**: Xây dựng đầy đủ các hàm `getTasks`, `createTask`, `updateTask`, `deleteTask` tương ứng với các phương thức HTTP `GET`, `POST`, `PUT/PATCH`, `DELETE`.
4.  **Cải tiến UX**: Liên tục thêm các tính năng nhỏ nhưng hữu ích như cảnh báo form chưa lưu, đóng modal khi click bên ngoài, và nút xóa bộ lọc để nâng cao trải nghiệm người dùng.

▶️ Hướng dẫn cài đặt và chạy dự án
Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:

**Yêu cầu**: Cài đặt Node.js (đã bao gồm npm).

**Bước 1: Tải về mã nguồn**

Clone repository này về máy của bạn hoặc tải về dưới dạng file ZIP.
git clone <URL_REPOSITORY_CUA_BAN>

**Bước 2: Cài đặt json-server**
npm install -g json-server

**Bước 3: Khởi động Backend Server**
# Đảm bảo bạn đang ở trong đúng thư mục dự án
npm start

**Bước 4: Chạy Frontend**
Mở file index.html bằng trình duyệt.

Cách tốt nhất là sử dụng một extension như "Live Server" trong Visual Studio Code. Click chuột phải vào file index.html và chọn "Open with Live Server". Việc này sẽ tự động mở trang web và tải lại mỗi khi bạn có thay đổi trong code.
