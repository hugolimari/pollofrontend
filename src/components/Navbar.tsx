import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  ChefHat, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  Coins, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Maximize, 
  Minimize,
  Flame
} from 'lucide-react';
import { soundService } from '../services/speech';

export type ActiveTab = 'customer' | 'kitchen' | 'dashboard' | 'menu' | 'staff' | 'shifts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewOrder: () => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  backendOnline
}) => {
  const [time, setTime] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundService.setSoundEnabled(next);
    if (next) soundService.playChime();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header style={{
      background: 'rgba(14, 19, 31, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: 'var(--ember-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px var(--ember-glow)'
          }}>
            <Flame size={24} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', lineHeight: 1.2 }}>
              Pollo que hace pollo
            </h1>
            <p style={{ fontSize: 11, color: 'var(--ember-400)', fontWeight: 600, letterSpacing: '0.04em' }}>
              PANEL WEB CENTRAL & DISPLAY KDS
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--bg-surface)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('customer')}
            className={`btn ${activeTab === 'customer' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 13 }}
            title="Pantalla completa para TV de clientes"
          >
            <Tv size={16} />
            <span>Pantalla de Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`btn ${activeTab === 'kitchen' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            <ChefHat size={16} />
            <span>Monitor Cocina</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            <LayoutDashboard size={16} />
            <span>Control & Ventas</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            <UtensilsCrossed size={16} />
            <span>Menú</span>
          </button>

          <button
            onClick={() => setActiveTab('shifts')}
            className={`btn ${activeTab === 'shifts' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            <Coins size={16} />
            <span>Caja Chica</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`btn ${activeTab === 'staff' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            <Users size={16} />
            <span>Personal</span>
          </button>
        </nav>

        {/* Action Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* New Test Order Trigger */}
          <button
            onClick={onOpenNewOrder}
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '8px 14px' }}
          >
            <PlusCircle size={16} />
            <span>Nuevo Pedido Demo</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`btn btn-secondary btn-icon ${soundOn ? '' : 'btn-outline'}`}
            title={soundOn ? 'Llamada por voz activada' : 'Llamada por voz silenciada'}
            style={{ width: 38, height: 38 }}
          >
            {soundOn ? <Volume2 size={18} color="var(--ready-text)" /> : <VolumeX size={18} color="var(--text-muted)" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="btn btn-secondary btn-icon"
            title="Pantalla Completa (TV)"
            style={{ width: 38, height: 38 }}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Clock */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 700,
            background: 'var(--bg-surface)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}>
            {time}
          </div>

          {/* Backend Status indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            padding: '6px 10px',
            borderRadius: 'var(--radius-full)',
            background: backendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.12)',
            border: `1px solid ${backendOnline ? 'var(--ready-border)' : 'rgba(59, 130, 246, 0.3)'}`,
            color: backendOnline ? 'var(--ready-text)' : '#60A5FA'
          }}>
            {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{backendOnline ? 'API PostgreSQL' : 'Modo Standalone'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
