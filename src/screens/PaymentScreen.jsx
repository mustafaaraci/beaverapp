import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentIntent, resetPaymentState } from "../redux/paymentSlice";
import { addMyOrder } from "../redux/orderSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { fetchAddresses } from "../redux/addressSlice";
import { clearCart } from "../redux/cartSlice";

const PaymentScreen = ({ navigation, route }) => {
  const { userId, items } = route.params;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const { loading } = useSelector((state) => state.payment);
  const { addresses } = useSelector((state) => state.addresses);
  const { confirmPayment } = useStripe();

  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cardDetails, setCardDetails] = useState();
  const [addressError, setAddressError] = useState(null);
  const [cardError, setCardError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [loadingPayment, setLoadingPayment] = useState(false);

  const cartItems = items || useSelector((state) => state.cart.items);

  useEffect(() => {
    // Adresleri yükle
    dispatch(fetchAddresses());
  }, [dispatch]);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const totalAmount = useMemo(() => parseFloat(calculateTotal()), [cartItems]);

  const validateInputs = () => {
    let isValid = true;

    if (!currentUser) {
      Alert.alert("Ödeme Hatası", "Kullanıcı bulunamadı.");
      isValid = false;
    }

    if (!totalAmount || totalAmount <= 0) {
      Alert.alert("Ödeme Hatası", "Geçersiz tutar.");
      isValid = false;
    }

    //hatayı custom çözüm sıkıntılı bir durum var burda
    if (!cardDetails?.complete == Boolean) {
      setCardError("Lütfen kart bilgilerini giriniz.");
      isValid = false;
    }

    if (!selectedAddress && !address) {
      setAddressError("Lütfen teslimat adresinizi seçin veya girin.");
      isValid = false;
    }

    return isValid;
  };

  const handleCardChange = (cardDetails) => {
    setCardDetails(cardDetails);

    if (cardDetails?.complete) {
      setCardError(null);
    } else {
      setCardError("Lütfen kart bilgilerini eksiksiz girin.");
    }
  };

  const startPaymentProcess = async () => {
    setAddressError(null);
    setCardError(null);

    if (!validateInputs()) {
      return;
    }
    setLoadingPayment(true); //ödeme başladıgında Loading durumunu aktif hale getir

    const paymentIntentResponse = await dispatch(
      createPaymentIntent({ amount: totalAmount, userId })
    );

    if (paymentIntentResponse.error) {
      Alert.alert("Ödeme Hatası", paymentIntentResponse.error.message);
      return;
    }

    const { clientSecret } = paymentIntentResponse.payload;

    const { error: paymentError, paymentIntent } = await confirmPayment(
      clientSecret,
      {
        paymentMethod: {
          card: cardDetails,
          billingDetails: {
            email: currentUser.email,
            address: { line1: selectedAddress || address }, //burada ikisinden biri
          },
        },
        paymentMethodType: "Card",
      }
    );
    setLoadingPayment(false); // İşlem tamamlandığında loading durumunu kapat
    if (paymentError) {
      Alert.alert(
        "Ödeme Hatası",
        paymentError.message || "Bilinmeyen bir hata oluştu."
      );
      return;
    }

    if (paymentIntent) {
      handleSuccessfulPayment(paymentIntent);
    }
  };

  const handleSuccessfulPayment = (paymentIntent) => {
    const ordersData = {
      id: paymentIntent.id,
      items: cartItems,
      total: totalAmount,
      address: selectedAddress || address,
      createdAt: new Date().toISOString(),
      userId: currentUser.userId,
    };

    dispatch(addMyOrder(ordersData)).then(() => {
      dispatch(clearCart()); // sepetteki ürünleri sıfırla opsiyonel
      setModalVisible(true);
      fadeIn();
      setTimeout(() => {
        navigation.navigate("MyOrders");
        dispatch(resetPaymentState());
      }, 3000);
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>
          ${item.price.toFixed(2)} x {item.quantity}
        </Text>
        {item.size && <Text style={styles.sizeText}>Beden: {item.size}</Text>}
        <Text style={styles.totalPriceText}>
          Toplam: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
  // gelen adres bölümü
  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => {
        setSelectedAddress(item.address);
        setAddressError(null);
      }}
    >
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setSelectedAddress(
              item.address === selectedAddress ? null : item.address
            );
          }}
        >
          {item.address === selectedAddress && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#28a745"
              style={styles.tickIcon}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.addressText}>{item.address}</Text>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Ödeme</Text>
      </View>
      {/* Ürünler Listesi */}
      <Text style={styles.sectionTitle}>Alışveriş Sepeti</Text>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        //keyExtractor={(item) => item.id.toString()}
        keyExtractor={(item) => `${item.id}-${item.size}`.toString()} // Benzersiz anahtar
        contentContainerStyle={styles.cartList}
      />
      {/* Toplam Tutar */}
      <Text style={styles.totalText}>
        Toplam Ödeme: ${totalAmount.toFixed(2)}
      </Text>

      {/* kayıtlı adres
      <View style={styles.addressSection}>
        <Text style={styles.sectionTitle}>Kayıtlı Adresler</Text>
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.addressList}
          style={{ maxHeight: 80 }}
        /> */}

      {/* Kayıtlı adresler */}
      <View style={styles.addressSection}>
        <Text style={styles.sectionTitle}>Kayıtlı Adresler</Text>
        {addresses.length === 0 ? (
          <Text style={styles.noAddressText}>
            Kayıtlı adresiniz bulunmamaktadır!
          </Text>
        ) : (
          <FlatList
            data={addresses}
            renderItem={renderAddressItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.addressList}
            style={{ maxHeight: 80 }}
          />
        )}

        {/* teslimat adresi */}
        <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
        <View style={styles.addressInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Teslimat Adresinizi Girin"
            value={selectedAddress || address}
            onChangeText={(text) => {
              setAddress(text);
              setSelectedAddress(null);
              if (text) setAddressError(null);
            }}
            selectionColor="#FFA500"
          />
          {addressError && <Text style={styles.errorText}>{addressError}</Text>}
        </View>
      </View>

      {/* kart bilgileri */}
      <Text style={styles.sectionTitle}>Kart Bilgileri</Text>
      <CardField
        style={styles.cardField}
        postalCodeEnabled={false}
        placeholders={"4242 4242 4242 4242"}
        onCardChange={handleCardChange}
      />
      {cardError && <Text style={styles.errorText}>{cardError}</Text>}
      <TouchableOpacity style={styles.payButton} onPress={startPaymentProcess}>
        <Text style={styles.payButtonText}>Şimdi Öde</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalText}>Ödeme Başarılı!</Text>
            <Text style={styles.modalText}>
              Siparişiniz başarılı bir şekilde oluşturuldu.
            </Text>
          </Animated.View>
        </View>
      </Modal>
      {loadingPayment && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Ödeme yapılıyor...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingRight: 150,
    marginLeft: -5,
  },
  backButton: {
    right: 8,
  },

  sectionTitle: {
    marginTop: 0,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  addressItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noAddressText: {
    color: "gray",
    textAlign: "center",
  },
  addressList: { marginBottom: 10 },
  cartList: { marginBottom: 16 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: { flex: 1 },
  productTitle: { fontSize: 16, color: "#333" },
  productPrice: { fontSize: 14, color: "#666" },
  totalPriceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500",
    textAlign: "right",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  cardField: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  payButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  payButtonText: { color: "#fff", fontWeight: "bold" },
  errorText: { textAlign: "center", color: "red", marginTop: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    width: 260,
    height: 220,
    backgroundColor: "#28a745",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  // yeni
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checked: {
    width: 16,
    height: 16,
    backgroundColor: "#28a745",
  },
  addressText: {
    fontSize: 14,
    color: "#333",
  },
  addressInputContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default PaymentScreen;
