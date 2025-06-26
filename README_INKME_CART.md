# Chức năng Thêm vào Giỏ hàng với File .inkme

## Tổng quan

Chức năng này cho phép người dùng tùy chỉnh sản phẩm 3D và lưu thiết kế dưới dạng file .inkme (JSON) khi thêm vào giỏ hàng.

## Cách hoạt động

### 1. Luồng dữ liệu

1. **Người dùng tùy chỉnh** sản phẩm trong iframe 3D
2. **Nhấn "Thêm vào giỏ hàng"** trong trang 3D
3. **Dữ liệu được thu thập** từ iframe (màu sắc, hiệu ứng, layers, images)
4. **Gửi dữ liệu** đến React app qua postMessage
5. **Upload file .inkme** lên Cloudinary
6. **Thêm vào giỏ hàng** với thông tin file .inkme

### 2. Định dạng File .inkme

```json
{
  "savedLayers": {
    "0": "{\"attrs\":{\"width\":450,\"height\":450,\"name\":\"bg_image\",\"listening\":false},\"className\":\"Image\"}",
    "1": "{\"attrs\":{\"width\":315.17,\"height\":405,\"x\":51,\"y\":185.87,\"name\":\"image1748217465249\",\"draggable\":true,\"scaleX\":0.37,\"scaleY\":0.37},\"className\":\"Image\"}",
    "length": 2
  },
  "savedImages": {
    "image1748217465249": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAsAAAUyCAYAAABoOH1mAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nI",
    "image1748217486436": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABFMAAAWGCAYA"
  },
  "sceneName": "tshirt-sizingtest",
  "color": "#fefefe",
  "bgColor": "#4c4c4c",
  "acidWash": 0,
  "puffPrint": 0
}
```

## Các file đã được cập nhật

### 1. Frontend (React)

- `client/src/main-component/Custom3D/Custom3D.jsx` - Xử lý message từ iframe
- `client/src/components/CartInkmeInfo/CartInkmeInfo.jsx` - Hiển thị thông tin file .inkme
- `client/src/components/CartInkmeInfo/CartInkmeInfo.css` - CSS cho component
- `client/src/main-component/CartPage/index.jsx` - Hiển thị thông tin trong giỏ hàng

### 2. 3D Page

- `3dpage/index.html` - Cart button handler
- `3dpage/js/export-handler.js` - Thu thập dữ liệu từ iframe

### 3. Backend (Server)

- `server/models/cart.js` - Thêm trường `inkmeFile`
- `server/routes/cart.js` - API upload file và thêm vào giỏ hàng

## API Endpoints

### 1. Upload File .inkme

```
POST /api/cart/upload-inkme
Content-Type: application/json

{
  "inkmeData": { /* dữ liệu .inkme */ },
  "sceneName": "tshirt-sizingtest"
}
```

**Response:**

```json
{
  "url": "https://res.cloudinary.com/.../inkme-files/tshirt-sizingtest_layout_1234567890.json",
  "public_id": "inkme-files/tshirt-sizingtest_layout_1234567890",
  "success": true
}
```

### 2. Thêm vào Giỏ hàng

```
POST /api/cart
Content-Type: application/json

{
  "productTitle": "Custom tshirt-sizingtest",
  "images": ["/path/to/image.jpg"],
  "rating": "5",
  "price": 299000,
  "quantity": 1,
  "subTotal": 299000,
  "productId": "custom-3d-1234567890",
  "userId": "user123",
  "inkmeFile": {
    "url": "https://res.cloudinary.com/.../file.json",
    "sceneName": "tshirt-sizingtest",
    "color": "#fefefe",
    "bgColor": "#4c4c4c",
    "acidWash": 0,
    "puffPrint": 0,
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "classifications": []
}
```

## Cách sử dụng

### 1. Tùy chỉnh sản phẩm

- Mở trang Custom 3D
- Tùy chỉnh màu sắc, thêm hình ảnh, áp dụng hiệu ứng
- Nhấn "Thêm vào giỏ hàng"

### 2. Xem thông tin trong giỏ hàng

- File .inkme sẽ được hiển thị dưới mỗi sản phẩm tùy chỉnh
- Có thể tải file .inkme về máy
- Hiển thị thông tin màu sắc, hiệu ứng, thời gian tạo

### 3. Tải file .inkme

- Nhấn nút download trong thông tin sản phẩm
- File sẽ được tải về với tên `{sceneName}_layout.inkme`

## Cấu hình

### 1. Cloudinary

Đảm bảo đã cấu hình Cloudinary trong file `.env`:

```
cloudinary_Config_Cloud_Name=your_cloud_name
cloudinary_Config_api_key=your_api_key
cloudinary_Config_api_secret=your_api_secret
```

### 2. Server URL

Cập nhật URL server trong các API calls:

```javascript
const response = await fetch("http://localhost:4000/api/cart/upload-inkme", {
  // ...
});
```

## Lưu ý

1. **Cross-origin**: Đảm bảo iframe và parent window có thể giao tiếp
2. **File size**: File .inkme có thể lớn do chứa base64 images
3. **Error handling**: Có fallback data khi không thể lấy dữ liệu từ iframe
4. **Security**: Validate dữ liệu trước khi upload lên Cloudinary

## Troubleshooting

### 1. Không nhận được dữ liệu từ iframe

- Kiểm tra console để xem lỗi
- Đảm bảo các function `getMaterialColor`, `getMaterialValue` tồn tại
- Kiểm tra cross-origin policy

### 2. Upload lên Cloudinary thất bại

- Kiểm tra cấu hình Cloudinary
- Đảm bảo có đủ quota
- Kiểm tra network connection

### 3. Không hiển thị trong giỏ hàng

- Kiểm tra API response
- Đảm bảo trường `inkmeFile` được lưu đúng
- Kiểm tra component `CartInkmeInfo` đã được import
