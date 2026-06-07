import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/data/lessons');

const titles = {
  91: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Liên từ: and, but, so, because", level: "B1" },
  92: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Although, however, therefore", level: "B1" },
  93: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "When, while, before, after", level: "B1" },
  94: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "If loại 0 và loại 1", level: "B1" },
  95: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "If loại 2", level: "B1" },
  96: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Mệnh đề nguyên nhân – kết quả", level: "B1" },
  97: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Mệnh đề tương phản", level: "B1" },
  98: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Câu ghép vs câu phức", level: "B1" },
  99: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Đọc đoạn có nhiều liên từ", level: "B1" },
  100: { chapter: "CHẶNG 4 — Nhóm 1: Câu phức và liên kết ý", title: "Kiểm tra câu phức", level: "B1" },

  101: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Who / which / that", level: "B1" },
  102: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Whom / whose / where / when", level: "B1" },
  103: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Mệnh đề quan hệ xác định", level: "B1" },
  104: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Mệnh đề quan hệ không xác định", level: "B1" },
  105: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Rút gọn mệnh đề quan hệ dạng V-ing", level: "B1" },
  106: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Rút gọn mệnh đề quan hệ dạng V3", level: "B1" },
  107: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Bài tập đọc câu có relative clauses", level: "B1" },
  108: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Bài tập viết lại câu", level: "B1" },
  109: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Reading 5: bài đọc có mệnh đề quan hệ", level: "B1" },
  110: { chapter: "CHẶNG 4 — Nhóm 2: Mệnh đề quan hệ và rút gọn cơ bản", title: "Kiểm tra", level: "B1" },

  111: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Modal verbs: can, could, should, must, have to", level: "B1" },
  112: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Gerund and infinitive: V-ing / to V", level: "B1" },
  113: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Passive voice: hiện tại, quá khứ, tương lai", level: "B1" },
  114: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Reported speech cơ bản", level: "B1" },
  115: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Comparisons", level: "B1" },
  116: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Enough / too / so / such", level: "B1" },
  117: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Quantifiers: many, much, few, little, some, any", level: "B1" },
  118: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Articles nâng cao", level: "B1" },
  119: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Prepositions hay gặp", level: "B1" },
  120: { chapter: "CHẶNG 4 — Nhóm 3: Các điểm ngữ pháp hay thi", title: "Kiểm tra chặng 4", level: "B1" },
};

const indexPath = path.resolve('public/data/course-index.json');
let courseIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

courseIndex = courseIndex.map(lesson => {
  const match = lesson.id.match(/^DAY_(\d+)$/);
  if (match) {
    const day = parseInt(match[1]);
    if (titles[day]) {
      const fileName = "day-" + match[1] + ".json";
      const filePath = path.join(outDir, fileName);
      
      const contentStr = fs.readFileSync(filePath, 'utf-8');
      const content = JSON.parse(contentStr);
      
      lesson.chapter = titles[day].chapter;
      lesson.title = "Buổi " + day + ": " + titles[day].title;
      lesson.description = "Bài học theo lộ trình";
      
      content.theory_html = "<h2>" + titles[day].title + "</h2><p>Nội dung đang được biên soạn cho buổi " + day + ".</p>";
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    }
  }
  return lesson;
});

fs.writeFileSync(indexPath, JSON.stringify(courseIndex, null, 2));

console.log("Updated course index with 91-120");
