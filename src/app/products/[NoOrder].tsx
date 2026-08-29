import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import products from "../../../data/products.json";
import { Pressable, Image, Text, StyleSheet} from "react-native";
import {productsImages} from "../components/images";
import { useProductStore } from "../stores/useProduct";
import "../components/images"

export default function ProductDetailsScreen() {
    const {NoOrder} = useLocalSearchParams();
    const product = useProductStore((state) => state.products.find((p) => String(p.NoOrder) === NoOrder));
    const navigation = useNavigation();

    if (!product) {
        return (
            <SafeAreaView>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text>Volver</Text>
                </Pressable>
                <Text>Producto no encontrado</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <Pressable onPress={() => navigation.goBack()}>
                <Text>Volver</Text>
            </Pressable>
            <Pressable>
                <Image source={productsImages[product.image as keyof typeof productsImages]} style={style.image} />
                <Text style={style.name}>{product.name}</Text>
                <Text>{product.description}</Text>
                <Text>{product.category}</Text>
                <Text style={style.precio}>Precio: ${product.price.toFixed(2)}</Text>
                <Text>Estado: {product.status}</Text>
            </Pressable>
        </SafeAreaView>
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