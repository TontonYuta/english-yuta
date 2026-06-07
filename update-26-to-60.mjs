import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/data/lessons');

const titles = {
  26: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "Đại từ nhân xưng + To be", level: "A1" },
  27: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "To be: phủ định và câu hỏi", level: "A1" },
  28: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "Tính từ sở hữu: my, your, his, her...", level: "A1" },
  29: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "This / That / These / Those", level: "A1" },
  30: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "A / An / The: dùng thực tế, không sa đà lý thuyết", level: "A1" },
  31: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "Danh từ số ít, số nhiều", level: "A1" },
  32: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "There is / There are", level: "A1" },
  33: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "Chủ đề từ vựng: personal information", level: "A1" },
  34: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "Chủ đề từ vựng: family", level: "A1" },
  35: { chapter: "CHẶNG 2 — Nhóm 1: To be và mô tả cơ bản", title: "Reading 1: giới thiệu bản thân và gia đình", level: "A1" },
  
  36: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Giới từ nơi chốn: in, on, under, near, next to", level: "A1" },
  37: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Giới từ thời gian: in, on, at", level: "A1" },
  38: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Số đếm, số thứ tự, ngày tháng", level: "A1" },
  39: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Hỏi giờ và nói giờ", level: "A1" },
  40: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Chủ đề: house and furniture", level: "A1" },
  41: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Chủ đề: school and classroom", level: "A1" },
  42: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Chủ đề: time, days, months, seasons", level: "A1" },
  43: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Reading 2: nhà cửa, lớp học, thời gian", level: "A1" },
  44: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Dịch câu có giới từ", level: "A1" },
  45: { chapter: "CHẶNG 2 — Nhóm 2: Nơi chốn, thời gian, sinh hoạt", title: "Kiểm tra nhỏ", level: "A1" },

  46: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Động từ thường thông dụng", level: "A1" },
  47: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Present Simple: khẳng định", level: "A1" },
  48: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Quy tắc thêm s/es", level: "A1" },
  49: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Phát âm đuôi s/es", level: "A1" },
  50: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Present Simple: phủ định", level: "A1" },
  51: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Present Simple: nghi vấn", level: "A1" },
  52: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Trạng từ tần suất", level: "A1" },
  53: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Chủ đề: daily routines", level: "A1" },
  54: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Chủ đề: hobbies and sports", level: "A1" },
  55: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Reading 3: một ngày của học sinh", level: "A1" },
  56: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Writing: viết 5–7 câu về bản thân", level: "A1" },
  57: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Chữa lỗi câu thường gặp", level: "A1" },
  58: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Ôn tập To be vs Present Simple", level: "A1" },
  59: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Mini test", level: "A1" },
  60: { chapter: "CHẶNG 2 — Nhóm 3: Hiện tại đơn", title: "Kiểm tra chặng 2", level: "A1" },
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

console.log("Updated course index with 26-60");
