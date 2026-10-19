# Planos Secuencias — Cine al Aire Libre

Aplicación web para un cine al aire libre: cartelera semanal (una película por día, 19:00 h), reservas (cupo de 50), membresía con perfil, calificaciones, comentarios y votación comunitaria.

## Estructura de la carpeta TP2
- `index.html`: la página (estructura). Ábrelo con doble clic para ver el prototipo.
- `css/estilos.css`: todos los estilos (colores, tipografías, tarjetas, botones, modo claro y oscuro).
- `js/app.js`: la lógica (cartelera, reservas, usuario, perfil, votación). Guarda los datos en el navegador (localStorage), **no** en Firebase.
- `.env.example`: nombres de las variables de Firebase (sin valores).
- `firestore.rules`: borrador de reglas de seguridad de Firestore.
- `.gitignore`: excluye `.env`, `node_modules` y `dist`.

El proyecto React + Vite conectado a Firestore se agrega en la siguiente etapa.

## Configuración de Firebase (para la etapa con React)
1. Crear un proyecto en https://console.firebase.google.com/ y registrar una app web (`</>`).
2. Authentication → Sign-in method → habilitar **Anonymous**.
3. Firestore Database → crear base `(default)`, edición Standard, región `southamerica-east1`, modo producción.
4. Pestaña Reglas → pegar el contenido de `firestore.rules` y publicar.
5. Copiar `.env.example` a `.env` y completar los 4 valores de `firebaseConfig`. Reiniciar `npm run dev` tras cualquier cambio.

## Notas
- Las variables `VITE_` llegan al navegador: usar solo la configuración web de Firebase, nunca claves privadas.
- Las reglas de Firestore se publican en Firebase; desplegar en Vercel no las actualiza.
- Las reglas no pueden controlar el cupo de 50 por función: eso se resuelve en la app con una transacción.

## Publicación
Subir a GitHub, importar el repositorio en Vercel (Vite, `npm run build`, salida `dist`), cargar las variables `VITE_FIREBASE_*` en Production y desplegar. Si cambian las variables, hacer Redeploy.
