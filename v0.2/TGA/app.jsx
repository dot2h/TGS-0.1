/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback } = React;

const NAV_ITEMS = [
{ id: 'music', label: 'Music', meta: 'Piano · Guitare · Clips' },
{ id: 'tech', label: 'Technology', meta: 'PDF · Articles · Video' },
{ id: 'contact', label: 'Contact', meta: 'Letters & links' },
{ id: 'search', label: 'Search', meta: 'Find anything' }];


// ─────────────────────────────────────────────────────────────────────
// Chrome (top corners)
// ─────────────────────────────────────────────────────────────────────
function Chrome({ topLeft, topLeftSub, topCenter, topCenterSub, topRight, topRightSub }) {
  return (
    <div className="chrome">
      <div className="col">
        <span className="top-meta">{topLeft}</span>
        {topLeftSub && <span className="meta">{topLeftSub}</span>}
      </div>
      <div className="col" style={{ alignItems: 'center', textAlign: 'center' }}>
        {topCenter && <span className="top-meta">{topCenter}</span>}
        {topCenterSub && <span className="meta">{topCenterSub}</span>}
      </div>
      <div className="col right">
        <span className="top-meta">{topRight}</span>
        {topRightSub && <span className="meta">{topRightSub}</span>}
      </div>
    </div>);

}

function Foot({ left, right, onLeft, onRight }) {
  return (
    <div className="foot">
      <a onClick={onLeft}>{left}</a>
      <a onClick={onRight}>{right}</a>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Landing — Now Playing
// ─────────────────────────────────────────────────────────────────────
function Landing({ onEnter }) {
  return (
    <div id="landing" className="screen active" onClick={onEnter}>
      <div className="video-wrap">
        <div className="video-fallback" />
      </div>

      <Chrome
        topLeft="The Great Site"
        topLeftSub="MMXXVI · v0.1"
        topCenter="A personal library by Hugo"
        topCenterSub="Music · Photo · Technology"
        topRight="Now playing"
        topRightSub="00:00:00 / ∞" />
      

      <div className="h1">
        <span>The Great Site</span>
      </div>

      <div className="hint">click anywhere to enter</div>

      <div className="foot">
        <a onClick={(e) => {e.stopPropagation();onEnter();}}>About</a>
        <a onClick={(e) => {e.stopPropagation();onEnter();}}>Past →</a>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Mega Nav
// ─────────────────────────────────────────────────────────────────────
function Nav({ onSelect, registerRefs }) {
  const refs = useRef({});

  useEffect(() => {
    if (registerRefs) registerRefs(refs.current);
  });

  return (
    <div id="nav" className="screen active">
      <Chrome
        topLeft="The Great Site"
        topLeftSub="Index"
        topRight="MMXXVI"
        topRightSub="04 entries" />
      

      <div className="nav-stack">
        {NAV_ITEMS.map((item, idx) =>
        <div
          key={item.id}
          className="megaitem"
          ref={(el) => {refs.current[item.id] = el;}}
          onClick={() => onSelect(item.id)} style={{ textAlign: "left", fontFamily: "\"Helvetica Neue\"" }}>
          
            <span className="num">N°{String(idx + 1).padStart(2, '0')}</span>
            <span className="label" style={{ fontFamily: "\"Helvetica Neue\"" }}>
              {item.label}
              <span className="plus" />
            </span>
            <span className="meta">{item.meta}</span>
          </div>
        )}
      </div>

      <div className="colophon">
        The Great Site — a private archive of music, photo & technology.<br />
        Updated continually. No analytics. No ads.
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Music page
// ─────────────────────────────────────────────────────────────────────
function MusicPage({ onBack, theme, onTheme, headerRef, onOpen }) {
  const data = window.GS_DATA.music;
  const total = data.piano.length + data.guitare.length + data.clips.length;

  return (
    <div className="screen active" data-theme={theme}>
      <div className="content">
        <BackBar onBack={onBack} />
        <ThemeToggle theme={theme} onTheme={onTheme} />

        <div className="content-head">
          <h1 ref={headerRef}>Music</h1>
          <div className="right">
            Piano · Guitare · Clips<br />
            {total} entries · Updated 04.2025
          </div>
        </div>

        <IndexTable section="Piano" items={data.piano} onOpen={(it) => onOpen(it, 'Music · Piano')} />
        <IndexTable section="Guitare" items={data.guitare} onOpen={(it) => onOpen(it, 'Music · Guitare')} />
        <IndexTable section="Clips" items={data.clips} noStatus onOpen={(it) => onOpen(it, 'Music · Clips')} />
      </div>
    </div>);

}

function IndexTable({ section, items, noStatus, onOpen }) {
  return (
    <>
      <div className="section-divider">
        <h2>{section}</h2>
        <span className="count">{items.length} entries</span>
      </div>
      <table className="index">
        <thead>
          <tr>
            <th className="code">ID</th>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Format</th>
            <th>Durée</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) =>
          <tr key={i} className={it.read ? 'read' : ''} onClick={() => onOpen && onOpen(it)} style={{cursor:'pointer'}}>
              <td className="code">{it.code}</td>
              <td className={'name' + (it.expanded ? ' expanded' : '')}>
                {it.name}
                {it.expanded && it.details &&
              <div className="sub">
                    {Object.entries(it.details).map(([k, v]) =>
                <React.Fragment key={k}>
                        <span>{k}</span>
                        <span>{v}</span>
                      </React.Fragment>
                )}
                  </div>
              }
              </td>
              <td className="col">{it.cat}</td>
              <td className="col">{it.fmt}</td>
              <td className="col">{it.dur}</td>
              <td className="col">{it.date}</td>
              <td className="dot-cell">{!it.read && !noStatus && <span className="dot" />}{noStatus && <span className="dot" />}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>);

}

// ─────────────────────────────────────────────────────────────────────
// Technology page
// ─────────────────────────────────────────────────────────────────────
function TechPage({ onBack, theme, onTheme, headerRef, onOpen }) {
  const data = window.GS_DATA.tech;
  return (
    <div className="screen active" data-theme={theme}>
      <div className="content">
        <BackBar onBack={onBack} />
        <ThemeToggle theme={theme} onTheme={onTheme} />

        <div className="content-head">
          <h1 ref={headerRef} style={{ fontFamily: "\"Helvetica Neue\"" }}>Technology</h1>
          <div className="right">
            Dev · IA · Design<br />
            {data.length} documents
          </div>
        </div>

        <table className="index">
          <thead>
            <tr>
              <th className="code">ID</th>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Format</th>
              <th>Pages</th>
              <th>Date</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((it, i) =>
            <tr key={i} className={it.status === 'Lu' ? 'read' : ''} onClick={() => onOpen && onOpen(it)} style={{cursor:'pointer'}}>
                <td className="code">{it.code}</td>
                <td className={'name' + (it.expanded ? ' expanded' : '')}>
                  {it.name} <span style={{ color: 'var(--muted)' }}>({it.lang})</span>
                  {it.expanded && it.details &&
                <div className="sub">
                      {Object.entries(it.details).map(([k, v]) =>
                  <React.Fragment key={k}>
                          <span>{k}</span>
                          <span>{v}</span>
                        </React.Fragment>
                  )}
                    </div>
                }
                </td>
                <td className="col">{it.cat}</td>
                <td className="col">{it.fmt}</td>
                <td className="col">{it.pages}</td>
                <td className="col">{it.date}</td>
                <td className="col">{it.status}</td>
                <td className="dot-cell">{it.status !== 'Lu' && <span className="dot" />}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Contact page
// ─────────────────────────────────────────────────────────────────────
function ContactPage({ onBack, theme, onTheme, headerRef }) {
  return (
    <div className="screen active" data-theme={theme}>
      <div className="content">
        <BackBar onBack={onBack} />
        <ThemeToggle theme={theme} onTheme={onTheme} />

        <div className="content-head">
          <h1 ref={headerRef}>Contact</h1>
          <div className="right">
            Pour échanger, partager,<br />
            ou simplement saluer.
          </div>
        </div>

        <div className="contact-grid">
          <div className="item">
            <span className="k">Email</span>
            <span className="v"><a href="mailto:hello@thegreatsite.fr">hello@thegreatsite.fr</a></span>
          </div>
          <div className="item">
            <span className="k">Instagram</span>
            <span className="v"><a>@the.great.site</a></span>
          </div>
          <div className="item">
            <span className="k">Mastodon</span>
            <span className="v"><a>@hugo@piaille.fr</a></span>
          </div>
          <div className="item">
            <span className="k">RSS</span>
            <span className="v"><a>/feed.xml</a></span>
          </div>
          <div className="item">
            <span className="k">PGP</span>
            <span className="v mono" style={{ fontFamily: 'Geist Mono, monospace', fontSize: 14 }}>0xA31C 9F40 22B6 7E11</span>
          </div>
          <div className="item">
            <span className="k">Localisation</span>
            <span className="v">Lyon, France</span>
          </div>
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Search page
// ─────────────────────────────────────────────────────────────────────
function SearchPage({ onBack, theme, onTheme, headerRef, onOpen }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 700);
    return () => clearTimeout(t);
  }, []);

  // Build flat index
  const all = [];
  Object.entries(window.GS_DATA.music).forEach(([k, arr]) => {
    arr.forEach((it) => all.push({ ...it, where: 'Music · ' + k }));
  });
  window.GS_DATA.tech.forEach((it) => all.push({ ...it, where: 'Technology' }));

  const matches = q.trim().length > 0 ?
  all.filter((it) => (it.name || '').toLowerCase().includes(q.toLowerCase())) :
  [];

  return (
    <div className="screen active" data-theme={theme}>
      <div className="content">
        <BackBar onBack={onBack} />
        <ThemeToggle theme={theme} onTheme={onTheme} />

        <div className="content-head">
          <h1 ref={headerRef}>Search</h1>
          <div className="right">
            {all.length} entries indexed<br />
            Music · Photo · Technology
          </div>
        </div>

        <div className="search-box">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a title, a category, a year…" />
          
        </div>

        <div className="search-results">
          {q.trim().length === 0 ?
          <span>— Awaiting query —</span> :
          matches.length === 0 ?
          <span>No match for "{q}"</span> :

          <span>{matches.length} match{matches.length > 1 ? 'es' : ''}</span>
          }
        </div>

        {matches.length > 0 &&
        <table className="index" style={{ marginTop: 24 }}>
            <tbody>
              {matches.map((it, i) =>
            <tr key={i} onClick={() => onOpen && onOpen(it)} style={{cursor:'pointer'}}>
                  <td className="code">{it.code}</td>
                  <td className="name">{it.name}</td>
                  <td className="col">{it.where}</td>
                  <td className="col">{it.fmt}</td>
                  <td className="col">{it.date}</td>
                </tr>
            )}
            </tbody>
          </table>
        }
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Detail page — single article / clip / PDF (inspired by Diogo Akio)
// ─────────────────────────────────────────────────────────────────────
function DetailPage({ item, parent, onBack, theme, onTheme }) {
  const d = item.detail || {};
  const isVideo = /vidéo|video/i.test(item.fmt || '');
  const isPdf = /pdf|article/i.test(item.fmt || '');

  // Top tagline — one sentence, sans-serif
  const tagline = d.tagline || `${item.name} — ${(d.subtitle || (item.cat || '') + ' · ' + (item.fmt || '')).toLowerCase()}, par Hugo`;

  // Hero overlays
  const heroLabel = d.heroLabel || (parent || '').replace(/^Music · /, '');
  const heroSeries = d.heroSeries || item.cat || '—';
  const heroTitle = d.heroTitle || item.name;

  // Footer 4 cols
  const fmtVal = [item.fmt, item.dur || item.pages].filter(Boolean).join(' · ');
  const cols = d.cols || [
    { k: 'Format',     v: fmtVal },
    { k: 'Catégorie',  v: [item.cat, parent].filter(Boolean).join(' · ') },
    { k: 'Mis à jour', v: (d.updated || item.date || '—') },
    { k: 'Crédits',    v: (d.credit || 'Hugo / TGS') }
  ];

  return (
    <div className="screen active detail2" data-theme={theme}>
      {/* Top: single-line tagline + close */}
      <header className="d2-top">
        <p className="d2-tagline">{tagline}</p>
        <button className="d2-close" onClick={onBack} aria-label="Fermer">+</button>
      </header>

      {/* Hero */}
      <main className="d2-hero">
        <div className="d2-frame">
          <div className="d2-media">
            <span className="d2-overlay d2-ol-tl">{heroLabel}</span>
            <button className="d2-overlay d2-ol-tr d2-menu" aria-label="Menu">
              <span /><span /><span />
            </button>
            <button className="d2-overlay d2-ol-r d2-next" aria-label="Suivant">→</button>
            <div className="d2-overlay d2-ol-bl">
              <span className="d2-series">{heroSeries}</span>
              <span className="d2-title">{heroTitle}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer: 4 cols + small dropdown */}
      <footer className="d2-foot">
        {cols.map((c, i) =>
        <div className="d2-col" key={i}>
            <span className="d2-k">{c.k}</span>
            <span className="d2-v">{c.v}</span>
          </div>
        )}
        <button className="d2-more" aria-label="Plus">▾</button>
      </footer>
    </div>);

}

function _DetailPageOld() { return null; }

// ─────────────────────────────────────────────────────────────────────
// Helpers — back bar, theme toggle
// ─────────────────────────────────────────────────────────────────────
function BackBar({ onBack }) {
  return (
    <div className="backbar" onClick={onBack}>
      <span className="arrow" />
      <span>Index</span>
    </div>);

}
function ThemeToggle({ theme, onTheme }) {
  return (
    <div className="themetoggle" onClick={() => onTheme(theme === 'day' ? 'night' : 'day')}>
      <span className="swatch" style={{ background: theme === 'day' ? '#0a0a0a' : '#fafaf7' }} />
      <span>{theme === 'day' ? 'Day' : 'Night'} mode</span>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// App — orchestrates screens + typographic transition
// ─────────────────────────────────────────────────────────────────────
function App() {
  const [route, setRoute] = useState('landing'); // landing | nav | music | tech | contact | search | detail
  const [theme, setTheme] = useState('night');
  const [transitioning, setTransitioning] = useState(false);
  const [detail, setDetail] = useState(null); // { item, parent }
  const [parentRoute, setParentRoute] = useState('music');

  const openDetail = useCallback((item, parent, fromRoute) => {
    setDetail({ item, parent });
    setParentRoute(fromRoute);
    setRoute('detail');
  }, []);
  const closeDetail = useCallback(() => {
    setRoute(parentRoute);
  }, [parentRoute]);

  const navRefs = useRef({});
  const headerRefs = useRef({});

  // Handle keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (route === 'detail') setRoute(parentRoute);else
        if (route !== 'landing' && route !== 'nav') setRoute('nav');else
        if (route === 'nav') setRoute('landing');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, parentRoute]);

  const goToContent = useCallback((id) => {
    // Find the source megaitem rect
    const src = navRefs.current[id];
    if (!src) {setRoute(id);return;}
    const srcRect = src.getBoundingClientRect();
    const labelEl = src.querySelector('.label');
    const labelText = labelEl?.firstChild?.textContent || src.textContent;
    const srcStyle = window.getComputedStyle(labelEl || src);

    // Build flying clone
    const fly = document.createElement('div');
    fly.className = 'fly';
    fly.textContent = labelText;
    fly.style.left = srcRect.left + 'px';
    fly.style.top = srcRect.top + 'px';
    fly.style.fontSize = srcStyle.fontSize;
    fly.style.color = '#fafaf7';
    document.body.appendChild(fly);

    // Hide source label only
    if (labelEl) labelEl.style.visibility = 'hidden';

    setTransitioning(true);

    // Fade out other nav items
    document.querySelectorAll('#nav .megaitem').forEach((el) => {
      if (el !== src) {
        el.style.transition = 'opacity 280ms ease';
        el.style.opacity = '0';
      }
    });
    document.querySelector('#nav .colophon').style.opacity = '0';
    document.querySelector('#nav .colophon').style.transition = 'opacity 280ms';

    // After short delay, switch route to content (renders header off-screen position)
    setTimeout(() => {
      setRoute(id);
      // Wait for render, then measure target header and animate fly to it
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const target = headerRefs.current[id];
          if (!target) {
            fly.remove();
            setTransitioning(false);
            return;
          }
          const tRect = target.getBoundingClientRect();
          const tStyle = window.getComputedStyle(target);
          // Hide the target h1 until fly arrives
          target.style.visibility = 'hidden';

          fly.style.transform = `translate(${tRect.left - srcRect.left}px, ${tRect.top - srcRect.top}px)`;
          fly.style.fontSize = tStyle.fontSize;
          fly.style.color = theme === 'day' ? '#0a0a0a' : '#fafaf7';

          setTimeout(() => {
            target.style.visibility = '';
            fly.remove();
            setTransitioning(false);
          }, 660);
        });
      });
    }, 220);
  }, [theme]);

  const goToNav = useCallback(() => {
    setRoute('nav');
  }, []);

  // Register header ref helper
  const headerRef = (id) => (el) => {headerRefs.current[id] = el;};

  return (
    <div className={transitioning ? 'transitioning' : ''}>
      {route === 'landing' && <Landing onEnter={() => setRoute('nav')} />}
      {route === 'nav' &&
      <Nav
        onSelect={goToContent}
        registerRefs={(r) => {navRefs.current = r;}} />

      }
      {route === 'music' && <MusicPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('music')} onOpen={(it, parent) => openDetail(it, parent, 'music')} />}
      {route === 'tech' && <TechPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('tech')} onOpen={(it) => openDetail(it, 'Technology', 'tech')} />}
      {route === 'contact' && <ContactPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('contact')} />}
      {route === 'search' && <SearchPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('search')} onOpen={(it) => openDetail(it, it.where, 'search')} />}
      {route === 'detail' && detail && <DetailPage item={detail.item} parent={detail.parent} onBack={closeDetail} theme={theme} onTheme={setTheme} />}
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);