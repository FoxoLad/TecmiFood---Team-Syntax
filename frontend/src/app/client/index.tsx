/** Atajo de /client hacia la pestaña de inicio. */
import { Redirect } from "expo-router";

export default function ClientIndexScreen() {
  return <Redirect href="/client/home" />;
}
