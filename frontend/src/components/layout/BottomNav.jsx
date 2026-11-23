import { NavLink, Link } from 'react-router-dom';
import { Home, Coffee, Compass, Tag, User, Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites.js';

const NAV_ITEMS = [
  { to: '/',      label: 'Beranda', icon: Home },
  { to: '/kafe',  label: 'Kafe',    icon: Coffee },
  { to: '/cari',  label: 'Cari',    icon: Compass },
  { to: '/promo', label: 'Promo',   icon: Tag },
  { to: '/profil',label: 'Profil',  icon: User },
];

export default function BottomNav() {
  const { favIds } = useFavorites();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigasi utama">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          aria-label={label}
          id={`nav-${label.toLowerCase()}`}
        >
          <Icon size={22} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
