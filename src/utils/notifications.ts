import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log(
        "Fallo al obtener los permisos para las notificaciones push.",
      );
      return;
    }

    //Configura projectId si usas EAS Build, si no, lo intenta resolver solo.
    //Usamos el ID del bundle / project.
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Token de Notificaci�n Push:", token);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(
      "Debes usar un dispositivo f�sico para las Notificaciones Push",
    );
  }

  return token;
}
