export const productsImages = {
    "CJQ": require("../../assets/images/product-icons/CJQ.png"),
    "Latte": require("../../assets/images/product-icons/Latte.png"),
    "Espresso": require("../../assets/images/product-icons/Espresso.png"),
    "Arizona GT": require("../../assets/images/product-icons/Arizona GT.png"),
    "Mocha": require("../../assets/images/product-icons/Mocha.png"),
    "Pan de platano": require("../../assets/images/product-icons/PanPlatano.png"),
    "Ate": require("../../assets/images/product-icons/ate.png"),
    "AguaMine": require("../../assets/images/product-icons/AguaMine.png"),
    "Avena": require("../../assets/images/product-icons/Avena.jpg"),
    "BanApp": require("../../assets/images/product-icons/BanApp.png"),
    "ChaiFrap": require("../../assets/images/product-icons/ChaiFrap.jpg"),
    "C&CFrap": require("../../assets/images/product-icons/C&CFrap.jpg"),
    "CaraFrap": require("../../assets/images/product-icons/CaraFrap.jpg"),
    "ChapataPomo": require("../../assets/images/product-icons/chapataPomo.jpg"),
    "CroissantNute": require("../../assets/images/product-icons/CroissantNute.jpg"),
    "D2Queso": require("../../assets/images/product-icons/D2Queso.jpg"),
    "GalletaChispa": require("../../assets/images/product-icons/GalletaChispa.jpg"),
    "GalletaKinder": require("../../assets/images/product-icons/GalletaKinder.jpg"),
    "MochaFrap": require("../../assets/images/product-icons/mochafrap.jpg"),
    "PizzaPita": require("../../assets/images/product-icons/PizzaPita.jpg"),
    "Smoothie": require("../../assets/images/product-icons/Smoothie.jpg"),
    "TisanaFrap": require("../../assets/images/product-icons/TisanaFrap.jpg"),
    "Yogurt": require("../../assets/images/product-icons/yogurt.jpg"),
    "Arizona": require("../../assets/images/product-icons/Arizona.png"),
};

export function getProductImageSource(image: string) {
    if (image.startsWith("http")) {
        return { uri: image };
    }

    return productsImages[image as keyof typeof productsImages] ?? productsImages.AguaMine;
}
