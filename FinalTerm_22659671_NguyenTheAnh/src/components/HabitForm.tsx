// components/HabitForm.tsx
import { Habit } from "@/types/habit";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

type Props = {
  initialData: Habit | null;
  onSave: (data: Pick<Habit, "title" | "description">) => void;
  onCancel: () => void;
};

const HabitForm = ({ initialData, onSave, onCancel }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
    setError(null);
  }, [initialData]);

  const handleSavePress = () => {
    if (!title.trim()) {
      setError("Title không được rỗng");
      return;
    }
    setError(null);
    onSave({ title, description });
  };

  return (
    <View className="p-4 gap-4">
      <Text className="text-xl font-bold text-center">
        {initialData ? "Sửa thói quen" : "Thói quen mới"}
      </Text>
      <TextInput
        mode="outlined"
        label="Title"
        value={title}
        onChangeText={setTitle}
      />
      {/* Q4: Hiển thị cảnh báo code test */}
      {error && <HelperText type="error">{error}</HelperText>}

      <TextInput
        mode="outlined"
        label="Description (Tùy chọn)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <View className="flex-row justify-end gap-2 mt-2">
        <Button mode="outlined" onPress={onCancel}>
          Hủy
        </Button>
        <Button mode="contained" onPress={handleSavePress}>
          Lưu
        </Button>
      </View>
    </View>
  );
};

export default HabitForm;