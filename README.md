![Logo](https://www.intelix.biz/site/public/images/Home_0007_logo_color.png "InteliX")
# Sistema de Digitalización de Facturas

#### v-1.0.0

## 1. Introducción.

Este repositorio contiene el frontend de la aplicacion "Sistema de Reporte de Ventas" 
de la solicitud "salesReport_BE", la cual esta diseñada para ...


## 2. Funcionalidad.

Sistema de Reporte de Ventas es un aplicación web diseñada para ...


## 3. Tipos de conexión.

-  La aplicacion realiza las peticiones (REST API) en el puerto **3000**.
- Las rutas para metodos "GET" en el servidor virtual son:
  - Ruta "/rg/resources/ids".
      - Retorna en formato de JSON las ids de los usuarios.

- Las rutas para metodos "POST" en el servidor virtual son:



## 4. Generalidades sobre la implementación.

- Esta aplicacion ha sido desarrollada con Node.js usando los siguientes modulos:
  - antd
  - axios
  - ckeditor
  - react
  - react-google-login
  - react-highlight-words
  - uuid

- Arbol de la aplicación:

	```
    front-end
    └───public
    │   ...
    └───src
    │   └───assets
    │   │    ...
    │   └───components
    │       ...
    │   .env
    │   README.md
    │   package.json   
    │   package-lock.json   
    │   ...
    ```
	
- Nivel de conocimiento: Medio.


## 5. Configuración y Despliegue.

Aspectos a considerar:

- Se describe el proceso de instalación y despliegue para la aplicación.
- Seguirlo paso a paso debería garantizar la correcta instalación y posterior despliegue o puesta en funcionamiento de los servicios. 
- Cualquier tipo de contingencia o caso atípico que se pudiera presentar durante el despliegue en un ambiente determinado será documentado en esta fase en el punto **5.3 Resolución de problemas**.

### 5.1. Prerrequisitos.

**Se deben tener configurados los siguientes entornos:**

- NodeJS
- pm2

#### Comandos basicos de pm2
  - `pm2 ls`: Devuelve una lista de los procesos con: Nombre y ID de cada proceso.
  - `pm2 start << ARCHIVO >>`: Inicia el proceso del archivo en cuestion.
  - `pm2 restart << ID >>`: Reiniciar el proceso identificado con la ID en cuestion.
  - `pm2 stop << ID >>`: Detiene el proceso identificado con la ID en cuestion.
  - `pm2 delete << ID >>`: Elimina el proceso identificado con la ID en cuestion.

### 5.2. Actualizaciones, instalación y configuración.

#### Instalación
- Si el contenedor tiene acceso a git:
  1. Acceder al contenedor mediante SSH **(ejemplo: ssh USUARIO@HOST -pPUERTO)**.
  2. Clonar el repositorio con `git`.
  3. Acceder a la carpeta donde se haya descargado todo el código fuente del servicio desde la consola de comando.
  4. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio.
  5. Ejecutar `pm2 start app.config.json` esto levantar la aplicacion segun lo especificado en el archivo de configuracion para despliegue.
- En caso de que el contenedor no tenga acceso a git:
  1. Clonar el repositorio de forma local y comprimir como archivo ZIP.
  2. Enviar el archivo zip del repositorio al contenedor mediante el comando SCP **(ejemplo: scp -P PUERTO ARCHIVO usuario@HOST:/home/produccion/)**.
  3. Acceder al contenedor mediante SSH **(ejemplo: ssh USUARIO@HOST -pPUERTO)**.
  4. Descomprimir el archivo ZIP del repositorio.
  5. Acceder a la carpeta donde se haya descargado todo el código fuente del servicio desde la consola de comando.
  6. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio.
  7. Ejecutar `pm2 start app.config.json` esto levantar la aplicacion segun lo especificado en el archivo de configuracion para
  8. Eliminar el archivo ZIP previamente descomprimido.

#### Actualizaciones
- Si el contenedor tiene acceso a git:
  1. Acceder al contenedor mediante SSH **(ejemplo: ssh USUARIO@HOST -pPUERTO)**.
  2. Detener el proceso con pm2.
  3. Acceder a la carpeta del repositorio.
  4. Ejecutar `git pull`.
  5. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio**Opcional si no hay que agregar una nueva dependencia**.
  5. Reiniciar el proceso con pm2.
- En caso de que el contenedor no tenga acceso a git:
  1. Clonar el repositorio de forma local y comprimir como archivo ZIP.
  2. Enviar el archivo zip del repositorio al contenedor mediante el comando SCP **(ejemplo: scp -P PUERTO ARCHIVO usuario@HOST:/home/produccion/)**.
  3. Acceder al contenedor mediante SSH **(ejemplo: ssh USUARIO@HOST -pPUERTO)**.
  4. Detener el proceso con pm2.
  5. Eliminar la carpeta del repositorio en cuestion.
  6. Descomprimir el archivo ZIP del repositorio actualizado.
  7. Acceder a la carpeta del repositorio actualizado
  8. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio.
  9. Reiniciar el proceso con pm2.
  10. Eliminar el archivo ZIP previamente descomprimido.

#### Configuraciones de credenciales *(Solo de ser necesario)*
Editar el archivo `.env` que se encuentran en la ruta `<<root>>`.

**`.env`**

```bash
  #APP REACT
  REACT_APP_API_BASE_URL = http://localhost:2001/api/v1

  #SERVER
  PORT = 3000
  APP_API_BASE_URL = http://10.48.13.156:2001

  # Google Login
  REACT_APP_CLIENT_ID_MAYOREO = 89578941712-6ots4uuk9gqk7n6fjjjm3ggg61bdrld9.apps.googleusercontent.com
  REACT_APP_CLIENT_ID_INTELIX = 89578941712-6ots4uuk9gqk7n6fjjjm3ggg61bdrld9.apps.googleusercontent.com
```
**Importante: Solo alterar estos valores de ser necesario**
    - `REACT_APP_API_BASE_URL` es la direccion del endpoint donde esta alojado el servicio REST API del backend (En producción apuntar a la direccion del frontend añadiendo "/api/v1" en el endpoint, ej: http://www.example.org/:3000 -> http://www.example.org/api/v1; En modo desarrollo apuntar al contenedor del backend correspondiente ej: http://localhost:2001/api/v1). **Importante: No terminar la cadena de texto correspondiente a los endpoint con "/"**.
    - `PORT` es el puerto por el cual se ejecutara la app  **(default: 3000)**.
    - `APP_API_BASE_URL` es la direccion del endpoint donde esta alojado el servicio REST API del backend(utilizado para el proceso de proxy inverso en el frontend ej: http://localhost:2001/api/v1/foo -> http://www.example.org/api/v1/foo). **Solo utilizado para el modo producción**. **Importante: No terminar la cadena de texto correspondiente a los endpoint con "/"**.
    - `REACT_APP_CLIENT_ID_MAYOREO` token ClientID proporcionado por la consola de desarrollo de Google para el inicio de sesion **Usuarios Mayoreo**.
    - `REACT_APP_CLIENT_ID_INTELIX` token ClientID proporcionado por la consola de desarrollo de Google para el inicio de sesion **Usuarios Intelix**.
### 5.3. Ejecución.

**Importante**.
*(Se recomienda leer mas en EL README.md en el repositorio "back-end")*.

En esta sección se deben considerar los siguientes pasos:

1. Inicializa el servidor `npm start`

2. Una vez desplegado, utilizar la app en [http://localhost:3000](http://localhost:3000)

### 5.4. Resolución de problemas.

- ......

---
_(c) 2020 Intelix Synergy C.A. Documentación técnica de aplicación **v1.0.0**_
