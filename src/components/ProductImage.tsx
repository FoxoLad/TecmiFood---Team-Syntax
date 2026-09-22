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
  return (
    <View style={[styles.frame, style]}>
      <Image
        contentFit={contentFit}
        source={resolveProductImageSource({ image, name })}
        style={[styles.image, imageStyle]}
        transition={180}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
