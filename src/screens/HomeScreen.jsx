import React, { useState, useEffect } from "react";
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

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const products = useSelector((state) =>
    selectProductsByCategory(state, selectedCategory)
  );

  useEffect(() => {
    // Yükleme durumu
    dispatch(fetchProducts()).then(() => setLoading(false));
  }, [dispatch, selectedCategory]);

  // Refresh
  const onRefresh = () => {
    setRefreshing(true);
    setSelectedCategory(null);
    dispatch(refreshProducts()).finally(() => {
      setRefreshing(false);
    });
  };

  // Ürünleri arama terimine göre filtrele
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Arama butonuna tıklandığında filtrelenmiş ürünleri göster
  const handleSearch = () => {
    if (searchTerm) {
      console.log("Arama Yapılıyor:", searchTerm);
    } else {
      console.log("Tüm ürünler gösteriliyor.");
    }
  };

  // Geri butonuna basıldığında arama terimini sıfırla
  const handleBack = () => {
    setSearchTerm("");
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
            onChangeText={setSearchTerm} // Arama terimini güncelle
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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

      {/* Kategoriler bileşeni, yalnızca arama yapılmadığında görünür */}
      {!searchTerm && (
        <View style={styles.categoriesWrapper}>
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      )}

      {/* FlatList ile ürünleri listele */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFA500"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          style={styles.scrollContainer}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductList
              products={[item]} // Her ürün için tek bir öğe gönderiyoruz
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
    paddingBottom: 64, // Tab bar ile arada boşluk oluşturmak için
    paddingTop: 10, // Kategorilerden aşağıda başlaması için boşluk
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
