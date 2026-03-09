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

Para acceder desde otro equipo sin instalar Node ni clonar el repositorio, despliega en **Render** o **Railway**.  
Consulta [`DEPLOY.md`](./DEPLOY.md) para la guía completa.

### Resumen rápido (Render)

1. Sube el código a GitHub.
2. Crea un **Web Service** en Render conectando tu repositorio.
3. Configura los comandos:
   - **Build:** `npm install && cd server && npm install && cd .. && npx ng build`
   - **Start:** `node server/index.js`
4. Añade las variables de entorno:
   - `NODE_ENV=production`
   - `JWT_SECRET=<tu_secreto>`
5. Obtendrás una URL pública (ej: `https://kanban-app-xxx.onrender.com`).

---

## 📤 Subir a GitHub

```bash
# Crea un nuevo repositorio en GitHub (sin README ni .gitignore, el proyecto ya los incluye)
git remote add origin https://github.com/TU_USUARIO/kanban-app.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Comandos Angular CLI

### Generar componentes

```bash
ng generate component nombre-componente
```

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