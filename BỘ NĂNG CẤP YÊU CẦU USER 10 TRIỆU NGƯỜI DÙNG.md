# YÊU CẦU DỰ ÁN SIÊU LỚN — THANH TOÁN QUỐC TẾ & SCALE 100 → 100 TRIỆU USER

> File riêng — không gộp vào CLAUDE.md (file quy tắc code chung). File này là yêu cầu kiến trúc + checklist file riêng cho dự án quy mô siêu lớn, có thanh toán quốc tế.

---

## 0. CẢNH BÁO RỦI RO KIẾN TRÚC (PHẢI ĐỌC TRƯỚC KHI CODE)

1. **SePay không phù hợp thanh toán quốc tế.** SePay chỉ xử lý chuyển khoản nội địa Việt Nam, không hỗ trợ thẻ quốc tế, không đa tiền tệ, không recurring billing. Bắt buộc thêm **Stripe** (hoặc Paddle/PayPal) làm cổng chính cho user quốc tế. SePay chỉ giữ vai trò phụ cho user VN nội địa.
2. **Khoảng cách 100 → 100 triệu user là khoảng cách kiến trúc rất lớn.** Không dùng 1 kiến trúc duy nhất cho cả 2 đầu. Thiết kế full-scale (multi-region, sharding) ngay từ ngày 1 = over-engineering, chết vì chậm ra mắt. Đúng cách: build đúng mức cho giai đoạn hiện tại, có **đường nâng cấp rõ ràng** (scale path) đã định trước.
3. Mọi quyết định kiến trúc lớn (chọn DB, chọn payment gateway, chọn region) phải được ghi lại lý do — không quyết định miệng rồi quên.

---

## 1. BỘ FILE DỰ ÁN CẦN CÓ

### A. Bắt buộc — nền tảng (mọi dự án)
| File | Vai trò |
|---|---|
| `.gitignore` | Chặn commit `.env`, `node_modules`, file rác |
| `.env.example` | Mẫu biến môi trường, không chứa giá trị thật |
| `README.md` | Mục đích, cách chạy local, lệnh deploy, kiến trúc tổng quan |
| `.eslintrc.json` + `.prettierrc` (JS/TS) hoặc `pyproject.toml` (Python) | Tự động bắt code bẩn, ép format đồng nhất |
| `package-lock.json` / `poetry.lock` | Khoá version dependency, tránh lệch môi trường |

### B. Enforcement — chặn lỗi tự động
| File | Vai trò |
|---|---|
| `.github/workflows/ci.yml` | Tự lint + tự test mỗi lần push, fail thì chặn merge |
| `.husky/pre-commit` + `lint-staged` | Chặn commit nếu chưa sạch, chặn lộ secret trước khi push |
| `.editorconfig` | Đồng bộ tab/encoding giữa các máy/IDE |

### C. Testing
| File | Vai trò |
|---|---|
| `jest.config.js` (JS) / `pytest.ini` (Python) + folder `tests/` | Test case bám theo acceptance criteria |

### D. Database (Supabase)
| File | Vai trò |
|---|---|
| `supabase/migrations/*.sql` | Mỗi thay đổi schema = 1 file có thứ tự, review/rollback được |
| `seed.sql` | Data mẫu dev/test, tách biệt tuyệt đối với data production |

### E. Deploy/Hạ tầng
| File | Vai trò |
|---|---|
| `vercel.json` | Cấu hình route, env, build command |
| `tsconfig.json` (nếu TypeScript) | Bắt lỗi kiểu dữ liệu lúc code |

### F. An toàn/Sự cố
| File | Vai trò |
|---|---|
| `SECURITY.md` | Quy trình xử lý khi phát hiện lỗ hổng/sự cố bảo mật |
| `CHANGELOG.md` | Ghi mỗi version đổi gì, dễ truy ngược khi bug mới phát sinh |

### G. Kiến trúc & quyết định kỹ thuật
| File | Vai trò |
|---|---|
| `docs/adr/*.md` (Architecture Decision Records) | Ghi lý do mỗi quyết định lớn — chống đổi tuỳ ý sau này |
| `docs/architecture.md` | Sơ đồ hệ thống, luồng dữ liệu, điểm nghẽn dự kiến khi scale |
| `openapi.yaml` | Contract API chuẩn (OpenAPI/Swagger) cho web/mobile/bên thứ 3 |

### H. Hạ tầng as code
| File | Vai trò |
|---|---|
| `terraform/*.tf` hoặc `infra/` (Pulumi) | Hạ tầng định nghĩa bằng code, dựng lại nhanh khi cần |
| `docker-compose.yml` + `Dockerfile` | Môi trường chạy nhất quán dev → staging → production |

### I. Thanh toán quốc tế & tuân thủ
| File | Vai trò |
|---|---|
| `docs/payment-flow.md` | Luồng Stripe (quốc tế) / SePay (nội địa), mapping currency, idempotency webhook cho cả 2 |
| `PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md` | Bắt buộc pháp lý khi nhận thanh toán quốc tế, đặc biệt GDPR nếu có user EU |
| `docs/tax-compliance.md` | Thuế VAT/GST theo khu vực user quốc tế |

### J. Khả năng mở rộng
| File | Vai trò |
|---|---|
| `docs/scaling-strategy.md` | Mốc cụ thể: bao nhiêu user cần read-replica DB, cache (Redis), queue (webhook/email) |
| `k6/` hoặc `loadtest/*.js` | Load test trước mỗi mốc tăng trưởng lớn |
| `docs/disaster-recovery.md` | Runbook backup/restore, ai làm gì khi DB chết/region sập |

### K. Quan sát hệ thống
| File | Vai trò |
|---|---|
| `monitoring/alerts.yml` (Sentry/Datadog) | Cảnh báo tự động khi lỗi/thanh toán fail tăng bất thường |
| `docs/runbook-incident.md` | Quy trình xử lý sự cố: ai báo, ai fix, escalation path |

### L. Đa ngôn ngữ/đa tiền tệ
| File | Vai trò |
|---|---|
| `locales/*.json` (i18n) | Đa ngôn ngữ UI |
| `docs/currency-handling.md` | Quy tắc hiển thị/tính giá theo tiền tệ, tỷ giá lấy từ đâu, làm tròn thế nào |

---

## 2. LỘ TRÌNH THEO GIAI ĐOẠN (KHÔNG LÀM HẾT CÙNG LÚC)

| Giai đoạn | Quy mô user | Cần thêm nhóm file |
|---|---|---|
| MVP | 100 – 10.000 | A, B, D, F + Stripe cơ bản |
| Tăng trưởng | 10.000 – 1.000.000 | + G, I, K + đọc-replica DB + Redis cache |
| Siêu lớn | 1.000.000 – 100.000.000 | + H, J, L + multi-region + queue system + dedicated DB cluster |

---

## 3. NGUYÊN TẮC ÁP DỤNG

- Không build kiến trúc của giai đoạn "Siêu lớn" khi đang ở giai đoạn "MVP" — lãng phí thời gian, chậm ra mắt.
- Mỗi lần lên giai đoạn mới: review lại `docs/scaling-strategy.md` để biết đúng mốc cần thêm gì, không thêm sớm/thêm muộn.
- File này được cập nhật cùng tốc độ với tăng trưởng thực tế của dự án — không cố định mãi theo bản gốc.
