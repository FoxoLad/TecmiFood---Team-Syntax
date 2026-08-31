import { FlatList, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "../../components/ProductCard";
import { useProductStore } from "../../stores/useProduct";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFCDB2",
  },
  headerScroll: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 15,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#fffefc",
  },
});

export default function ProductsScreen() {
  const products = useProductStore((state) => state.products);

  const deleteProduct = (id: string | number) => {
    // Aquí puedes conectar la acción deleteProduct del store si está definida
  };

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.headerScroll}
          >
            <Text style={style.title}>Todos</Text>
            <Text style={style.title}>Entregados</Text>
            <Text style={style.title}>Pendientes</Text>
            <Text style={style.title}>Historial</Text>
          </ScrollView>
        }
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </SafeAreaView>
  );
}
