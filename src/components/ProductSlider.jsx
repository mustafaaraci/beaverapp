import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const products = [
  {
    id: "1",
    image:
      "https://cdn.dsmcdn.com/ty1464/pimWidgetApi/mobile_20240806055505_3046646KadinMobile202408051801.jpg",
  },
  {
    id: "2",
    image:
      "https://cdn.dsmcdn.com/ty1595/pimWidgetApi/mobile_20241031155745_2702142KadinMobile202410311802.jpg",
  },
  {
    id: "3",
    image:
      "https://cdn.dsmcdn.com/ty1597/pimWidgetApi/mobile_20241101163035_boyneryeni1.jpg",
  },
  {
    id: "4",
    image:
      "https://cdn.dsmcdn.com/ty1587/pimWidgetApi/mobile_20241018214404_adidas.jpg",
  },
];

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;

const ProductSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            event.nativeEvent.contentOffset.x / ITEM_WIDTH
          );
          setActiveIndex(index);
        }}
        contentContainerStyle={styles.listContainer}
        decelerationRate="fast"
      />
      <View style={styles.dotContainer}>
        {products.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? "#FFA500" : "#d3d3d3",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ProductSlider;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: 164,
    marginVertical: -5,
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  card: {
    width: 382,
    height: 140,
    borderRadius: 10,
    backgroundColor: "white",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    overflow: "hidden",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 16,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 5,
    marginHorizontal: 2,
  },
});
