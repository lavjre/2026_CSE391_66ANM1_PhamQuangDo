// ============================================================
// src/components/ModalForm.jsx — Cửa sổ Pop-up (Modal)
// ============================================================
// Component này:
//   1. Bọc nội dung form trong Bootstrap Modal
//   2. Điều khiển show/hide qua props (không dùng data-bs-toggle)
//   3. Dùng useRef + useEffect để sync React state với Bootstrap JS
//
// PROPS nhận vào:
//   - show     : boolean  — true = hiện modal, false = ẩn modal
//   - onClose  : function — Callback khi đóng modal (click X hoặc nút Đóng)
//   - title    : string   — Tiêu đề hiển thị trên header modal
//   - children : ReactNode — Nội dung bên trong modal (form component)
//   - size     : string   — Kích thước modal: 'sm' | '' | 'lg' | 'xl'
// ============================================================

// useEffect: Hook để thực hiện side effects (thao tác ngoài render)
// useRef: Hook để giữ tham chiếu tới DOM node hoặc giá trị bền vững
import { useEffect, useRef } from 'react'

// Import Modal class từ Bootstrap JS
// Bootstrap 5 hỗ trợ tree-shaking: Chỉ import những gì cần dùng
// Thay vì: import 'bootstrap' (import toàn bộ)
import { Modal } from 'bootstrap'

function ModalForm({ show, onClose, title, children, size = '' }) {

  // ─────────────────────────────────────────────────────────
  // useRef — 2 refs cho 2 mục đích khác nhau
  // ─────────────────────────────────────────────────────────

  // Ref 1: Trỏ tới DOM element thật của modal
  // React cần DOM element để Bootstrap có thể khởi tạo Modal instance
  // Khởi tạo: null (chưa có DOM khi component chưa mount)
  const modalElRef = useRef(null)

  // Ref 2: Lưu Bootstrap Modal instance
  // Dùng ref thay vì state vì:
  //   - Thay đổi instance KHÔNG cần re-render component
  //   - State thay đổi → re-render → tốn hiệu năng không cần thiết
  //   - Ref thay đổi → KHÔNG re-render → phù hợp cho "side data"
  const bsModalRef = useRef(null)

  // ─────────────────────────────────────────────────────────
  // useEffect 1: Khởi tạo Bootstrap Modal — chạy 1 lần duy nhất
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Tại đây: Component đã mount → DOM đã có → modalElRef.current ≠ null
    // Tạo Bootstrap Modal instance từ DOM element
    bsModalRef.current = new Modal(modalElRef.current, {
      // backdrop: 'static' — Click ra ngoài modal KHÔNG đóng modal
      // Lý do: Tránh người dùng vô tình đóng khi đang nhập form
      // Giá trị khác: true (click ngoài đóng), false (không có backdrop)
      backdrop: 'static',
      // keyboard: false — Nhấn ESC không đóng modal
      keyboard: false,
    })

    // ── CLEANUP FUNCTION ──
    // Trả về một hàm → React gọi hàm này khi component UNMOUNT
    // (Khi component bị xoá khỏi DOM, ví dụ: chuyển trang)
    // Mục đích: Dọn dẹp để tránh memory leak
    return () => {
      // Huỷ Bootstrap Modal instance, giải phóng event listeners
      bsModalRef.current?.dispose()
      // ?. (Optional chaining): Chỉ gọi dispose() nếu bsModalRef.current không phải null/undefined
    }
    // [] — Dependency array rỗng → Effect chỉ chạy 1 lần sau lần render đầu tiên
    // (Tương đương componentDidMount trong class component)
  }, [])

  // ─────────────────────────────────────────────────────────
  // useEffect 2: Đồng bộ prop `show` với Bootstrap Modal
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Guard: Nếu instance chưa được tạo → bỏ qua
    // (Effect 1 và Effect 2 có thể chạy theo thứ tự khác nhau)
    if (!bsModalRef.current) return

    if (show) {
      // show = true → Gọi method .show() của Bootstrap Modal
      // Bootstrap sẽ: Add class 'show', thêm backdrop, focus modal
      bsModalRef.current.show()
    } else {
      // show = false → Gọi method .hide()
      // Bootstrap sẽ: Xoá class 'show', animation fade out, xoá backdrop
      bsModalRef.current.hide()
    }

    // [show] — Chạy lại effect mỗi khi prop `show` thay đổi
    // Ví dụ: App.jsx setShowModal(true) → show = true → effect chạy → modal.show()
  }, [show])

  // ─────────────────────────────────────────────────────────
  // RENDER: Cấu trúc HTML của Bootstrap Modal
  // ─────────────────────────────────────────────────────────
  return (
    /*
      .modal: Bootstrap class — ẩn modal mặc định (display: none)
      .fade: Animation fade in/out khi show/hide
      ref={modalElRef}: GẮN ref vào DOM element này
        → modalElRef.current = thẻ div này
        → Bootstrap dùng DOM element để khởi tạo
      tabIndex="-1": Cho phép div nhận focus bằng programmatic
        (cần thiết cho accessibility — keyboard navigation)
    */
    <div
      className="modal fade"
      ref={modalElRef}
      tabIndex="-1"
      // aria-labelledby: Accessibility — liên kết modal với tiêu đề của nó
      aria-labelledby="modalTitle"
      // aria-hidden="true": Ẩn với screen reader khi modal chưa show
      // Bootstrap tự quản lý attribute này khi show/hide
      aria-hidden="true"
    >
      {/*
        .modal-dialog: Container định vị modal ở giữa màn hình
        .modal-dialog-centered: Căn giữa theo chiều dọc (vertical center)
        .modal-dialog-scrollable: Nội dung dài → scroll bên trong modal
        modal-${size}: Kích thước modal
          - modal-sm: 300px
          - (mặc định): 500px
          - modal-lg: 800px
          - modal-xl: 1140px

        Template literal có điều kiện:
        `modal-dialog ${size ? `modal-${size}` : ''}`
        → Nếu size='lg' → 'modal-dialog modal-lg'
        → Nếu size='' → 'modal-dialog ' (không thêm class kích thước)
      */}
      <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size ? `modal-${size}` : ''}`}>

        {/* .modal-content: Card trắng chứa toàn bộ nội dung modal */}
        <div className="modal-content border-0 shadow-lg">

          {/* ── MODAL HEADER ── */}
          {/*
            .modal-header: Bootstrap styling cho header
            bg-primary text-white: Nền xanh, chữ trắng
            border-0: Xoá border mặc định giữa header và body
          */}
          <div className="modal-header bg-primary text-white border-0">

            {/* Tiêu đề modal — nhận từ prop `title` */}
            {/* id="modalTitle": Được tham chiếu bởi aria-labelledby trên .modal */}
            <h5 className="modal-title fw-bold" id="modalTitle">
              {title}
            </h5>

            {/*
              Nút đóng modal (X)
              .btn-close: Bootstrap X icon
              .btn-close-white: Màu trắng (cho nền tối)
              onClick={onClose}: Gọi hàm onClose từ props khi click
                → App.jsx: setShowModal(false) → show = false → modal.hide()
              aria-label="Đóng": Mô tả cho screen reader
            */}
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          {/* ── MODAL BODY ── */}
          {/*
            .modal-body: Vùng nội dung chính
            Padding mặc định: 1rem

            {children}: Render bất cứ JSX nào được truyền vào giữa thẻ
            → Ví dụ: <ModalForm>...<StudentForm />...</ModalForm>
            → children = <StudentForm /> component
            → Pattern này gọi là "Composition" hoặc "Slot Pattern"
          */}
          <div className="modal-body">
            {children}
          </div>

          {/* Không có .modal-footer vì nút Submit/Cancel ở trong form (children) */}
          {/* Nếu muốn có footer: Thêm prop `footer` hoặc dùng thêm children slot */}

        </div>
        {/* end .modal-content */}

      </div>
      {/* end .modal-dialog */}

    </div>
    // end .modal
  )
}

export default ModalForm

// ============================================================
// CÁCH DÙNG Ở APP.JSX:
//
// <ModalForm
//   show={showModal}
//   onClose={handleClose}
//   title={editItem ? '✏️ Chỉnh sửa sinh viên' : '➕ Thêm sinh viên mới'}
//   size="lg"
// >
//   <StudentForm
//     defaultValues={editItem}
//     onSubmit={handleSubmit}
//     onClose={handleClose}
//   />
// </ModalForm>
//
// ── LUỒNG HOẠT ĐỘNG: ──
// 1. User click "Thêm" → App: setShowModal(true)
// 2. show prop = true → useEffect chạy → bsModal.show()
// 3. Bootstrap: animation + backdrop + focus
// 4. User click X → onClose() → App: setShowModal(false)
// 5. show prop = false → useEffect chạy → bsModal.hide()
// 6. Bootstrap: animation fade out + xoá backdrop
// ============================================================
