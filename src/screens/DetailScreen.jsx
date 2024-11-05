import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();

  const handleAddToCart = () => {
    Alert.alert("Sepete Eklendi", `${product.title} sepete eklendi!`);
  };

  const handleBuyNow = () => {
    Alert.alert(
      "Şimdi Al",
      `${product.title} için ödeme sayfasına yönlendiriliyorsunuz!`
    );
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

          {/* Beden Seçim Alanı */}
          <View style={styles.sizeSelectionContainer}>
            <Text style={styles.sizeSelectionTitle}>Beden Seçin:</Text>
            <View style={styles.sizeOptions}>
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <TouchableOpacity key={size} style={styles.sizeOption}>
                  <Text style={styles.sizeOptionText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.fixedFooter}>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
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
    backgroundColor: "#28a745", // Yeşil renk
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
    top: 20, // Yukarıdan uzaklık
    left: 10, // Soldan uzaklık
    zIndex: 1, // Diğer bileşenlerin üstünde görünmesi için
  },
});

export default DetailScreen;
