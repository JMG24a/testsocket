# Formu Api

## Levantar el proyecto de forma local
* Descagrar paquetes npm

    Debe descargar las dependencias que el proyecto necesita con:
    ```
    npm i
    ```

* Definir las variables de entorno

    Para definir las variables de entorno copie y pegue el archivo _.env.example_ ubicado en la raíz del proyecto. Renombre la copia a _.env_ y defina las variables de entorno necesarias:
    ```
    PORT=puerto_local_correr_servidor
    DBCNN=url_mongoDB
    TOKEN=token_secreto

    GOOGLE_PASSWORD=contraseña_Google
    GOOGLE_CLIENT_ID=id_cliente_proporcionado_por_Google
    GOOGLE_CLIENT_SECRET=id_secreto_proporcionado_por_Google
    GOOGLE_CALLBACK_URL=url_Google
    ```
* Levantar servidor local

    Para correr el servidor de forma local:
    ```
    npm start
    ```
## API
### **Endpoints de FORMULARIOS**
Los endpoints de formularios regresan un JSON con la información y un valor `ok: true` sí todo sale bien. El valor es `false` si hay algún problema y además contienen un `message` y un `errorDescription` (en caso de ocurrir un problema).

#### GET
* Obtener todos los formularios registrados: `/forms`
    ```
    {
        ok: true,
        forms: [...]
    }
    ```
* Obtener formulario por id: `/forms/[formId]`
    ```
    {
        ok: true,
        form: {...}
    }
    ```
<!-- #### POST
---

### **End-points de USUARIOS** -->