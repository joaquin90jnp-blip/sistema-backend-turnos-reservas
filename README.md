# Sistema Backend de Turnos y Reservas — Entrega Final

API backend completa para administrar servicios, gestionar reservas, asociar servicios a una reserva y consultar la relación entre ambas entidades.

Persistencia principal: **MongoDB Atlas + Mongoose**, arquitectura en capas `routes → controllers → services → repositories → DAO → models`. Validación con **Zod**, consultas avanzadas con paginación, relaciones con **ObjectId + populate**, vistas con **Handlebars** y tiempo real con **Socket.io**.

## Tecnologías
- Node.js + Express 4 + Mongoose 7 (Atlas) + Zod 3
- express-handlebars + Socket.io 4
- dotenv para configuración

## Estructura
```
src/
  config/env.config.js
  models/service.model.js
  models/booking.model.js
  dao/services.dao.js
  dao/bookings.dao.js
  repositories/services.repository.js
  repositories/bookings.repository.js
  services/services.service.js
  services/bookings.service.js
  validators/services.validator.js
  validators/bookings.validator.js
  validators/query.validator.js
  middlewares/validation.middleware.js
  controllers/services.controller.js
  controllers/bookings.controller.js
  controllers/views.controller.js
  routes/services.router.js
  routes/bookings.router.js
  routes/views.router.js
  views/layouts/main.handlebars
  views/services.handlebars
  views/availability.handlebars
  views/error.handlebars
  public/css/styles.css
  public/js/socket.js
  app.js
  server.js
.env.example
.gitignore
README.md
```

## Modelos
- **Service**: `name, description, duration (>0), price (>=0), category, available (boolean)`, timestamps.
- **Booking**: `clientName, clientEmail (email), date (YYYY-MM-DD), time (HH:MM), status enum [pending,confirmed,cancelled,completed], services: [{ service: ObjectId ref Service, quantity >=1 }]`. Solo guarda `ObjectId`, nunca el objeto completo.

## Instalación
```bash
npm install
cp .env.example .env
# Editar .env SOLO local (no se sube):
# PORT=8080
# MONGO_URI=mongodb+srv://usuario:<db_password>@ecommerce-cluster.cs8tgdt.mongodb.net/turnos-reservas?retryWrites=true&w=majority&appName=ecommerce-cluster
npm run dev
# o
npm start
```

## Endpoints
```
GET    /                                health
GET    /api/services?category=&available=&page=&limit=&sortBy=&order=
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/:bid               populate
PUT    /api/bookings/:bid
DELETE /api/bookings/:bid
POST   /api/bookings/:bid/services/:sid asocia servicio (quantity++)
GET    /views/services                  Handlebars
GET    /views/availability              Handlebars services + bookings
GET    /views/bookings                  alias availability
```

## Consultas avanzadas GET /api/services
| Param | Ejemplo | Descripción |
|-------|---------|-------------|
| `category` | `?category=peluqueria` | filtro exacto |
| `available` | `?available=true` | `true`/`false` |
| `page` | `?page=2` | >=1, default 1 |
| `limit` | `?limit=5` | 1-100, default 10 |
| `sortBy` | `?sortBy=price` | name,price,duration,category,createdAt,updatedAt |
| `order` | `?order=desc` | asc/desc, default asc |

Respuesta:
```json
{
  "status": "success",
  "payload": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

Ejemplos:
```bash
curl "http://localhost:8080/api/services"
curl "http://localhost:8080/api/services?category=estetica&available=true"
curl "http://localhost:8080/api/services?page=2&limit=2"
curl "http://localhost:8080/api/services?sortBy=price&order=desc"
```

## Validación Zod (400 antes de DB)
```bash
# Falta category
curl -X POST http://localhost:8080/api/services -H "Content-Type: application/json" -d '{"name":"Test","description":"desc","duration":30,"price":1000,"category":"","available":true}'

# Email inválido
curl -X POST http://localhost:8080/api/bookings -H "Content-Type: application/json" -d '{"clientName":"Ana","clientEmail":"bad","date":"2026-10-01","time":"10:00"}'

# ObjectId inválido
curl -X POST http://localhost:8080/api/bookings/123/services/abc
```

## Populate
```bash
SID=$(curl -s -X POST http://localhost:8080/api/services -H "Content-Type: application/json" -d '{"name":"Corte","description":"Corte clásico","duration":30,"price":5000,"category":"peluqueria","available":true}' | python3 -c "import sys,json; print(json.load(sys.stdin)['payload']['_id'])")
BID=$(curl -s -X POST http://localhost:8080/api/bookings -H "Content-Type: application/json" -d '{"clientName":"Ana","clientEmail":"ana@test.com","date":"2026-10-01","time":"10:00"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['payload']['_id'])")
curl -X POST http://localhost:8080/api/bookings/$BID/services/$SID
curl http://localhost:8080/api/bookings/$BID
# -> services[0].service.name = "Corte"
```

## Handlebars + Socket.io
- `/views/services`: tabla + form crear + cambiar disponibilidad. Escucha `serviceCreated/Updated/Deleted`.
- `/views/availability`: services + bookings con populate + forms crear reserva / agregar servicio. Escucha `bookingCreated/Updated/Deleted`.
- Abrir en 2 pestañas, crear desde una → aparece en la otra sin recargar.

## Variables de entorno
Todo por `.env`. Repo incluye `.env.example`, nunca `.env`, `node_modules` ni credenciales.
