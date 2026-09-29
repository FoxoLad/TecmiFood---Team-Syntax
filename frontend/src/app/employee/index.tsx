/** Atajo de /employee hacia la lista de órdenes. */
import { Redirect } from "expo-router";

export default function EmployeeIndexScreen() {
    return <Redirect href="/employee/orders" />;
}
