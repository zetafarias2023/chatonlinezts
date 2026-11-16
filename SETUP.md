# 166 STUDIO v2 — publicación web + Android

Esta entrega incorpora tienda, cuentas de productores, panel multi-productor, aprobación/verificación administrativa, carga de beats, almacenamiento privado para masters, PayPal y PWA. Sigue siendo necesario configurar tus cuentas y completar pruebas antes de aceptar dinero real.

## Requisitos
- Node.js 20+
- Cuenta Supabase
- Cuenta Vercel y GitHub
- Cuenta PayPal Business y app REST en PayPal Developer
- Android Studio + Android SDK para generar APK/AAB

## A. Base de datos y almacenamiento
1. Crea un proyecto en https://supabase.com.
2. En SQL Editor ejecuta `supabase/schema.sql`.
3. En Authentication > URL Configuration configura la URL del sitio de Vercel y `http://localhost:3000`.
4. En Authentication > Providers habilita Email. Configura confirmación de email.
5. Copia Project URL, anon/public key y service_role key desde Project Settings > API.
6. El SQL crea `beat-files` privado y `beat-previews` público. No hagas público `beat-files`.

## B. Crear tu usuario administrador
1. Ejecuta el proyecto local o publicado y abre `/auth`.
2. Registrate con tu email real y confirmá el email.
3. En Supabase > Table Editor > profiles, buscá tu email.
4. En SQL Editor ejecutá (reemplazá el email):
   `update public.profiles set role='admin', producer_status='approved', verified=true where email='TU_EMAIL';`
5. Iniciá sesión otra vez y abrí `/dashboard`.
6. Otros registros se crean automáticamente como `producer` y `pending`. Desde tu panel aprobás productores y asignás o quitás el distintivo verificado.

Nunca habilites que los usuarios elijan su propio rol admin.

## C. Variables de entorno
Copia `.env.example` a `.env.local` y completa:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — solo servidor
- `PAYPAL_CLIENT_ID`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — mismo Client ID, público
- `PAYPAL_CLIENT_SECRET` — solo servidor
- `PAYPAL_ENV=sandbox`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

No envíes el Client Secret por chat, no lo pongas en GitHub ni en variables `NEXT_PUBLIC_`.

## D. Ejecutar y probar
Dentro de la carpeta:
```bash
npm install
npm run dev
```
Abre `http://localhost:3000`. Creá el usuario admin, luego otra cuenta de prueba y aprobala. Subí un beat MP3/WAV. Probá descarga gratuita y compras con PayPal Sandbox.

## E. Publicar en Vercel
1. Subí el proyecto a un repositorio GitHub privado.
2. En Vercel seleccioná Add New > Project e importá el repositorio.
3. Agregá todas las variables de entorno anteriores en Settings > Environment Variables para Production y Preview.
4. Configurá `NEXT_PUBLIC_SITE_URL` con la URL final HTTPS.
5. Deploy. Verificá `/`, `/auth` y `/dashboard`.
6. En Supabase Authentication > URL Configuration, agregá la URL final y el callback permitido que use Supabase Auth.
7. Para `166studio.free.je`: añadilo en Vercel > Settings > Domains y copiá exactamente los registros DNS que Vercel indique. No adivines registros ni cambies nameservers sin confirmar quién administra el dominio. Conservá los registros MX/TXT de correo.

## F. PayPal
1. Empezá con Sandbox. Añadí credenciales Sandbox a Vercel y probá órdenes con cuentas Sandbox.
2. No actives Live hasta verificar pagos completados, registro de compra, descarga y reembolsos/disputas.
3. La integración actual tiene endpoints create/capture básicos; antes de producción comercial hay que añadir verificación criptográfica de webhooks PayPal, idempotencia/reconciliación, asociación de compra a usuario y política de reembolsos.
4. Confirmá con PayPal la elegibilidad de tu cuenta argentina para recibir pagos por bienes digitales, retiro, conversión y comisiones antes de cobrar en USD.

## G. Instalar en Android
### PWA rápida
Después de publicar en HTTPS, abrí el sitio en Chrome Android > menú > Instalar aplicación / Añadir a pantalla principal.

### APK/AAB con Capacitor
1. En `capacitor.config.ts`, cambiá `YOUR-VERCEL-DOMAIN.vercel.app` por tu URL HTTPS real.
2. Instalá Android Studio y el Android SDK.
3. En la carpeta del proyecto ejecutá:
```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```
4. En Android Studio probá en un dispositivo físico. Para generar instalable: Build > Generate Signed Bundle / APK.
5. Guardá el keystore de firma en un lugar seguro; no lo subas a GitHub. Para Google Play generá AAB y completá ficha, política de privacidad, clasificación de contenido y requisitos vigentes de Play Console.

La app Capacitor carga la web desplegada porque el proyecto usa rutas de servidor. No uses export estático. Verificá especialmente PayPal, login, subida y descarga dentro del WebView.

## Funciones que aún requieren trabajo antes de producción
- Verificación de firma de webhooks PayPal y proceso de reembolso.
- Registro de compras ligado a identidad de comprador y portal de descargas.
- Gestión de licencias/contratos descargables y términos de uso.
- Moderación avanzada, edición/eliminación de beats, reportes y auditoría de acciones.
- Rate limiting, antivirus/validación de archivos, límites de cuota y protección antiabuso.
- Pruebas de extremo a extremo y revisión legal/contable para Argentina.

No anuncies pagos reales, insignias oficiales ni seguridad absoluta hasta completar esos controles.
