import { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CustomerDisplay } from './components/CustomerDisplay';
import { KitchenMonitor } from './components/KitchenMonitor';
import { Dashboard } from './components/Dashboard';
import { MenuCatalog } from './components/MenuCatalog';
import { StaffManagement } from './components/StaffManagement';
import { ShiftHistory } from './components/ShiftHistory';
import { NewOrderModal } from './components/NewOrderModal';
import { api } from './services/api';
import { Order, Product, Category, ShiftSummary, CashMovement, User, DashboardMetrics, OrderStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('customer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shift, setShift] = useState<ShiftSummary | null>(null);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

  // Load core data
  const refreshData = useCallback(async () => {
    const isOnline = await api.checkBackend();
    setBackendOnline(isOnline);

    const [ordersData, prodsData, catsData, shiftData, movsData, usersData, metricsData] = await Promise.all([
      api.getOrders(),
      api.getProducts(),
      api.getCategories(),
      api.getActiveShift(),
      api.getShiftMovements(),
      api.getUsers(),
      api.getDashboardMetrics()
    ]);

    setOrders(ordersData);
    setProducts(prodsData);
    setCategories(catsData);
    setShift(shiftData);
    setMovements(movsData);
    setUsers(usersData);
    setMetrics(metricsData);
  }, []);

  useEffect(() => {
    refreshData();
    // Poll data every 10 seconds to keep KDS and Customer Display in sync
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Actions
  const handleUpdateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    const updated = await api.getOrders();
    setOrders(updated);
    const updatedMetrics = await api.getDashboardMetrics();
    setMetrics(updatedMetrics);
  };

  const handleOrderDelivered = async (orderId: number) => {
    await handleUpdateOrderStatus(orderId, 'entregado');
  };

  const handleToggleStock = async (productId: number, newStock: boolean) => {
    await api.toggleProductStock(productId, newStock);
    const prods = await api.getProducts();
    setProducts(prods);
  };

  const handleAddMovement = async (tipo: 'INGRESO' | 'EGRESO', monto: number, concepto: string) => {
    await api.addCashMovement(tipo, monto, concepto);
    const [s, m] = await Promise.all([api.getActiveShift(), api.getShiftMovements()]);
    setShift(s);
    setMovements(m);
  };

  const handleCreateOrder = async (orderNum: number, tipo: 'mesa' | 'para_llevar', items: { prodId: number; qty: number; notas?: string }[]) => {
    await api.createDemoOrder(orderNum, tipo, items);
    const updated = await api.getOrders();
    setOrders(updated);
    const updatedMetrics = await api.getDashboardMetrics();
    setMetrics(updatedMetrics);
  };

  const handleCreateUser = async (data: any) => {
    await api.createUser(data);
    const u = await api.getUsers();
    setUsers(u);
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    await api.toggleUserActive(userId, newStatus);
    const u = await api.getUsers();
    setUsers(u);
  };

  const nextOrderNumber = orders.length > 0 ? Math.max(...orders.map(o => o.numero_orden)) + 1 : 147;

  return (
    <div className="app-container">
      {/* Central Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewOrder={() => setShowOrderModal(true)}
        backendOnline={backendOnline}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'customer' && (
          <CustomerDisplay
            orders={orders}
            onOrderDelivered={handleOrderDelivered}
          />
        )}

        {activeTab === 'kitchen' && (
          <KitchenMonitor
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'dashboard' && metrics && shift && (
          <Dashboard
            metrics={metrics}
            shift={shift}
            recentOrders={orders}
          />
        )}

        {activeTab === 'menu' && (
          <MenuCatalog
            products={products}
            categories={categories}
            onToggleStock={handleToggleStock}
          />
        )}

        {activeTab === 'shifts' && shift && (
          <ShiftHistory
            shift={shift}
            movements={movements}
            onAddMovement={handleAddMovement}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement
            users={users}
            onCreateUser={handleCreateUser}
            onToggleStatus={handleToggleUserStatus}
          />
        )}
      </main>

      {/* New Test Order Modal */}
      {showOrderModal && (
        <NewOrderModal
          products={products}
          onClose={() => setShowOrderModal(false)}
          onCreateOrder={handleCreateOrder}
          nextOrderNumber={nextOrderNumber}
        />
      )}
    </div>
  );
}

export default App;
