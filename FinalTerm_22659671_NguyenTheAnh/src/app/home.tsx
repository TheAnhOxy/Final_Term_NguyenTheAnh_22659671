// app/home.tsx
import HabitForm from "@/components/HabitForm";
import HabitItem from "@/components/HabitItem";
import { useHabits } from "@/hooks/useHabits";
import { Habit } from "@/types/habit";
import React, { useState } from "react";
import { FlatList, RefreshControl, View, Alert } from "react-native";
import {
  ActivityIndicator,
  Button,
  FAB,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

const HomePage = () => {
  // Q10: Lấy logic từ custom hook
  const {
    habits,
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshHabits,
    handleAddHabit,
    handleUpdateHabit,
    handleRemoveHabit,
    handleToggleHabit,
    handleImport,
  } = useHabits();

  // State cho Modal (Câu 4, 6)
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Mở modal Thêm mới (Câu 4)
  const openAddModal = () => {
    setEditingHabit(null);
    setModalVisible(true);
  };

  // Mở modal Sửa (Câu 6)
  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Xử lý khi nhấn "Lưu" trên Modal
  const handleSave = async (data: Pick<Habit, "title" | "description">) => {
    try {
      if (editingHabit) {
        // Q6: Sửa
        await handleUpdateHabit(editingHabit.id, data);
      } else {
        // Q4: Thêm
        await handleAddHabit(data);
      }
      closeModal();
    } catch (e) {
      Alert.alert("Error", "Failed to save habit.");
    }
  };

  // Q3: Empty state
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-4">
      {/* Q10: Cải thiện Empty state */}
      <Text variant="headlineSmall" className="text-center mb-4">
        (^-^)
      </Text>
      <Text variant="titleMedium" className="text-center">
        Chưa có thói quen nào.
      </Text>
      <Text variant="bodyMedium" className="text-center">
        Hãy thêm một thói quen mới bằng nút "+" ở dưới!
      </Text>
    </View>
  );

  return (
    <View className="flex flex-1 bg-gray-50">
      {/* Q8: Tìm kiếm/Filter */}
      <View className="px-4 py-3 bg-white shadow">
        <TextInput
          mode="outlined"
          label="Tìm kiếm thói quen..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
        />
        {/* Q9: Nút Import API */}
        <Button
          mode="contained-tonal"
          onPress={handleImport}
          loading={isLoading} // Q10: Disable khi loading
          disabled={isLoading}
          icon="api"
          className="mt-2"
        >
          Import Thói quen mẫu
        </Button>
      </View>

      {/* Q3: Màn hình danh sách */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HabitItem
            data={item}
            onToggle={handleToggleHabit} // Q5
            onEdit={openEditModal} // Q6
            onDelete={handleRemoveHabit} // Q7
          />
        )}
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : renderEmptyState}
        // Q10: Pull to refresh
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshHabits} />
        }
        contentContainerStyle={{ paddingBottom: 80 }} // Chừa chỗ cho FAB
      />

      {/* Q4: Nút "+" mở Modal */}
      <FAB
        icon="plus"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        onPress={openAddModal}
      />

      {/* Q4 & Q6: Modal Thêm/Sửa */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 10,
          }}
        >
          <HabitForm
            initialData={editingHabit}
            onSave={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default HomePage;