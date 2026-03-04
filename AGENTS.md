# AGENTS.md - Project Standards & Guidelines

Este archivo sirve como la "memoria técnica" y guía de estilo para los agentes de IA y colaboradores que trabajen en este proyecto.

## 1. Contexto Tecnológico
- **Framework**: React 19 (Vite)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Backend/DB**: Firebase (Firestore, Storage, Auth)
- **Animaciones**: Motion (framer-motion)

## 2. Estructura de Carpetas Sugerida (Modularización)
Actualmente el proyecto tiene componentes muy grandes (`Portfolio.tsx`, `AdminPanel.tsx`). Se recomienda migrar a esta estructura:

```text
src/
├── assets/             # Recursos estáticos (imágenes, SVGs)
├── components/         # Componentes de UI reutilizables
│   ├── ui/             # Botones, inputs, tarjetas (atómicos)
│   ├── portfolio/      # Secciones específicas del Portfolio (Hero, Experience, Skills)
│   └── admin/          # Sub-secciones del Panel de Administración
├── hooks/              # Custom hooks para lógica de negocio
├── lib/                # Configuraciones de librerías externas (firebase.ts)
├── services/           # Lógica de comunicación con Firebase/APIs
├── types/              # Definiciones de interfaces y tipos TypeScript
└── utils/              # Funciones auxiliares puras
```

## 3. Patrones de Diseño
- **Componentes Funcionales**: Siempre usar `FC` de React o funciones estándar con tipos para props.
- **Service Pattern**: Extraer la lógica de Firebase (get/add/delete) a la carpeta `services/` para que los componentes solo se encarguen de la UI.
- **Custom Hooks**: Si un componente tiene mucho estado o lógica compleja (ej: formularios de admin), crear un hook como `useAdminProjects.ts`.
- **Atomic Design Lite**: Separar componentes pequeños de las secciones grandes para mejorar la legibilidad.

## 4. Estándar de Variables y Nombrado
- **Componentes**: `PascalCase` (ej: `SkillCard.tsx`).
- **Archivos de lógica/hooks**: `camelCase` (ej: `useAuth.ts`, `firebaseService.ts`).
- **Variables y Funciones**: `camelCase` (ej: `const [projects, setProjects] = useState()`).
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `const MAX_UPLOAD_SIZE = 5000`).
- **Interfaces/Types**: `PascalCase` comenzando con `I` o descriptivo (ej: `ProjectData` o `IProject`).

## 5. Reglas para Agentes de IA
1. **Evitar Monolitos**: No añadir más de 300 líneas a un solo archivo. Si crece, divide en sub-componentes.
2. **TypeScript Estricto**: Siempre definir tipos para las props y retornos de funciones. No usar `any`.
3. **Tailwind 4**: Usar las nuevas utilidades y variables de CSS de Tailwind 4. Evitar estilos inline.
4. **Verificación**: Antes de dar por terminada una tarea, verificar que el `npm run dev` no tenga errores de consola.

---
*Modificado por última vez: marzo 2026*
