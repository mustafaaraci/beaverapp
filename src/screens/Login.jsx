import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Formik } from "formik";
import * as Yup from "yup";
import AntDesign from "@expo/vector-icons/AntDesign";

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error, currentUser } = useSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Geçersiz e-posta adresi")
      .required("E-posta gereklidir"),
    password: Yup.string()
      .required("Şifre gereklidir")
      .min(6, "Şifre en az 6 karakter olmalıdır"),
  });

  const handleLogin = (values, { resetForm }) => {
    const userData = { email: values.email, password: values.password };
    dispatch(loginUser(userData))
      .unwrap()
      .then(() => {
        setModalVisible(true);
        resetForm();
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate("Home");
        }, 1500);
      })
      .catch((err) => {
        setErrorMessage(err);
        setErrorModalVisible(true);
        setTimeout(() => {
          setErrorModalVisible(false);
        }, 1500);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Ionicons
          style={styles.backText}
          name="chevron-back"
          size={24}
          color="#475569"
        />
      </TouchableOpacity>

      <Text style={styles.title}>Giriş Yap</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          resetForm,
        }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              selectionColor="#FFA500"
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry={!showPassword}
                placeholderTextColor="#ccc"
                selectionColor="#FFA500"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <AntDesign
                  name={showPassword ? "eye" : "eyeo"}
                  size={24}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Şifremi Unuttum?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  setErrorMessage("");
                  resetForm();
                  navigation.navigate("Register");
                }}
              >
                <Text style={styles.registerText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      {/* Başarı Modal Bileşeni */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successModalContent}>
              <Ionicons name="checkmark-circle" size={70} color="green" />
              <Text style={styles.modalTitle}>Giriş Başarılı</Text>
              <Text style={styles.modalMessage}>
                Hoş geldiniz, {currentUser?.name} {currentUser?.surname}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hata Modal Bileşeni */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => {
          setErrorModalVisible(false);
          setErrorMessage("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.errorModalContent}>
              <Ionicons name="close-circle" size={70} color="red" />
              <Text style={styles.modalTitle}>Giriş Hatası!</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    marginRight: 3,
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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 30,
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  forgotPassword: {
    color: "#FFA500",
    fontWeight: "bold",
    textAlign: "center",
  },
  registerButton: {
    alignItems: "center",
  },
  registerText: {
    color: "#FFA500",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  successModalContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  errorModalContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
