# Estructura del Código

- `/src`: Directorio principal del código fuente.
  - `/assets`: Almacena las imágenes que utiliza el proyecto.
  - `/components`: Almacena componentes reutilizables de React.
  - `/context`: Almacena context customizados.
  - `/hooks`: Almacena hooks customizados.
  - `/services`: Almacena lógica compleja de entidades principales, se pueden entender como el conjunto de funciones similares a un controlador.
  - `/strategies`: Almacena funciones consideradas como una estrategia/algoritmo para realizar algún cambio en un objeto.
  - `/texts`: Almancena archivos json con traducciones utilizadas en toda la app. Todo texto plano debe ir en este directorio y ser importado en la vista correspondiente.
  - `/utils`: Almacena funciones cortas y reiterativas, utilería.
  - `/views`: Almancena las vistas de la aplicación, todo lo observable directamente por el usuario. 
  - `index.js`: Construcciones de ReactDOM con todas las vistas.
