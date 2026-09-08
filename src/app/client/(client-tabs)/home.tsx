import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SafeView from "../../../components/SafeView";

type Cafeteria = {
  name: string;
  imageUrl: string;
};
// This is a placeholder for the cafeterias data. In a real application, you would fetch this data from an API or a database.
const cafeterias: Cafeteria[] = [
  { name: "BUSTERS", imageUrl: "" },
  { name: "BEESWEET", imageUrl: "" },
  { name: "MÁS CAFÉ", imageUrl: "" },
];

export default function HomeScreen() {
  const [selectedCafeteria, setSelectedCafeteria] = useState<string | null>(null);

  return (
    <SafeView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>CAFETERÍAS</Text>

        {cafeterias.map((cafeteria) => {
          const isSelected = selectedCafeteria === cafeteria.name;

          return (
            <Pressable
              accessibilityLabel={`Seleccionar ${cafeteria.name}`}
              accessibilityRole="button"
              key={cafeteria.name}
              onPress={() => setSelectedCafeteria(cafeteria.name)}
              style={[styles.card, isSelected && styles.selectedCard]}
            >
              <View style={styles.imageFrame}>
                {cafeteria.imageUrl ? (
                  <Image
                    accessibilityLabel={`Imagen de ${cafeteria.name}`}
                    contentFit="cover"
                    source={cafeteria.imageUrl}
                    style={styles.image}
                  />
                ) : null}
                <View style={styles.nameOverlay}>
                  <Text style={styles.cafeteriaName}>{cafeteria.name}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#cbc583",
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  title: {
    borderBottomColor: "rgba(255, 255, 255, 0.65)",
    borderBottomWidth: 1,
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    paddingBottom: 6,
    paddingTop: 4,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f6f2d9",
    borderRadius: 32,
    marginHorizontal: 5,
    marginTop: 36,
    padding: 9,
  },
  selectedCard: {
    backgroundColor: "#ffffff",
  },
  imageFrame: {
    alignItems: "center",
    aspectRatio: 1.75,
    backgroundColor: "#e5dfb7",
    borderRadius: 25,
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  nameOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  cafeteriaName: {
    color: "#ffffff",
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center",
  },
});