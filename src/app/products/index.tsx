import { useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import products from "../../../data/products.json";
import { ProductCard } from "../components/ProductCard";

export default function ProductsScreen() {
  const[productsList, setProductsList] = useState(products);

  const deleteProduct = (id: string) => {
    setProductsList(listadoActual => listadoActual.filter(product => product.id !== id));
  };

  return (
  <SafeAreaView>
    <FlatList
      ListHeaderComponent={
        <Text >Listado de productos</Text>
      }
      data={productsList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard product={{ ...item, id: String(item.id) }} onDelete={deleteProduct} />
      )}
    />
  </SafeAreaView>
  );


}
