import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectCartItems,
  selectTotalQuantity,
} from "../redux/cartSlice";
import Toast from "react-native-toast-message";

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const totalQuantity = useSelector(selectTotalQuantity);
  const { currentUser } = useSelector((state) => state.users);
  const cartItems = useSelector(selectCartItems);

  // Stateler
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const increaseQuantity = () => {
    if (quantity < 5) {
      setQuantity((prev) => prev + 1);
    } else {
      Toast.show({
        text1: "Bu üründen en fazla 5 adet alabilirsiniz.",
        type: "error",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = () => {
    const isClothing =
      product.category === "men's clothing" ||
      product.category === "women's clothing";

    if (isClothing && !selectedSize) {
      Toast.show({
        text1: "Lütfen bir beden seçin!",
        position: "top",
        type: "error",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    const totalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (totalQuantity > 5) {
      Toast.show({
        text1: "Maksimum miktara ulaşıldı!",
        text2: "Bu üründen en fazla 5 adet alabilirsiniz.",
        type: "error",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const cartItem = { ...product, size: selectedSize, quantity };
    dispatch(addToCart(cartItem));
    Toast.show({
      text1: "Ürününüz sepete eklendi.",
      text2: `${product.title} ${
        isClothing ? `(${selectedSize})` : ""
      } sepetinize eklendi.`,
      position: "top",
      type: "success",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const handleBuyNow = () => {
    const isClothing =
      product.category === "men's clothing" ||
      product.category === "women's clothing";

    if (isClothing && !selectedSize) {
      Toast.show({
        text1: "Lütfen bir beden seçin!",
        position: "top",
        type: "error",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    const totalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (totalQuantity > 5) {
      Toast.show({
        text1: "Maksimum miktara ulaşıldı!",
        text2: "Bu üründen en fazla 5 adet alabilirsiniz.",
        type: "error",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const cartItem = { ...product, size: selectedSize, quantity };

    // Kullanıcı giriş kontrolü
    if (!currentUser) {
      Toast.show({
        text1: "Öncelikle giriş yapmalısınız!",
        type: "error",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
      });
      navigation.navigate("Login"); // Giriş ekranına yönlendir
      return;
    }

    // Ödeme ekranına yönlendirme
    navigation.navigate("Payment", {
      userId: currentUser.userId, // Kullanıcı ID'sini buradan gönderiyoruz
      items: [{ ...cartItem, size: selectedSize }], // Ürün bilgilerini gönderiyoruz
    });

    Toast.show({
      text1: "Ödeme ekranına yönlendiriliyorsunuz.",
      text2: `${product.title} ${
        isClothing ? `(${selectedSize})` : ""
      } ödeme ekranına yönlendiriliyorsunuz.`,
      position: "top",
      type: "success",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPressIn={() => setIsBackButtonHovered(true)} // Hover etkisi
          onPressOut={() => setIsBackButtonHovered(false)} // Hover etkisini kaldır
          onPress={() => navigation.goBack()}
        >
          <View
            style={
              isBackButtonHovered ? styles.backButtonHovered : styles.backButton
            }
          >
            <Ionicons name="chevron-back" size={24} color="#475569" />
          </View>
        </TouchableOpacity>

        <Text
          style={styles.productTitleHeader}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.title}
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart" size={24} color="#475569" />
          {totalQuantity > 0 && (
            <View style={styles.notificationCircle}>
              <Text style={styles.notificationText}>{totalQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Beden Seçimi */}
          {(product.category === "men's clothing" ||
            product.category === "women's clothing") && (
            <View style={styles.sizeSelectionContainer}>
              <Text style={styles.sizeSelectionTitle}>Beden Seçin:</Text>
              <View style={styles.sizeOptions}>
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeOption,
                      selectedSize === size && styles.selectedSizeOption,
                    ]}
                    onPress={() => handleSizeSelect(size)}
                  >
                    <Text
                      style={[
                        styles.sizeOptionText,
                        selectedSize === size && styles.selectedSizeText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Miktar Kontrolü */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Miktar:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityDisplay}>{quantity}</Text>
              <TouchableOpacity
                onPress={increaseQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.fixedFooter}>
        <Text style={styles.productPrice}>
          ${Number(product.price).toFixed(2)}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Sepete Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buttonText}>Şimdi Al</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
    paddingBottom: 4,
  },
  backButton: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#fff",
  },
  backButtonHovered: {
    padding: 4,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  productTitleHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    padding: 16,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  productInfo: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  sizeSelectionContainer: {
    marginBottom: 20,
  },
  sizeSelectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 8,
  },
  sizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeOption: {
    backgroundColor: "#e0e0e0",
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSizeOption: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  sizeOptionText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
  },
  selectedSizeText: {
    color: "#FFA500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#475569",
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
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
  quantityDisplay: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    width: 40,
    textAlign: "center",
  },
  fixedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    elevation: 2,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  addToCartButton: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  buyNowButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  notificationCircle: {
    position: "absolute",
    right: -1,
    top: -4,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  notificationText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default DetailScreen;
