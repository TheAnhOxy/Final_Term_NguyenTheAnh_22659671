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
  Switch,
} from "react-native-paper";

const HomePage = () => {
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

  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const openAddModal = () => {
    setEditingHabit(null);
    setModalVisible(true);
  };
  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const handleSave = async (data: Pick<Habit, "title" | "description">) => {
    try {
      if (editingHabit) await handleUpdateHabit(editingHabit.id, data);
      else await handleAddHabit(data);
      closeModal();
    } catch (e) {
      Alert.alert("Error", "Failed to save habit.");
    }
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-6">
      <Text variant="headlineSmall" className="text-center mb-3">
        (^-^)
      </Text>
      <Text variant="titleMedium" className="text-center mb-1">
        Chưa có thói quen nào.
      </Text>
      <Text variant="bodyMedium" className="text-center">
        Hãy thêm một thói quen mới bằng nút "+" ở dưới!
      </Text>
    </View>
  );

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (habit.description &&
        habit.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesActive = showActiveOnly ? habit.active === 1 : true;
    return matchesSearch && matchesActive;
  });

  return (
    <View className="flex flex-1 bg-gray-50">
      {/* Search & Filter */}
      <View className="px-4 py-4 bg-white shadow rounded-b-lg">
        <TextInput
          mode="outlined"
          label="Tìm kiếm thói quen..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
          className="rounded-lg"
        />

        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-base">Chỉ hiển thị thói quen đang Active</Text>
          <Switch value={showActiveOnly} onValueChange={setShowActiveOnly} />
        </View>

        <Button
          mode="contained-tonal"
          onPress={handleImport}
          loading={isLoading}
          disabled={isLoading}
          icon="api"
          className="mt-3 rounded-lg"
        >
          Import Thói quen mẫu
        </Button>
      </View>

      {/* List */}
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HabitItem
            data={item}
            onToggle={handleToggleHabit}
            onEdit={openEditModal}
            onDelete={handleRemoveHabit}
          />
        )}
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshHabits} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: "#3498db",
        }}
        onPress={openAddModal}
      />

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 12,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="titleLarge">
              {editingHabit ? "Sửa thói quen" : "Thêm thói quen"}
            </Text>
            <FAB icon="close" small onPress={closeModal} />
          </View>

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
