import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Animated,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import SafeView from "../../../components/SafeView";
import { colors, radii, spacing } from "../../../constants/theme";
import productsData from "../../../data/products.json";

type Product = {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: string;
  category: string;
  modifications?: string;
};

type CafeteriaSection = {
  title: string;
  headerColor: string;
  cardBgColor: string;
  route?: any;
  data: Product[];
};

const allProducts = productsData as Product[];
const promotionImages = [
  require("../../../../assets/images/promotionBanner/PromocionBustersTest.jpg"),
  require("../../../../assets/images/promotionBanner/PromocionTest.jpg"),
  require("../../../../assets/images/promotionBanner/PromocionalTecmilenio.png"),
];

const cafeteriaSections: CafeteriaSection[] = [
  {
    title: "BUSTERS",
    headerColor: "#8F651A",
    cardBgColor: "#8F651A",
    route: "/client/cafeterias/bustershome",
    data: allProducts.filter(
      (product) => product.businessId === "BT" && product.status === "active",
    ),
  },
  {
    title: "BEE SWEET",
    headerColor: "#d4af37",
    cardBgColor: "#e2bf43",
    data: [
      {
        id: "BS-001",
        name: "Panqué",
        description: "Panqué clásico",
        businessId: "BS",
        price: 102.0,
        image: "",
        status: "active",
        category: "Alimentos",
      },
      {
        id: "BS-003",
        businessId: "BS",
        name: "Chocolatín",
        description: "Pan de chocolatín",
        price: 35.0,
        image: "",
        status: "active",
        category: "Alimentos",
      },
      {
        id: "BS-004",
        businessId: "BS",
        name: "Muffin Chocolate",
        description: "Muffin relleno de chocolate",
        price: 49.0,
        image: "",
        status: "active",
        category: "Alimentos",
      },
    ],
  },
];

export default function HomeScreen() {
  const [activePromotion, setActivePromotion] = useState(0);
  const [promotionOpacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const promotionInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(promotionOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(promotionOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      setActivePromotion((current) => (current + 1) % promotionImages.length);
    }, 4000);

    return () => clearInterval(promotionInterval);
  }, [promotionOpacity]);

  return (
    <SafeView style={styles.safeArea}>
      {/* Barra de notificaciones*/}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Título Principal*/}
        <Text style={styles.mainTitle}>CAFETERÍAS</Text>
        <View style={styles.titleDivider} />

        {/* Banner Promocional */}
        <View style={styles.bannerContainer}>
          <Animated.Image
            source={promotionImages[activePromotion]}
            resizeMode="cover"
            style={[styles.bannerImage, { opacity: promotionOpacity }]}
          />
          <View style={styles.promotionIndicators}>
            {promotionImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.promotionDot,
                  index === activePromotion && styles.activePromotionDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Botones de Acceso Rápido */}
        <View style={styles.ActionButtonsContainer}>
          <Pressable style={styles.ActionButton}>
            <Ionicons name="heart-outline" size={22} color="#000000" />
            <Text style={styles.ActionButtonText}>Favoritos</Text>
          </Pressable>
          <Pressable style={styles.ActionButton}>
            <Ionicons name="time-outline" size={22} color="#000000" />
            <Text style={styles.ActionButtonText}>Historial</Text>
          </Pressable>
          <Pressable style={styles.ActionButton}>
            <Ionicons name="document-text-outline" size={22} color="#000000" />
            <Text style={styles.ActionButtonText}>Pedidos</Text>
          </Pressable>
        </View>

        {/* Secciones BUSTERS / BEE-SWEET */}
        {cafeteriaSections.map(
          (
            section, //Por cada cafeteria del array "cafeteriaSections" se crea un apartado
          ) => (
            <View
              key={section.title}
              style={[
                styles.cafeteriaSection,
                { backgroundColor: section.cardBgColor },
              ]}
            >
              <Pressable
                style={[
                  styles.sectionHeader,
                  { backgroundColor: section.headerColor },
                ]}
                onPress={() => {
                  if (section.route) {
                    router.push({
                      pathname: section.route,
                      params: { name: section.title },
                    });
                  }
                }}
              >
                <Text style={styles.sectionTitleText}>{section.title}</Text>
                <Ionicons name="chevron-forward" size={22} color="#ffffff" />
              </Pressable>
              <View style={styles.headerDivider} />
              <Text style={styles.subHeaderTitle}>Más vendidos:</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContainer}
                nestedScrollEnabled={true}
              >
                {section.data.map((item) => (
                  <View key={item.id} style={styles.productCard}>
                    {/*Cambiar el ".id" por la categoria de "Más vendidos" cuando lo tengamos*/}
                    <View style={styles.productImageWhiteBox} />
                    {/*Aquí debería ir la imagen del producto*/}
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ),
        )}
      </ScrollView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  mainTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginTop: spacing.screen,
  },
  titleDivider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginHorizontal: spacing.screen,
    marginBottom: 10,
  },
  bannerContainer: {
    height: 110,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: radii.medium,
    borderWidth: 0,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  promotionIndicators: {
    bottom: 8,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
  },
  promotionDot: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 5,
    borderWidth: 1,
    height: 9,
    width: 9,
  },
  activePromotionDot: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    width: 22,
  },
  ActionButtonsContainer: {
    gap: 8,
    flexDirection: "row",
    marginHorizontal: spacing.screen,
    marginTop: 12,
  },
  ActionButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  ActionButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  cafeteriaSection: {
    borderRadius: radii.large,
    marginHorizontal: spacing.screen,
    marginTop: 20,
    overflow: "hidden",
    paddingBottom: 16,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitleText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "bold",
  },
  headerDivider: {
    backgroundColor: "#ffffff",
    height: 1,
    width: "100%",
  },
  subHeaderTitle: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 16,
    marginVertical: 6,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    borderRadius: 16,
    marginRight: 12,
    padding: 10,
    width: 120,
  },
  productImageWhiteBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    height: 90,
    marginBottom: 8,
    width: "100%",
  },
  productName: {
    color: colors.surface,
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
});
