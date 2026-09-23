/** La app abre directo en el inicio del cliente. */
import { Redirect } from "expo-router";

export default function AppIndex() {
    return <Redirect href="/client/home" />;
}
