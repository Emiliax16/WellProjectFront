# Despliegue del frontend

El frontend se publica como sitio estático en un bucket de S3, servido por CloudFront en `https://promedicion.cl`. El despliegue es manual y no pasa por GitHub: lo que se sube al bucket es el resultado de `npm run build` en el computador de quien despliega. Por eso, un cambio mergeado en `master` no llega a producción hasta que alguien lo construye y lo sube. Del mismo modo, un cambio local que nunca se pusheó podría terminar publicado si se construye desde una copia sin limpiar.

Los nombres del bucket y el ID de la distribución de CloudFront no se escriben en este repositorio, que es público. Donde aparecen `<BUCKET>` y `<DISTRIBUTION_ID>`, se deben reemplazar por los valores que tiene la persona responsable del proyecto.

## Requisitos

Para desplegar se necesita lo siguiente:

1. Node y npm. `react-scripts` 5 acepta Node 14 o superior; el build se verificó por última vez con Node 26. Conviene anotar la versión usada en cada despliegue, porque `package-lock.json` no está versionado y el resultado depende de las dependencias que resuelva `npm install`.
2. El AWS CLI instalado y configurado con una cuenta que pueda leer y escribir en el bucket y crear invalidaciones en CloudFront.
3. Acceso de lectura al repositorio.

## Variables de entorno en el build

Create React App fija `NODE_ENV=production` al ejecutar `npm run build`, sin importar lo que diga cualquier archivo `.env`. Con ese valor, `src/utils/routes.utils.js` usa la URL fija `https://promedicionbackend.com/`. Las variables `REACT_APP_API_PROTOCOL`, `REACT_APP_API_HOST` y `REACT_APP_API_PORT` igual quedan dentro del bundle, porque el mismo archivo arma siempre la URL de desarrollo, pero en producción no se usan.

Todas las variables `REACT_APP_*` se incorporan al bundle, y cualquier persona puede leerlas desde el navegador. Ninguna de ellas debe contener un secreto. Esto incluye `REACT_APP_DELETE_PASSWORD`: la confirmación que pide al borrar es solo una barrera visual, porque el backend no la valida.

Create React App también da prioridad a `.env.production.local` y `.env.local` por sobre `.env.production`. Si alguno de esos archivos existe en el computador de quien despliega, puede cambiar el resultado sin que nadie lo note. Esa es una de las razones para construir desde un clon limpio.

## Procedimiento

1. Anotar qué versión está publicada hoy, para poder comparar después:

   ```bash
   curl -sI https://promedicion.cl/asset-manifest.json | grep -i last-modified
   curl -s https://promedicion.cl/asset-manifest.json | grep '"main.js"'
   ```

2. Respaldar el contenido actual del bucket. Es lo que permite volver atrás, porque reconstruir un commit anterior no garantiza obtener el mismo bundle sin un lockfile versionado:

   ```bash
   aws s3 sync s3://<BUCKET> ~/respaldo-front-$(date +%F)
   ```

3. Construir desde un clon limpio de `master`, en una carpeta nueva y sin archivos `.env` locales. La carpeta se crea con `mktemp` para que nunca se reutilice el clon de un despliegue anterior:

   ```bash
   DEPLOY_DIR=$(mktemp -d)
   git clone https://github.com/Emiliax16/WellProjectFront.git "$DEPLOY_DIR" && cd "$DEPLOY_DIR"
   git log -1 --format='%h %s'
   node -v
   npm install
   npm run build
   ```

   Hay que revisar que `git log` muestre el commit esperado y que el build termine sin errores. Si el proyecto necesita variables `REACT_APP_*` que no están en `.env.production`, se escriben a mano en un archivo `.env.production.local` dentro del clon antes de construir, y nunca se commitean.

4. Subir el build sin `--delete`. Los archivos de la versión anterior se mantienen en el bucket a propósito: mientras CloudFront o el navegador de alguien todavía entreguen el `index.html` anterior, ese `index.html` pide el `main.<hash>.js` anterior. Si ese archivo ya no existe, CloudFront responde con el `index.html` en su lugar y la página queda en blanco:

   ```bash
   aws s3 sync build/ s3://<BUCKET>
   ```

5. Invalidar la caché de CloudFront y esperar a que termine, para que los usuarios reciban la versión nueva:

   ```bash
   INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> \
     --paths "/*" --query Invalidation.Id --output text)
   aws cloudfront wait invalidation-completed --distribution-id <DISTRIBUTION_ID> --id "$INVALIDATION_ID"
   ```

6. Verificar que la versión publicada cambió. El `Last-Modified` debe corresponder a la hora del despliegue, y el nombre de `main.js` debe ser distinto al anotado en el paso 1 si hubo cambios en el código:

   ```bash
   curl -sI https://promedicion.cl/asset-manifest.json | grep -i last-modified
   curl -s https://promedicion.cl/asset-manifest.json | grep '"main.js"'
   ```

   Por último, iniciar sesión en el sitio y revisar la vista que cambió. Esto comprueba lo que entrega CloudFront; un navegador puede seguir mostrando la versión anterior hasta que recargue.

Los archivos de versiones anteriores pesan alrededor de 1 MB por despliegue. Si en algún momento se quieren limpiar, conviene hacerlo con `--delete` varios días después de un despliegue, nunca en el mismo momento.

## Volver atrás

Para volver a la versión anterior se restaura el respaldo del paso 2 y se invalida la caché, igual que en un despliegue normal:

```bash
aws s3 sync ~/respaldo-front-<fecha> s3://<BUCKET>
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> \
  --paths "/*" --query Invalidation.Id --output text)
aws cloudfront wait invalidation-completed --distribution-id <DISTRIBUTION_ID> --id "$INVALIDATION_ID"
```

Como el paso 4 no borra archivos, restaurar el respaldo vuelve a dejar el `index.html` anterior apuntando a su propio `main.<hash>.js`, que sigue en el bucket.

## Mejoras pendientes

Dos cambios harían este procedimiento más simple y reproducible. El primero es versionar `package-lock.json`, para que dos builds del mismo commit produzcan el mismo resultado. El segundo es configurar los headers de caché que recomienda Create React App: `Cache-Control: max-age=31536000` para `build/static`, cuyos nombres cambian en cada build, y `no-cache` para `index.html` y el resto de los archivos.
