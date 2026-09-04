import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { productsImages } from "../../../components/images";
import { useProductStore } from "../../../stores/useProduct";

export default function EmployeeOrderDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const products = useProductStore((state) => state.products);
	const orderProducts = products.filter((product) => String(product.NoOrder) === id);
	const total = orderProducts.reduce((sum, product) => sum + product.price, 0);

	if (orderProducts.length === 0) {
		return (
			<SafeAreaView style={styles.container}>
				<Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
					<Ionicons color="#111110" name="chevron-back" size={30} />
					<Text style={styles.backText}>Volver</Text>
				</Pressable>
				<Text style={styles.notFound}>Pedido no encontrado</Text>
			</SafeAreaView>
		);
	}

	const orderNumber = orderProducts[0].NoOrder;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Pressable accessibilityLabel="Volver a la lista de pedidos" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
						<Ionicons color="#111110" name="chevron-back" size={30} />
						<Text style={styles.backText}>Pedidos</Text>
					</Pressable>
					<Text style={styles.title}>ORDEN #{String(orderNumber).padStart(3, "0")}</Text>
				</View>

				<View style={styles.statusRow}>
					<Text style={styles.statusLabel}>Estado</Text>
					<Text style={[styles.statusValue, orderProducts[0].status.toLowerCase() === "entregado" && styles.deliveredStatus]}>{orderProducts[0].status}</Text>
				</View>

				{orderProducts.map((product) => (
					<View key={product.id} style={styles.productCard}>
						<Image source={productsImages[product.image as keyof typeof productsImages]} style={styles.productImage} />
						<View style={styles.productDetails}>
							<Text style={styles.productName}>{product.name}</Text>
							<Text style={styles.description}>{product.description}</Text>
							<Text style={styles.category}>{product.category.toUpperCase()}</Text>
							<Text style={styles.price}>${product.price.toFixed(2)}</Text>
						</View>
						<View style={styles.modificationsBox}>
							<Text style={styles.modificationsTitle}>Modificaciones</Text>
							<Text style={styles.modificationsText}>
								{product.modifications?.trim() || "Sin modificaciones"}
							</Text>
						</View>
					</View>
				))}

				<View style={styles.totalBar}>
					<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#DFCDB2",
		flex: 1,
	},
	content: {
		padding: 14,
		paddingBottom: 28,
	},
	header: {
		alignItems: "center",
		flexDirection: "row",
		marginBottom: 14,
	},
	backButton: {
		alignItems: "center",
		flexDirection: "row",
		gap: 2,
		paddingVertical: 6,
	},
	backText: {
		color: "#111110",
		fontSize: 17,
		fontWeight: "700",
	},
	title: {
		flex: 1,
		fontSize: 27,
		fontWeight: "900",
		textAlign: "right",
	},
	statusRow: {
		alignItems: "center",
		backgroundColor: "#EDE6CE",
		borderColor: "#111110",
		borderRadius: 12,
		borderWidth: 1.5,
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	statusLabel: {
		fontSize: 18,
		fontWeight: "800",
	},
	statusValue: {
		color: "#f27600",
		fontSize: 18,
		fontWeight: "700",
	},
	deliveredStatus: {
		color: "#15803d",
	},
	productCard: {
		backgroundColor: "#EDE6CE",
		borderColor: "#111110",
		borderRadius: 16,
		borderWidth: 1.5,
		marginBottom: 12,
		padding: 12,
	},
	productImage: {
		alignSelf: "center",
		height: 130,
		resizeMode: "contain",
		width: "100%",
	},
	productDetails: {
		marginTop: 4,
	},
	productName: {
		fontSize: 24,
		fontWeight: "900",
	},
	description: {
		fontSize: 15,
		lineHeight: 20,
		marginTop: 4,
	},
	category: {
		color: "#777777",
		fontSize: 12,
		marginTop: 6,
	},
	price: {
		fontSize: 23,
		fontWeight: "800",
		marginTop: 3,
	},
	modificationsBox: {
		backgroundColor: "#fff8e7",
		borderColor: "#d6b77a",
		borderRadius: 10,
		borderWidth: 1,
		marginTop: 12,
		paddingHorizontal: 11,
		paddingVertical: 9,
	},
	modificationsTitle: {
		fontSize: 16,
		fontWeight: "900",
	},
	modificationsText: {
		color: "#444444",
		fontSize: 16,
		marginTop: 3,
	},
	totalBar: {
		alignItems: "center",
		backgroundColor: "#000000",
		borderRadius: 22,
		marginTop: 2,
		paddingVertical: 7,
	},
	totalText: {
		color: "#ffffff",
		fontSize: 29,
		fontWeight: "900",
	},
	notFound: {
		fontSize: 18,
		marginTop: 30,
		textAlign: "center",
	},
});
