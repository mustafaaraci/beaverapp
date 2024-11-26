import React from "react";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/redux/store";
import Toast from "react-native-toast-message";
import { StripeProvider } from "@stripe/stripe-react-native";
export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StripeProvider publishableKey="pk_test_51OBCUXKosyg0UiB5kyGhTnMUi3XPztqcim9MiSAuRWfceCpqJQI6VN4a1IS1UisiWAZzG4WXgcSWQJrUckbt2fwG00JVW9hHrj">
            <SafeAreaView style={styles.safeArea}>
              <AppNavigator />
              <StatusBar
                style="auto"
                barStyle="light-content" // Yazı rengini beyaz yapmak için
                backgroundColor="#fff" // Durum çubuğu arka plan rengi
              />
              <Toast refToast={(refToast) => Toast.setRef(refToast)} />
            </SafeAreaView>
          </StripeProvider>
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
