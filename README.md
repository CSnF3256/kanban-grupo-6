# Kanban · Grupo 6

Tablero React para crear, editar, eliminar y mover tareas entre Pendiente, En progreso y Completado. Las tareas se guardan en el navegador con localStorage.

## Ejecutar con Node.js 24

```sh
npm ci
npm run dev
npm test
npm run build
```

## Integración y despliegue

El workflow **Kanban CI** instala las dependencias, ejecuta Vitest y genera el build cuando hay un push a `main` o un pull request con destino a `main`.

Vercel puede importar el repositorio con el preset **Vite**, directorio raíz del repositorio, salida `dist` y rama de producción `main`.
