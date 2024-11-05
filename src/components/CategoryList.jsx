import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";

export const categories = [
  { label: "Erkek", value: "men's clothing" },
  { label: "Kadın", value: "women's clothing" },
  { label: "Takı", value: "jewelery" },
  { label: "Elektronik", value: "electronics" },
  { label: "Tablet", value: "tablets" },
  { label: "Bilgisayar", value: "computers" },
  { label: "Telefon", value: "telephones" },
  { label: "Kozmetik", value: "cosmetics" },
];

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        {
          backgroundColor:
            selectedCategory === item.value ? "#FFA500" : "#e2e8f0",
          borderColor: selectedCategory === item.value ? "#FFA500" : "#cbd5e1",
        },
      ]}
      onPress={() => onSelectCategory(item.value)}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedCategory === item.value ? "white" : "#475569",
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.value} // Benzersiz anahtar
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    />
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  categoryButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginHorizontal: 3,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
    borderWidth: 1,
  },
  categoryText: {
    fontWeight: "bold",
  },
  categoriesContainer: {
    paddingVertical: 1,
  },
});
