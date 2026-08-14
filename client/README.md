# IRIS To-Do Frontend

Frontend de la prueba técnica de IRIS construido con Angular 22, componentes standalone y Signals.

## Estado actual

- Dashboard responsive basado en la propuesta visual.
- Lista inicialmente vacía: no se utilizan datos mock precargados.
- Creación, completado y eliminación de tareas en memoria.
- Búsqueda por título.
- Filtros por estado y categoría.
- Ordenamiento por prioridad o fecha.
- Métricas de total, completadas, pendientes y progreso.
- Estructura preparada para conectar posteriormente una API.

Todavía no se han definido endpoints ni se ha agregado un cliente HTTP. La persistencia actual vive en `TaskService` y se reemplazará cuando exista el contrato del backend.

## Estructura

```text
src/app/
├── pages/components/  # Vistas de página y sus componentes
│   └── task-dashboard/
├── models/            # Tipos del frontend
├── services/          # Servicios de aplicación
├── guards/            # Reservado para autenticación
└── interceptors/      # Reservado para HTTP/auth
```

## Desarrollo local

```bash
npm install
npm start
```

Abrir `http://localhost:4200/tasks`.

## Build y pruebas

```bash
npm run build
npm test -- --watch=false
```

## Environments

La configuración se encuentra en `src/environments/`. Actualmente contiene únicamente el indicador de producción. El logo pertenece a la vista y se declara en `task-dashboard.html`. La URL de la API se agregará cuando se defina el backend; no se incluyen secretos en estos archivos porque forman parte del bundle público del navegador.
