const fs = require('fs');
let code = fs.readFileSync('src/app/employee/inventory.tsx', 'utf8');

// Add searchQuery state
code = code.replace(
  /const \[localProducts, setLocalProducts\] = useState<Product\[\]>\(\[\]\);/,
  'const [localProducts, setLocalProducts] = useState<Product[]>([]);\n  const [searchQuery, setSearchQuery] = useState("");'
);

// Add search input to UI
const searchUI = `
        <View style={styles.headerRow}>
           <Text style={styles.subtitle}>Gestión de Existencias</Text>
        </View>
        <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
           <TextInput
              style={{ backgroundColor: '#F0F0F0', borderRadius: 12, padding: 12, fontSize: 16 }}
              placeholder="Buscar producto..."
              value={searchQuery}
              onChangeText={setSearchQuery}
           />
        </View>
`;
code = code.replace(/<View style=\{styles\.headerRow\}>\s*<Text style=\{styles\.subtitle\}>Gestión de Existencias<\/Text>\s*<\/View>/, searchUI);

// Filter and sort the data
code = code.replace(
  /data=\{localProducts\}/,
  'data={localProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name))}'
);

fs.writeFileSync('src/app/employee/inventory.tsx', code);
