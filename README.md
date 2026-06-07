# English Mastery App - Hướng dẫn tạo và chỉnh sửa khóa học

Ứng dụng học tiếng Anh toàn diện, được thiết kế với giao diện hiện đại, giúp sinh viên và người học từ mất gốc đạt 9+ THPTQG và 800+ TOEIC. Lộ trình khóa học kéo dài 180 buổi tập trung vào Từ vựng, Ngữ pháp và Đọc hiểu.

## 🌟 Tính năng của nền tảng

Nền tảng này hỗ trợ giao diện học tập tương tác (Micro-learning) bao gồm:
- **Tài liệu & Đọc hiểu (Left Pane)**: Hiển thị lý thuyết, đoạn văn, bài đọc dài một cách trực quan, rõ ràng (áp dụng trên Desktop/Tablet) hoặc dạng Popup (trên Mobile).
- **Thẻ từ vựng (Flashcards)**: Tương tác 3D lật thẻ để giúp ghi nhớ từ mới hiệu quả. Tích hợp âm thanh phát âm. Mặt sau flashcard trình bày đa nghĩa, phân biệt từ loại, có đầy đủ cụm từ ví dụ và câu ví dụ.
- **Trắc nghiệm luyện bài (Quiz)**: Các câu hỏi trắc nghiệm A, B, C, D kèm theo hiệu ứng âm thanh sắc nét ngay lập tức cho biết đúng/sai.
- **Sổ tay lỗi sai (Error Notebook)**: Tự động lưu và tổ chức các lỗi sai người học mắc phải trong quá trình làm Quiz, giúp học viên ôn tập lại kiến thức hổng.
- **Chuỗi học tập (Streak & Gamification)**: Khích lệ tinh thần học viên bằng chuỗi ngày học liên tục và các rương phần thưởng.
- **Micro-learning Flow**: Bài học được chia thành những bước nhỏ giúp người học tương tác liên tục mà không bị chán.

---

## 📂 Cách thức cấu trúc dữ liệu bài học

Dữ liệu của toàn bộ 180 bài học được thiết kế dưới dạng file tĩnh `JSON` và lưu trữ trong thư mục `public/data/lessons/`. 

Mỗi buổi học có 1 file theo định dạng: `day-XXX.json` (ví dụ: `day-001.json`, `day-023.json`). 
Để sửa nội dung một buổi học, bạn chỉ cần thay đổi nội dung file JSON tương ứng.

Cấu trúc chuẩn của 1 file JSON chứa bài học như sau:
```json
{
  "theory_html": "<h2>Lý thuyết</h2><p>Trình bày HTML... dùng <ul>, <li>...</p>",
  "vocabulary": [
    {
      "word": "test",
      "pronunciation": "/test/",
      "meanings": [
        "(n) test: bài kiểm tra, sự thử nghiệm",
        "(v) test: kiểm tra, thử nghiệm"
      ],
      "phrase_example": "Pass a test",
      "phrase_translation": "Thi đỗ / Vượt qua bài kiểm tra.",
      "sentence_example": "I have a math test tomorrow.",
      "sentence_translation": "Tôi có 1 bài kiểm tra toán vào ngày mai."
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "Tìm nghĩa đúng của từ 'improve':",
      "options": ["Cải thiện", "Phát triển", "Từ bỏ", "Hoàn thành"],
      "correct_answer": "Cải thiện",
      "explanation": "Từ 'improve' có nghĩa là cải thiện, làm cho tốt hơn (to make something better)."
    }
  ]
}
```

---

## 🤖 Prompt (Câu lệnh) để tự động tạo nội dung bằng AI

Để tiết kiệm thời gian, bạn có thể thiết kế bài học hoàn chỉnh nhờ sự trợ giúp của ChatGPT, Gemini, hay Claude. Copy **Prompt** dưới đây, điền Tên bài học rồi gửi cho AI.

### Prompt chuẩn

```text
Bạn là một chuyên gia thiết kế chương trình học tiếng Anh xuất sắc, giúp học sinh từ mất gốc đạt 9+ THPTQG và 800+ TOEIC. 
Hãy viết nội dung bài học cho tôi dưới dạng JSON chuẩn. 

Tên bài học hôm nay: "[ĐIỀN TÊN BÀI HỌC VÀO ĐÂY, ví dụ: Buổi 61: Tìm chủ ngữ và động từ chính]"

YÊU CẦU VỀ NỘI DUNG MÔN HỌC BẮT BUỘC PHẢI CHÚ Ý:
1. theory_html (Lý thuyết và Đọc hiểu): Trình bày theory bằng HTML (Sử dụng các thẻ <h2>, <h3>, <p>, <ul>, <li>, <strong>, <i>). Đoạn văn đọc hiểu dài hãy bỏ vào phần này. Ngữ pháp giải thích cần thật ngắn gọn, dễ hiểu, tránh lý thuyết rườm rà.
2. vocabulary (Từ vựng): Chọn ngẫu nhiên khoảng 3-8 từ quan trọng trong bài.
  - Tách bạch rõ ràng danh sách từ vựng thành các trường:
      + `word`: Từ hoặc cụm từ
      + `pronunciation`: Phát âm (nếu có)
      + `meanings`: List (mảng) giải nghĩa của các từ loại (VD ["(n) test: bài kiểm tra", "(v) test: kiểm tra"])
      + `phrase_example`: Ví dụ cụm từ đi liền thường gặp
      + `phrase_translation`: Nghĩa tiếng Việt của ví dụ cụm từ
      + `sentence_example`: Câu ví dụ bằng tiếng Anh
      + `sentence_translation`: Nghĩa tiếng Việt của câu ví dụ
3. quiz (Trắc nghiệm): Viết từ 3-10 câu trắc nghiệm (Tùy số lượng bài).
  - Có thể bao gồm các câu hỏi từ vựng, ngữ pháp, hoặc câu hỏi đọc hiểu dựa vào phần lý thuyết phía trên.
  - BẮT BUỘC phải có trường `explanation` giải thích ngắn gọn lý do tại sao lại chọn đáp án đó hoặc lưu ý cần thiết. Đây là data quan trọng để đưa vào sổ tay lỗi sai.

YÊU CẦU VỀ FORMAT TRẢ VỀ:
Trả về DUY NHẤT 1 cấu trúc JSON (đúng định dạng) chứa 3 key: "theory_html", "vocabulary", và "quiz". Không cần id, không cần title ở root. Không markdown code block, không giải thích gì thêm, bắt đầu bằng "{" và kết thúc bằng "}":
{
  "theory_html": "<h2>...</h2>",
  "vocabulary": [
    {
      "word": "từ đơn/cụm từ",
      "pronunciation": "/phiên âm/",
      "meanings": [
        "(từ loại 1) từ tiếng anh: nghĩa tiếng việt",
        "(từ loại 2) từ tiếng anh: nghĩa tiếng việt"
      ],
      "phrase_example": "cụm từ ví dụ",
      "phrase_translation": "nghĩa cụm từ",
      "sentence_example": "câu ví dụ tiếng anh",
      "sentence_translation": "câu ví dụ tiếng việt"
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "Câu hỏi đọc hiểu / ngữ pháp",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "Giải thích chi tiết tại sao đáp án A lại đúng..."
    }
  ]
}
```

### 🎯 Quy trình tạo mới bài học:
1. Bạn nhìn vào danh sách bài học và chọn làm nội dung cho: **Buổi 61: Tìm chủ ngữ và động từ chính**.
2. Bạn copy prompt ở trên.
3. Thay `[ĐIỀN TÊN BÀI HỌC VÀO ĐÂY]` thành `Buổi 61: Tìm chủ ngữ và động từ chính`.
4. Gửi cho AI.
5. AI trả về text JSON.
6. Bạn mở file `public/data/lessons/day-061.json`, xóa sạch dữ liệu "rỗng" cũ và dán text JSON mới vào.
7. Vào ứng dụng trải nghiệm bài học vừa mới thêm.

---

## 🛠️ Một vài mẹo định dạng `theory_html`
Ứng dụng sử dụng Tailwind Typography (`prose`) nên các thẻ HTML sẽ được tự động hiển thị đẹp mắt:
- Dùng `<h2>Tiêu đề lớn</h2>`
- Dùng `<h3>Tiểu mục</h3>`
- Dùng `<ul><li>Danh sách 1</li><li>Danh sách 2</li></ul>`
- Dùng `<strong>Chữ đậm nhấn mạnh</strong>`
- Dùng `<i>Chữ nghiêng</i>`
- Dùng `<p>Nội dung văn bản, đoạn văn đọc hiểu dài.</p>`

