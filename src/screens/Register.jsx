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
import { registerUser, clearError } from "../redux/userSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  const { loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // Hata yönetimi
  useEffect(() => {
    if (error) {
      Alert.alert("Kayıt Hatası", error);
      dispatch(clearError()); // Hata mesajını temizlemek için
    }
  }, [error, dispatch]);

  const handleRegister = () => {
    if (username && lastname && email && password && confirmPassword) {
      if (password === confirmPassword) {
        // E-posta formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Alert.alert("Hata", "Geçersiz e-posta formatı.");
          return;
        }

        // userData nesnesini oluştur
        const userData = {
          username, // kullanıcı adı
          lastname, // soyadı
          email, // e-posta
          password, // şifre
        };

        dispatch(registerUser(userData)) // userData'yı gönder
          .unwrap()
          .then(() => {
            Alert.alert(
              "Kayıt Başarılı",
              `Hoş geldiniz, ${username} ${lastname}!`
            );
            navigation.navigate("Login"); // Kayıttan sonra giriş ekranına yönlendir
          })
          .catch((err) => {
            Alert.alert("Kayıt Hatası", err || "Bir hata oluştu."); // Hata mesajı göster
          })
          .finally(() => {
            // Formu temizle
            setUsername("");
            setLastname("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          });
      } else {
        Alert.alert("Hata", "Şifreler eşleşmiyor.");
      }
    } else {
      Alert.alert("Hata", "Tüm alanları doldurun.");
    }
  };

  return (
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Soyadı"
          value={lastname}
          onChangeText={setLastname}
          placeholderTextColor="#ccc"
        />
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
        <TextInput
          style={styles.input}
          placeholder="Şifreyi Onayla"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#ccc"
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Yükleniyor..." : "Kaydol"}
        </Text>
      </TouchableOpacity>
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPrompt}>Zaten bir hesabınız var mı?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}> Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Register;

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
  loginPromptContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  loginPrompt: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFA500",
  },
});
