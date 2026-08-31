import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "../../components/ProductCard";
import { useProductStore } from "../../stores/useProduct";
import type { Product } from "../../types/product";

export default function ProductsScreen() {
  const products = useProductStore((state) => state.products);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtra los productos por nombre o número de orden
  const filteredProducts = products.filter((item: Product) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesOrder = String(item.NoOrder ?? "").includes(query);
    return matchesName || matchesOrder;
  });

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            {/* Pestañas de categorías/estados */}
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

            {/* Barra de Búsqueda */}
            <View style={style.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#333333" style={style.searchIcon} />
              <TextInput
                style={style.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#777777"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>
          </View>
        }
        data={filteredProducts}
        keyExtractor={(item: Product) => item.id.toString()}
        renderItem={({ item }: { item: Product }) => <ProductCard product={item} />}
        contentContainerStyle={style.listContent}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFCDB2",
  },
  headerScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 20,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
    color: "#111110",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE6CE",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: "#111110",
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111110",
    height: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
