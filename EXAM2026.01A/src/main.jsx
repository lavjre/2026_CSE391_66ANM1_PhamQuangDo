// ============================================================
// src/main.jsx — Điểm khởi động (Entry Point) của ứng dụng React
// ============================================================
// File này chạy đầu tiên khi ứng dụng load.
// Nhiệm vụ: Mount (gắn) React app vào DOM của index.html
// ============================================================

// --- IMPORT BOOTSTRAP ---
// Phải import CSS trước JS để Bootstrap áp dụng styles đúng thứ tự
import 'bootstrap/dist/css/bootstrap.min.css'
// bootstrap.bundle.min.js: Bao gồm Bootstrap JS + Popper.js
// Popper.js cần thiết để: Modal, Dropdown, Tooltip hoạt động đúng
// Nếu chỉ import bootstrap.min.js (không có bundle) → Modal sẽ không hoạt động!
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// --- IMPORT REACT ---
// StrictMode: Chế độ kiểm tra nghiêm ngặt trong development
// Tự động phát hiện: deprecated APIs, side effects không an toàn, v.v.
// Chỉ chạy trong development, không ảnh hưởng production build
import { StrictMode } from 'react'

// createRoot: API mới của React 18 (thay thế ReactDOM.render cũ)
// Hỗ trợ Concurrent Features (rendering không đồng bộ, ưu tiên task)
import { createRoot } from 'react-dom/client'

// --- IMPORT COMPONENT GỐC ---
// App.jsx là component cha chứa toàn bộ ứng dụng
import App from './App.jsx'

// --- MOUNT ỨNG DỤNG ---
// Bước 1: document.getElementById('root') → Tìm thẻ <div id="root"> trong index.html
// Bước 2: createRoot(...) → Tạo "gốc React" từ DOM element đó
// Bước 3: .render(<App />) → Render component App vào trong div#root
createRoot(document.getElementById('root')).render(
  // StrictMode bọc ngoài App → tất cả component con đều được kiểm tra
  <StrictMode>
    <App />
  </StrictMode>,
)

// ============================================================
// LUỒNG HOẠT ĐỘNG:
// index.html load → script main.jsx chạy → React mount vào #root
// → App render → các component con render → Giao diện hiện ra
// ============================================================
