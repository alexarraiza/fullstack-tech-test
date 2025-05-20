# Prueba técnica FullStack

![Demo](docs/demo.gif)

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

# Pipelines de datos

## Obtencion de datos desde API de REE (periódico)

```mermaid
sequenceDiagram
Backend->>MongoDb: Fetch last successful sync
Backend->>+REE API: GET 'datos/balance/balance-electrico' from last sync or 1 month ago
Note over Backend, REE API: Every day at 3 am or at startup
REE API->>-Backend: Data from last sync to end of yesterday
Backend->>MongoDb: Transform data and persist
```

## Modelo de datos

```mermaid
classDiagram
  class BalanceElectricoModel{
    date: Date;
    type: string;
    group: string;
    value: number;
    }
  class DataIngestionLogModel{
    startDate: Date;
    endDate: Date;
    success: boolean;
    type: DataIngestionLogType;
    message: string;
    }

  note for BalanceElectricoModel "Almacena los datos obtenidos de la API de REE
   simplificados para ser mostrados en el frontend"

   note for DataIngestionLogModel "Almacena un registro de las syncs de datos de la API de REE
   tanto correctas como fallidas para poder tener una gestion
   ante errores o fallos inesperados"
```

## Obtención de datos

Actualmente el sistema obtiene datos desde la API de REE de forma automática en dos momentos

- En el inicio del sistema se obtienen los datos del mes en curso en caso de que no se haya hecho ninguna sync anterior.
- Cada dia a las 3 am se ejecuta una sync que obtiene datos desde la última sync correcta hasta el fin del dia anterior.

También se pueden obtener datos de forma manual desde el frontend, para ello se debe pulsar en el botón `Sincronizar API` de la parte superior

![Manual sync button](docs/manual-sync-button.png)

Y en el formulario que aparece, se escoge un rango de fechas y se pulsa en el botón de `Obtener`

![Sync form](docs/sync-form.png)

Esto sincronizará el sistema, obteniendo datos desde la API de REE, con las fechas escogidas y reemplazando los datos de la BBDD con los nuevos obtenidos.
