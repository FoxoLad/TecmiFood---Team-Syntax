const fs = require('fs');
let code = fs.readFileSync('src/app/employee/product-form.tsx', 'utf8');

// 1. Fix ImagePicker MediaTypeOptions warning
code = code.replace(/ImagePicker\.MediaTypeOptions\.Images/g, "['images']");

// 2. Add 'Picker' import if not available, but since standard Picker requires a separate library (@react-native-picker/picker), 
// I'll just use a horizontal scroll view with simple choice chips for categories.
const categoryChoices = `
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
`;

code = code.replace(
  /<View style=\{\[styles\.field, \{ flex: 1, marginRight: 8 \}\]\}>\s*<Text style=\{styles\.label\}>Categoría<\/Text>\s*<TextInput style=\{styles\.input\} value=\{category\} onChangeText=\{setCategory\} placeholder="Ej\. Comidas" \/>\s*<\/View>/g,
  categoryChoices
);

// 3. Conditionally render Subcategory input
code = code.replace(
  /<View style=\{\[styles\.field, \{ flex: 1, marginLeft: 8 \}\]\}>\s*<Text style=\{styles\.label\}>Subcategoría<\/Text>\s*<TextInput style=\{styles\.input\} value=\{subcategory\} onChangeText=\{setSubcategory\} placeholder="Ej\. Frías" \/>\s*<\/View>/g,
  `{category === "Bebidas" && (
              <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Subcategoría</Text>
                <TextInput style={styles.input} value={subcategory} onChangeText={setSubcategory} placeholder="Ej. Frías" />
              </View>
            )}`
);
// Also fix the <View style={styles.row}> wrapping them if needed. Actually it's fine if they sit in a row, wait, category choices will take the whole width. Let's fix the row wrapper.
code = code.replace(
  /<View style=\{styles\.row\}>[\s\S]*?\{category === "Bebidas" && \([\s\S]*?<\/View>\s*\)\}\s*<\/View>/g,
  categoryChoices + `\n            {category === "Bebidas" && (
              <View style={styles.field}>
                <Text style={styles.label}>Subcategoría (ej: Frías, Calientes)</Text>
                <TextInput style={styles.input} value={subcategory} onChangeText={setSubcategory} placeholder="Ej. Frías" />
              </View>
            )}`
);

// 4. Price onBlur formatting
code = code.replace(
  /onChangeText=\{setPrice\} placeholder="0\.00" keyboardType="numeric" \/>/,
  `onChangeText={setPrice} onBlur={() => { if (price && !price.includes('.')) setPrice(price + '.00'); }} placeholder="0.00" keyboardType="numeric" />`
);

// 5. Add Image URL input field
const imageUrlInput = `
            <View style={styles.field}>
              <Text style={styles.label}>URL de la Imagen (opcional)</Text>
              <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://..." />
            </View>
`;
code = code.replace(/<\/View>\s*<View style=\{styles\.field\}>\s*<Text style=\{styles\.label\}>Nombre<\/Text>/, `</View>\n${imageUrlInput}\n            <View style={styles.field}>\n              <Text style={styles.label}>Nombre</Text>`);

// Add styles for category chips
const chipStyles = `
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
`;
code = code.replace(/const styles = StyleSheet\.create\(\{/, `const styles = StyleSheet.create({\n${chipStyles}`);

fs.writeFileSync('src/app/employee/product-form.tsx', code);
