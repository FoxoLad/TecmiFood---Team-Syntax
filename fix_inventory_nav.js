const fs = require('fs');
let code = fs.readFileSync('src/app/employee/inventory.tsx', 'utf8');

// Replace itemRow View with Pressable
code = code.replace(
  /<View style=\{styles\.itemRow\}>/g, 
  '<Pressable style={styles.itemRow} onPress={() => router.push({ pathname: "/employee/product-form", params: { id: item.id } })}>'
);
code = code.replace(
  /<\/View>\n\s*<\/View>\n\s*\)\}\n\s*\/>/g, 
  '</View>\n                   </Pressable>\n             )}\n           />'
);

// Add FAB before </SafeAreaView> (the bottom one)
const fab = `
        <Pressable 
          style={styles.fab} 
          onPress={() => router.push("/employee/product-form")}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </Pressable>
`;
code = code.replace(/<\/SafeAreaView>\n\s*<\/View>/, fab + '      </SafeAreaView>\n    </View>');

// Add fab styles
const fabStyles = `
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: employee.accent,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
`;
code = code.replace(/}\);\n*$/, fabStyles);

fs.writeFileSync('src/app/employee/inventory.tsx', code);
