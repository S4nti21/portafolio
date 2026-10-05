---
titulo: 'RDAM: certificados digitales de deuda alimentaria'
codigo: 'HOLOCRÓN'
anio: 2026
categoria: 'Proyecto académico (full stack)'
resumen: 'Sistema full stack que digitaliza de punta a punta el trámite del certificado de deuda alimentaria: solicitud, pago online y entrega por email.'
problema: 'Pedir un certificado de deuda alimentaria exige ir en persona, pagar en ventanilla y después volver a retirarlo.'
resultado: 'El trámite se hace entero online y cada paso queda auditado: 32 endpoints REST documentados con Swagger, y los 4 servicios se levantan con un solo comando.'
stack:
  - 'Java 17'
  - 'Spring Boot 3.2'
  - 'Spring Security (JWT)'
  - 'MySQL 8'
  - 'React 19'
  - 'TypeScript'
  - 'Node.js'
  - 'Docker Compose'
  - 'GitHub Actions'
repo: 'https://github.com/S4nti21/RDAM'
imagen: '../../assets/misiones/rdam.png'
imagenAlt: 'Portada del proyecto: una notebook con el panel del ciudadano y sus solicitudes, junto a un certificado de deuda alimentaria y un sobre de email.'
orden: 2
borrador: false
---

Lo hice como proyecto académico en el Summer Campus 2026 de i2T. El ciudadano radica la solicitud, paga el arancel por una pasarela externa y recibe el certificado por email; un operador la revisa y la resuelve.

### Lo que hice

- **Tres roles** con permisos distintos (ciudadano, operador y administrador) y autenticación con JWT.
- **Un flujo de estados que solo avanza**: lo garantizan un trigger en la base de datos y la validación del backend. Todo queda auditado.
- **32 endpoints REST** documentados con OpenAPI/Swagger.
- **Se levanta con un comando**: `docker compose up --build` arranca los 4 servicios.

### La integración de pago

Es la parte que más trabajé. El backend cifra el monto y las URLs de retorno con AES-256-CBC, y el navegador los envía a la pasarela con un POST de formulario. La pasarela confirma el pago con un webhook firmado con HMAC-SHA256, y el backend valida esa firma antes de dar el pago por bueno: sin eso, cualquiera podría marcar una solicitud como pagada.

### El stack, capa por capa

- **Backend**: Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, MapStruct y MySQL 8.
- **Frontend**: React 19, TypeScript estricto, Vite 7 y CSS propio con design tokens.
- **Pasarela**: un simulador en Node.js con Express.
- **Infraestructura**: Docker Compose con 4 servicios, nginx y GitHub Actions para la integración continua.

El organismo y los datos son ficticios: es un proyecto con fines educativos.
