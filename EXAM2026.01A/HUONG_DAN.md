# 📘 HƯỚNG DẪN DỰ ÁN: Quản lý Sinh viên

> **Stack:** React 18 + Vite + Bootstrap 5  
> **Mức độ:** Cơ bản → Trung bình  
> **Mục tiêu Bài 1:** Xây dựng giao diện quản lý dữ liệu hoàn chỉnh với CRUD đầy đủ

---

## 📁 CẤU TRÚC DỰ ÁN

```
quan-ly-sinh-vien/
│
├── 📄 package.json          ← Cấu hình project & danh sách thư viện
├── 📄 vite.config.js        ← Cấu hình Vite (build tool)
├── 📄 index.html            ← File HTML gốc duy nhất (SPA)
│
└── 📁 src/                  ← Toàn bộ source code React
    ├── 📄 main.jsx          ← Điểm khởi động, mount React vào DOM
    ├── 📄 App.jsx           ← Component gốc, quản lý state & logic
    │
    ├── 📁 components/       ← Các component UI tái sử dụng
    │   ├── 📄 Header.jsx       ← Thanh navbar + nút thêm mới
    │   ├── 📄 StatsBar.jsx     ← 4 card thống kê
    │   ├── 📄 SearchBar.jsx    ← Ô tìm kiếm real-time
    │   ├── 📄 DataTable.jsx    ← Bảng danh sách sinh viên
    │   ├── 📄 ModalForm.jsx    ← Cửa sổ pop-up (Bootstrap Modal)
    │   └── 📄 StudentForm.jsx  ← Form thêm/sửa (bên trong Modal)
    │
    ├── 📁 data/
    │   └── 📄 data.js          ← Dữ liệu giả lập (5 sinh viên mẫu)
    │
    └── 📁 utils/
        └── 📄 validate.js      ← Hàm kiểm tra dữ liệu form
```

---

## 🚀 CÁCH CHẠY DỰ ÁN

### Bước 1 — Cài Node.js (nếu chưa có)
Tải tại: https://nodejs.org (chọn phiên bản LTS)

Kiểm tra đã cài:
```bash
node --version   # Phải >= 18.0
npm --version    # Phải >= 9.0
```

### Bước 2 — Cài dependencies
```bash
# Mở terminal, vào thư mục project
cd quan-ly-sinh-vien

# Cài tất cả thư viện trong package.json
npm install

# Lệnh này sẽ tạo thư mục node_modules/ (KHÔNG commit thư mục này lên git)
```

### Bước 3 — Chạy development server
```bash
npm run dev
```

Kết quả trên terminal:
```
  VITE v6.0.5  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Mở trình duyệt → `http://localhost:5173` → Giao diện hiện ra

### Các lệnh khác
```bash
npm run build    # Build cho production → tạo thư mục dist/
npm run preview  # Xem trước bản build production
```

---

## 🎯 TÍNH NĂNG CỦA ỨNG DỤNG

| Tính năng | Mô tả |
|-----------|-------|
| **Xem danh sách** | Bảng hiển thị 5 sinh viên mẫu với đầy đủ thông tin |
| **Tìm kiếm** | Gõ là lọc ngay — tìm theo mọi field (họ tên, mã SV, khoa...) |
| **Thêm mới** | Click "Thêm sinh viên" → Modal form → Validate → Thêm vào đầu danh sách |
| **Chỉnh sửa** | Click ✏️ → Modal điền sẵn data → Sửa → Cập nhật |
| **Xoá** | Click 🗑️ → Confirm dialog → Xoá khỏi danh sách |
| **Thống kê** | 4 card: Tổng SV / Đang học / Bảo lưu / Tốt nghiệp |
| **Responsive** | Cột ẩn/hiện theo màn hình (mobile/tablet/desktop) |

---

## 🗺️ LUỒNG HOẠT ĐỘNG

### Khi load trang lần đầu
```
1. index.html load → script main.jsx chạy
2. createRoot(#root).render(<App />) → React mount vào div#root
3. App() chạy → useState(danhSachSinhVien) → data = [5 sv mẫu]
4. App return JSX → React render tất cả component con
5. Giao diện hiện ra với 5 sinh viên trong bảng
```

### Khi nhấn "Thêm sinh viên"
```
1. Header: onClick → onAdd() [callback từ props]
2. App: handleOpenAdd() → setEditItem(null) + setShowModal(true)
3. React re-render: showModal = true
4. ModalForm: useEffect([show]) chạy → bsModal.show()
5. Bootstrap: Animation fade in → Modal hiện
6. StudentForm render với defaultValues=null → Form rỗng
```

### Khi submit form thêm mới
```
1. StudentForm: handleSubmit(e) → e.preventDefault()
2. validateForm(form) → Có lỗi? → setErrors() → Dừng
3. Không lỗi → onSubmit(formData) [callback]
4. App: handleSubmit(formData) → setData(prev => [formData, ...prev])
5. React: data state thay đổi → App re-render → DataTable nhận data mới
6. Bảng cập nhật: Sinh viên mới xuất hiện ở hàng đầu
7. onClose() → setShowModal(false) → Modal đóng
```

### Khi gõ tìm kiếm
```
1. SearchBar: input onChange → onChange(e.target.value)
2. App: setKeyword(value) → keyword state thay đổi
3. useMemo([data, keyword]): Tính lại filteredData
4. React re-render: DataTable nhận filteredData mới
5. Bảng hiển thị chỉ các sv khớp keyword
```

---

## 📖 GIẢI THÍCH TỪNG FILE CHI TIẾT

### 1. `main.jsx` — Điểm bắt đầu

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'   // CSS Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'  // JS + Popper.js

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**Tại sao import bootstrap.bundle?**
- `bootstrap.min.js` chỉ có Bootstrap JS
- `bootstrap.bundle.min.js` = Bootstrap JS + Popper.js
- Popper.js cần thiết cho: Modal, Dropdown, Tooltip, Popover

**StrictMode làm gì?**
- Chạy mỗi component 2 lần (dev only) để phát hiện side effects
- Cảnh báo khi dùng deprecated APIs
- KHÔNG ảnh hưởng production build

---

### 2. `App.jsx` — Trung tâm điều khiển

**State và mục đích:**

| State | Type | Mục đích |
|-------|------|---------|
| `data` | Array | Danh sách sinh viên — nguồn sự thật |
| `showModal` | Boolean | Điều khiển show/hide modal |
| `editItem` | Object\|null | Sinh viên đang sửa (null = thêm mới) |
| `keyword` | String | Từ khoá tìm kiếm |

**Tại sao đặt state ở App?**

Quy tắc: Đặt state ở component cha **thấp nhất** mà tất cả component cần dùng đều là con của nó.

```
App (data, showModal, editItem, keyword)
 ├── Header cần: soLuong (từ data.length) + onAdd → Phải lên App
 ├── StatsBar cần: data → Phải lên App
 ├── SearchBar cần: keyword + onChange → Phải lên App
 ├── DataTable cần: data + onDelete + onEdit → Phải lên App
 └── ModalForm > StudentForm cần: onSubmit + defaultValues → Phải lên App
```

→ Tất cả đều cần data → State phải ở App (component chung của tất cả)

---

### 3. `ModalForm.jsx` — Kết hợp React + Bootstrap

**Vấn đề:** Bootstrap Modal hoạt động qua DOM manipulation, React hoạt động qua Virtual DOM. Hai cơ chế khác nhau → Cần cầu nối.

**Giải pháp dùng useRef + useEffect:**

```jsx
// Bước 1: Tạo ref trỏ tới DOM node thật
const modalElRef = useRef(null)
const bsModalRef = useRef(null)

// Bước 2: Gán ref vào JSX element
<div className="modal fade" ref={modalElRef}>

// Bước 3: Sau khi mount, DOM sẵn sàng → Tạo Bootstrap instance
useEffect(() => {
  bsModalRef.current = new Modal(modalElRef.current)
  return () => bsModalRef.current?.dispose() // Cleanup
}, []) // Chỉ 1 lần

// Bước 4: Đồng bộ prop show với Bootstrap
useEffect(() => {
  show ? bsModalRef.current.show() : bsModalRef.current.hide()
}, [show]) // Mỗi khi show thay đổi
```

**Tại sao dùng ref thay vì state cho bsModal instance?**
- State thay đổi → Re-render → Tạo lại instance → Bug
- Ref thay đổi → KHÔNG re-render → Instance tồn tại lâu dài

---

### 4. `StudentForm.jsx` — Controlled Components

**Controlled Component Pattern:**

```
State (form) ──→ value prop ──→ Input hiển thị giá trị
     ↑                               │
     │                               ↓
setForm() ←── handleChange() ←── onChange event
```

**Xử lý nhiều input với 1 handler:**

```jsx
const handleChange = (e) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
  //                           ↑ Computed property key
}

// Input phải có name attribute trùng với key trong state:
<input name="hoTen" value={form.hoTen} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />
// Tất cả đều dùng cùng 1 handleChange
```

**Hiển thị lỗi Bootstrap:**

```jsx
// is-invalid: Thêm viền đỏ vào input
// invalid-feedback: Hiện text lỗi màu đỏ bên dưới
<input className={`form-control ${errors.hoTen ? 'is-invalid' : ''}`} />
<div className="invalid-feedback">{errors.hoTen}</div>
```

---

### 5. `validate.js` — Tách logic ra ngoài

**Tại sao tách?**
1. **Tái sử dụng:** BookForm, EmployeeForm cũng dùng được
2. **Testable:** `validateForm({ hoTen: '' })` → Không cần render component
3. **Readable:** Form component chỉ lo UI, validate lo business rules

**Pattern error object:**
```js
const errors = {}
// Chỉ thêm key nếu có lỗi → Object rỗng {} = không có lỗi
if (!form.hoTen.trim()) errors.hoTen = 'Lỗi...'
if (!emailRegex.test(form.email)) errors.email = 'Lỗi...'
return errors
// Kết quả: { hoTen: 'Lỗi...', email: 'Lỗi...' }
// → 2 field lỗi → Hiện 2 thông báo cùng lúc
```

---

## ❓ CÂU HỎI THƯỜNG GẶP

### Q: Modal không mở/đóng được?
**A:** Kiểm tra `main.jsx` đã import `bootstrap.bundle.min.js` chưa.
```jsx
// ✅ Phải có dòng này
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

### Q: `Modal is not a constructor`?
**A:** Import sai cách. Phải dùng named import:
```jsx
// ✅ Đúng
import { Modal } from 'bootstrap'
// ❌ Sai
import Modal from 'bootstrap'
```

### Q: Bảng không cập nhật sau khi thêm/xoá?
**A:** Đang mutate state trực tiếp. Phải tạo mảng mới:
```jsx
// ❌ Sai — React không detect thay đổi
data.push(newItem)
setData(data)

// ✅ Đúng — Mảng mới → React detect → Re-render
setData(prev => [...prev, newItem])
```

### Q: `Warning: Each child in a list should have a unique "key" prop`?
**A:** Thêm `key` vào phần tử ngoài cùng trong `.map()`:
```jsx
{data.map(sv => (
  <tr key={sv.id}>  {/* ← key trên phần tử ngoài nhất */}
    ...
  </tr>
))}
```

### Q: Nhấn Huỷ lại submit form?
**A:** Thiếu `type="button"` trên nút Huỷ:
```jsx
// ❌ Sai — Mặc định là type="submit" → Submit form khi click!
<button onClick={onClose}>Huỷ</button>

// ✅ Đúng
<button type="button" onClick={onClose}>Huỷ</button>
```

### Q: Form không reset sau khi thêm mới?
**A:** Gọi `setForm(FORM_RONG)` sau khi `onSubmit()`:
```jsx
onSubmit(submittedData)   // Gửi data lên App
setForm(FORM_RONG)        // Reset về rỗng
setErrors({})             // Xoá hết lỗi
```

### Q: `Cannot read properties of null (reading 'id')`?
**A:** Truy cập `editItem.id` khi `editItem` là null. Dùng optional chaining:
```jsx
// ❌ Sai
const id = defaultValues.id

// ✅ Đúng
const id = defaultValues?.id ?? Date.now()
//          ↑ Nếu null → undefined → ?? → Date.now()
```

---

## 🔧 MỞ RỘNG DỰ ÁN (Nâng cao)

### Thêm sort bảng theo cột
```jsx
// Thêm state
const [sortConfig, setSortConfig] = useState({ key: 'hoTen', dir: 'asc' })

// Computed
const sortedData = useMemo(() =>
  [...filteredData].sort((a, b) => {
    const mul = sortConfig.dir === 'asc' ? 1 : -1
    return a[sortConfig.key].localeCompare(b[sortConfig.key]) * mul
  }),
  [filteredData, sortConfig]
)

// Trong DataTable header:
<th onClick={() => setSortConfig(prev => ({
  key: 'hoTen',
  dir: prev.key === 'hoTen' && prev.dir === 'asc' ? 'desc' : 'asc'
}))}>
  Họ tên {sortConfig.key === 'hoTen' ? (sortConfig.dir === 'asc' ? '↑' : '↓') : ''}
</th>
```

### Thêm phân trang (Pagination)
```jsx
const [trang, setTrang] = useState(1)
const TREN_TRANG = 10

const pagedData = useMemo(() =>
  filteredData.slice((trang - 1) * TREN_TRANG, trang * TREN_TRANG),
  [filteredData, trang]
)
const tongTrang = Math.ceil(filteredData.length / TREN_TRANG)
```

### Lưu dữ liệu vào localStorage
```jsx
// Thay useState thường bằng custom hook
function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : init
  })
  const setValPersist = (newVal) => {
    setVal(newVal)
    localStorage.setItem(key, JSON.stringify(
      typeof newVal === 'function' ? newVal(val) : newVal
    ))
  }
  return [val, setValPersist]
}

// Dùng:
const [data, setData] = useLocalStorage('sinh-vien', danhSachSinhVien)
```

### Xuất CSV
```jsx
const handleExportCSV = () => {
  const headers = ['Họ tên', 'Mã SV', 'Khoa', 'Email', 'Số ĐT']
  const rows = data.map(sv =>
    [sv.hoTen, sv.maSinhVien, sv.khoa, sv.email, sv.sdt].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  // \uFEFF: BOM UTF-8 — Excel đọc được tiếng Việt
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'danh-sach-sinh-vien.csv'
  a.click()
  URL.revokeObjectURL(url)
}
```

---

## 📚 TÀI LIỆU THAM KHẢO

| Tài liệu | Link |
|----------|------|
| React Official Docs | https://react.dev |
| Bootstrap 5 Docs | https://getbootstrap.com/docs/5.3 |
| Vite Guide | https://vitejs.dev/guide |
| React Hooks Reference | https://react.dev/reference/react |
| Bootstrap Modal JS | https://getbootstrap.com/docs/5.3/components/modal |

---

*Dự án demo cho Bài 1 — Xây dựng giao diện quản lý dữ liệu với React + Bootstrap 5*
