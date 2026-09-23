/**
 * Inicio del cliente: promociones, accesos rápidos y los menús de cada cafetería.
 */
import { useProductStore } from "../../../stores/useProduct";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, type Href } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import SafeView from "../../../components/SafeView";
import { ProductImage } from "../../../components/ProductImage";
import { useOrders } from "../../../stores/useOrders";
import { useUserStore } from "../../../stores/useUserStore";
import { formatOrderNumber, getOrderStatusLabel } from "../../../types/order";
import { isProductAvailable, type Product } from "../../../types/product";
import { isClientOrder } from "../../../utils/client";

type CafeteriaSection = {
  businessId: string;
  title: string;
  headerColor: string;
  cardBgColor: string;
  route?: Href;
  data: Product[];
};

const BATCH_SIZE = 4;
const BANNERS = [
  require("../../../../assets/images/promotionBanner/PromocionalPrueba.jpg"),
  require("../../../../assets/images/promotionBanner/PromocionalTecmilenio.png"),
  require("../../../../assets/images/promotionBanner/PromocionBustersTest.jpg"),
];

const BEE_SWEET_PRODUCTS: Product[] = [
  {
    id: "BS-001",
    businessId: "BS",
    name: "Panqué",
    description: "Panqué clásico",
    price: 102.0,
    image: "",
    inStock: true,
    category: "Comidas",
  },
  {
    id: "BS-002",
    businessId: "BS",
    name: "Chocolatín",
    description: "Pan de chocolatín",
    price: 35.0,
    image: "",
    inStock: true,
    category: "Comidas",
  },
];

export default function HomeScreen() {
  const allProducts = useProductStore((state) => state.products as Product[]);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const [activeBanner, setActiveBanner] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<Record<string, number>>({});
  const clientId = useUserStore((state) => state.clientId);
  const activeOrder = useOrders((state) =>
    state.orders.find(
      (order) =>
        isClientOrder(order.customerName, clientId) &&
        order.status !== "Entregado" &&
        order.status !== "Cancelado",
    ),
  );
  const fetchOrders = useOrders((state) => state.fetchOrders);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      fetchProducts();
    }, [fetchOrders, fetchProducts]),
  );

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveBanner((current) => (current + 1) % BANNERS.length);
    }, 4500);

    return () => clearInterval(bannerTimer);
  }, []);

  const openProduct = useCallback((product: Product) => {
    if (product.businessId !== "BT") {
      return;
    }

    router.push({
      pathname: "/client/cafeterias/product/[id]",
      params: { id: product.id },
    });
  }, []);

  const getVisibleProducts = useCallback((section: CafeteriaSection) => {
    const visibleCount = visibleProducts[section.businessId] ?? BATCH_SIZE;
    return section.data.slice(0, visibleCount);
  }, [visibleProducts]);

  const loadMoreProducts = useCallback((
    section: CafeteriaSection,
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const reachedEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 40;
    const currentCount = visibleProducts[section.businessId] ?? BATCH_SIZE;

    if (reachedEnd && currentCount < section.data.length) {
      setVisibleProducts((current) => {
        const latestCount = current[section.businessId] ?? BATCH_SIZE;
        if (latestCount >= section.data.length) {
          return current;
        }

        return {
          ...current,
          [section.businessId]: latestCount + BATCH_SIZE,
        };
      });
    }
  }, [visibleProducts]);

  const cafeteriaSections = useMemo<CafeteriaSection[]>(() => [
    {
      businessId: "BT",
      title: "BUSTERS",
      headerColor: "#8F651A",
      cardBgColor: "#8F651A",
      route: "/client/cafeterias/bustershome",
      data: allProducts.filter(
        (product) => product.businessId === "BT" && isProductAvailable(product),
      ),
    },
    {
      businessId: "BS",
      title: "BEE SWEET",
      headerColor: "#d4af37",
      cardBgColor: "#e2bf43",
      data: BEE_SWEET_PRODUCTS,
    },
  ], [allProducts]);

  return (
    <SafeView style={styles.safeArea}>
      {/*Barra de notificaciones*/}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/*Contenedor Principal*/}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.kicker}>ORDENA A TU MANERA</Text>
            <Text style={styles.mainTitle}>Cafeterías</Text>
            <Text style={styles.subtitle}>Tu antojo, a un toque de distancia.</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="cafe-outline" size={25} color="#FFFFFF" />
          </View>
        </View>

        {/*Banner Promocional*/}
        <View style={styles.bannerContainer}>
          <Image
            source={BANNERS[activeBanner]}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerShade} />
          <View style={styles.bannerCaption}>
            <Text style={styles.bannerCaptionTitle}>Lo bueno empieza aquí</Text>
            <Text style={styles.bannerCaptionText}>Descubre algo delicioso hoy.</Text>
          </View>
          <View style={styles.bannerDots}>
            {BANNERS.map((_, index) => (
              <Pressable
                accessibilityLabel={`Ver promoción ${index + 1}`}
                accessibilityRole="button"
                key={index}
                onPress={() => setActiveBanner(index)}
                style={[styles.bannerDot, index === activeBanner && styles.bannerDotActive]}
              />
            ))}
          </View>
        </View>

        {/*Botones de acción*/}
        <View style={styles.actionButtonsContainer}>
          <Pressable
            accessibilityLabel="Abrir favoritos"
            accessibilityRole="button"
            onPress={() => router.push("/client/favorites")}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          >
            <Ionicons name="heart-outline" size={21} color="#8F651A" />
            <Text style={styles.actionButtonText}>Favoritos</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Abrir pedidos activos"
            accessibilityRole="button"
            onPress={() => router.push("/client/orders")}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          >
            <Ionicons name="document-text-outline" size={21} color="#8F651A" />
            <Text style={styles.actionButtonText}>Pedidos</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Abrir historial de pedidos"
            accessibilityRole="button"
            onPress={() => router.push("/client/orders?view=history")}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          >
            <Ionicons name="time-outline" size={21} color="#8F651A" />
            <Text style={styles.actionButtonText}>Historial</Text>
          </Pressable>
        </View>

        {activeOrder ? (
          <Pressable
            accessibilityLabel="Ver el estado de tu pedido"
            accessibilityRole="button"
            onPress={() => router.push("/client/orders")}
            style={styles.activeOrderBanner}
          >
            <View style={styles.activeOrderIcon}>
              <Ionicons
                color="#FFFFFF"
                name={activeOrder.status === "Terminado" ? "checkmark-circle" : "restaurant-outline"}
                size={22}
              />
            </View>
            <View style={styles.activeOrderCopy}>
              <Text style={styles.activeOrderTitle}>
                Pedido #{formatOrderNumber(activeOrder.orderNumber)}
              </Text>
              <Text style={styles.activeOrderStatus}>
                {getOrderStatusLabel(activeOrder.status)}
              </Text>
            </View>
            <Ionicons color="#FFFFFF" name="chevron-forward" size={20} />
          </Pressable>
        ) : null}

        {/*Mensaje de cargando mientras conecta con MongoDB*/}
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#8F651A" />
            <Text style={styles.loadingText}>Cargando menú...</Text>
          </View>
        ) : (
          cafeteriaSections.map((section) => (
            <View
              key={section.title}
              style={[
                styles.cafeteriaSection,
                { backgroundColor: section.cardBgColor },
              ]}
            >
              <Pressable
                disabled={!section.route}
                style={[
                  styles.sectionHeader,
                  { backgroundColor: section.headerColor },
                ]}
                onPress={() => {
                  if (section.route) {
                    router.push(section.route);
                  }
                }}
              >
                {/*Header de la cafetería*/}
                <Text style={styles.sectionTitleText}>{section.title}</Text>
                <Ionicons name="chevron-forward" size={22} color="#ffffff" />
              </Pressable>
              <View style={styles.headerDivider} />
              <Text style={styles.subHeaderTitle}>Más vendidos:</Text>

              {section.data.length === 0 ? (
                <Text style={styles.emptySection}>El menú se está actualizando.</Text>
              ) : null}

              {/*Scroll horizontal de productos*/}
              <ScrollView
                horizontal
                onMomentumScrollEnd={(event) => loadMoreProducts(section, event)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContainer}
                nestedScrollEnabled={true}
              >
                {getVisibleProducts(section).map((item) => (
                  <Pressable
                    accessibilityLabel={`Ver ${item.name}`}
                    accessibilityRole={item.businessId === "BT" ? "button" : undefined}
                    disabled={item.businessId !== "BT"}
                    key={item.id}
                    onPress={() => openProduct(item)}
                    style={({ pressed }) => [
                      styles.productCard,
                      pressed && item.businessId === "BT" && styles.productCardPressed,
                    ]}
                  >
                  <View style={styles.productImageWrap}>
                    <ProductImage
                      contentFit="cover"
                      image={item.image}
                      name={item.name}
                      style={styles.productImage}
                    />
                  </View>

                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                    {item.businessId === "BT" ? (
                      <View style={styles.viewProductLabel}>
                        <Text style={styles.viewProductText}>Ver producto</Text>
                        <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </Pressable>
                ))}
                {(visibleProducts[section.businessId] ?? BATCH_SIZE) < section.data.length ? (
                  <View style={styles.loadMoreHint}>
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                    <Text style={styles.loadMoreText}>Desliza para ver más</Text>
                  </View>
                ) : null}
              </ScrollView>
              {!section.route ? (
                <View pointerEvents="none" style={styles.comingSoonOverlay}>
                  <View style={styles.comingSoonBadge}>
                    <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.comingSoonText}>PRÓXIMAMENTE</Text>
                  </View>
                </View>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F5F0",
    flex: 1,
  },
  content: {
    paddingBottom: 36,
  },
  heroHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 18,
    paddingTop: 12,
  },
  kicker: {
    color: "#8F651A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  mainTitle: {
    color: "#000000",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 2,
  },
  subtitle: {
    color: "#6A6965",
    fontSize: 14,
    marginTop: 2,
  },
  headerIcon: {
    alignItems: "center",
    backgroundColor: "#8F651A",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  bannerContainer: {
    height: 178,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#DDD5C5",
  },
  bannerImage: {
    height: "100%",
    width: "100%",
  },
  bannerShade: {
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  bannerCaption: {
    bottom: 30,
    left: 18,
    position: "absolute",
  },
  bannerCaptionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  bannerCaptionText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 3,
  },
  bannerDots: {
    bottom: 12,
    flexDirection: "row",
    gap: 6,
    left: 18,
    position: "absolute",
  },
  bannerDot: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 5,
    height: 7,
    width: 7,
  },
  bannerDotActive: {
    backgroundColor: "#FFFFFF",
    width: 22,
  },
  actionButtonsContainer: {
    gap: 8,
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E7E2D8",
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 12,
    shadowColor: "#302512",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  actionButtonPressed: {
    backgroundColor: "#EEE9DE",
    transform: [{ scale: 0.97 }],
  },
  actionButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "600",
  },
  activeOrderBanner: {
    alignItems: "center",
    backgroundColor: "#8F651A",
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  activeOrderIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  activeOrderCopy: {
    flex: 1,
  },
  activeOrderTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  activeOrderStatus: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 13,
    marginTop: 2,
  },
  loadingState: {
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center",
  },
  cafeteriaSection: {
    borderRadius: 22,
    marginHorizontal: 16,
    marginTop: 20,
    overflow: "hidden",
    paddingTop: 2,
    paddingBottom: 16,
    position: "relative",
  },
  comingSoonOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(20, 18, 14, 0.58)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  comingSoonBadge: {
    alignItems: "center",
    backgroundColor: "rgba(20, 18, 14, 0.78)",
    borderColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  comingSoonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitleText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerDivider: {
    backgroundColor: "#ffffff",
    height: 1,
    width: "100%",
  },
  subHeaderTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptySection: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  horizontalScrollContainer: {
    paddingLeft: 10,
    paddingRight: 24,
  },
  loadMoreHint: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    width: 76,
  },
  loadMoreText: {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 4,
    textAlign: "center",
  },
  productCard: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 18,
    marginRight: 12,
    padding: 10,
    width: 138,
  },
  productCardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  productImageWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
  },
  productImage: {
    height: 102,
    width: "100%",
  },
  productName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  viewProductLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    marginTop: 6,
  },
  viewProductText: {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 11,
    fontWeight: "700",
  },
});
