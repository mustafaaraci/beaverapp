import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useSelector } from "react-redux";
import { selectTotalQuantity } from "../redux/cartSlice";

const Feather = ({ state, descriptors, navigation }) => {
  // sepetteki benzersiz ürün sayısını al
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {route.name === "Home" && (
              <>
                <Entypo
                  name="home"
                  size={24}
                  color={isFocused ? "#FFA500" : "#7D7D7D"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#FFA500" : "#7D7D7D" },
                  ]}
                >
                  Anasayfa
                </Text>
              </>
            )}
            {route.name === "Favorites" && (
              <>
                <MaterialIcons
                  name="favorite"
                  size={25}
                  color={isFocused ? "#FFA500" : "#7D7D7D"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#FFA500" : "#7D7D7D" },
                  ]}
                >
                  Favorilerim
                </Text>
              </>
            )}
            {route.name === "Cart" && (
              <>
                <Entypo
                  name="shopping-cart"
                  size={24}
                  color={isFocused ? "#FFA500" : "#7D7D7D"}
                />
                {totalQuantity > 0 && (
                  <View style={styles.notificationCircle}>
                    <Text style={styles.notificationText}>{totalQuantity}</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#FFA500" : "#7D7D7D" },
                  ]}
                >
                  Sepetim
                </Text>
              </>
            )}
            {route.name === "Profile" && (
              <>
                <FontAwesome5
                  name="user-alt"
                  size={22}
                  color={isFocused ? "#FFA500" : "#7D7D7D"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#FFA500" : "#7D7D7D" },
                  ]}
                >
                  Hesabım
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopColor: "#eee",
    elevation: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  notificationCircle: {
    position: "absolute",
    right: -1,
    top: -5,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  notificationText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default Feather;
