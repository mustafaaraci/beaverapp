import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/orderSlice";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders()); // Siparişleri çekme fonksiyonu
  }, [dispatch]);

  // Siparişleri tarih sırasına göre sıralama (en yeni en üstte)
  const orderListDesc = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>
          Sipariş Tarihi:{" "}
          {new Date(item.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <View style={styles.orderStatus}>
          <MaterialIcons name="check-circle" size={20} color="green" />
        </View>
      </View>
      <FlatList
        data={item.items}
        renderItem={renderProductItem}
        keyExtractor={(product) => `${product.id}-${product.size}`} // Benzersiz anahtar
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
      <View style={styles.orderDetails}>
        <Text>
          <Text style={styles.orderText}>Sipariş No:</Text> {item._id}
        </Text>
        <Text>
          <Text style={styles.orderText}>Teslim Adresi:</Text> {item.address}
        </Text>
        <View style={styles.bottomCard}>
          <Text style={styles.orderTotal}>
            Ödenen Tutar: ${item.total.toFixed(2)}
          </Text>
          <Text style={styles.statusText}>Sipariş Verildi</Text>
        </View>
      </View>
    </View>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>
          {item.title} {item.size && `(${item.size})`}
        </Text>
        <Text style={styles.productPrice}>
          ${item.price.toFixed(2)} x {item.quantity}
        </Text>
        <Text style={styles.sizeText}>Beden: {item.size}</Text>
        <Text style={styles.totalPriceText}>
          Toplam: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siparişlerim</Text>
      </View>

      {status === "loading" ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : status === "failed" ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : orderListDesc.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Henüz sipariş oluşturmadınız.</Text>
        </View>
      ) : (
        <FlatList
          data={orderListDesc}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id.toString()} // Benzersiz anahtar
          contentContainerStyle={styles.orderList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "flex-end",
  },
  backButton: {
    marginRight: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderList: {
    paddingBottom: 16,
  },
  orderItem: {
    marginTop: 4,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderColor: "#FFA500",
    borderWidth: 0.5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bottomCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderDetails: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  orderText: {
    fontWeight: "bold",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
  },
  orderAddress: {
    marginTop: 5,
    color: "#333",
  },
  productList: {
    marginVertical: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 14,
    color: "#333",
  },
  productQuantity: {
    fontSize: 12,
    color: "#666",
  },
  statusText: {
    color: "green",
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  totalPriceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
});

export default MyOrdersScreen;
