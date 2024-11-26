import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logoutUser } from "../redux/userSlice";
import Ionicons from "@expo/vector-icons/Ionicons";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const ProfileScreen = () => {
  const { currentUser } = useSelector((state) => state.users);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Eğer kullanıcı yoksa hiçbir şey gösterme
  if (!currentUser) {
    return null;
  }

  // Çıkış işlemi
  const handleLogout = () => {
    setLoading(true);
    setLogoutModalVisible(true);
    setTimeout(() => {
      setLogoutModalVisible(false);
      navigation.navigate("Home");
      dispatch(logoutUser());
      setLoading(false);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: currentUser.profileImage }}
            style={styles.profileImage}
          />
          <Ionicons
            name="person-circle"
            size={50}
            color="#FFA500"
            style={styles.userIcon}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {capitalizeFirstLetter(currentUser.name)}{" "}
            {capitalizeFirstLetter(currentUser.surname)}
          </Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
        </View>

        {/* İkonlar sağ üst kısım */}
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFA500" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mail-outline" size={24} color="#FFA500" />
          </TouchableOpacity>
        </View>
      </View>

      {/* card kısmı */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ContactInfo")}
      >
        <Ionicons name="call" size={24} color="#FFA500" />
        <Text style={styles.cardText}>İletişim Bilgilerim</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Address")}
      >
        <Ionicons name="location-outline" size={24} color="#FFA500" />
        <Text style={styles.cardText}>Adres Bilgilerim</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("MyOrders")}
      >
        <Ionicons name="cart" size={24} color="#FFA500" />
        <Text style={styles.cardText}>Siparişlerim</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#FFA500" />
        <Text style={styles.cardText}>Teslim Edilen Ürünler</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Ionicons name="card" size={24} color="#FFA500" />
        <Text style={styles.cardText}>Ödeme Yöntemlerim</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successModalContent}>
              <Ionicons name="checkmark-circle" size={70} color="green" />
              <Text style={styles.modalTitle}>Çıkış Başarılı</Text>
              <Text style={styles.modalMessage}>Çıkış işlemi yapıldı.</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFA500",
    marginRight: 20,
  },
  userIcon: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
    marginTop: 0,
    marginLeft: -10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: -5,
  },
  userEmail: {
    fontSize: 13,
    color: "#555",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FFA500",
    borderRadius: 30,
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
