import * as Device from 'expo-device';
import { Platform } from 'react-native';

let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn("expo-notifications no está disponible en este entorno (probablemente Expo Go SDK 53+).");
}

export async function registerForPushNotificationsAsync() {
  let token = null;

  if (!Notifications) {
    console.warn("Notificaciones Push desactivadas porque expo-notifications no se pudo cargar.");
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Fallo al obtener los permisos para las notificaciones push.');
      return null;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Token de Notificación Push:", token);
    } catch (e) {
      console.error("Error al obtener token de push:", e);
    }
  } else {
    console.log('Debes usar un dispositivo físico para las Notificaciones Push');
  }

  return token;
}
