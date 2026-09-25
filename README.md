# Frontend PolloPOS Web - Panel de Control y Pantalla de Clientes

Aplicación web complementaria en **React + Vite + TypeScript** para el sistema PolloPOS. Diseñada para funcionar en navegadores de escritorio, tabletas y pantallas de televisión (Smart TV / Totem publicitario).

---

## Modulos Incluidos

1. **Pantalla de Llamadas a Clientes (Turnero TV)**:
   - Vista de pantalla completa para exhibición hacia el público o comedor.
   - Columnas diferenciadas de pedidos **En Preparación** y pedidos **Listos para Retirar**.
   - **Timbre sonoro acústico (Chime)** generado mediante Web Audio API al cambiar una orden a lista.
   - **Locución por voz sintética (Text-to-Speech)** en español anunciando el número de orden y cliente.
   - Botón de pantalla completa nativo (`F11` o botón en interfaz).

2. **Monitor de Cocina (KDS - Kitchen Display System)**:
   - Visualización de comandas en tiempo real agrupadas por estado (Pendiente, En Preparación, Listo).
   - Cronómetro de tiempo transcurrido con alerta visual de demora (>15 min).
   - Acciones táctiles rápidas para avanzar el estado de la comanda con un solo toque.

3. **Panel de Control y Métricas (Dashboard)**:
   - Total de ventas del día, ticket promedio, comandas atendidas y arqueo estimado de efectivo.
   - Gráfico de volumen de pedidos por franja horaria.
   - Listado de productos más vendidos.
   - Indicador de estado del turno de caja actual.

4. **Catálogo y Control de Disponibilidad**:
   - Visualización de la carta con precios y categorías.
   - Interruptores rápidos para marcar productos agotados o activos en tiempo real sin reiniciar el sistema.

5. **Historial de Turnos y Arqueos de Caja**:
   - Resumen de aperturas y cierres de turno.
   - Comparativa de efectivo declarado vs registrado por sistema y cálculo de diferencias.

6. **Gestión de Personal**:
   - Administración de usuarios con control de roles (`admin`, `cajero`, `cocina`).
   - Bloqueo o activación de acceso.

7. **Creación Rápida de Pedidos**:
   - Modal para simular o ingresar comandas directamente desde la web para pruebas o pedidos telefónicos.

---

## Modo de Funcionamiento Híbrido (Backend Real / Modo Demo)

La aplicación cuenta con tolerancia automática:
- **Si el backend (`backendpollo`) está corriendo** en `http://localhost:3000`, la aplicación consumirá los datos reales de la base de datos PostgreSQL.
- **Si el backend no está iniciado**, la aplicación conmuta automáticamente a un almacén en memoria con datos de ejemplo interactivos, permitiendo evaluar el diseño y probar los cambios de estado sin necesidad de levantar bases de datos.

---

## Instrucciones de Instalación y Ejecución

### 1. Requisitos Previos
- Node.js versión 18 o superior.

### 2. Instalación de Dependencias
```bash
cd frontendpollo
npm install
```

### 3. Ejecución en Desarrollo
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:5173`.

### 4. Compilación para Producción
```bash
npm run build
```
Los archivos estáticos optimizados se generarán en la carpeta `dist/`.

---

## Configuración de Entorno (Opcional)

Si deseas apuntar a un servidor backend remoto o IP local específica (por ejemplo para probar desde una tablet o televisor conectado a la red Wi-Fi):

Crea un archivo `.env` en la raíz de `frontendpollo`:
```env
VITE_API_URL=http://192.168.1.100:3000/api
```
