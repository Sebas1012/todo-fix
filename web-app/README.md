# IRIS To-Do Frontend

Frontend de la prueba técnica de IRIS construido con Angular 22, componentes standalone y Signals.

## Estado actual

- Dashboard responsive basado en la propuesta visual.
- Lista inicialmente vacía: no se utilizan datos mock precargados.
- Creación, completado y eliminación de tareas mediante la API.
- Búsqueda por título.
- Filtros por estado y categoría.
- Ordenamiento por prioridad o fecha.
- Métricas de total, completadas, pendientes y progreso.
- Contratos, mapper y servicios preparados para la API REST.

La API local utiliza `http://localhost:3000/api`. El login se implementará después; durante el desarrollo puede utilizarse el bypass controlado del API.

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
pnpm install
pnpm start
```

Abrir `http://localhost:4200/tasks`.

## Build y pruebas

```bash
pnpm run build
pnpm test -- --watch=false
```

## Environments

La configuración se encuentra en `src/environments/` e incluye únicamente el indicador de producción y la URL pública de la API. No se incluyen secretos en estos archivos porque forman parte del bundle público del navegador.
