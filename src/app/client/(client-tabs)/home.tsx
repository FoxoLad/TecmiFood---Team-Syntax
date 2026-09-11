import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SafeView from "../../../components/SafeView";

//Definición de productos y secciones
type Modification = {
  name: string;
  price: number;
};

type Product = {
  _id?: string;
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  subcategory?: string;
  modifications?: Modification[];
};

type CafeteriaSection = {
  businessId: string;
  title: string;
  headerColor: string;
  cardBgColor: string;
  route?: any;
  data: Product[];
};

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //Enlace de producción en Render
  const API_URL = "https://tecmifood-team-syntax.onrender.com/api/productos";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando productos desde", API_URL, ":", error);
        setIsLoading(false);
      });
  }, []);

  const cafeteriaSections: CafeteriaSection[] = [
    {
      businessId: "BT",
      title: "BUSTERS",
      headerColor: "#8F651A",
      cardBgColor: "#8F651A",
      route: "/client/cafeterias/bustershome",
      data: allProducts.filter(
        (product) => product.businessId === "BT" && product.inStock === true,
      ),
    },
    {
      businessId: "BS",
      title: "BEE SWEET",
      headerColor: "#d4af37",
      cardBgColor: "#e2bf43",
      //DATOS SIMULADOS TEMPORALES PARA BEE SWEET (BORRAR CUANDO SE SUBAN LOS PRODUCTOS A MONGODB)
      data: [
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
      ],
    },
  ];

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
        {/*Titulo Principal*/}
        <Text style={styles.mainTitle}>CAFETERÍAS</Text>
        <View style={styles.titleDivider} />

        {/*Banner Promocional*/}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../../../assets/images/promotionBanner/PromocionalPrueba.jpg")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/*Botones de acción*/}
        <View style={styles.ActionButtonsContainer}>
          <Pressable style={styles.ActionButton}>
            <Ionicons name="heart-outline" size={16} color="#000000" />
            <Text style={styles.ActionButtonText}>Favoritos</Text>
          </Pressable>
          <Pressable style={styles.ActionButton}>
            <Ionicons name="time-outline" size={16} color="#000000" />
            <Text style={styles.ActionButtonText}>Historial</Text>
          </Pressable>
          <Pressable style={styles.ActionButton}>
            <Ionicons name="document-text-outline" size={16} color="#000000" />
            <Text style={styles.ActionButtonText}>Pedidos</Text>
          </Pressable>
        </View>

        {/*Mensaje de cargando mientras conecta con MongoDB*/}
        {isLoading ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#8F651A" />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Cargando menú...
            </Text>
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

              {/*Scroll horizontal de productos*/}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContainer}
                nestedScrollEnabled={true}
              >
                {section.data.map((item) => (
                  <View key={item.id} style={styles.productCard}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.productImageWhiteBox} />
                    )}

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
          ))
        )}
      </ScrollView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  mainTitle: {
    color: "#000000",
    fontSize: 35,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 5,
  },
  titleDivider: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  bannerContainer: {
    height: 110,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000000",
    overflow: "hidden",
    backgroundColor: "#eaeaea",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  ActionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 12,
  },
  ActionButton: {
    alignItems: "center",
    borderColor: "#000000",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ActionButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "600",
  },
  cafeteriaSection: {
    borderRadius: 20,
    marginHorizontal: 16,
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
  productImage: {
    borderRadius: 12,
    height: 90,
    marginBottom: 8,
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
});
