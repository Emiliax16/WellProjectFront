# Instrucciones de Despliegue

## Despliegue en S3 de Amazon AWS

1. Construir los cambios:
    ```bash
    npm run build
    ```
2. Subir los cambios al bucket de S3:
    ```bash
    aws s3 sync build/ s3://BUCKET --delete
    ```
3. Invalidar el cache en Cloudfront:
    ```bash
    aws cloudfront create-invalidation --distribution-id YOUR_CLOUDFRONT_ID --paths "/*"
    ```
4. Verificar si el cache fue invalidado:
    ```bash
    aws cloudfront get-invalidation --id INVALIDATION_ID --distribution-id DISTRIBUTION_ID
    ```
