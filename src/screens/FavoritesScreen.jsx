import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { removeFavorite, removeAllFavorites } from "../redux/favoriteSlice";
import { refreshProducts } from "../redux/productSlice";
import Toast from "react-native-toast-message";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  //sayfa yenilemek için
  // const { refreshing } = useSelector((state) => state.products);

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);

    const handleRemoveFavorite = (productId) => {
      dispatch(removeFavorite(productId));
      Toast.show({
        text1: "Ürün favorilerden çıkarıldı!",
        position: "top",
        type: "success",
        visibilityTime: 2000,
        autoHide: true,
      });
    };

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate("Detail", { product: item })}
      >
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <MaterialIcons
              name="favorite"
              size={24}
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
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => navigation.navigate("Detail", { product: item })}
          >
            <Text style={styles.addToCartButtonText}>Ürünü İncele</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  //sayfa yenileme
  // const onRefresh = () => {
  //   dispatch(refreshProducts());
  // };

  const handleRemoveAllFavorites = () => {
    dispatch(removeAllFavorites());
    Toast.show({
      text1: "Tüm favori ürünler kaldırıldı!",
      position: "top",
      type: "success",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  return (
    <View style={styles.container}>
      {favorites.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#475569" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorilerim</Text>
          <TouchableOpacity
            style={styles.removeAllButton}
            onPress={handleRemoveAllFavorites}
          >
            <Text style={styles.removeAllButtonText}>Tümünü Çıkar</Text>
          </TouchableOpacity>
        </View>
      )}

      {favorites.length > 0 && <View style={styles.headerSeparator} />}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessage}>Favori ürün yok </Text>
            <FontAwesome5 name="smile" size={24} color="black" />
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
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          //sayfa yenileme
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          contentContainerStyle={styles.flatListContent}
        />
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
    marginBottom: 48,
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
    paddingRight: 150,
  },
  removeAllButton: {
    backgroundColor: "#ea580c",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  removeAllButtonText: {
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
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
    marginTop: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  productContent: {
    padding: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
    marginTop: 5,
  },
  favoriteIcon: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  priceAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productRating: {
    fontSize: 14,
    marginRight: 5,
  },
  addToCartButton: {
    backgroundColor: "#FFA500",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingTop: 0,
    paddingBottom: 2,
  },
});

export default FavoritesScreen;
