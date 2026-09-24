const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const regex = /<Pressable\s*accessibilityLabel="Ver ventas"[\s\S]*?<\/Pressable>/;
const replacement = `
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable
                accessibilityLabel="Inventario"
                accessibilityRole="button"
                onPress={() => router.push("/employee/inventory")}
                style={style.historyButton}
              >
                <Ionicons color={employee.accent} name="cube-outline" size={24} />
              </Pressable>
              <Pressable
                accessibilityLabel="Ver ventas"
                accessibilityRole="button"
                onPress={() => router.push("/employee/history")}
                style={style.historyButton}
              >
                <Ionicons color={employee.accent} name="bar-chart-outline" size={24} />
              </Pressable>
            </View>
`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync('src/app/employee/orders/index.tsx', code);
