/** Imagen de producto. Si la foto no corresponde al nombre, el espacio queda en blanco. */
import { Image, type ImageContentFit, type ImageStyle } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveProductImageSource } from "../constants/images";

type ProductImageProps = {
  image?: string | null;
  name?: string | null;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
};

export function ProductImage({
  image,
  name,
  style,
  imageStyle,
  contentFit = "cover",
}: ProductImageProps) {
  const source = resolveProductImageSource({ image, name });

  return (
    <View style={[styles.frame, style]}>
      {source ? (
        <Image
          contentFit={contentFit}
          source={source}
          style={[styles.image, imageStyle]}
          transition={180}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
