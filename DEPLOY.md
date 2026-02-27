# Despliegue en la nube (Render)

Guía para desplegar KanbanApp en [Render](https://render.com) y acceder desde cualquier ordenador sin instalar nada.

## Requisitos

- Cuenta en [Render](https://render.com) (gratuita)
- Repositorio en GitHub

## Pasos

### 1. Sube el código a GitHub

Si aún no lo has hecho:

```bash
git add .
git commit -m "Preparar despliegue en Render"
git push origin develop
```

### 2. Crear servicio en Render

1. Entra en [dashboard.render.com](https://dashboard.render.com)
2. **New** → **Web Service**
3. Conecta tu repositorio de GitHub (autoriza Render si es necesario)
4. Selecciona el repositorio `kanban-app`
5. Configura:
   - **Branch:** `develop` (o `main`)
   - **Root Directory:** (dejar vacío)
   - **Runtime:** Node
   - **Build Command:** (Render usará `render.yaml` automáticamente)
   - **Start Command:** `node server/index.js`

Si no usas `render.yaml`, configura manualmente:

- **Build Command:**
  ```
  npm install && cd server && npm install && cd .. && npx ng build
  ```
- **Start Command:**
  ```
  node server/index.js
  ```

### 3. Variables de entorno

En **Environment** del servicio, añade:

| Key        | Value                          |
|------------|--------------------------------|
| NODE_ENV   | production                     |
| JWT_SECRET | (genera una contraseña segura) |

### 4. Desplegar

Pulsa **Create Web Service**. Render construirá y desplegará la app (5–10 min la primera vez).

### 5. URL de la demo

Al terminar, Render te dará una URL como:

```
https://kanban-app-xxxx.onrender.com
```

Abre esa URL en cualquier navegador (incluso sin Node ni el repo instalado).

## Alternativa: Railway

1. Entra en [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Selecciona el repositorio
4. Railway detecta Node.js. Configura:
   - **Build:** `npm install && cd server && npm install && cd .. && npx ng build`
   - **Start:** `node server/index.js`
5. Añade variable `NODE_ENV=production` y `JWT_SECRET`
6. Railway genera una URL pública

## Notas

- **Primera carga:** En el plan gratuito de Render, el servicio puede tardar ~30 s en despertar si ha estado inactivo.
- **Datos:** Se guardan en `server/data.json` en el servidor. En Render el disco es efímero; los datos pueden perderse al redeploy. Para producción real, usa una base de datos externa.
- **HTTPS:** Render y Railway ofrecen HTTPS automático.
