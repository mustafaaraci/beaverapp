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
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Toast from "react-native-toast-message";

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        text1: "Lütfen bir beden seçin!",
        position: "top",
        type: "error",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const cartItem = { ...product, size: selectedSize };
    dispatch(addToCart(cartItem));
    Toast.show({
      text1: "Ürününüz sepete eklendi.",
      text2: `${product.title} (${selectedSize}) sepetinize eklendi.`,
      position: "top",
      type: "success",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const handleGoToCart = () => {
    navigation.navigate("Cart"); // Sepet ekranına yönlendirme
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
    borderColor: "#333",
  },
  sizeOptionText: {
    fontWeight: "bold",
    color: "#333",
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
