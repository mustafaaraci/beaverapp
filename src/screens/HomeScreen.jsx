import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import ProductSlider from "../components/ProductSlider";
import Fontisto from "@expo/vector-icons/Fontisto";
import ProductList from "../components/ProductList";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  selectProductsByCategory,
  refreshProducts,
} from "../redux/productSlice";
import { useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const products = useSelector((state) =>
    selectProductsByCategory(state, selectedCategory)
  );
  const { status } = useSelector((state) => state.products);

  // Ürünleri yükle
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    setSelectedCategory(null);
    dispatch(refreshProducts()).finally(() => {
      setRefreshing(false);
    });
  };
  // Filtrelenmiş ürünler
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  //geri butonu arama ekranı
  const handleBack = () => {
    setSearchTerm("");
    setSelectedCategory(null); // Kategoriyi sıfırla
    Keyboard.dismiss(); // Klavyeyi kapat
  };

  // Arama input kontrolu metin silindiğinde geri butonunu gizle ve klavyeyi kapat
  const handleSearchInputChange = (text) => {
    setSearchTerm(text);
    if (text === "") {
      handleBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFA500" />
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Marka, ürün veya kategori ara..."
            placeholderTextColor="#cbd5e1"
            selectionColor="#FFA500"
            value={searchTerm}
            // onChangeText={setSearchTerm}
            onChangeText={handleSearchInputChange}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#FFA500" />
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFA500" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Fontisto name="email" size={24} color="#FFA500" />
          </TouchableOpacity>
        </View>
      </View>

      {!searchTerm && (
        <View style={styles.categoriesWrapper}>
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      )}

      {status === "loading" ? (
        <ActivityIndicator
          size="large"
          color="#FFA500"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          style={styles.scrollContainer}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()} // Benzersiz anahtar
          renderItem={({ item }) => (
            <ProductList
              products={[item]}
              selectedCategory={selectedCategory}
              navigation={navigation}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            !searchTerm && (
              <View style={styles.sliderContainer}>
                <ProductSlider />
              </View>
            )
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>Ürün bulunamadı!</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "orange",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
  backButton: {
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#334155",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  searchButton: {
    padding: 10,
  },
  categoriesWrapper: {
    height: 60,
    overflow: "hidden",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
    gap: 7,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 7,
    width: "18%",
  },
  scrollContainer: {
    marginTop: -10,
    width: "100%",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  listContainer: {
    paddingBottom: 64,
    paddingTop: 10,
  },
  sliderContainer: {
    margin: -5,
    marginBottom: 1,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#7D7D7D",
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default HomeScreen;
