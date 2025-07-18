# Barlacteo Frontend

Este proyecto es una aplicación frontend desarrollada en **React** diseñada para modernizar el sistema de **Barlacteo**, ofreciendo una interfaz de usuario intuitiva y eficiente. Interactúa con dos microservicios backend desarrollados en **Spring Boot** con **Maven** y **API REST**, optimizando la gestión de inventarios y la autenticación segura para mejorar la experiencia de los trabajadores y usuarios de Barlacteo.

## Microservicios

- **Microservicio de Inventario**: Permite registrar y gestionar productos, lotes, movimientos, categorías y otras funcionalidades relacionadas con el control de inventarios.
- **Microservicio de Autenticación**: Administra el registro de usuarios y restringe el acceso mediante tokens **JWT**, garantizando seguridad en el sistema.

## Requisitos previos

- **Node.js** (versión 18.x o superior)
- **npm** o **yarn** para la gestión de dependencias
- **Docker** y **Docker Compose** (opcional, para ejecutar los microservicios)
- Microservicios backend desplegados:
  - **Inventario API**: Ejemplo: `[http://localhost:8080](https://github.com/clmoralesl/barlacteo-inventario)`
  - **Autenticación API**: Ejemplo: `[http://localhost:8081](https://github.com/clmoralesl/inventario-auth)`
- Base de datos MySQL configurada para el microservicio de autenticación

