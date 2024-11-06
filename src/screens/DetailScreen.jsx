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
import { addToCart } from "../redux/cartSlice";
import Toast from "react-native-toast-message";
import { selectCartItems } from "../redux/cartSlice";

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // Sepetteki ürünleri al
  const cartItems = useSelector(selectCartItems);

  const [selectedSize, setSelectedSize] = useState(null);
  // Ürün miktarını tutan state
  const [quantity, setQuantity] = useState(1);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => (prev < 5 ? prev + 1 : prev));
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

    // Sepetteki aynı bedenden ürün sayısını kontrol et
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

  const handleGoToCart = () => {
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#475569" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

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
                    <Text style={styles.sizeOptionText}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

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
          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={handleGoToCart}
          >
            <Text style={styles.buttonText}>Sepete Git</Text>
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
  scrollContainer: {
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 8,
    marginBottom: 16,
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
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSizeOption: {
    backgroundColor: "#FFA500",
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  sizeOptionText: {
    fontWeight: "bold",
    color: "#333",
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
});

export default DetailScreen;
