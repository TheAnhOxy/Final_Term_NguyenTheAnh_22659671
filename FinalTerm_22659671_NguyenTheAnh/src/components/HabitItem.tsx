// components/HabitItem.tsx
import { Habit } from "@/types/habit";
import React from "react";
import { View } from "react-native";
import { Card, Checkbox, Icon, IconButton, Text } from "react-native-paper";

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
    backgroundColor: isDone ? "#e0f7ec" : "#ffffff",
    borderLeftWidth: 5,
    borderLeftColor: isDone ? "#2ecc71" : isActive ? "#3498db" : "#bdc3c7",
    elevation: 3,
  };

  return (
    <View className="px-4 my-2">
      <Card style={cardStyle}>
        <View className="flex-row items-center py-2 px-3">

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
              }}
            >
              {data.title}
            </Text>

            {data.description ? (
              <Text
                variant="bodySmall"
                style={{ opacity: 0.7 }}
              >
                {data.description}
              </Text>
            ) : null}

            {/* Active / Inactive label */}
            <View className="mt-1">
              {isActive ? (
                <Text
                  variant="labelSmall"
                  style={{
                    color: "#3498db",
                    fontWeight: "600",
                  }}
                >
                  • Active
                </Text>
              ) : (
                <Text
                  variant="labelSmall"
                  style={{
                    color: "gray",
                    fontWeight: "600",
                  }}
                >
                  • Inactive
                </Text>
              )}
            </View>
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
    </View>
  );
};

export default React.memo(HabitItem);
