import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmployeeHeader } from "../../components/EmployeeHeader";
import { ProductImage } from "../../components/ProductImage";
import { colors, employee } from "../../constants/theme";
import { useProductStore } from "../../stores/useProduct";
import { useUserStore } from "../../stores/useUserStore";
import { endpoints } from "../../constants/api";
import { Product } from "../../types/product";

export default function InventoryScreen() {
  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const prefix = employeeCafeteria === "Busters" ? "BT" : "BS";
    setLocalProducts(products.filter(p => p.id?.startsWith(prefix)));
  }, [products, employeeCafeteria]);

  const toggleStock = async (product: Product, newValue: boolean) => {
    setIsUpdating(prev => ({ ...prev, [product.id]: true }));
    // Update local state optimistic
    setLocalProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newValue } : p));
    
    try {
      await fetch(endpoints.products + "/" + product.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: newValue })
      });
      fetchProducts();
    } catch (e) {
      console.error(e);
      // Revert
      setLocalProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: !newValue } : p));
    } finally {
      setIsUpdating(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <View style={styles.shell}>
      <SafeAreaView edges={["top"]} style={styles.shellTop}>
        <EmployeeHeader
          backLabel="Órdenes"
          onBack={() => router.back()}
          title="Inventario"
        />
      </SafeAreaView>
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <View style={styles.headerRow}>
           <Text style={styles.subtitle}>Gestión de Existencias</Text>
        </View>
        
        {localProducts.length === 0 ? (
           <ActivityIndicator style={{ marginTop: 40 }} color={employee.accent} size="large" />
        ) : (
           <FlatList
             data={localProducts}
             keyExtractor={p => p.id}
             contentContainerStyle={styles.list}
             renderItem={({ item }) => (
                <Pressable style={styles.itemRow} onPress={() => router.push({ pathname: "/employee/product-form" as any, params: { id: item.id } })}>
                   <ProductImage image={item.image} name={item.name} style={styles.image} contentFit="cover" />
                   <View style={styles.info}>
                      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.statusText}>{item.inStock ? "Disponible" : "Agotado"}</Text>
                   </View>
                   <View style={styles.action}>
                      {isUpdating[item.id] ? (
                          <ActivityIndicator color={employee.accent} size="small" />
                      ) : (
                          <Switch
                            value={item.inStock}
                            onValueChange={(val) => toggleStock(item, val)}
                            trackColor={{ false: "#FFE5E5", true: "#D7F3E1" }}
                            thumbColor={item.inStock ? colors.success : colors.danger}
                          />
                      )}
                   </View>
                   </Pressable>
             )}
           />
        )}
      
        <Pressable 
          style={styles.fab} 
          onPress={() => router.push("/employee/product-form" as any)}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { backgroundColor: employee.background, flex: 1 },
  shellTop: { backgroundColor: employee.background },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    overflow: "hidden",
  },
  headerRow: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  list: {
    padding: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  action: {
    width: 60,
    alignItems: "flex-end",
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: employee.accent,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
