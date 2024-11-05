import React from "react";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/redux/store";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={styles.safeArea}>
            <AppNavigator />
            <StatusBar style="auto" />
            <Toast refToast={(refToast) => Toast.setRef(refToast)} />
          </SafeAreaView>
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 38,
  },
});
