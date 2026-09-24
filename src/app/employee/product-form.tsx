import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmployeeHeader } from "../../components/EmployeeHeader";
import { ProductImage } from "../../components/ProductImage";
import { endpoints } from "../../constants/api";
import { colors, employee } from "../../constants/theme";
import { useProductStore } from "../../stores/useProduct";
import { useUserStore } from "../../stores/useUserStore";

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const businessId = employeeCafeteria === "Busters" ? "BT" : "BS";
  
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Comidas");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      const product = products.find(p => p.id === id);
      if (product) {
        setName(product.name);
        setDescription(product.description);
        setPrice(String(product.price));
        setCategory(product.category);
        setSubcategory(product.subcategory || "");
        setImage(product.image);
      }
    }
  }, [id, isEditing, products]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // We will save the base64 string directly to DB
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(base64Image);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !price.trim() || !category.trim()) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos obligatorios.");
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        id: isEditing ? id : `${businessId}-${Date.now()}`,
        businessId,
        name,
        description,
        price: Number(price),
        category,
        subcategory,
        image,
        inStock: true
      };

      const url = isEditing ? `${endpoints.products}/${id}` : endpoints.products;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });

      if (!res.ok) throw new Error("Error al guardar");

      await fetchProducts();
      router.back();
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar el producto.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        style: "destructive", 
        onPress: async () => {
          try {
            await fetch(`${endpoints.products}/${id}`, { method: "DELETE" });
            await fetchProducts();
            router.back();
          } catch (e) {
            Alert.alert("Error", "No se pudo eliminar el producto.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.shell}>
      <SafeAreaView edges={["top"]} style={styles.shellTop}>
        <EmployeeHeader
          backLabel="Inventario"
          onBack={() => router.back()}
          title={isEditing ? "Editar Producto" : "Nuevo Producto"}
        />
      </SafeAreaView>
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.content}>
            
            <View style={styles.imagePickerContainer}>
               <Pressable style={styles.imagePicker} onPress={pickImage}>
                 {image ? (
                   <ProductImage image={image} name={name} style={styles.previewImage} contentFit="cover" />
                 ) : (
                   <View style={styles.placeholderImage}>
                     <Ionicons name="camera-outline" size={32} color={colors.textSecondary} />
                     <Text style={styles.placeholderText}>Añadir Imagen</Text>
                   </View>
                 )}
               </Pressable>
               {image ? (
                  <Pressable onPress={() => setImage("")} style={{ marginTop: 8 }}>
                      <Text style={{ color: colors.danger }}>Quitar imagen</Text>
                  </Pressable>
               ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>URL de la Imagen (opcional)</Text>
              <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://..." />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ej. Hamburguesa doble" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholder="Ingredientes y detalles" multiline />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Precio</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} onBlur={() => { if (price && !price.includes('.')) setPrice(price + '.00'); }} placeholder="0.00" keyboardType="numeric" />
            </View>

            
            <View style={styles.field}>
              <Text style={styles.label}>Categoría</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {["Comidas", "Bebidas", "Postres", "Snacks", "Promociones"].map(cat => (
                  <Pressable 
                    key={cat} 
                    onPress={() => setCategory(cat)}
                    style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                  >
                    <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>{cat}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {category === "Bebidas" && (
              <View style={styles.field}>
                <Text style={styles.label}>Subcategoría (ej: Frías, Calientes)</Text>
                <TextInput style={styles.input} value={subcategory} onChangeText={setSubcategory} placeholder="Ej. Frías" />
              </View>
            )}

            <Pressable 
              style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Guardar</Text>}
            </Pressable>

            {isEditing && (
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Eliminar Producto</Text>
              </Pressable>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: employee.accent + '20',
    borderColor: employee.accent,
  },
  categoryChipText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: employee.accent,
  },

  shell: { backgroundColor: employee.background, flex: 1 },
  shellTop: { backgroundColor: employee.background },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    overflow: "hidden",
  },
  content: {
    padding: 24,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: employee.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FFE5E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  deleteButtonText: {
    color: "#CC0A0A",
    fontWeight: "bold",
    fontSize: 16,
  }
});
