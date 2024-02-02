# API REST AWS Lambda Y Serverless Framework

Implmentación de API REST con endpoints `POST` y `GET` . Recupera y guarda datos de The Star Wars API de modelo  '`Starships` '. La arquitectura de este proyecto es contruido siguiento el patron `Repository Pattern`. 

## Tecnologias

- `node.js` con  `node.js`
- `express`
- `tsoa` para trabajar con anotaciones para generar APIS.
- `serverless-framework`
- `serverless-framework` para desplegar proyectos a AWS
- `jest`y `supertest` para escribir pruebas unitarias
- `swagger-ui-express` para generar documentación 
- `docker` para generar base de datos dynamodb localmente para testear


## Instalación

clonar el proyecto:

```
git clone https://github.com/calfarome/api-serverless-typescript.git
```

Entrar directorio

```
cd api-serverless-typescript
```

Run:

```
npm install
```

## Usage

Para iniciar el proyecto, primero levantar base de datos DynamoDB localente con docker

```
npm run docker
```

Luego iniciar el proyecto localmente:

```
npm run dev```


## Documentacion

Una vez iniciado el proyecto, ingresar: [http://localhost:4000/docs/](http://localhost:3000/docs/)
para ver documentación y probar los endpoints

## Desplegar a AWS

Run:

```
npm run deploy
```


## Iniciar pruebas unitarias

Run:

```
npm test
```

## Autor

César A. M.