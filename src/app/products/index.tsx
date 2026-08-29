import { useState } from "react";
import { FlatList, Text, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../stores/useProduct";

const style = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default function ProductsScreen() {
  const products = useProductStore((state) => state.products);

  const deleteProduct = (id: string) => {
  };

  return (
  <SafeAreaView>
    <FlatList
      ListHeaderComponent={
        <ScrollView horizontal>
        <Text style={style.title}>Todos</Text>
        <Text style={style.title}>Entregados</Text>
        <Text style={style.title}>Pendientes</Text>
        </ScrollView>
      }
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (<ProductCard product={item}/>
      )}
    />
  </SafeAreaView>
  );


}
