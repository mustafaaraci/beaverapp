import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/userSlice"; // loginUser thunk'ını içe aktar

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.users); // Kullanıcı durumunu al

  // Hata yönetimi
  useEffect(() => {
    if (error) {
      Alert.alert("Giriş Hatası", error);
      dispatch(clearError()); // Hata mesajını temizlemek için
    }
  }, [error, dispatch]);

  const handleLogin = () => {
    if (email && password) {
      // userData nesnesini oluştur
      const userData = {
        email,
        password,
      };

      dispatch(loginUser(userData)) // userData'yı gönder
        .unwrap()
        .then((data) => {
          Alert.alert(
            "Giriş Başarılı",
            `Hoş geldiniz, ${data.username || email}!`
          );
          // Başarılı giriş sonrası yönlendirme
          navigation.navigate("Home"); // Ana sayfanıza yönlendirin
        })
        .catch((err) => {
          Alert.alert("Giriş Hatası", err); // Hata mesajı göster
        });
    } else {
      Alert.alert("Hata", "Kullanıcı adı ve şifre gereklidir.");
    }
  };

  return (
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ccc"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#ccc"
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Yükleniyor..." : "Giriş Yap"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Şifremi Unuttum?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 30,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 10,
    color: "#FFA500",
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 18,
  },
});
