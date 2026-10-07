---
titulo: 'Gestión interna de Productos Weidmann'
codigo: 'ARMERÍA'
anio: 2026
categoria: 'App de gestión (PWA)'
resumen: 'App web en producción para Productos Weidmann, el negocio de mi familia: pedidos, cuentas corrientes y préstamo de espadas en tiempo real.'
problema: 'Los pedidos se seguían a mano, en papel y por WhatsApp, sin un lugar donde ver en qué estado estaba cada uno. Además, las espadas que la empresa presta a sus clientes para armar brochets gigantes muchas veces no volvían.'
resultado: 'Está en producción y se usa todos los días en el local y el depósito: reemplazó al papel y a WhatsApp en el seguimiento de los pedidos, y cada espada prestada queda registrada hasta que vuelve.'
stack: ['React 18', 'Vite 5', 'React Router', 'Supabase', 'PWA (Workbox)', 'ESLint 9', 'Vitest']
imagen: '../../assets/misiones/productos-weidmann.jpg'
imagenAlt: 'La app de Productos Weidmann en un celular, una tablet y una computadora, abierta en el inicio con el resumen de la semana: pedidos y préstamos activos.'
orden: 1
borrador: false
---

## La solución

Desarrollé una app web a medida del flujo de trabajo de la empresa, que se usa desde el celular o la PC. Cada pedido tiene un estado que se actualiza en tiempo real en todos los dispositivos, y de cada espada prestada queda registrado quién la tiene, con un recordatorio de devolución por WhatsApp que sale con un solo toque.

Tiene dos roles: **producción**, para cargar y actualizar pedidos y préstamos desde el local o el depósito, y **administración**, que además maneja cuentas corrientes, remitos, productos y precios.

### Qué hace

- **Pedidos** con estados (Pendiente, Completado, Entregado o Cancelado), edición y sincronización en tiempo real entre dispositivos.
- **Historial** con filtros y purga automática de registros antiguos.
- **Préstamo de espadas**: quién tiene cada una, su devolución y el recordatorio por WhatsApp.
- **Cuentas corrientes de mayoristas**: saldo, historial de movimientos, pedidos con precios editables, registro de pagos y remitos en PDF. Los movimientos no se borran: se anulan con un motivo, así queda trazabilidad completa.
- **Inicio con resumen semanal**: pedidos por estado y préstamos activos y devueltos, de un vistazo.
- **PWA instalable**, que funciona sin conexión.

### Por qué una PWA

En planta, los celulares y tablets están expuestos a humedad, suciedad y uso rudo, así que no tenía sentido apostar a equipos de gama alta. Elegí una PWA liviana que corre bien en equipos viejos o de gama baja. Supabase funciona como base de datos y capa de tiempo real: el frontend se conecta directo, sin un backend propio que mantener.

## Lo que aprendí

Es mi primer proyecto en producción real, y lo hice para el negocio de mi familia. Antes de escribir una línea de código tuve que entender el proceso de punta a punta, y me llevo que las decisiones técnicas se piensan para el contexto en el que se usa la app, no solo para la demo. Seguro hay mucho margen de mejora y es el primer paso de un camino largo, pero estoy orgulloso de que hoy se use todos los días.
