import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const locations = { batumi: [41.643, 41.631] };
const adminAccounts = {
  elizeumbatumi: { pass: "loveheadshots", clubId: 1 },
  portalbatumi: { pass: "differentworld", clubId: 2 },
  controllerbatumi: { pass: "elizeumbetter", clubId: 3 }
};

const i18n = {
  ka: { book: "დაჯავშნა", confirm: "დადასტურება", name: "სახელი", phone: "ტელეფონი", time: "დრო (მაგ: 14-18)", day: "რიცხვი", month: "მაისი", admin: "ადმინი", guest: "სტუმარი", approve: "მიღება", login: "შესვლა", logout: "გამოსვლა", status: "სტატუსი", free: "გათავისუფლება", requests: "მოთხოვნები", pcs: "კომპიუტერები" },
  ru: { book: "Забронировать", confirm: "Подтвердить", name: "Имя", phone: "Телефон", time: "Время (напр: 14-18)", day: "Число", month: "Мая", admin: "Админ", guest: "Гость", approve: "Принять", login: "Войти", logout: "Выйти", status: "Статус", free: "Освободить", requests: "Заявки", pcs: "Компьютеры" },
  en: { book: "Book Now", confirm: "Confirm", name: "Name", phone: "Phone", time: "Time (ex: 2-6pm)", day: "Day", month: "May", admin: "Admin", guest: "Guest", approve: "Approve", login: "Login", logout: "Logout", status: "Status", free: "Free Up", requests: "Requests", pcs: "Computers" }
};

function MapHandler({ isVisible }) {
  const map = useMap();
  useEffect(() => {
    if (isVisible) { setTimeout(() => map.invalidateSize(), 250); }
  }, [isVisible, map]);
  return null;
}

function App() {
  const [lang, setLang] = useState('ka'); 
  const [view, setView] = useState('guest');
  const [authClubId, setAuthClubId] = useState(null);
  const [authForm, setAuthForm] = useState({ user: '', pass: '' });
  
  const [clubs, setClubs] = useState(() => {
    const saved = localStorage.getItem('gogame_clubs');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Elizeum", coords: [41.6446, 41.6302], computers: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, busy: false, user: null })) },
      { id: 2, name: "Portal", coords: [41.6439, 41.6322], computers: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, busy: false, user: null })) },
      { id: 3, name: "Controller", coords: [41.6427, 41.6308], computers: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, busy: false, user: null })) }
    ];
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('gogame_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeClubId, setActiveClubId] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', phone: '', timeText: '', day: '' });

  useEffect(() => {
    localStorage.setItem('gogame_clubs', JSON.stringify(clubs));
    localStorage.setItem('gogame_bookings', JSON.stringify(bookings));
  }, [clubs, bookings]);

  const handleLogin = () => {
    const acc = adminAccounts[authForm.user.toLowerCase()];
    if (acc && acc.pass === authForm.pass) { 
      setAuthClubId(acc.clubId); 
      setView('admin'); 
    } else { 
      alert("Invalid credentials!"); 
    }
  };

  const handleOrder = (club) => {
    if (!userForm.name || !userForm.phone || !userForm.timeText || !userForm.day) return alert("Fill all fields!");
    
    const newBooking = { 
      id: Date.now(), 
      clubId: club.id, 
      pc: selectedComp, 
      name: userForm.name,
      phone: userForm.phone,
      time: userForm.timeText,
      date: `${userForm.day} ${i18n[lang].month} 2026`
    };
    
    setBookings([newBooking, ...bookings]);
    alert("Request sent!");
    setActiveClubId(null); setSelectedComp(null); setUserForm({ name: '', phone: '', timeText: '', day: '' });
  };

  const approveOrder = (b) => {
    setClubs(prev => prev.map(c => c.id === b.clubId ? {
      ...c, computers: c.computers.map(p => p.id === b.pc ? { 
        ...p, busy: true, user: { ...b } 
      } : p)
    } : c));
    setBookings(prev => prev.filter(x => x.id !== b.id));
  };

  const freeUpPC = (pcId) => {
    setClubs(prev => prev.map(c => c.id === authClubId ? {
      ...c, computers: c.computers.map(p => p.id === pcId ? { ...p, busy: false, user: null } : p)
    } : c));
  };

  const t = i18n[lang];
  const currentClub = clubs.find(c => c.id === authClubId);

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">GoGame <span>GEORGIA</span></div>
        <div className="nav">
          <div className="group">
            <button className={view === 'guest' ? 'active' : ''} onClick={() => setView('guest')}>{t.guest}</button>
            <button className={view !== 'guest' ? 'active' : ''} onClick={() => setView(authClubId ? 'admin' : 'login')}>{t.admin}</button>
          </div>
          <div className="group languages">
            {['KA', 'RU', 'EN'].map(l => (
              <button key={l} className={lang === l.toLowerCase() ? 'active' : ''} onClick={() => setLang(l.toLowerCase())}>{l}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="content">
        <div className={`map-box ${view === 'guest' ? 'active' : ''}`}>
          <MapContainer center={locations.batumi} zoom={14} className="leaflet-container">
            <MapHandler isVisible={view === 'guest'} />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {clubs.map(club => (
              <Marker key={club.id} position={club.coords}>
                <Popup closeOnClick={false}>
                  <div className="ui-popup">
                    {activeClubId !== club.id ? (
                      <div className="club-preview">
                        <h3>{club.name}</h3>
                        <button className="btn-main" onClick={() => setActiveClubId(club.id)}>{t.book}</button>
                      </div>
                    ) : (
                      <div className="booking-ui">
                        <div className="pc-grid">
                          {club.computers.map(c => (
                            <div key={c.id} 
                                 className={`pc-box ${c.busy ? 'busy' : ''} ${selectedComp === c.id ? 'selected' : ''}`}
                                 onClick={() => !c.busy && setSelectedComp(c.id)}>{c.id}</div>
                          ))}
                        </div>
                        {selectedComp && (
                          <div className="booking-form animate-in">
                            <input placeholder={t.name} value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                            <input placeholder={t.phone} value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} />
                            <div className="input-row">
                                <input type="number" placeholder={t.day} min="1" max="31" value={userForm.day} onChange={e => setUserForm({...userForm, day: e.target.value})} />
                                <input placeholder={t.time} value={userForm.timeText} onChange={e => setUserForm({...userForm, timeText: e.target.value})} />
                            </div>
                            <button className="btn-main confirm" onClick={() => handleOrder(club)}>{t.confirm}</button>
                          </div>
                        )}
                        <button className="btn-back" onClick={() => {setActiveClubId(null); setSelectedComp(null)}}>← {lang === 'ru' ? 'Назад' : 'Back'}</button>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {view === 'login' && (
          <div className="overlay center">
            <div className="auth-card">
              <h2>ADMIN PANEL</h2>
              <input placeholder="Login" value={authForm.user} onChange={e => setAuthForm({...authForm, user: e.target.value})} />
              <input type="password" placeholder="Password" value={authForm.pass} onChange={e => setAuthForm({...authForm, pass: e.target.value})} />
              <button className="btn-main" onClick={handleLogin}>{t.login}</button>
            </div>
          </div>
        )}

        {view === 'admin' && currentClub && (
          <div className="overlay p24">
            <div className="admin-header">
              <div className="header-info">
                <h1>{currentClub.name}</h1>
                <span className="status-badge">{currentClub.computers.filter(p => p.busy).length} / {currentClub.computers.length} {t.pcs}</span>
              </div>
              <button className="btn-logout" onClick={() => {setView('guest'); setAuthClubId(null);}}>{t.logout}</button>
            </div>
            
            <div className="admin-layout">
              <div className="admin-col">
                <h3>{t.requests}</h3>
                <div className="requests-list">
                  {bookings.filter(b => b.clubId === authClubId).map(b => (
                    <div key={b.id} className="request-card">
                      <div className="req-data">
                        <span className="pc-tag">PC #{b.pc}</span>
                        <strong>{b.name}</strong>
                        <span className="req-phone">{b.phone}</span>
                        <span className="req-time">{b.date} • {b.time}</span>
                      </div>
                      <button className="btn-approve" onClick={() => approveOrder(b)}>{t.approve}</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-col">
                <h3>{t.pcs}</h3>
                <div className="pcs-manager">
                  {currentClub.computers.map(pc => (
                    <div key={pc.id} className={`pc-row-managed ${pc.busy ? 'is-occupied' : 'is-available'}`}>
                      <div className="pc-label-wrapper">
                        <span className="pc-num">#{pc.id}</span>
                        <span className="pc-status-text">{pc.busy ? 'OCCUPIED' : 'FREE'}</span>
                        {pc.busy && pc.user && (
                          <div className="info-tooltip">
                            <div className="tooltip-inner">
                              <strong>{pc.user.name}</strong>
                              <span>{pc.user.phone}</span>
                              <div className="line"></div>
                              <span>{pc.user.date}</span>
                              <span className="highlight">{pc.user.time}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {pc.busy && <button onClick={() => freeUpPC(pc.id)} className="btn-free-up">{t.free}</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;