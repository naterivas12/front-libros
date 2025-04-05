# TelcoBooks

Un sistema moderno de gestión de libros construido con Angular 11, que presenta una arquitectura modular y Bootstrap para un diseño responsive.

## Características

- 📚 Operaciones CRUD completas para libros y autores
- 🎯 Arquitectura modular para una mejor organización del código
- 🎨 Interfaz de usuario responsive con Bootstrap
- 📝 Validación de formularios y manejo de errores
- 🔍 Funcionalidad de búsqueda
- 📄 Soporte de paginación
- 🚀 Formularios modales para una entrada de datos eficiente

## Stack Tecnológico

- Angular 11
- Bootstrap
- Angular HttpClient
- Formularios Reactivos
- TypeScript

## Estructura del Proyecto

La aplicación sigue una arquitectura modular con módulos de características:

```
src/
├── app/
│   ├── modules/
│   │   ├── authors/
│   │   ├── books/
│   │   ├── dashboard/
│   │   └── layout/
│   ├── core/
│   └── shared/
```

## Servidor de Desarrollo

Ejecuta `ng serve` para iniciar el servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias cualquiera de los archivos fuente.

## Construcción

Ejecuta `ng build` para construir el proyecto. Los archivos generados se almacenarán en el directorio `dist/`. Usa la bandera `--prod` para una construcción de producción.

## Integración con API

La aplicación se conecta a una API REST en:
```
https://back-libros-production.up.railway.app/api
```
