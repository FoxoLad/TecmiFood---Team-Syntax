import { Alert, Button, Image, Pressable, StyleSheet,  Text, View } from "react-native";
import { Product } from "../types/product";
import { useNavigation, type NativeStackNavigationProp } from "expo-router";
import { SymbolView } from "expo-symbols";

type ProductCardProps = {
    product:Product;
    onDelete: (productId: string) => void;
};
type ProductNavigation = {
    "products/[id]": { id: string };
};

export function ProductCard({ product, onDelete }: ProductCardProps) {
    const navigation = useNavigation<NativeStackNavigationProp<ProductNavigation>>();
    return (
        <View>
            <View style={style.card}>
            <Pressable
            onPress={() => navigation.navigate("products/[id]", { id: product.id })}>
                <Image source={{ uri: product.image }} style={style.image} /></Pressable>
                <Text style={style.name}>{product.name}</Text>
                <Text>{product.description}</Text>
                <Text>{product.category}</Text>
                <Text style={style.precio}>Precio: ${product.price.toFixed(2)}</Text>
                <Text>{product.available ? "Disponible" : "No disponible"}</Text>

                <Pressable
                onPress={() => Alert.alert("¿Estás seguro?", "Esta acción no se puede deshacer.", [
                    { text: "Cancelar", style: "cancel" },
                    {onPress: () => onDelete(product.id)}
                ])}>
                    <SymbolView
                    name={{
                        android: 'delete',
                    }}
                    size={22}
                    tintColor="red"
                    />
                </Pressable>
            </View>
                
            
        </View>
    );
}



const style = StyleSheet.create({
card: {
    padding: 16,
    borderColor: "#FADAA5",
    borderWidth: 1,
    borderRadius: 8,
},
image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
},
name: {
    fontSize: 18,
    fontWeight: "bold",
},
precio: {
    fontSize: 16,
    color: "#888",
},
})