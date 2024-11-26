import React, { useEffect } from "react";
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
  const { currentUser } = useSelector((state) => state.users);

  //console kullanıcı
  // console.log("kullanıcı", currentUser);

  const dispatch = useDispatch();
  //sayfa yenilemek için
  // const refreshing = false;

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
  //sepeti temizleme fonksiyonu
  const handleClearCart = () => {
    dispatch(clearCart());
    Toast.show({
      text1: "Sepetinizde bulunan ürünler çıkarıldı!",
      position: "top",
      type: "success",
      visibilityTime: 2000,
      autoHide: true,
    });
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
  //sayfa yenileme
  // const onRefresh = () => {};

  const handleCheckout = () => {
    if (!currentUser) {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      Toast.show({
        text1: "Öncelikle giriş yapmalısınız!",
        type: "error",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      navigation.navigate("Login");
    } else if (cartItems.length === 0) {
      Toast.show({
        text1: "Sepetinizde ürün bulunmuyor.",
        type: "error",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      // Ödeme sayfasına yönlendir
      navigation.navigate("Payment", {
        userId: currentUser.userId,
        items: cartItems, // Sepet içeriğini ödeme sayfasına gönder
      });
    }
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

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={100} color="#ccc" />
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessage}>
              Sepetinizde ürün bulunmamaktadır!
            </Text>
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
          keyExtractor={(item) => `${item.id}-${item.size}`} // Benzersiz anahtar
          //sayfa yenileme
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
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
    backgroundColor: "#f8fafc",
    padding: 20,
    margin: -12,
    marginTop: 0,
    marginBottom: 54,
    //paddingBottom: 20,
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
    flex: 1,
    textAlign: "flex-end",
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
    borderColor: "#FFA500",
    borderWidth: 0.5,
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
