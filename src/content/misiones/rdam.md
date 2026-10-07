---
titulo: 'RDAM: certificados digitales de deuda alimentaria'
codigo: 'HOLOCRÓN'
anio: 2026
categoria: 'Proyecto académico (full stack)'
resumen: 'Sistema full stack que digitaliza de punta a punta el trámite del certificado de deuda alimentaria: solicitud, pago online y entrega por email.'
problema: 'Pedir un certificado de deuda alimentaria exige ir en persona, pagar en ventanilla y después volver a retirarlo.'
resultado: 'De tres pasos presenciales a ninguno: el certificado se pide y se paga online, llega por email y cada paso queda auditado.'
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

## La solución

Llevé el trámite entero a la web. El ciudadano carga la solicitud, paga el arancel online a través de una pasarela externa y recibe el certificado por email. Del otro lado, un operador revisa cada solicitud y la resuelve.

- **Tres roles** con permisos distintos (ciudadano, operador y administrador) y autenticación con JWT.
- **Un flujo de estados que solo avanza**: una solicitud nunca vuelve atrás, y lo garantizan un trigger en la base de datos y la validación del backend. Todo queda auditado.

### La integración de pago

Es la parte que más trabajé. El backend cifra el monto y las URLs de retorno con AES-256-CBC, y el navegador los envía a la pasarela con un POST de formulario. La pasarela confirma el pago con un webhook firmado con HMAC-SHA256, y el backend valida esa firma antes de dar el pago por bueno: sin eso, cualquiera podría marcar una solicitud como pagada.

## Cómo está hecho

- **Backend**: Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, MapStruct y MySQL 8, con 32 endpoints REST documentados con OpenAPI/Swagger.
- **Frontend**: React 19, TypeScript estricto, Vite 7 y CSS propio con design tokens.
- **Pasarela**: un simulador en Node.js con Express.
- **Infraestructura**: Docker Compose con 4 servicios, nginx y GitHub Actions para la integración continua. Todo se levanta con un solo comando: `docker compose up --build`.

## El contexto

Lo hice como proyecto académico en el Summer Campus 2026 de i2T. El organismo y los datos son ficticios.
