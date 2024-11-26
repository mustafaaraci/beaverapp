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
  fetchContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../redux/contactSlice"; // Redux slice dosyanızın yolu
import Toast from "react-native-toast-message";

const ContactScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { contacts, status } = useSelector((state) => state.contacts);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState({
    _id: null,
    phone: "",
    email: "",
    address: "",
  });

  // Hata mesajları için state
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    dispatch(fetchContacts());
  };

  const validate = () => {
    let valid = true;
    const newErrors = { phone: "", email: "", address: "" };

    // Telefon numarası validasyonu (11 haneli)
    if (!/^\d{11}$/.test(contactData.phone)) {
      newErrors.phone = "Telefon numarası 11 haneli olmalıdır.";
      valid = false;
    }

    // E-posta validasyonu
    if (!/\S+@\S+\.\S+/.test(contactData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin.";
      valid = false;
    }

    // Adres validasyonu (örnek, boş olamaz)
    if (!contactData.address) {
      newErrors.address = "Adres alanı boş bırakılamaz.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const saveContact = () => {
    // Validasyonu kontrol et
    if (!validate()) {
      return; // Geçersizse işlemi durdur
    }

    setLoading(true);
    const action = contactData._id ? updateContact : addContact;
    const payload = contactData._id
      ? { contactId: contactData._id, contactData }
      : contactData;

    dispatch(action(payload))
      .then(() => {
        Toast.show({
          text1: "Başarılı",
          text2: contactData._id
            ? "Bilgileriniz başarıyla güncellendi!"
            : "Bilgileriniz başarıyla eklendi!",
          position: "top",
          type: "success",
          visibilityTime: 2000,
        });
        loadContacts();
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          "Hata",
          error.response?.data?.message ||
            "Bilgileriniz kaydedilirken bir hata oluştu."
        );
      })
      .finally(() => {
        setLoading(false);
        resetForm();
      });
  };

  const resetForm = () => {
    setContactData({ _id: null, phone: "", email: "", address: "" });
    setErrors({ phone: "", email: "", address: "" }); // Hata mesajlarını sıfırla
    setModalVisible(false);
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={20} color="#555" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.contactLabel}>Telefon:</Text>
            <Text style={styles.contactDetail}>{item.phone}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={20} color="#555" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.contactLabel}>E-posta:</Text>
            <Text style={styles.contactDetail}>{item.email}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#555" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.contactLabel}>Adres:</Text>
            <Text style={styles.contactDetail}>{item.address}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => editContact(item)}>
          <Ionicons name="create-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeContact(item)}>
          <Ionicons name="trash-outline" size={24} color="#FF3D00" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const editContact = (contact) => {
    setContactData(contact);
    setModalVisible(true);
  };

  const removeContact = (contact) => {
    const contactId = contact._id;
    Alert.alert(
      "Onayla",
      "Bu bilgileri silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          onPress: () => {
            dispatch(deleteContact(contactId))
              .then(() => {
                Toast.show({
                  text1: "Başarılı",
                  text2: "Bilgileriniz başarıyla silindi!",
                  position: "top",
                  type: "success",
                  visibilityTime: 2000,
                });
                loadContacts();
              })
              .catch(() => {
                Alert.alert("Hata", "Bilgiler silinirken bir hata oluştu.");
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İletişim Bilgilerim</Text>
        {contacts.length === 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={28} color="#FFA500" />
          </TouchableOpacity>
        )}
      </View>

      {status === "loading" ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : contacts.length === 0 ? (
        <Text style={styles.noContactText}>
          İletişim bilgileriniz bulunmamaktadır!
        </Text>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.contactList}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {contactData._id ? "Bilgilerimi Güncelle" : "Bilgilerimi Ekle"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Telefon"
              value={contactData.phone}
              onChangeText={(text) =>
                setContactData({ ...contactData, phone: text })
              }
              keyboardType="phone-pad"
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              value={contactData.email}
              onChangeText={(text) =>
                setContactData({ ...contactData, email: text })
              }
              keyboardType="email-address"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Adres"
              value={contactData.address}
              onChangeText={(text) =>
                setContactData({ ...contactData, address: text })
              }
              keyboardType="default"
            />
            {errors.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveContact}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : contactData._id ? (
                  "Güncelle"
                ) : (
                  "Kaydet"
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContactScreen;

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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  contactList: {
    paddingBottom: 50,
  },
  contactCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderColor: "#FFA500",
    borderWidth: 0.5,
  },
  contactDetails: {
    flex: 1,
    marginRight: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailTextContainer: {
    marginLeft: 10,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  contactDetail: {
    fontSize: 16,
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#FF3D00",
    fontWeight: "bold",
  },
  noContactText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#FF3D00",
    fontSize: 14,
    marginBottom: 10,
  },
});
