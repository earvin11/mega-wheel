# Sprint Gaming Boilerplate Doc:

## Descripción:

Este proyecto sirve como punto de partida para el backend de los juegos de la empresa Sprint Gaming. Se ha implementado utilizando la Arquitectura Hexagonal con Vertical Slicing, lo que nos permite crear una solución modular y escalable. Además, hemos aplicado el Diseño Guiado por el Dominio (DDD) y el Diseño Guiado por Tests (TDD), lo que ha permitido generar una solución limpia y bien estructurada.

Al utilizar la Arquitectura Hexagonal con Vertical Slicing, hemos conseguido desacoplar las diferentes capas de la aplicación y separar la lógica de negocio de los detalles técnicos de la implementación. Esto hace que el código sea más fácil de entender y mantener.

El Diseño Guiado por el Dominio (DDD) nos ha permitido modelar el dominio de la aplicación de manera clara y precisa, lo que ha facilitado la implementación de la lógica de negocio.

Por último, el Diseño Guiado por Tests (TDD) nos ha permitido asegurarnos de que el código cumple con los requisitos especificados en los casos de uso y que se comporta de manera esperada. Esto ha permitido detectar y corregir errores de manera temprana en el ciclo de desarrollo.

## Requisitos:

- Node JS v16.5.0.
- MongoDB v5.0

## Instalación:

1. Clona el repositorio del proyecto en tu espacio de trabajo local:

```bash
git clone git@bitbucket.org:informagestudios/games-boilerplate.git
```

2. Instala las dependencias del proyecto.

```bash
yarn install
```

3. Configura tus variables de entorno. Se provee un archivo .env.example. Debes cambiar su nombre a .env.

## Uso:

1. Asegúrate de que el servidor de MongoDB esté en ejecución.
2. Inicia el servidor de desarrollo con el siguiente comando:

```bash
yarn dev
```

3. La aplicación estará disponible en http://localhost:3333.

## Pruebas:

El proyecto tiene suites de pruebas configuradas para cada módulo del backend. Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
yarn test
```

Si deseas ejecutar pruebas específicas, puedes especificar la suite de pruebas con el siguiente comando:

```bash
yarn test [nombre-de-la-suite]
```

Los nombres de las suites disponibles son:

- auditory
- user
- chips
- support
- role
- questions
- operator
- log
- game
- faqs
- exchange
- currency
- croupier
- client
- authentication

## Documentación de la API

La API del proyecto proporciona servicios para interactuar con la base de datos y gestionar los recursos del sistema. Los endpoints son accesibles a través del protocolo HTTP y siguen las convenciones REST.

Para conocer más sobre la estructura, parámetros y respuestas de los diferentes endpoints, consulte la [documentación de la API](https://documenter.getpostman.com/view/25411609/2s93eYUBv2) generada con Postman.
# mega-wheel
