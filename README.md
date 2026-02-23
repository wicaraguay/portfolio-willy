# Portafolio Willy Tech 🚀

Este es el repositorio de mi portafolio profesional, construido con tecnologías modernas y desplegado de forma serverless en **Firebase**.

## 🛠️ Tecnologías

- **Frontend**: React + Vite + Tailwind CSS
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Iconografía**: Lucide React
- **Backend & DB**: Firebase (Firestore + Authentication + Storage)
- **Hosting**: Firebase Hosting

## 🚀 Instalación y Desarrollo Local

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/nombre-del-repo.git
    cd nombre-del-repo
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Firebase**:
    - Crea un proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
    - Habilita Firestore, Authentication (Email/Password) y Storage.
    - Crea un archivo `src/lib/firebase.ts` con tus credenciales (puedes guiarte de la estructura del proyecto).

4.  **Correr localmente**:
    ```bash
    npm run dev
    ```

## 📦 Despliegue

El proyecto está configurado para desplegarse fácilmente:

```bash
npm run deploy
```

Este comando construye el proyecto y lo sube automáticamente a Firebase Hosting.

## 🛡️ Administración

El panel de administración se encuentra en `/admin`. Está protegido por Firebase Authentication, permitiendo gestionar el contenido del portafolio (textos, habilidades, imágenes) de forma dinámica sin tocar el código.

---
Creado con ❤️ por Willan Caraguay
