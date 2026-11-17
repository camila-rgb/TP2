# Planos Secuencias — Cine al Aire Libre

Aplicación web para un ciclo de cine al aire libre con **una película por día, a las 19:00 h**. Permite ver la cartelera, reservar y pagar entradas (en modo prueba), votar la próxima función, calificar y recomendar películas, y armar un perfil de espectador con carnet de socio.

Trabajo Práctico 2 — Desarrollo Frontend II (UADE, FADI · DETEX · 2026).

- **Aplicación publicada:** https://planos-secuencias.vercel.app/
- **Repositorio:** https://github.com/camila-rgb/TP2

---

## Tecnologías

| Capa | Herramienta |
| --- | --- |
| Interfaz | React 18 + Vite 5 |
| Datos y autenticación | Firebase: Authentication (acceso anónimo) y Cloud Firestore |
| Despliegue | Vercel (conectado a GitHub) |
| APIs externas | TMDB (cartelera mensual, opcional) y Open-Meteo (pronóstico del clima, sin clave) |

## Funcionalidades

- **Cartelera** con una función por día, búsqueda por título o director, y filtros por género y época.
- **Ficha de película** con sinopsis, cupo disponible (50 lugares por función), calificación, favoritas, ocultar películas y comentarios.
- **Reserva y pago en modo prueba**, con validación de tarjeta, estado de carga («Procesando pago…») y mensajes de error o éxito. No se cobra dinero real.
- **Entrada digital** con código QR por cada reserva confirmada.
- **Cancelación de reservas** (hasta 24 h antes) y reprogramación si la función se suspende por lluvia.
- **Votación comunitaria** de la próxima función (un voto por socio).
- **Membresía** con niveles según funciones vistas y planes con descuento.
- **Perfil** con géneros preferidos, favoritas, recomendaciones propias y actividad reciente.
- **Contacto**, con validaciones y envío del mensaje a Firestore.
- **Diseño responsive** (computadora y celular) con tema claro y oscuro automático.

## Datos que se guardan en Firebase

| Colección | Qué contiene | Operaciones desde la app |
| --- | --- | --- |
| `users/{uid}` | Perfil del visitante: nombre, email, géneros, favoritas, calificaciones, reservas, recomendaciones, voto de la comunidad, plan y actividad | Consultar (`getDoc` al abrir la app) y crear o modificar (`setDoc` en cada cambio del perfil) |
| `messages` | Mensajes del formulario de contacto: `uid`, nombre, email, texto y fecha | Crear (`addDoc`) |

Cada navegador recibe una identidad propia mediante **Authentication → Anónimo**, por lo que abrir la app desde otro dispositivo no recupera el mismo perfil.

Las reglas incluidas en `firestore.rules` también dejan preparadas las colecciones `reservations`, `ratings`, `comments`, `polls` y `movies`, para una etapa posterior. Hoy la app todavía no las utiliza.

> La app mantiene una copia local de respaldo del perfil en el navegador (`localStorage`) para un arranque rápido. Los datos de referencia son los de Firestore: el estado de la conexión se informa al pie de la página.

---

## Cómo ejecutarla en tu computadora

### Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`)
- Un proyecto de Firebase (ver la sección siguiente)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/camila-rgb/TP2.git
cd TP2

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Editar .env y completar los valores (ver más abajo)

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`. Si modificás `.env`, **reiniciá** el servidor (`Ctrl + C` y `npm run dev`).

### Otros comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión generada por `build` |

---

## Variables de entorno

Copiá `.env.example` a `.env` y completá una variable por línea, **sin comillas ni comas**. Los valores salen del objeto `firebaseConfig` de la consola de Firebase.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_TMDB_KEY=
```

- Las variables de Firebase `API_KEY`, `PROJECT_ID` y `APP_ID` son las mínimas para que la app se conecte.
- `VITE_TMDB_KEY` es **opcional**: con una clave de [TMDB](https://www.themoviedb.org/settings/api) la cartelera se renueva cada mes con clásicos; sin ella, se usa el catálogo propio de la app.
- El archivo `.env` está en `.gitignore` y **no debe subirse al repositorio**.
- Las variables con prefijo `VITE_` quedan incluidas en el código que recibe el navegador. Solo corresponde usar la configuración web de Firebase, nunca claves privadas ni credenciales de cuentas de servicio. El acceso a los datos se controla con las reglas de Firestore.

---

## Configurar Firebase

1. Entrá a la [consola de Firebase](https://console.firebase.google.com/) y creá un proyecto. Google Analytics y Firebase Hosting no son necesarios.
2. En **Configuración del proyecto → Tus apps**, registrá una app web (`</>`) y copiá los valores de `firebaseConfig` al `.env`.
3. En **Authentication → Método de acceso**, habilitá **Anónimo**.
4. En **Firestore Database**, creá una base de edición **Standard** con identificador `(default)`, región `southamerica-east1` (São Paulo) y en **modo producción**.
5. En la pestaña **Reglas / Rules**, pegá el contenido de [`firestore.rules`](./firestore.rules) y publicalo.
6. Cuando la app esté en Vercel, agregá su dominio en **Authentication → Configuración → Dominios autorizados**.

> Las reglas de Firestore se publican en Firebase. Desplegar en Vercel **no** las actualiza.

### Cómo verificar la integración

1. Creá un usuario desde la app y recargá la página: el perfil debe seguir ahí.
2. Hacé un cambio (por ejemplo, marcá una favorita) y comprobalo en **Firestore → Datos → `users`**.
3. Enviá un mensaje desde **Contacto** y buscalo en la colección `messages`.

---

## Publicar en Vercel

1. En [Vercel](https://vercel.com/), conectá tu cuenta de GitHub e importá este repositorio.
2. Configuración del proyecto:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** la carpeta donde está `package.json`
3. En **Settings → Environment Variables**, cargá las variables del `.env` para el entorno **Production**.
4. Desplegá. Si agregás o cambiás variables después, ejecutá **Redeploy**.

Con GitHub conectado, cada `git push` a `main` genera un nuevo despliegue automático.

---

## Estructura del proyecto

```text
.
├── firestore.rules        # Reglas de seguridad de Firestore
├── .env.example           # Nombres de las variables de entorno (sin valores)
├── index.html
├── public/img/            # Pósters del catálogo propio
└── src/
    ├── main.jsx           # Punto de entrada
    ├── App.jsx            # Navegación entre vistas
    ├── firebase.js        # Inicialización de Firebase y acceso anónimo
    ├── context/AppContext.jsx  # Estado global, sesión y sincronización con Firestore
    ├── cartelera.js       # Renovación mensual de la cartelera (TMDB)
    ├── clima.js           # Pronóstico de Open-Meteo
    ├── data/              # Catálogo, planes y perfil inicial
    ├── components/        # Ficha, pago, entrada, tarjetas, avisos
    ├── views/             # Pantallas: inicio, cartelera, votación, perfil, etc.
    └── styles/estilos.css # Estilos (tema claro y oscuro, responsive)
```

## Seguridad

- `.env`, `node_modules` y `dist` están excluidos con `.gitignore`.
- Las reglas de Firestore restringen cada perfil a su dueño, validan el largo de los textos y limitan las reservas de 1 a 6 entradas.
- El pago es una **simulación**: no se procesan ni se guardan datos reales de tarjetas.

## Créditos

Desarrollado con apoyo de herramientas de inteligencia artificial. Las películas y los datos de la cartelera provienen de un catálogo propio y de [TMDB](https://www.themoviedb.org/). Este producto utiliza la API de TMDB pero no está avalado ni certificado por TMDB.
