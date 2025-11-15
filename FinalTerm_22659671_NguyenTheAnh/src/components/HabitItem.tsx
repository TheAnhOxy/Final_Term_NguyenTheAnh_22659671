import { Habit } from "@/types/habit";
import React from "react";
import { Pressable, View } from "react-native";
import { Card, Checkbox, IconButton, Text } from "react-native-paper";

type Props = {
  data: Habit;
  onToggle: (id: number) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: number, title: string) => void;
};

const HabitItem = ({ data, onToggle, onEdit, onDelete }: Props) => {
  const isDone = data.done_today === 1;
  const isActive = data.active === 1;

  const cardStyle = {
    backgroundColor: isDone ? "#e8f9f0" : "#ffffff",
    borderLeftWidth: 5,
    borderLeftColor: isDone ? "#2ecc71" : isActive ? "#3498db" : "#bdc3c7",
    elevation: 3,
  };

  return (
    <View className="px-4 my-2">
      <Pressable onPress={() => onToggle(data.id)}>
        <Card style={cardStyle}>
          <View className="flex-row items-center py-3 px-3">

            {/* Checkbox Toggle */}
            <Checkbox
              status={isDone ? "checked" : "unchecked"}
              onPress={() => onToggle(data.id)}
            />

            {/* Text */}
            <View className="flex-1 ml-2">
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "600",
                  textDecorationLine: isDone ? "line-through" : "none",
                  color: isDone ? "#2ecc71" : "#333",
                }}
              >
                {data.title}
              </Text>

              {data.description ? (
                <Text
                  variant="bodySmall"
                  style={{
                    opacity: 0.7,
                    textDecorationLine: isDone ? "line-through" : "none",
                  }}
                >
                  {data.description}
                </Text>
              ) : null}

              {/* Active / Inactive */}
              <Text
                variant="labelSmall"
                style={{
                  marginTop: 2,
                  color: isActive ? "#3498db" : "#888",
                  fontWeight: "600",
                }}
              >
                • {isActive ? "Active" : "Inactive"}
              </Text>
            </View>

            {/* Edit button */}
            <IconButton
              icon="pencil-outline"
              size={22}
              onPress={() => onEdit(data)}
            />

            {/* Delete button */}
            <IconButton
              icon="trash-can-outline"
              iconColor="#e74c3c"
              size={22}
              onPress={() => onDelete(data.id, data.title)}
            />

          </View>
        </Card>
      </Pressable>
    </View>
  );
};

export default React.memo(HabitItem);
