# CRUD API

## 3 bước

- Phân tích chức năng
- Vẽ schema bằng DBML
- Tạo schema trong prisma
- Code

## Phân tích chức năng

- Người dùng đăng ký tài khoản: email, name, password, confirm password
- Người dùng đăng nhập: email, password
- Người dùng đăng bài post: title, content
- Áp dụng JWT cho việc xác thực người dùng, tích hợp Access Token và Refresh Token: Access Token sẽ là stateless, còn Refresh Token sẽ lưu trên database (stateful)
- Một người dùng có thể có nhiều post
- Một người dùng có thể đăng nhập trên nhiều thiết bị => Có nhiều refresh token cho mỗi người dùng

=> Ta sẽ có 3 bảng: User, Post, RefreshToken

Quan hệ giữa các bảng:

- User có nhiều post: 1-n
- User có nhiều refresh token: 1-n
# nestjs-learning
