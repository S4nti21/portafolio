---
titulo: 'ATuPuerta: delivery de productos variados'
codigo: 'HALCÓN'
anio: 2026
categoria: 'Proyecto anual en equipo'
resumen: 'Plataforma de delivery para comercios de cualquier rubro, no solo de comida: cuatro roles, pago con Mercado Pago y seguimiento del repartidor en vivo.'
problema: 'Las apps de reparto más conocidas (PedidosYa, Rappi, Glovo, Uber) cobran una comisión de entre el 15 y el 30 %, además del envío: el cliente paga más y el comercio gana menos. Y casi todas se especializan en comida.'
resultado: 'Frontend y backend ya funcionan integrados de punta a punta, con pagos de prueba en Mercado Pago: un comercio de cualquier rubro puede vender con delivery sin ceder un porcentaje de cada venta.'
stack:
  - 'Node.js'
  - 'Express'
  - 'MySQL'
  - 'React 19'
  - 'Vite'
  - 'Socket.IO'
  - 'Mercado Pago'
  - 'Mapbox'
  - 'Leaflet'
repo: 'https://github.com/AaronJuarez-P/Proyecto-aTuPuerta-PP2'
imagen: '../../assets/misiones/atupuerta.jpg'
imagenAlt: 'Logo de ATuPuerta: un marcador de mapa con una casa y una caja, y el lema "Todo lo que necesitás, en un solo lugar".'
orden: 3
borrador: false
---

## La solución

Armamos una plataforma de delivery que no se queda con un porcentaje de cada venta: el cliente paga el precio que pone el comercio, sin recargos, y el repartidor cobra por distancia, con un monto base más un adicional por kilómetro. Y sirve para cualquier rubro, no solo comida: hoy reúne supermercados, librerías, ferreterías y tiendas de ropa.

Cada uno de los cuatro roles tiene su panel. El **cliente** compra, paga con Mercado Pago y sigue al repartidor en vivo en el mapa; el **comercio** gestiona sus productos, el stock, los precios y los pedidos; el **repartidor** toma pedidos y confirma cada entrega, y el **administrador** supervisa todo. Los avisos de cada pedido llegan como notificaciones push.

## Mi parte

Lo hicimos en equipo como proyecto anual de la Práctica Profesionalizante 2 del IES Santa Fe, con Aarón Juarez en el backend y Gonzalo Silva y Jerónimo Ocampo en el frontend. Yo trabajé en el backend y después integré el frontend con la API.

- **Pagos con Mercado Pago**, en modo sandbox. El webhook es idempotente, porque Mercado Pago reintenta las notificaciones, y si se rechaza una compra los productos vuelven al stock.
- **Seguimiento del repartidor en vivo** con Socket.IO, sobre un mapa de Leaflet y OpenStreetMap.
- **Rutas y geocodificación con Mapbox**, migradas desde Google Maps, con la búsqueda de direcciones limitada a la zona de reparto.
- **Catálogo de productos** con stock y precios, y el flujo completo del repartidor.
- **La integración del frontend con el backend**, por fases: sesión real y login de los cuatro roles, compra, pago y seguimiento del cliente, paneles del comercio y del repartidor, perfil, notificaciones, reclamos y administración.

## Cómo está hecho

- **Backend**: Node.js y Express con MySQL, JWT y bcryptjs para la autenticación, Web Push para las notificaciones, y helmet con express-rate-limit para la seguridad.
- **Frontend**: React 19 con Vite, React Router con rutas protegidas por rol, el cliente de Socket.IO, Leaflet y Oxlint.
