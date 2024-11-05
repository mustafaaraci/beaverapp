import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoriteSlice";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 22) / 2;
const CARD_HEIGHT = 240;

const ProductList = ({ products, selectedCategory, navigation }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites); // Favori ürünleri al

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleToggleFavorite = (product) => {
    dispatch(toggleFavorite(product)); // Favori durumunu değiştirmek için dispatch

    // Favori durumu kontrolü
    const isFavorite = favorites.some((fav) => fav.id === product.id);

    Toast.show({
      text1: isFavorite
        ? "Ürün favorilerden çıkarıldı!"
        : "Ürün favorilere eklendi!",
      type: "success",
      position: "top",
      visibilityTime: 1000,
      autoHide: true,
    });
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id); // Favori olup olmadığını kontrol et

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate("Detail", { product: item })}
      >
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => handleToggleFavorite(item)}
          >
            <MaterialIcons
              name="favorite"
              size={25}
              color={isFavorite ? "#FFA500" : "#cbd5e1"}
            />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productContent}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.priceAndRating}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.productRating}>{item.rating.rate}</Text>
              <Text style={styles.starRating}>
                {Array(Math.round(item.rating.rate)).fill("⭐").join("")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // id'yi string'e çevir
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 0,
    marginTop: -10,
  },
  listContainer: {
    paddingBottom: 24,
    marginBottom: 24,
  },
  columnWrapper: {
    justifyContent: "center",
    marginVertical: 14,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 6,
    marginTop: -10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 0,
  },
  favoriteIcon: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  productImage: {
    width: "100%",
    height: 130,
    resizeMode: "contain",
  },
  productContent: {
    padding: 12,
    flex: 1,
    justifyContent: "space-evenly",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#475569",
  },
  priceAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    color: "#FFA500",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productRating: {
    fontSize: 10,
    color: "#FFA500",
    fontWeight: "bold",
  },
  starRating: {
    fontSize: 8,
    color: "#FFA500",
  },
});

export default ProductList;
