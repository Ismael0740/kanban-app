# KanbanApp

Aplicación web para el seguimiento de tareas de equipos usando el método Kanban. Desarrollada con Angular 21.

## Roadmap del proyecto

### Fase 1 ✓
- **Componente Kanban**: Tablero con columnas (Backlog, En proceso, Bloqueado, Hecho) para crear y mover tareas
- **Componente Task**: Tarjeta editable con detalles de cada tarea
- Persistencia de datos en **localStorage**

### Fase 2 ✓
- **Componente Lista-Kanbans**: Acceso a múltiples tableros Kanban, crear/eliminar tableros

### Fase 3 ✓
- Sistema de **usuarios** con autenticación por tokens JWT
- Base de datos (JSON file) para persistencia en servidor
- Sesión de usuario con sus propios kanbans y datos
- Login, registro y cierre de sesión

---

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) v21.1.3.

## Subir a GitHub

1. Crea un nuevo repositorio en [GitHub](https://github.com/new) (sin README ni .gitignore, el proyecto ya los incluye)
2. Conecta el repositorio local y sube el código:

```bash
git remote add origin https://github.com/TU_USUARIO/kanban-app.git
git branch -M main
git push -u origin main
```

## Ejecución

**Importante:** La app requiere el backend API para funcionar (Fase 3).

1. Inicia el servidor API (en una terminal):
   ```bash
   npm run server
   ```
   O en modo desarrollo con recarga automática:
   ```bash
   npm run server:dev
   ```

2. Inicia Angular (en otra terminal):
   ```bash
   ng serve
   ```

El proxy de Angular redirige `/api` al backend en `http://localhost:3000`. Los datos se guardan en `server/data.json`.

## Development server

Para iniciar solo el frontend (requiere backend en marcha):

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
