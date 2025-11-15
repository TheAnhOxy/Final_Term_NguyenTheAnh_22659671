// hooks/useHabits.ts
import {
  batchImportHabits,
  createHabit,
  deleteHabit,
  getAllHabits,
  toggleHabitDone,
  updateHabit,
} from "@/db";
import { Habit } from "@/types/habit";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

// Q10: Tách custom hook
export const useHabits = () => {
  const db = useSQLiteContext();

  // State
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm lấy dữ liệu (dùng useCallback)
  const refreshHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      const allHabits = await getAllHabits(db);
      setHabits(allHabits);
    } catch (e) {
      Alert.alert("Error", "Failed to load habits.");
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  // Tự động load khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      refreshHabits();
    }, [refreshHabits])
  );

  // Q8: Lọc client-side (dùng useMemo)
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) =>
      habit.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [habits, searchQuery]);

  // --- Actions ---

  // Q4: Thêm
  const handleAddHabit = useCallback(
    async (data: Pick<Habit, "title" | "description">) => {
      await createHabit(db, data);
      await refreshHabits();
    },
    [db, refreshHabits]
  );

  // Q5: Toggle
  const handleToggleHabit = useCallback(
    async (id: number) => {
      await toggleHabitDone(db, id);
      // Cập nhật state ngay lập tức để UI mượt hơn
      setHabits((prev) =>
        prev.map((h) =>
          h.id === id ? { ...h, done_today: h.done_today === 0 ? 1 : 0 } : h
        )
      );
      // (Không cần refresh lại từ DB)
    },
    [db]
  );

  // Q6: Sửa
  const handleUpdateHabit = useCallback(
    async (id: number, data: Pick<Habit, "title" | "description">) => {
      await updateHabit(db, id, data);
      await refreshHabits();
    },
    [db, refreshHabits]
  );

  // Q7: Xóa
  const handleRemoveHabit = useCallback(
    (id: number, title: string) => {
      Alert.alert(
        "Xác nhận xóa", // Q7: Hiện Alert xác nhận
        `Bạn có chắc muốn xóa thói quen "${title}" không?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              await deleteHabit(db, id);
              await refreshHabits();
            },
          },
        ]
      );
    },
    [db, refreshHabits]
  );

  // Q9: Import
  const handleImport = useCallback(async () => {
    // API mẫu (thay thế bằng API thật nếu có)
    const API_URL = "https://jsonplaceholder.typicode.com/todos";
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch");

      const apiData = (await response.json()) as { title: string }[];
      // Lấy 5-10 item mẫu
      const habitsToImport = apiData.slice(0, 10).map((item) => ({
        title: item.title, // Map trường "title"
        description: "Imported from API",
      }));

      await batchImportHabits(db, habitsToImport);
      await refreshHabits();
      Alert.alert("Success", "Imported sample habits!");
    } catch (e) {
      Alert.alert("Error", "Failed to import habits."); // Q9: Báo lỗi
    } finally {
      setIsLoading(false); // Q10: Button/controls disabled
    }
  }, [db, refreshHabits]);

  return {
    habits: filteredHabits, // (Đã lọc)
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshHabits,
    handleAddHabit,
    handleToggleHabit,
    handleUpdateHabit,
    handleRemoveHabit,
    handleImport,
  };
};