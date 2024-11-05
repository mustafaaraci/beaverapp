import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
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

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const products = useSelector((state) =>
    selectProductsByCategory(state, selectedCategory)
  );

  // const refreshing = useSelector((state) => state.products.refreshing); // Redux'tan refresh durumunu al

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, selectedCategory]);

  // Refresh
  const onRefresh = () => {
    setRefreshing(true);
    setSelectedCategory(null);
    dispatch(refreshProducts()).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Marka, ürün veya kategori ara..."
            placeholderTextColor="#cbd5e1"
            selectionColor="#FFA500"
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

      {/* Kategoriler bileşeni */}
      <View style={styles.categoriesWrapper}>
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {/* FlatList ile ürünleri listele */}
      <FlatList
        style={styles.scrollContainer}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductList
            products={[item]} // Her ürün için tek bir öğe gönderiyoruz
            selectedCategory={selectedCategory}
            navigation={navigation}
          />
        )}
        numColumns={2} // İki sütun
        columnWrapperStyle={styles.columnWrapper} // Sütunlar arasındaki boşluk
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={ProductSlider} // Ürün slider bileşeni
        contentContainerStyle={styles.listContainer}
      />
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
    paddingBottom: 64, // Tab bar ile arada boşluk oluşturmak için
  },
});

export default HomeScreen;
