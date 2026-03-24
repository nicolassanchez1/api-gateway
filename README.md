# 🚀 API Gateway - LinkTik Technical Test

Este repositorio contiene el **API Gateway** principal para el ecosistema de microservicios desarrollado como parte de la prueba técnica de LinkTik.

El Gateway está construido con **NestJS 11** y actúa como el punto de entrada único (Single Entry Point) y proxy inverso para enrutar las peticiones del frontend hacia los microservicios correspondientes, manejando la seguridad y validación de tokens de manera centralizada.

## 🏗️ Arquitectura del Ecosistema

El sistema sigue un patrón de diseño de Microservicios, orquestado a través de este Gateway:

- **API Gateway (Este repo):** Puerto `:8080`
- **Auth Microservice:** Puerto `:3002` (Gestiona JWT y usuarios)
- **Products Microservice:** Puerto `:3003` (Catálogo e inventario)
- **Orders Microservice:** Puerto `:3001` (Gestión de compras)

> _Nota: Los puertos pueden variar según la configuración del archivo `.env`._

## 🛡️ Características Principales

1. **Reverse Proxy Dinámico:** Implementado con `http-proxy-middleware` para reenviar peticiones conservando el contexto original (URLs intactas).
2. **Validación JWT Centralizada:** Un `AuthMiddleware` intercepta las peticiones a rutas protegidas (como `/orders`) y valida el Bearer Token antes de permitir que la petición alcance el microservicio interno.
3. **Manejo de CORS:** Configurado nativamente para permitir la comunicación fluida con la aplicación Frontend en React/Next.js.
4. **Contenerización:** Listo para ser desplegado en entornos aislados con Docker.

## ⚙️ Configuración del Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo (`.env.example` si existe). Las variables clave son:

```env
PORT=8080
JWT_SECRET=secret-key
AUTH_SERVICE_URL=[http://127.0.0.1:3002](http://127.0.0.1:3002)
PRODUCTS_SERVICE_URL=[http://127.0.0.1:3003](http://127.0.0.1:3003)
ORDERS_SERVICE_URL=[http://127.0.0.1:3001](http://127.0.0.1:3001)
```

## 🚀 Despliegue y Ejecución

Opción A: Ejecución Local (Desarrollo)
Si deseas correr el Gateway en tu máquina local para desarrollo:

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Levantar el servicio en modo desarrollo
npm run start:dev
```

Opción B: Usando Docker (Producción)
Para construir y levantar el contenedor de forma aislada:

```bash
# 1. Construir la imagen
docker build -t api-gateway .

# 2. Correr el contenedor
docker run -p 8080:8080 --env-file .env api-gateway
```

## 🛣️ Enrutamiento Configurado

El Gateway captura y redirige automáticamente las peticiones hacia sus respectivos microservicios:

| Métodos | Endpoint Base | Microservicio Destino | Seguridad |
| :--- | :--- | :--- | :--- |
| `GET`, `POST` | `/auth/*` | ➔ **Auth Service** | Pública |
| `GET` | `/products/*` | ➔ **Products Service**| Pública pero 🔒 Requiere JWT para crear/actualizar un producto |
| `GET`, `POST`, `PATCH` | `/orders/*` | ➔ **Orders Service** | 🔒 Requiere JWT |
