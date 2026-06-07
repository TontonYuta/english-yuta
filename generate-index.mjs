import fs from 'fs';
import path from 'path';

const chapters = [
  {
    name: "Tập 0: Khởi động cho người mất gốc",
    level: "A0",
    lessons: [
      "Test đầu vào & Cách học lại từ đầu",
      "Cách học từ vựng bằng cụm từ",
      "Cách đọc một câu tiếng Anh",
      "Thiết lập sổ từ vựng & lịch ôn"
    ]
  },
  {
    name: "Tập 1: Âm, từ loại, câu đơn",
    level: "A0-A1",
    lessons: [
      "Bảng chữ cái & Âm cơ bản (IPA)",
      "Âm, cụm từ, câu, dấu câu",
      "Danh từ, Động từ, Tính từ",
      "Đại từ nhân xưng",
      "Cấu trúc S + V + O"
    ]
  },
  {
    name: "Tập 2: To be, danh từ, mạo từ",
    level: "A1",
    lessons: [
      "Động từ To-be cơ bản",
      "This, That, These, Those",
      "Mạo từ A, An, The",
      "Danh từ số ít & số nhiều",
      "There is / There are"
    ]
  },
  {
    name: "Tập 3: Hiện tại đơn & Sinh hoạt",
    level: "A1",
    lessons: [
      "Hiện tại đơn: Khẳng định",
      "Hiện tại đơn: Phủ định & Nghi vấn",
      "Trạng từ chỉ tần suất",
      "Từ vựng: Daily routines",
      "Reading: Một ngày của tôi"
    ]
  },
  {
    name: "Tập 4: Các thì cơ bản",
    level: "A1-A2",
    lessons: [
      "Hiện tại tiếp diễn",
      "Quá khứ đơn: Động từ có quy tắc",
      "Quá khứ đơn: Bất quy tắc",
      "Tương lai đơn (Will vs Be going to)"
    ]
  },
  {
    name: "Tập 5: Đọc câu dài & Cụm từ",
    level: "A2",
    lessons: [
      "Tìm chủ ngữ và động từ chính",
      "Cụm danh từ dài",
      "Cụm giới từ trong câu",
      "Đọc câu dài: Tách cụm & Phân tích"
    ]
  },
  {
    name: "Tập 6: Ngữ pháp THPT nền",
    level: "B1",
    lessons: [
      "Động từ khuyết thiếu (Modal verbs)",
      "Danh động từ & Động từ nguyên thể (V-ing / to V)",
      "Câu bị động (Passive voice)",
      "Câu gián tiếp (Reported speech cơ bản)",
      "Các cấu trúc So sánh"
    ]
  },
  {
    name: "Tập 7: Mệnh đề, câu phức, đọc hiểu",
    level: "B1-B2",
    lessons: [
      "Liên từ: and, but, so, because, although",
      "Câu điều kiện (If type 1, 2, 3)",
      "Mệnh đề quan hệ (Who, Which, That)",
      "Rút gọn mệnh đề quan hệ",
      "Đọc hiểu: Bài đọc có câu phức"
    ]
  },
  {
    name: "Tập 8: Từ vựng THPT",
    level: "B1-B2",
    lessons: [
      "Education & Lifelong learning",
      "Technology & AI",
      "Environment & Climate change",
      "Health & Lifestyle",
      "Culture & Tourism"
    ]
  },
  {
    name: "Tập 9: Đọc hiểu THPTQG",
    level: "B2",
    lessons: [
      "Kỹ năng Skimming & Scanning",
      "Main idea & Detail questions",
      "Reference & Inference questions",
      "Cloze test: Điền từ vào đoạn văn",
      "Chữa lỗi sai & Viết lại câu"
    ]
  },
  {
    name: "Tập 10: TOEIC Reading Part 5-6",
    level: "B2-C1",
    lessons: [
      "Part 5: Từ loại & Thì",
      "Part 5: Từ vựng & Collocations",
      "Part 6: Chọn từ theo ngữ cảnh",
      "Part 6: Chọn câu chèn vào đoạn"
    ]
  },
  {
    name: "Tập 11: TOEIC Reading Part 7",
    level: "C1",
    lessons: [
      "Part 7: Single passage (Email, Notice)",
      "Part 7: Double passages",
      "Part 7: Triple passages",
      "Part 7: Câu hỏi suy luận đa văn bản"
    ]
  },
  {
    name: "Tập 12: Luyện đề tổng hợp",
    level: "C1",
    lessons: [
      "Test tổng hợp THPTQG số 1",
      "Test tổng hợp THPTQG số 2",
      "TOEIC Reading Mock Test",
      "Chữa chuyên sâu lỗi ngữ pháp & từ vựng"
    ]
  }
];

const courseIndex = [];

chapters.forEach((chapter, cIdx) => {
  chapter.lessons.forEach((lessonName, lIdx) => {
    const lessonId = `VOL${cIdx}_L${lIdx+1}`;
    courseIndex.push({
      id: lessonId,
      chapter: chapter.name,
      title: lessonName,
      level: chapter.level,
      description: `Thuộc ${chapter.name}`,
      content_file: `/data/dummy.json`
    });
  });
});

const outputPath = path.resolve('public/data/course-index.json');
fs.writeFileSync(outputPath, JSON.stringify(courseIndex, null, 2));

console.log('Successfully generated public/data/course-index.json with', courseIndex.length, 'lessons.');
