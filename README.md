# 📋 KanbanApp

Aplicación web para el seguimiento de tareas de equipos usando el método **Kanban**.  
Desarrollada con **Angular 21** como proyecto práctico del curso de **SCRUM Master**.

🌐 **Demo en producción:** [https://kanban-app-two-ochre.vercel.app/](https://kanban-app-two-ochre.vercel.app/)

---

## 👥 Equipo

| Nombre | Rol |
|---|---|
| **Ismael** | Scrum Master |
| **Rocío** | UX/UI Designer |
| **Alex** | Developer |
| **Pablo Fernández** | Tester |
| **Pablo Ramón** | Product Owner |

---

## 🗺️ Roadmap del proyecto

### ✅ Fase 1
- **Componente Kanban:** Tablero con columnas (*Backlog, En proceso, Bloqueado, Hecho*) para crear y mover tareas.
- **Componente Task:** Tarjeta editable con los detalles de cada tarea.
- Persistencia de datos en `localStorage`.

### ✅ Fase 2
- **Componente Lista-Kanbans:** Acceso a múltiples tableros Kanban.
- Crear y eliminar tableros.

### ✅ Fase 3
- Sistema de usuarios con autenticación por tokens **JWT**.
- Base de datos (fichero JSON) para persistencia en servidor.
- Sesión de usuario con sus propios kanbans y datos.
- Login, registro y cierre de sesión.

### ✅ Fase 4
- **Diseño final:** Diseño completo con acabado profesional

## 🚀 Ejecución local

> **Importante:** La app requiere el backend API para funcionar (Fase 3).

### 1. Instalar dependencias

```bash
npm install
cd server && npm install && cd ..
```
Recupera todas dependencias y modulos de node

### 2. Iniciar el servidor API

```bash
# Modo producción
npm run server

# Modo desarrollo con recarga automática
npm run server:dev
```

### 3. Iniciar Angular (en otra terminal)

```bash
ng serve
```

Abre el navegador en [http://localhost:4200/](http://localhost:4200/). La aplicación se recargará automáticamente al modificar los archivos fuente.

> El proxy de Angular redirige `/api` al backend en `http://localhost:3000`.  
> Los datos se guardan en `server/data.json`.

---

## ☁️ Despliegue en la nube

Para que la aplicación fuera accesible desde cualquier equipo sin necesidad de instalar Node ni clonar el repositorio, desplegamos la app en **Render**, una plataforma cloud que permite publicar aplicaciones web de forma sencilla conectándola directamente a un repositorio de GitHub. Render se encarga de ejecutar el build, levantar el servidor y mantener el servicio activo bajo una URL pública, sin necesidad de gestionar infraestructura.

### Rama de despliegue: `render`

El proyecto cuenta con una rama dedicada llamada `render`, separada de `main`, que contiene la configuración específica para que el despliegue funcione correctamente en este entorno. En ella se ajustan los comandos de build y arranque del servidor, así como las variables de entorno necesarias (`NODE_ENV=production` y `JWT_SECRET`). De esta forma, la rama principal se mantiene limpia para el desarrollo y la rama `render` refleja en todo momento el estado desplegado en producción.

🌐 **Demo desplegada:** [https://kanban-app-two-ochre.vercel.app/](https://kanban-app-two-ochre.vercel.app/)

> Para más detalles sobre la configuración del despliegue, consulta [`DEPLOY.md`](./DEPLOY.md).
---

## 🛠️ Comandos Angular CLI

Para ver todos los esquemas disponibles (componentes, directivas, pipes...):

```bash
ng generate --help
```

### Build

```bash
ng build
```

Compila el proyecto y almacena los artefactos en el directorio `dist/`. La build de producción optimiza la aplicación para rendimiento y velocidad.

---

## 🧪 Tests

### Tests unitarios

Los tests unitarios se ejecutan con **Vitest**:

```bash
ng test
```

### Tests end-to-end

Los tests E2E se ejecutan con **Cypress**:

```bash
ng e2e
```

---

## 📚 Recursos adicionales

- [Angular CLI — Overview y referencia de comandos](https://angular.dev/tools/cli)
- [Documentación de Angular](https://angular.dev)
- [Documentación de Cypress](https://docs.cypress.io)

---

> Proyecto generado con **Angular CLI v21.1.3**.
