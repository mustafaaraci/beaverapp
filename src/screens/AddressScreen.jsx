import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
} from "../redux/addressSlice";
import Toast from "react-native-toast-message";

const AddressScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { addresses, status } = useSelector((state) => state.addresses);
  const { currentUser } = useSelector((state) => state.users);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressData, setAddressData] = useState({
    name: "",
    surname: "",
    phone: "",
    address: "",
    city: "",
    addressType: "home",
    userId: currentUser.userId,
  });

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAddresses()).finally(() => setLoading(false));
  }, [dispatch, navigation]);

  const addNewAddress = () => {
    const { name, surname, address, city, phone, userId } = addressData;

    if (!name || !surname || !address || !city || !phone) {
      Alert.alert("Hata", "Tüm alanlar doldurulmalıdır.");
      return;
    }

    setLoading(true);
    dispatch(addAddress({ ...addressData, userId }))
      .then(() => {
        Toast.show({
          text1: "Başarılı",
          text2: "Adres başarıyla eklendi!",
          position: "top",
          type: "success",
          visibilityTime: 2000,
        });
        resetForm();
        setModalVisible(false);
      })
      .catch((err) => {
        Alert.alert("Hata", "Adres eklenirken bir hata oluştu.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const openUpdateModal = (address) => {
    setSelectedAddress(address);
    setAddressData({
      name: address.name,
      surname: address.surname,
      phone: address.phone,
      address: address.address,
      city: address.city,
      addressType: address.addressType,
      userId: currentUser.userId,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const updateExistingAddress = () => {
    const { name, surname, address, city, phone } = addressData;

    if (!name || !surname || !address || !city || !phone) {
      Alert.alert("Hata", "Tüm alanlar doldurulmalıdır.");
      return;
    }

    setLoading(true);
    dispatch(updateAddress({ id: selectedAddress._id, addressData }))
      .then(() => {
        Toast.show({
          text1: "Başarılı",
          text2: "Adres başarıyla güncellendi!",
        });
        resetForm();
        setModalVisible(false);
      })
      .catch((err) => {
        Alert.alert("Hata", "Adres güncellenirken bir hata oluştu.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setAddressData({
      name: "",
      surname: "",
      phone: "",
      address: "",
      city: "",
      addressType: "home",
      userId: currentUser.userId,
    });
    setIsEditing(false);
    setSelectedAddress(null);
  };

  const removeAddress = (address) => {
    const addressId = address._id;

    Alert.alert(
      "Onayla",
      "Bu adresi silmek istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          onPress: () => console.log("Silme iptal edildi"),
          style: "cancel",
        },
        {
          text: "Sil",
          onPress: () => {
            setRemoveLoading((prev) => ({ ...prev, [addressId]: true }));

            dispatch(deleteAddress(addressId))
              .then(() => {
                Toast.show({
                  text1: "Başarılı",
                  text2: "Adres başarıyla silindi!",
                  position: "top",
                  type: "success",
                  visibilityTime: 2000,
                });
              })
              .catch((err) => {
                Alert.alert("Hata", "Adres silinirken bir hata oluştu.");
                console.error(err);
              })
              .finally(() => {
                setRemoveLoading((prev) => ({ ...prev, [addressId]: false }));
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressCard}>
      <Text style={styles.addressText}>
        {item.addressType === "home" ? (
          <Ionicons name="home-outline" size={20} color="#555" />
        ) : (
          <Ionicons name="business-outline" size={20} color="#555" />
        )}
        {item.addressType === "home" ? " Ev Adresi" : " İş Adresi"}
      </Text>

      <View style={styles.addressDetailContainer}>
        <Text style={styles.label}>İsim:</Text>
        <Text style={styles.addressDetail}>{item.name}</Text>
      </View>

      <View style={styles.addressDetailContainer}>
        <Text style={styles.label}>Soyisim:</Text>
        <Text style={styles.addressDetail}>{item.surname}</Text>
      </View>

      <View style={styles.addressDetailContainer}>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.addressDetail}>{item.phone}</Text>
      </View>

      <View style={styles.addressDetailContainer}>
        <Text style={styles.label}>Adres:</Text>
        <Text style={styles.addressDetail}>
          {item.address}, {item.city}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openUpdateModal(item)}
      >
        <Ionicons name="create-outline" size={24} color="#007BFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeAddress(item)}
        disabled={removeLoading[item._id] || false}
      >
        {removeLoading[item._id] ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="trash-outline" size={24} color="red" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adres Bilgilerim</Text>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={28} color="#FFA500" />
        </TouchableOpacity>
      </View>

      {status === "loading" ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : addresses.length === 0 ? (
        <Text style={styles.noAddressText}>
          Adres kaydınız bulunmamaktadır!
        </Text>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.addressList}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Adres Güncelle" : "Yeni Adres Ekle"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ad"
              value={addressData.name}
              onChangeText={(text) =>
                setAddressData({ ...addressData, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Soyad"
              value={addressData.surname}
              onChangeText={(text) =>
                setAddressData({ ...addressData, surname: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Telefon"
              value={addressData.phone}
              onChangeText={(text) =>
                setAddressData({ ...addressData, phone: text })
              }
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Şehir"
              value={addressData.city}
              onChangeText={(text) =>
                setAddressData({ ...addressData, city: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Adres"
              value={addressData.address}
              onChangeText={(text) =>
                setAddressData({ ...addressData, address: text })
              }
            />

            <View style={styles.addressTypeContainer}>
              <TouchableOpacity
                onPress={() =>
                  setAddressData({ ...addressData, addressType: "home" })
                }
                style={[
                  styles.typeButton,
                  addressData.addressType === "home" &&
                    styles.selectedTypeButton,
                ]}
              >
                <Text
                  style={
                    addressData.addressType === "home" &&
                    styles.selectedTypeButtonText
                  }
                >
                  Ev
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setAddressData({ ...addressData, addressType: "work" })
                }
                style={[
                  styles.typeButton,
                  addressData.addressType === "work" &&
                    styles.selectedTypeButton,
                ]}
              >
                <Text
                  style={
                    addressData.addressType === "work" &&
                    styles.selectedTypeButtonText
                  }
                >
                  İş
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={isEditing ? updateExistingAddress : addNewAddress}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : isEditing ? (
                  "Güncelle"
                ) : (
                  "Kaydet"
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addressCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "flex-start",
    borderColor: "#FFA500",
    borderWidth: 0.5,
  },
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  addressDetailContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  addressDetail: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
    width: 300,
  },
  editButton: {
    position: "absolute",
    right: 50,
    top: 16,
  },
  deleteButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  noAddressText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  addressTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedTypeButton: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  selectedTypeButtonText: {
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddressScreen;
