# TecmiFood - Team Syntax

**TecmiFood** es una aplicación móvil desarrollada en **React Native con Expo** diseñada para modernizar y optimizar la experiencia de compra en las cafeterías del campus de la Universidad Tecmilenio (en específico, **Beesweet** y **Busters**).

El objetivo principal de este proyecto es evitar las largas filas durante los recesos, permitiendo a los **clientes (principalmente alumnos)** realizar pedidos desde su celular, personalizar sus alimentos y recibir notificaciones cuando la comida esté lista. Que a su vez, otorga a los **empleados** una herramienta robusta (Panel de Cocina e Inventario) para gestionar el flujo de las órdenes y mantener actualizado el menú.

---

## Funcionalidades Principales

La aplicación se divide en dos experiencias de usuario totalmente personalizadas según su rol:

### Lado del Cliente

- **Navegación por Cafeterías:** Acceso a los menús de _Beesweet_ y _Busters_ categorizados (Comidas, Bebidas, Otros).
- **Personalización de Pedidos:** Capacidad para ajustar cantidades y añadir notas especiales o modificaciones a cada producto (ej. "Sin mayonesa", "Leche deslactosada").
- **Carrito de Compras Inteligente:** Un sistema de validación que impide acaparar productos y saturar de órdenes para mitigar malos usos de la aplicación (Límite máximo de **3 productos idénticos** y **8 productos en total** por orden (Maximo **3 órdenes al mismo tiempo**)).
- **Seguimiento de Órdenes (Tracking):** El alumno puede monitorear su orden en tiempo real (_Pendiente ➝ En Preparación ➝ Terminado ➝ Entregado_).
- **Favoritos y Perfil:** Opción de guardar comidas recurrentes y modificar preferencias (como el tema Claro/Oscuro).

### Lado del Empleado (Administración de Cafetería)

- **Dashboard de Órdenes:** Visualización en tiempo real de los pedidos entrantes mediante tarjetas de fácil lectura.
- **Gestión de Estatus:** Flujo de trabajo para mover un pedido desde la cola de espera hacia la cocina, y finalmente notificar al cliente que su plato está listo para recoger y pagar en el mostrador.
- **Historial de Ventas:** Registro de órdenes durante la jornada.
- **Manejo de Inventario:** CRUD (Crear, Leer, Actualizar, Borrar) para dar de alta nuevos platillos o desactivar (marcar como agotado) productos cuando falten insumos.

---

## Tecnologías Utilizadas y Arquitectura

El proyecto está construido sobre el ecosistema **MERN adaptado a Mobile** (MongoDB, Express, React Native, Node.js). La arquitectura separa el Front-End del Back-End comunicándose a través de una API RESTful.

### Frontend (App Móvil)

- **React Native + Expo (v57):** Permite programar con JavaScript/TypeScript y exportar una aplicación nativa para iOS, Android e incluso Web.
- **Expo Router:** Enrutamiento basado en archivos (`src/app`), similar a la web, lo cual facilita la navegación y la organización de pantallas.
- **TypeScript:** Añade tipado estático, reduciendo drásticamente los errores durante el desarrollo y autocompletando propiedades de los modelos.
- **Zustand:** Un gestor de estado global superrápido y minimalista que reemplaza a Redux. Maneja el carrito (`useCartStore`), la sesión del usuario (`useUserStore`) y las alertas en toda la app.
- **React Native Paper:** Librería de componentes que implementa "Material Design", acelerando el maquetado visual y garantizando accesibilidad y consistencia.

### Backend (Servidor y API)

- **Node.js y Express.js:** El motor de ejecución y framework minimalista para levantar el servidor web y enrutar las peticiones (`GET`, `POST`, `PUT`, `DELETE`).
- **MongoDB y Mongoose:** Base de datos NoSQL en la nube (MongoDB Atlas). _Mongoose_ actúa como "Object Data Modeling" para obligar a que los datos cumplan con un esquema (Ej. evitar que una orden no tenga precio).
- **Render.com (Despliegue en la Nube):** La API en producción se encuentra alojada de manera gratuita y segura en [Render](https://render.com). El frontend móvil consume los endpoints directamente desde `https://tecmifood-team-syntax.onrender.com`. Esto permite que la aplicación funcione en cualquier celular sin necesidad de correr el servidor localmente.

---

## Estructura del Proyecto e Importancia de sus Archivos

En este proyecto optamos por utilizar una organización modular y escalable.
A continuación se explica el por qué y para qué de las carpetas y archivos más relevantes del proyecto:

### Estructura Frontend (`/src`)

- **`app/`**: Contiene la navegación. Al usar _Expo Router_, cada archivo aquí es literalmente una pantalla.
  - `_layout.tsx`: Es el archivo maestro de navegación. Configura barras superiores, menús y temas globales de la app.
  - `(tabs)/`: Contiene los menús de la barra de navegación inferior del cliente (`home.tsx`, `cart.tsx`, `profile.tsx`).
  - `employee/`: Rutas protegidas exclusivas para el staff (`orders.tsx`, `preparing.tsx`, `inventory.tsx`). Separa la lógica administrativa de la vista del consumidor o cliente.
  - `cafeteria/`: Pantallas dinámicas (como `[category].tsx`) que reciclan un mismo diseño visual pero cargan diferentes productos dependiendo si abres "Beesweet" o "Busters".
- **`stores/`**: Donde "vive" la memoria global de la app.
  - `useCartStore.ts`: Aquí se ejecuta la regla de negocio del carrito. Contiene funciones que evalúan la cantidad de productos añadidos y bloquean la acción si superas el límite por estudiante (3 iguales / 8 total y el límite de ordenes al mismo tiempo (3)).
  - `useUserStore.ts`: Guarda quién está usando la app y su rol (Cliente o Empleado).
- **`constants/`**: Archivos de configuración general que evitan repetir código.
  - `theme.ts`: Es el manual de diseño. Contiene paletas de colores (Claro y Oscuro), sombras, tamaños de letra y bordes. Si queremos cambiar el color de la app, se puede hacer en este único archivo.
  - `api.ts`: Archivo central que guarda la URL base de nuestro servidor (**Render**), para evitar escribirla manualmente en cada llamada a red (fetch).
  - `productsImages.ts`: Archivo con inteligencia propia. Utiliza un algoritmo de "Distancia de Levenshtein" para leer el nombre de un producto de la base de datos (incluso si está mal escrito) y asignarle la mejor foto disponible del menú local.
- **`components/`**: Pequeñas piezas visuales reciclables.
  - `ProductCard.tsx`: La tarjeta genérica donde se pinta cada producto.
  - `ThemeReveal.tsx`: Maneja la animación que se muestra cuando el usuario cambia entre el Modo Claro y Oscuro.

### Estructura Backend (`/backend`)

- **`index.js`**: El archivo que levanta el servidor, conecta con la base de datos Atlas y activa los CORS.
- **`models/`**: Definen "Cómo lucen los datos".
  - `Order.js`: Define la estructura de un pedido. Requiere estrictamente los IDs de producto y asigna el estado inicial de una orden como `Pendiente`.
  - `Product.js` y `User.js`: Definen colecciones del catálogo e información de inicio de sesión de los usuarios.
- **`routes/`**: Archivos controladores que procesan la comunicación de red.
  - `orders.js` y `products.js`: Exponen los "endpoints" (ej. `/api/orders`) para que el frontend envíe JSON y estos lo guarden en MongoDB de forma asíncrona.

---

## Almacenamiento de Datos (Base de Datos)

Todo el flujo dinámico se guarda en **MongoDB Atlas**. Hemos dividido los registros en distintas Colecciones:

1.  **`Products` (Productos):** Almacena los productos del menú (`businessId`, `name`, `price`, `category`, `status`).
2.  **`Orders` (Órdenes):** Almacena el historial de ventas. Cada orden guarda un arreglo de productos, modificaciones en formato de texto, precio total y un estado transicional (`Pendiente` -> `Terminado`).
3.  **`Cafeterias`:** Colección para controlar variables de entorno, como activar un "Modo Cerrado/Abierto" si la cafetería ya cerró operaciones ese día.

_El Frontend no manipula bases de datos; utiliza `fetch` o hooks personalizados como `useOrders.ts` para pedir al backend que haga las consultas y devuelva JSON._

---

## Guía de Instalación y Configuración

Dado que la aplicación ya está conectada al backend productivo en **Render** (`https://tecmifood-team-syntax.onrender.com`), **sólo necesitas levantar el entorno móvil (Frontend) para probar la app**. Sin embargo, a continuación se listan ambos procesos por si se desea modificar código del servidor localmente.

### Pre-requisitos

- Tener instalado [Node.js](https://nodejs.org/es/).
- Instalar la herramienta Expo CLI (`npm install -g expo-cli`).
- Tener la app _Expo Go_ descargada en tu dispositivo móvil (iOS/Android), o tener instalado Android Studio para emulación local.

### Paso 1: Levantar el Frontend (Aplicación Móvil con Expo)

Abre tu terminal y ubícate en la raíz del proyecto.

```bash
#1. Instala todas las dependencias de React Native / Expo
npm install

#2. Inicia la aplicación móvil
npx expo start
```

_Al correr `npx expo start`, aparecerá un código QR en tu terminal. Escanéalo con la aplicación Expo Go en tu teléfono._

### Paso 2 (Opcional): Configurar Backend para Pruebas Locales

Si necesitas hacer cambios en el servidor (en la carpeta `backend/`) y no quieres afectar la aplicación en producción alojada en Render:

```bash
#1. Entra a la carpeta del servidor
cd backend

#2. Instala los paquetes necesarios de Node
npm install

#3. Configura tus variables locales
#Crea un archivo .env en la carpeta 'backend' con la info de la Base de Datos:
#MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/tecmifood
#PORT=5000

#4. Inicia el servidor de prueba
npm run dev
```

**Nota Importante:** Si levantas el servidor localmente, asegúrate de ir al archivo `/src/constants/api.ts` de la aplicación móvil y cambiar temporalmente la URL de Render por `http://localhost:5000` para que la app se comunique con tu computadora.

### Notas para Windows (Problemas de Scripts)

Es preferible hacer esto desde una terminal cmd, ya que aveces PowerShell bloquea la ejecución de Expo por directivas de seguridad.
