# TecmiFood - Team Syntax

Expo/React Native app to view products and orders from two flows: client and employee.

## Requirements

- Node.js
- npm
- Expo CLI
- Android Studio with an emulator configured (optional if you want to view the app on Android)

## 1. Install dependencies

```bash
npm install
```

## 2. Start the project

```bash
npx expo start
```

## 3. View the web app

To view the app in the browser:

```bash
npx expo start --web
```

Then open the URL shown by Expo, usually something like:

```text
http://localhost:8081
```

And in the browser you can go to these routes:

- Client:
  ```text
  http://localhost:8081/client/products
  ```

- Employee:
  ```text
  http://localhost:8081/employee/orders
  ```

## 4. View it from Android

### Option A: Android emulator

1. Open Android Studio.
2. Start an Android emulator.
3. In the project terminal run:

```bash
npx expo start --android
```

This will open the app in the emulator if it is configured correctly.

### Option B: Expo Go on a physical device

1. Install Expo Go on your Android phone.
2. Run:

```bash
npx expo start
```
3. Scan the QR code from your phone.

### Routes inside the app

The default flow goes to the client view:

```text
/client/products
```

The employee view is at:

```text
/employee/orders
```

## 5. Current screen flow

- Client: products and product detail
- Employee: orders

## 6. Useful commands

```bash
npx expo start
npx expo start --web
npx expo start --android
npx tsc --noEmit
```

## 7. Note

If the project does not start because of script restrictions on Windows, you can use:

```powershell
powershell -ExecutionPolicy Bypass -NoLogo -Command "Set-Location 'path\to\project'; npx expo start --web"
```


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
