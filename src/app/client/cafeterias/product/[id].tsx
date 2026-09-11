import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import SafeView from "../../../../components/SafeView";
import { colors, radii } from "../../../../constants/theme";
import productsData from "../../../../data/products.json";
import { Product } from "../../../../types/product";

const bustersProducts = productsData as Product[];

const getModificationOptions = (category: string) => {
    if (category === "Alimentos") {
        return ["Sin salsa", "Sin ingredientes picantes", "Extra servilletas"];
    }

    if (
        category === "Bebidas" ||
        category === "Frappe" ||
        category === "Bebidas Calientes o Heladas"
    ) {
        return ["Sin hielo", "Poco hielo", "Sin azúcar"];
    }

    return ["Sin bolsa", "Empaque separado", "Extra servilletas"];
};

export default function BustersProductScreen() {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const [modalType, setModalType] = useState<"confirm" | "success" | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedModifications, setSelectedModifications] = useState<string[]>([]);
    const [additionalNotes, setAdditionalNotes] = useState("");
    const productId = Array.isArray(id) ? id[0] : id;
    const product = useMemo(
        () =>
            bustersProducts.find(
                (currentProduct) =>
                    currentProduct.id === productId &&
                    currentProduct.businessId === "BT",
            ),
        [productId],
    );

    const orderProduct = () => {
        if (!product) {
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
                        onPress={() => setIsFavorite((current) => !current)}
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
                <View style={styles.imageBox}>
                    {product.image.startsWith("http") ? (
                        <Image
                            source={{ uri: product.image }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : null}
                </View>

                <Text style={styles.name}>{product.name}</Text>
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
                    {getModificationOptions(product.category).map((modification) => {
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
                    accessibilityLabel={`Agregar ${product.name} al carrito`}
                    onPress={orderProduct}
                    style={styles.orderButton}
                >
                    <Text style={styles.orderButtonText}>AGREGAR AL CARRITO</Text>
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
                                    onPress={() => setModalType("success")}
                                    style={styles.confirmButton}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        CONFIRMAR
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={() => setModalType(null)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>ACEPTAR</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeView>
    );
}

const styles = StyleSheet.create({
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
        alignItems: "center",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        height: 220,
        justifyContent: "center",
        marginBottom: 20,
        width: "100%",
    },
    image: {
        height: "100%",
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
});
