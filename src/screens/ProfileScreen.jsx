import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Direkt olarak Login sayfasına yönlendir
    navigation.navigate("Login"); // "Login" sayfasının ismi
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Kullanıcı bilgilerini burada gösterebilirsiniz, ancak bu sayfa hemen yönlendirecek */}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
