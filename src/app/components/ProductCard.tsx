import { Alert, Button, Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { Product } from "../types/product";
import { useNavigation, type NativeStackNavigationProp } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useProductStore } from "../stores/useProduct";
import { productsImages } from "./images";



type ProductCardProps = {
    product:Product;
};
type ProductNavigation = {
    "products/[id]": { id: string };
    "products/[NoOrder]": { NoOrder: number };
};

export function ProductCard({ product }: ProductCardProps) {
    const navigation = useNavigation<NativeStackNavigationProp<ProductNavigation>>();
    const orderNumber = (product as Product & { NoOrder?: number }).NoOrder ?? 0;
    const status = (product as Product & { status?: string }).status ?? "Sin estado";
    const  deleteProduct = useProductStore((state) => state.deleteProduct);

    return (
        <View>
            <View style={style.card}>
                <Text style={style.noOrden}>No Orden {orderNumber}</Text>
            <Pressable
            onPress={() => navigation.navigate("products/[NoOrder]", { NoOrder: orderNumber })}>
                <Image source={productsImages[product.image as keyof typeof productsImages]} style={style.image} /></Pressable>
                <Text style={style.name}>{product.name}</Text>
                <Text>{product.description}</Text>
                <Text>{product.category}</Text>
                <Text style={style.precio}>Precio: ${product.price.toFixed(2)}</Text>
                <Text>Estado: {status}</Text>

                <Pressable
                onPress={() => Alert.alert("¿Estás seguro?", "Esta acción no se puede deshacer.", [
                    { text: "Cancelar", style: "cancel" },
                    {onPress: () => deleteProduct(product.id)}
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
    noOrden: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    card: {
        padding: 20,
        borderColor: "#ede6ec",
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#00000000",
},
})