# Prueba técnica FullStack

## Iniciar aplicacion en modo PROD

Se puede usar directamente el archivo `docker-compose.prod.yml` que esta listo para funcionar. (Es recomendable cambiar las credenciales de acceso a MongoDB)

Hay que tener en cuenta que si se usa `docker-compose.prod.yml` ya se incluye una instancia de MongoDB, si se desea usar una distinta es suficiente con modificar los parametros de conexión.

Si por algun caso se necesita desplegar por separado, en los directorios `backend` y `frontend` hay un archivo `dockerfile` que se puede usar para entorno de produccion. Pero es necesario que se establezcan las variables de entorno y argumentos de la build definidas en el `docker-compose.prod.yml`. Además se requiere una instancia de MongoDB independiente.

## Iniciar aplicacion en modo DEV

Para desarrollo, la opción recomendada es usar `docker-compose up` sobre el archivo `docker-compose.dev.yml` de la raiz del proyecto.

Esto incluye hot reload y permite trabajar en el mismo entorno que en producción.

## Ejecutar tests del backend

- Navegar al directorio backend
- Desde el terminal ejecutar el comando `npm run test`
