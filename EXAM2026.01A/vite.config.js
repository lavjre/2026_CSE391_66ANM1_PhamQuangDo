// ============================================================
// vite.config.js — Cấu hình Vite (build tool / dev server)
// ============================================================
// Vite là công cụ build hiện đại thay thế Create React App.
// Ưu điểm: khởi động nhanh, hot reload tức thì, bundle nhỏ hơn.
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: Danh sách plugin mở rộng cho Vite
  // @vitejs/plugin-react: Cho phép Vite hiểu JSX và Fast Refresh
  // (tự động reload component khi save file mà không mất state)
  plugins: [react()],
})
