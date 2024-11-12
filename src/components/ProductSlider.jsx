import React, { useEffect, useState, useRef } from "react";
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
const ITEM_WIDTH = width * 0.98;

const ProductSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
    }
  }, [activeIndex]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  const handleScrollEnd = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        onMomentumScrollEnd={handleScrollEnd}
        decelerationRate="fast"
        initialScrollIndex={0}
        contentContainerStyle={{ alignItems: "center" }}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: -10,
  },
  card: {
    width: ITEM_WIDTH,
    height: 140,
    borderRadius: 10,
    backgroundColor: "white",
    marginHorizontal: 10 * 0.98,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10 * 0.98,
    marginLeft: 9.1 * 0.98,
    marginTop: 8,
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
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
