// db/index.ts
import { Habit } from "@/types/habit";
import { SQLiteDatabase } from "expo-sqlite";

// Q1 & Q2: Khởi tạo bảng và seed dữ liệu
export const initDatabaseAndSeed = async (db: SQLiteDatabase) => {
  // Tạo bảng habits
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      active INTEGER DEFAULT 1,
      done_today INTEGER DEFAULT 0,
      created_at INTEGER
    )
  `);

  // Q2: Seed dữ liệu mẫu nếu bảng trống
  const countResult = await db.getFirstAsync<{ "COUNT(*)": number }>(
    "SELECT COUNT(*) FROM habits"
  );
  const count = countResult ? countResult["COUNT(*)"] : 0;

  if (count === 0) {
    console.log("Seeding sample habits...");
    await db.runAsync(
      "INSERT INTO habits (title, description, created_at) VALUES (?, ?, ?)",
      ["Uống 2 lít nước", "Uống đủ nước mỗi ngày", Date.now()]
    );
    await db.runAsync(
      "INSERT INTO habits (title, description, created_at) VALUES (?, ?, ?)",
      ["Đi bộ 15 phút", "Vận động sau giờ làm", Date.now()]
    );
  }
};

// Q3: Lấy tất cả habits (dùng trong hook)
export const getAllHabits = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Habit>("SELECT * FROM habits ORDER BY created_at DESC");
};

// Q4: Thêm habit mới
export const createHabit = async (
  db: SQLiteDatabase,
  data: Pick<Habit, "title" | "description">
) => {
  return await db.runAsync(
    "INSERT INTO habits (title, description, created_at) VALUES (?, ?, ?)",
    [data.title, data.description || null, Date.now()]
  );
};

// Q5: Toggle trạng thái done_today
export const toggleHabitDone = async (db: SQLiteDatabase, id: number) => {
  return await db.runAsync(
    "UPDATE habits SET done_today = CASE WHEN done_today = 0 THEN 1 ELSE 0 END WHERE id = ?",
    [id]
  );
};

// Q6: Cập nhật habit
export const updateHabit = async (
  db: SQLiteDatabase,
  id: number,
  data: Pick<Habit, "title" | "description">
) => {
  return await db.runAsync(
    "UPDATE habits SET title = ?, description = ? WHERE id = ?",
    [data.title, data.description || null, id]
  );
};

// Q7: Xóa habit
export const deleteHabit = async (db: SQLiteDatabase, id: number) => {
  return await db.runAsync("DELETE FROM habits WHERE id = ?", [id]);
};

// Q9: Import hàng loạt (sử dụng transaction để hiệu quả)
export const batchImportHabits = async (
  db: SQLiteDatabase,
  habits: Pick<Habit, "title" | "description">[]
) => {
  await db.withTransactionAsync(async () => {
    for (const habit of habits) {
      // Chỉ INSERT nếu title chưa tồn tại (tránh trùng lặp)
      await db.runAsync(
        `INSERT INTO habits (title, description, created_at)
         SELECT ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM habits WHERE title = ?)`,
        [habit.title, habit.description || null, Date.now(), habit.title]
      );
    }
  });
};