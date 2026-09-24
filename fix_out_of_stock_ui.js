const fs = require('fs');

const bustersCode = fs.readFileSync('src/app/client/cafeterias/bustershome.tsx', 'utf8');
const beeSweetCode = fs.readFileSync('src/app/client/cafeterias/beesweethome.tsx', 'utf8');

const regex = /<Pressable[\s\S]*?key=\{product\.id\}[\s\S]*?onPress=\{[\s\S]*?\}[\s\S]*?style=\{styles\.gridItem\}>[\s\S]*?<ProductImage[\s\S]*?\/>[\s\S]*?<View style=\{styles\.gridContent\}>[\s\S]*?<Text numberOfLines=\{2\} style=\{styles\.gridName\}>\{product\.name\}<\/Text>[\s\S]*?<Text style=\{styles\.gridPrice\}>\$\{product\.price\.toFixed\(2\)\}<\/Text>[\s\S]*?<\/View>[\s\S]*?<View style=\{styles\.plusIcon\}>[\s\S]*?<Ionicons color=\{colors\.text\} name="add" size=\{20\} \/>[\s\S]*?<\/View>[\s\S]*?<\/Pressable>/;

const replacement = `
        <Pressable
            key={product.id}
            disabled={!product.inStock}
            onPress={() => router.push({
                pathname: "/client/cafeterias/product/[id]",
                params: { id: product.id },
            })}
            style={[styles.gridItem, !product.inStock && { opacity: 0.5 }]}
        >
            <View>
               <ProductImage
                   contentFit="contain"
                   image={product.image}
                   name={product.name}
                   style={styles.gridImage}
               />
               {!product.inStock && (
                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                       <Text style={{ backgroundColor: '#CC0A0A', color: 'white', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold', fontSize: 12 }}>AGOTADO</Text>
                   </View>
               )}
            </View>
            <View style={styles.gridContent}>
                <Text numberOfLines={2} style={styles.gridName}>{product.name}</Text>
                <Text style={styles.gridPrice}>\${product.price.toFixed(2)}</Text>
            </View>
            {product.inStock && (
               <View style={styles.plusIcon}>
                   <Ionicons color={colors.text} name="add" size={20} />
               </View>
            )}
        </Pressable>
`;

fs.writeFileSync('src/app/client/cafeterias/bustershome.tsx', bustersCode.replace(regex, replacement.trim()));
fs.writeFileSync('src/app/client/cafeterias/beesweethome.tsx', beeSweetCode.replace(regex, replacement.trim()));
