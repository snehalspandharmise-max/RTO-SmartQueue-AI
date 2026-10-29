import React, { useState } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-sm"
        style={{ position: 'relative', padding: '0.45rem 0.65rem', borderRadius: '50%' }}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              borderRadius: '9999px',
              padding: '1px 5px',
              minWidth: '16px',
              textAlign: 'center'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '120%',
            width: '320px',
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>In-App Notifications</span>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
              {unreadCount} unread
            </span>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: n.is_read ? '#ffffff' : '#f0f9ff',
                    cursor: 'pointer'
                  }}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.825rem', color: '#0f172a' }}>{n.title}</strong>
                    {!n.is_read && (
                      <span style={{ fontSize: '0.65rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Check size={10} /> New
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.35 }}>{n.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.4rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                    <Clock size={11} /> {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
