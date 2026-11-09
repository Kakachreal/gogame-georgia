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

const LOCALES = { ka: 'ka-GE', ru: 'ru-RU', en: 'en-US' };

const i18n = {
  ka: { book: "დაჯავშნა", confirm: "დადასტურება", name: "სახელი", phone: "ტელეფონი", time: "დრო (მაგ: 14-18)", day: "რიცხვი", admin: "ადმინი", guest: "სტუმარი", approve: "მიღება", login: "შესვლა", logout: "გამოსვლა", status: "სტატუსი", free: "გათავისუფლება", requests: "მოთხოვნები", pcs: "კომპიუტერები", back: "უკან", sent: "მოთხოვნა გაიგზავნა!", fillAll: "შეავსეთ ყველა ველი!", badDay: "რიცხვი უნდა იყოს 1-დან 31-მდე", alreadyRequested: "ეს კომპიუტერი უკვე დაჯავშნილია მოთხოვნით", badLogin: "არასწორი მონაცემები!", occupied: "დაკავებული", available: "თავისუფალი" },
  ru: { book: "Забронировать", confirm: "Подтвердить", name: "Имя", phone: "Телефон", time: "Время (напр: 14-18)", day: "Число", admin: "Админ", guest: "Гость", approve: "Принять", login: "Войти", logout: "Выйти", status: "Статус", free: "Освободить", requests: "Заявки", pcs: "Компьютеры", back: "Назад", sent: "Заявка отправлена!", fillAll: "Заполните все поля!", badDay: "Число должно быть от 1 до 31", alreadyRequested: "Этот компьютер уже забронирован заявкой", badLogin: "Неверные данные!", occupied: "Занят", available: "Свободен" },
  en: { book: "Book Now", confirm: "Confirm", name: "Name", phone: "Phone", time: "Time (ex: 2-6pm)", day: "Day", admin: "Admin", guest: "Guest", approve: "Approve", login: "Login", logout: "Logout", status: "Status", free: "Free Up", requests: "Requests", pcs: "Computers", back: "Back", sent: "Request sent!", fillAll: "Fill all fields!", badDay: "Day must be between 1 and 31", alreadyRequested: "This computer already has a pending request", badLogin: "Invalid credentials!", occupied: "Occupied", available: "Free" }
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
  const emptyForm = { name: '', phone: '', timeText: '', day: '' };
  const [userForm, setUserForm] = useState(() => {
    try {
      const saved = localStorage.getItem('gogame_form');
      return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm;
    } catch {
      return emptyForm;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gogame_clubs', JSON.stringify(clubs));
      localStorage.setItem('gogame_bookings', JSON.stringify(bookings));
      localStorage.setItem('gogame_form', JSON.stringify(userForm));
    } catch {
      // storage unavailable (private mode / full) — app keeps working in memory
    }
  }, [clubs, bookings, userForm]);

  const handleLogin = () => {
    const acc = adminAccounts[authForm.user.trim().toLowerCase()];
    if (acc && acc.pass === authForm.pass) {
      setAuthClubId(acc.clubId);
      setView('admin');
    } else {
      alert(t.badLogin);
    }
  };

  const handleOrder = (club) => {
    const day = Number(userForm.day);
    if (!userForm.name.trim() || !userForm.phone.trim() || !userForm.timeText.trim() || !userForm.day) {
      return alert(t.fillAll);
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) return alert(t.badDay);
    if (bookings.some(b => b.clubId === club.id && b.pc === selectedComp)) return alert(t.alreadyRequested);

    const now = new Date();
    const dateLabel = new Date(now.getFullYear(), now.getMonth(), day)
      .toLocaleDateString(LOCALES[lang], { day: 'numeric', month: 'long', year: 'numeric' });

    const newBooking = {
      id: Date.now(),
      clubId: club.id,
      pc: selectedComp,
      name: userForm.name.trim(),
      phone: userForm.phone.trim(),
      time: userForm.timeText.trim(),
      date: dateLabel
    };

    setBookings(prev => [newBooking, ...prev]);
    alert(t.sent);
    setActiveClubId(null); setSelectedComp(null); setUserForm(emptyForm);
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
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              className="dark-tiles"
            />
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
                        <button className="btn-back" onClick={() => {setActiveClubId(null); setSelectedComp(null)}}>← {t.back}</button>
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
              <input placeholder={t.login} autoComplete="username" value={authForm.user} onChange={e => setAuthForm({...authForm, user: e.target.value})} />
              <input type="password" placeholder="Password" autoComplete="current-password" value={authForm.pass} onChange={e => setAuthForm({...authForm, pass: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
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
                        <span className="pc-status-text">{pc.busy ? t.occupied : t.available}</span>
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