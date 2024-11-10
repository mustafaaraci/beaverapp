import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/userSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Formik } from "formik";
import * as Yup from "yup";
import AntDesign from "@expo/vector-icons/AntDesign";

const Register = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Ad gereklidir"),
    surname: Yup.string().required("Soyadı gereklidir"),
    email: Yup.string()
      .email("Geçersiz e-posta formatı")
      .required("E-posta gereklidir"),
    password: Yup.string()
      .required("Şifre gereklidir")
      .min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
      .required("Şifreyi onaylamak zorunludur"),
  });

  const handleRegister = (values, { resetForm }) => {
    const userData = {
      // name: values.name,
      // surname: values.surname,
      name: values.name.charAt(0).toUpperCase() + values.name.slice(1),
      surname: values.surname.charAt(0).toUpperCase() + values.surname.slice(1),
      email: values.email,
      password: values.password,
    };

    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        setModalMessage(
          `Kayıt işleminiz başarıyla oluşturulmuştur. ${userData.name} ${userData.surname}`
        );
        setModalType("success");
        setModalVisible(true);
        resetForm();

        setTimeout(() => {
          navigation.navigate("Login");
        }, 1500);
      })
      .catch((err) => {
        setModalMessage((err = error || "Bir hata oluştu!"));
        setModalType("error");
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
        }, 1500);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          style={styles.backText}
          name="chevron-back"
          size={24}
          color="#475569"
        />
      </TouchableOpacity>

      <Text style={styles.title}>Kayıt Ol</Text>
      <Formik
        initialValues={{
          name: "",
          surname: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ad"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              placeholderTextColor="#ccc"
              selectionColor="#FFA500"
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Soyadı"
              value={values.surname}
              onChangeText={handleChange("surname")}
              onBlur={handleBlur("surname")}
              placeholderTextColor="#ccc"
              selectionColor="#FFA500"
            />
            {errors.surname && (
              <Text style={styles.error}>{errors.surname}</Text>
            )}

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

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Şifreyi Onayla"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#ccc"
                selectionColor="#FFA500"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <AntDesign
                  name={showConfirmPassword ? "eye" : "eyeo"}
                  size={24}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>
            <View style={styles.loginPromptContainer}>
              <Text style={styles.loginPrompt}>
                Zaten bir hesabınız var mı?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}> Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalType === "success" ? (
              <View style={styles.successModalContent}>
                <Ionicons name="checkmark-circle" size={70} color="green" />
                <Text style={styles.successTitle}>Başarılı!</Text>
                <Text style={styles.modalMessage}>{modalMessage}</Text>
              </View>
            ) : (
              <View style={styles.errorModalContent}>
                <Ionicons name="close-circle" size={70} color="red" />
                <Text style={styles.errorTitle}>Kayıt işlemi hatalı!</Text>
                <Text style={styles.modalMessage}>{error}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Register;

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
  loginPromptContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  successModalContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  errorModalContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalMessage: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
});
