**Diagrama de arquitectura - Banca en Línea**

Descripción rápida

- Este diagrama (`architecture.svg`) muestra el flujo de la aplicación desde el punto de entrada `App.tsx` hacia los providers (Redux, Auth, Language, Theme), luego al `NavigationContainer` y `StackNavigator`, y finalmente a las pantallas y componentes.

Estructura mostrada

- `App.tsx`: Punto de entrada; envuelve con `Provider` (Redux) y los context providers.
- `Providers`: `AuthProvider`, `LanguageProvider`, `ThemeProvider`.
- `NavigationContainer` → `StackNavigator` → `TabsNavigator`.
- `Screens`: `LoginScreen`, `HomeScreen`, `AccountsScreen`, `AccountDetailScreen`, `TransferScreen`, `ProfileScreen`, `SettingsScreen`.
- `Screens`: `LoginScreen`, `HomeScreen`, `AccountsScreen`, `AccountDetailScreen`, `TransferScreen`, `SettingsScreen`.
- `components/`: Componentes reutilizables usados dentro de las pantallas.
- `store/`, `data/`, `utils/`: Estado global, datos de ejemplo y utilidades (traducciones, tema).
- `assets/`: Iconos, splash y recursos.

Cómo abrir el diagrama

- En VS Code: abre `docs/architecture.svg` para verlo en el editor.
- Alternativamente, puedes abrirlo con cualquier visor de imágenes/ navegadores.

Siguientes pasos (opcional)

- Convertir a PNG para compartir fuera del repo.
- Generar un diagrama más detallado (flujos de Redux, acciones y reducers, o secuencia de navegación).

Si quieres que genere la versión PNG o añada más detalle, dime qué área expandir (navegación, store, contextos, componentes).
