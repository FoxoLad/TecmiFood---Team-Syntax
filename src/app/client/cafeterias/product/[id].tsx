/** Detalle de un producto: foto, personalización y alta al carrito. */
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    View,
    Animated,
} from "react-native";

import SafeView from "../../../../components/SafeView";
import { ProductImage } from "../../../../components/ProductImage";
import { radii, type Palette } from "../../../../constants/theme";
import { useColors } from "../../../../stores/useTheme";
import { useCafeteriaStatus } from "../../../../stores/useCafeteriaStatus";
import { useCartStore } from "../../../../stores/useCartStore";
import { useProductStore } from "../../../../stores/useProduct";
import { useFavoritesStore } from "../../../../stores/useFavorites";
import { modificationLabels } from "../../../../types/product";

export default function BustersProductScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const [modalType, setModalType] = useState<"confirm" | "success" | null>(null);
    const [selectedModifications, setSelectedModifications] = useState<string[]>([]);
    const [additionalNotes, setAdditionalNotes] = useState("");
    
    const productId = Array.isArray(id) ? id[0] : id;
    
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
    const isFavorite = useFavoritesStore((state) => state.isFavorite(productId as string));

    const products = useProductStore((state) => state.products);
    const fetchProducts = useProductStore((state) => state.fetchProducts);
    const isLoading = useProductStore((state) => state.isLoading);
    const addItemToCart = useCartStore((state) => state.addItem);
    const isOpen = useCafeteriaStatus((state) => state.isOpen);
    const fetchStatus = useCafeteriaStatus((state) => state.fetchStatus);

    useFocusEffect(
        useCallback(() => {
            fetchStatus();
            const statusTimer = setInterval(fetchStatus, 15000);
            return () => clearInterval(statusTimer);
        }, [fetchStatus]),
    );

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products.length]);


    const product = useMemo(
        () => products.find((currentProduct) => currentProduct.id === productId),
        [productId, products],
    );
    const currentCartTotal = useCartStore((state) => 
        state.items.reduce((acc, i) => acc + i.quantity, 0)
    );

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const showToast = (msg: string) => {
        setToastMessage(msg);
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
        ]).start(() => setToastMessage(null));
    };

    const handleConfirmOrder = () => {
        if (!product) return;
        if (!useCafeteriaStatus.getState().isOpen) {
            setModalType(null);
            Alert.alert("Cafetería cerrada", "Solo puedes pedir cuando la cafetería esté abierta.");
            return;
        }

        const res = addItemToCart(product, 1, selectedModifications, additionalNotes);
        
        setModalType(null);
        if (!res.success) {
            showToast(res.reason === "product_limit" ? "Límite de 3 por producto alcanzado." : "Límite de 8 productos en total alcanzado.");
            return;
        }

        setModalType("success");
    };

    const orderProduct = () => {
        if (!product || !isOpen) {
            return;
        }

        setModalType("confirm");
    };

    const shareProduct = () => {
        if (!product) {
            return;
        }

        Share.share({
            message: `${product.name}\n${product.description}\nPrecio: $${product.price.toFixed(2)}`,
            title: product.name,
        });
    };

    const toggleModification = (modification: string) => {
        setSelectedModifications((current) =>
            current.includes(modification)
                ? current.filter((item) => item !== modification)
                : [...current, modification],
        );
    };

    if (isLoading && !product) {
        return (
            <SafeView style={styles.container}>
                <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
                <Text style={styles.emptyText}>Cargando producto...</Text>
            </SafeView>
        );
    }

    if (!product) {
        return (
            <SafeView style={styles.container}>
                <Pressable
                    accessibilityLabel="Volver al menú de la cafetería"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.iconButton}
                >
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </Pressable>
                <Text style={styles.emptyText}>Producto no encontrado.</Text>
            </SafeView>
        );
    }

    return (
        <SafeView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    accessibilityLabel="Volver al menú de la cafetería"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.iconButton}
                >
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </Pressable>

                <View style={styles.headerActions}>
                    <Pressable
                        accessibilityLabel="Compartir producto"
                        accessibilityRole="button"
                        onPress={shareProduct}
                        style={styles.iconButton}
                    >
                        <Ionicons name="share-outline" size={25} color={colors.text} />
                    </Pressable>
                    <Pressable
                        accessibilityLabel={isFavorite ? "Quitar de favoritos" : "Guardar como favorito"}
                        accessibilityRole="button"
                        onPress={() => { if (product) toggleFavorite(product); }}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={26}
                            color={isFavorite ? colors.danger : colors.text}
                        />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <ProductImage
                    contentFit="contain"
                    image={product.image}
                    name={product.name}
                    style={styles.imageBox}
                />

                <Text style={styles.name}>{product.name}</Text>
                {!product.inStock && (
                    <Text style={{ color: '#CC0A0A', fontWeight: 'bold', fontSize: 16, marginBottom: 8, backgroundColor: '#FFE5E5', padding: 8, borderRadius: 8, textAlign: 'center', overflow: 'hidden' }}>PRODUCTO AGOTADO</Text>
                )}
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.description}>
                    {product.description || "Sin descripción disponible."}
                </Text>

                <Text style={styles.price}>${product.price.toFixed(2)}</Text>

                <Text style={styles.modificationsTitle}>Personaliza tu producto</Text>
                <Text style={styles.modificationsHint}>
                    Selecciona las modificaciones que necesites.
                </Text>

                <View style={styles.modificationsList}>
                    {modificationLabels(product).map((modification) => {
                        const isSelected = selectedModifications.includes(modification);

                        return (
                            <Pressable
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: isSelected }}
                                key={modification}
                                onPress={() => toggleModification(modification)}
                                style={styles.modificationOption}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        isSelected && styles.checkboxSelected,
                                    ]}
                                >
                                    {isSelected ? (
                                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                    ) : null}
                                </View>
                                <Text style={styles.modificationText}>{modification}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                <TextInput
                    accessibilityLabel="Instrucciones adicionales"
                    multiline
                    onChangeText={setAdditionalNotes}
                    placeholder="¿Quieres agregar alguna indicación?"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.notesInput}
                    textAlignVertical="top"
                    value={additionalNotes}
                />

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isOpen ? `Agregar ${product.name} al carrito` : "La cafetería está cerrada"}
                    disabled={!isOpen}
                    onPress={orderProduct}
                    style={[styles.orderButton, !isOpen && styles.orderButtonClosed]}
                >
                    <Text style={styles.orderButtonText}>
                        {isOpen ? "AGREGAR AL CARRITO" : "CAFETERÍA CERRADA"}
                    </Text>
                </Pressable>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent
                visible={modalType !== null}
                onRequestClose={() => setModalType(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {modalType === "success" ? (
                            <Ionicons
                                color={colors.success}
                                name="checkmark-circle"
                                size={64}
                                style={styles.successIcon}
                            />
                        ) : null}
                        <Text style={styles.modalTitle}>
                            {modalType === "confirm"
                                ? "Agregar al carrito"
                                : "Producto agregado"}
                        </Text>
                        <Text style={styles.modalMessage}>
                            {modalType === "confirm"
                                ? `¿Deseas agregar ${product.name} al carrito por $${product.price.toFixed(2)}?`
                                : `${product.name} se agregó al carrito.`}
                        </Text>
                        {modalType === "confirm" &&
                        (selectedModifications.length > 0 || additionalNotes.trim()) ? (
                            <Text style={styles.modalDetails}>
                                {selectedModifications.length > 0
                                    ? `Modificaciones: ${selectedModifications.join(", ")}. `
                                    : ""}
                                {additionalNotes.trim()
                                    ? `Nota: ${additionalNotes.trim()}`
                                    : ""}
                            </Text>
                        ) : null}

                        {modalType === "confirm" ? (
                            <View style={styles.modalActions}>
                                <Pressable
                                    onPress={() => setModalType(null)}
                                    style={styles.cancelButton}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        CANCELAR
                                    </Text>
                                </Pressable>
                            <Pressable
                                    onPress={handleConfirmOrder}
                                    style={styles.confirmButton}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        CONFIRMAR
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={() => {
                                    setModalType(null);
                                    router.back();
                                }}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>ACEPTAR</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </Modal>

            {toastMessage && (
                <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
        </SafeView>
    );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        padding: 16,
    },
    header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        minHeight: 44,
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        alignItems: "center",
        height: 44,
        justifyContent: "center",
        width: 44,
    },
    content: {
        paddingBottom: 24,
    },
    imageBox: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radii.large,
        borderWidth: 1,
        height: 240,
        marginBottom: 20,
        width: "100%",
    },
    name: {
        color: colors.text,
        fontSize: 26,
        fontWeight: "bold",
    },
    category: {
        color: colors.accent,
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 6,
        textTransform: "uppercase",
    },
    description: {
        color: "#444444",
        fontSize: 17,
        lineHeight: 24,
        marginTop: 16,
    },
    price: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 20,
    },
    modificationsTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 24,
    },
    modificationsHint: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    modificationsList: {
        gap: 10,
        marginTop: 14,
    },
    modificationOption: {
        alignItems: "center",
        flexDirection: "row",
        minHeight: 34,
    },
    checkbox: {
        alignItems: "center",
        borderColor: colors.border,
        borderRadius: 5,
        borderWidth: 1.5,
        height: 23,
        justifyContent: "center",
        marginRight: 10,
        width: 23,
    },
    checkboxSelected: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    modificationText: {
        color: colors.text,
        fontSize: 16,
    },
    notesInput: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radii.small,
        borderWidth: 1,
        fontSize: 15,
        height: 90,
        marginTop: 16,
        padding: 12,
    },
    orderButton: {
        alignItems: "center",
        backgroundColor: colors.accent,
        borderRadius: radii.pill,
        marginTop: 24,
        paddingVertical: 15,
    },
    orderButtonClosed: {
        backgroundColor: colors.textSecondary,
    },
    orderButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "bold",
    },
    modalOverlay: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        width: "100%",
    },
    modalTitle: {
        color: "#000000",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    successIcon: {
        alignSelf: "center",
        marginBottom: 8,
    },
    modalMessage: {
        color: "#444444",
        fontSize: 16,
        lineHeight: 22,
        marginTop: 12,
        textAlign: "center",
    },
    modalDetails: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 12,
        textAlign: "center",
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        alignItems: "center",
        backgroundColor: "#E5E5E5",
        borderRadius: 14,
        flex: 1,
        paddingVertical: 13,
    },
    cancelButtonText: {
        color: "#333333",
        fontSize: 14,
        fontWeight: "bold",
    },
    confirmButton: {
        alignItems: "center",
        backgroundColor: "#8F651A",
        borderRadius: 14,
        flex: 1,
        paddingVertical: 13,
    },
    confirmButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    closeButton: {
        alignItems: "center",
        backgroundColor: colors.surfaceMuted,
        borderRadius: radii.pill,
        marginTop: 24,
        paddingVertical: 13,
    },
    closeButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "bold",
    },
    emptyText: {
        color: "#555555",
        fontSize: 18,
        marginTop: 40,
        textAlign: "center",
    },
    toastContainer: {
        position: "absolute",
        top: "50%",
        left: "10%",
        right: "10%",
        backgroundColor: "rgba(0,0,0,0.75)",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: radii.large,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    toastText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
  });
}
