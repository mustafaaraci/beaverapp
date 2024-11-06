import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const refreshing = false;

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
    Toast.show({
      text1: "Ürün sepetten çıkarıldı!",
      position: "top",
      type: "success",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const handleClearCart = () => {
    Alert.alert(
      "Sepeti Temizle",
      "Sepeti temizlemek istediğinizden emin misiniz?",
      [
        { text: "Hayır", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            dispatch(clearCart());
            Toast.show({
              text1: "Sepetinizde bulunan ürünler çıkarıldı!",
              position: "top",
              type: "success",
              visibilityTime: 2000,
              autoHide: true,
            });
          },
        },
      ]
    );
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(increaseQuantity(item));
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(decreaseQuantity(item));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const renderItem = ({ item }) => {
    const totalPrice = (item.price * item.quantity).toFixed(2);

    return (
      <View style={styles.cartItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Detail", { product: item })}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { product: item })}
          >
            <Text style={styles.productTitle}>
              {item.title}
              {item.size && ` (${item.size})`}
            </Text>
          </TouchableOpacity>
          {item.size && (
            <Text style={styles.sizeInfoText}>Beden Seçimi: {item.size}</Text>
          )}
          <Text style={styles.productPrice}>
            ${item.price.toFixed(2)} x {item.quantity}
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleDecreaseQuantity(item)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => handleIncreaseQuantity(item)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.totalPriceText}>
              Toplam Fiyat: ${totalPrice}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item)}
              style={styles.removeButton}
            >
              <MaterialIcons style={styles.removeButtonText} name="delete" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = () => {};

  const handleCheckout = () => {
    // Sepeti al butonuna tıklanınca gösterilecek toast mesajı
    Toast.show({
      text1: "Şuan Kullanılamıyor!",
      position: "top",
      type: "info",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  return (
    <View style={styles.container}>
      {cartItems.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#475569" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sepetim</Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Sepeti Temizle</Text>
          </TouchableOpacity>
        </View>
      )}

      {cartItems.length > 0 && <View style={styles.headerSeparator} />}

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessage}>
              Sepetinizde ürün bulunmamaktadır!
            </Text>
            <MaterialIcons
              name="remove-shopping-cart"
              size={24}
              color="black"
              style={styles.emptyIcon}
            />
          </View>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.continueShoppingButtonText}>
              Alışverişe Devam Et
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id + item.size}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Toplam Sepet: ${calculateTotal()}
          </Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.buttonText}>Sepeti Al</Text>
          </TouchableOpacity>
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
    margin: -8,
    marginTop: 0,
    marginBottom: 54,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingRight: 170,
  },
  clearButton: {
    backgroundColor: "#ea580c",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerSeparator: {
    height: 1,
    backgroundColor: "#FFA500",
    marginBottom: 0,
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    marginRight: 8,
  },
  emptyIcon: {
    alignSelf: "center",
  },
  continueShoppingButton: {
    backgroundColor: "#FFA500",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  continueShoppingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 5,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sizeInfoText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    width: 100,
    justifyContent: "center",
  },
  quantityButton: {
    backgroundColor: "#fff",
    borderColor: "#FFA500",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 8,
    width: 30,
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#FFA500",
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 14,
    alignSelf: "flex-end",
  },
  removeButtonText: {
    color: "#7D7D7D",
    fontWeight: "bold",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500",
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingTop: 0,
    paddingBottom: 2,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
    marginLeft: -100,
  },
});

export default CartScreen;
