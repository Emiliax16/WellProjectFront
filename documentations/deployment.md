# Despliegue del frontend

El frontend se publica como sitio estático en un bucket de S3, servido por CloudFront en `https://promedicion.cl`. El despliegue es manual y no pasa por GitHub: lo que se sube al bucket es el resultado de `npm run build` en el computador de quien despliega. Por eso, un cambio mergeado en `master` no llega a producción hasta que alguien lo construye y lo sube. Del mismo modo, un cambio local que nunca se pusheó podría terminar publicado si se construye desde una copia sin limpiar.

Los nombres del bucket y el ID de la distribución de CloudFront no se escriben en este repositorio, que es público. Donde aparecen `<BUCKET>` y `<DISTRIBUTION_ID>`, se deben reemplazar por los valores que tiene la persona responsable del proyecto.

## Requisitos

Para desplegar se necesita lo siguiente:

1. Node y npm compatibles con `react-scripts` 5.
2. El AWS CLI instalado y configurado con una cuenta que pueda escribir en el bucket y crear invalidaciones en CloudFront.
3. Acceso de lectura al repositorio.

## Variables de entorno en el build

Create React App fija `NODE_ENV=production` al ejecutar `npm run build`, sin importar lo que diga cualquier archivo `.env`. Con ese valor, `src/utils/routes.utils.js` usa la URL fija `https://promedicionbackend.com/`. En consecuencia, las variables `REACT_APP_API_PROTOCOL`, `REACT_APP_API_HOST` y `REACT_APP_API_PORT` solo afectan el desarrollo local.

Las demás variables `REACT_APP_*` sí se incorporan al bundle, y cualquier persona puede leerlas desde el navegador. Ninguna de ellas debe contener un secreto. Esto incluye `REACT_APP_DELETE_PASSWORD`: la confirmación que pide al borrar es solo una barrera visual, porque el backend no la valida.

Create React App también da prioridad a `.env.local` y `.env.production.local` por sobre `.env.production`. Si alguno de esos archivos existe en el computador de quien despliega, puede cambiar el resultado sin que nadie lo note. Esa es una de las razones para construir desde un clon limpio.

## Procedimiento

1. Anotar qué versión está publicada hoy, para poder comparar después:

   ```bash
   curl -sI https://promedicion.cl/asset-manifest.json | grep -i last-modified
   curl -s https://promedicion.cl/asset-manifest.json | grep '"main.js"'
   ```

2. Construir desde un clon limpio de `master`, sin archivos `.env` locales. Como `package-lock.json` no está versionado, `npm install` puede resolver versiones distintas a las del despliegue anterior, así que conviene revisar que el build termine sin errores:

   ```bash
   git clone https://github.com/Emiliax16/WellProjectFront.git /tmp/front-deploy
   cd /tmp/front-deploy
   git log -1 --format='%h %s'
   npm install
   npm run build
   ```

   Si el proyecto necesita variables `REACT_APP_*` que no están en `.env.production`, se copian a mano en el clon antes de construir y nunca se commitean.

3. Subir el build. `--delete` elimina del bucket los archivos que ya no existen en el build nuevo:

   ```bash
   aws s3 sync build/ s3://<BUCKET> --delete
   ```

4. Invalidar la caché de CloudFront para que los usuarios reciban la versión nueva:

   ```bash
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   aws cloudfront get-invalidation --distribution-id <DISTRIBUTION_ID> --id <INVALIDATION_ID>
   ```

5. Verificar que la versión publicada cambió. El `Last-Modified` debe corresponder a la hora del despliegue, y el nombre de `main.js` debe ser distinto al anotado en el paso 1 si hubo cambios en el código:

   ```bash
   curl -sI https://promedicion.cl/asset-manifest.json | grep -i last-modified
   curl -s https://promedicion.cl/asset-manifest.json | grep '"main.js"'
   ```

   Por último, iniciar sesión en el sitio y revisar la vista que cambió.

## Volver atrás

S3 no guarda la versión anterior si el bucket no tiene versionado activado. Para volver atrás, se repite el procedimiento desde el commit anterior. Para eso, en el paso 2 se agrega `git checkout <commit-anterior>` antes de `npm install`, y luego se sube y se invalida igual que en un despliegue normal.
