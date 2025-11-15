import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { Stack } from "expo-router";
import { Text, View } from "react-native"; // Thêm View
import { SQLiteProvider } from "expo-sqlite";
import { initDatabaseAndSeed } from "@/db";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  ActivityIndicator, // Thêm ActivityIndicator
} from "react-native-paper";
import { Suspense } from "react"; // 1. Thêm import Suspense

// Component Fallback để hiển thị khi database đang load
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator animating={true} size="large" />
    <Text style={{ marginTop: 10 }}>Loading Database...</Text>
  </View>
);

export default function Layout() {
  return (
    // 2. Bọc toàn bộ Provider bằng <Suspense>
    <Suspense fallback={<LoadingFallback />}>
      {/* Q1: Cài đặt SQLiteProvider */}
      <SQLiteProvider databaseName="habits.db" onInit={initDatabaseAndSeed}>
        <PaperProvider theme={MD3LightTheme}>
          <SafeAreaProvider>
            <SafeAreaView className="flex flex-1 bg-white">
              <Text className="text-3xl text-center font-bold mt-2">
                Habit Tracker
              </Text>

              {/* Dùng Stack thay vì Tabs cho đơn giản theo đề bài */}
              {/* 3. Stack sẽ chỉ render SAU KHI onInit hoàn tất */}
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </SQLiteProvider>
    </Suspense>
  );
}