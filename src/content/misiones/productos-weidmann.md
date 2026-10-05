---
titulo: 'Gestión interna de Productos Weidmann'
codigo: 'ARMERÍA'
anio: 2026
categoria: 'App de gestión (PWA)'
resumen: 'App web en producción para Productos Weidmann, el negocio de mi familia: pedidos, cuentas corrientes y préstamo de espadas en tiempo real.'
problema: 'Los pedidos se seguían a mano, en papel y por WhatsApp, sin un lugar donde ver en qué estado estaba cada uno. Además, las espadas que la empresa presta a sus clientes para armar brochets gigantes muchas veces no volvían.'
resultado: 'Está en producción y se usa todos los días: cada pedido se ve en tiempo real desde cualquier dispositivo, y de cada espada se sabe quién la tiene, con recordatorio de devolución por WhatsApp en un toque.'
stack: ['React 18', 'Vite 5', 'React Router', 'Supabase', 'PWA (Workbox)', 'ESLint 9', 'Vitest']
imagen: '../../assets/misiones/productos-weidmann.jpg'
imagenAlt: 'La app de Productos Weidmann en un celular, una tablet y una computadora, abierta en el inicio con el resumen de la semana: pedidos y préstamos activos.'
orden: 1
borrador: false
---

Desarrollé una herramienta de gestión a medida del flujo de trabajo de la empresa: reemplazó el seguimiento manual de pedidos por una app web con estado en tiempo real, que se usa desde el celular o la PC.

Tiene dos roles: **producción**, para cargar y actualizar pedidos y préstamos desde el local o el depósito, y **administración**, que además maneja cuentas corrientes, remitos, productos y precios.

### Lo que hice

- **Pedidos**: estados (Pendiente, Completado, Entregado o Cancelado), edición y sincronización en tiempo real entre dispositivos.
- **Historial**: filtros y purga automática de registros antiguos.
- **Préstamo de espadas**: quién tiene cada una, su devolución y un recordatorio por WhatsApp con un solo toque.
- **Cuentas corrientes de mayoristas**: saldo, historial de movimientos, pedidos con precios editables, registro de pagos y remitos en PDF. Los movimientos no se borran: se anulan con un motivo, así queda trazabilidad completa.
- **Inicio con resumen semanal**: pedidos por estado y préstamos activos y devueltos, de un vistazo.
- **PWA instalable**, que funciona sin conexión.

### Por qué una PWA

En planta, los celulares y tablets están expuestos a humedad, suciedad y uso rudo, así que no tenía sentido apostar a equipos de gama alta. Elegí una PWA liviana que corre bien en equipos viejos o de gama baja. Supabase funciona como base de datos y capa de tiempo real: el frontend se conecta directo, sin un backend propio que mantener.

### Lo que aprendí

Es mi primer proyecto en producción real, y lo hice para el negocio de mi familia. Antes de escribir una línea de código tuve que entender el proceso de punta a punta, y me llevo que las decisiones técnicas se piensan para el contexto en el que se usa la app, no solo para la demo. Seguro hay mucho margen de mejora y es el primer paso de un camino largo, pero estoy orgulloso de que hoy se use todos los días.
