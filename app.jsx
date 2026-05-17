/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback } = React;

const NAV_ITEMS = [
{ id: 'music', label: 'Music', meta: 'Piano · Guitare · Clips' },
{ id: 'tech', label: 'Skool', meta: 'PDF · Articles · Videos' },
{ id: 'contact', label: 'Contact', meta: 'About us' },
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
        {topRight && <span className="top-meta">{topRight}</span>}
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
        <video autoPlay muted loop playsInline>
          <source src="assets/videos/(Mk.gee)-Breakthespell(Live In Los Angeles).mp4" type="video/mp4" />
        </video>
      </div>

      <Chrome
        topLeft="The Great Site"
        topLeftSub="Landing · v0.1"
        /* topCenter="A personal library by Hugo"
        topCenterSub="Music · Photo · Skool" */
        topRight=".h Family"
        /* topRightSub="00:00:00 / ∞" */ />


      <div className="h1">
        <span>The Great Site</span>
      </div>

      <div className="hint">click anywhere to enter</div>

      {/* <div className="foot">
        <a onClick={(e) => {e.stopPropagation();onEnter();}}>About</a>
        <a onClick={(e) => {e.stopPropagation();onEnter();}}>Past →</a>
      </div> */}
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Mega Nav
// ─────────────────────────────────────────────────────────────────────
function Nav({ onSelect, registerRefs, theme, onTheme }) {
  const refs = useRef({});

  useEffect(() => {
    if (registerRefs) registerRefs(refs.current);
  });

  return (
    <div id="nav" className="screen active" data-theme={theme}>
      <Chrome
        topLeft="The Great Site"
        topLeftSub="Index"
        topRight={<ThemeToggle theme={theme} onTheme={onTheme} />}
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
        The Great Site — an open archive of music, art & technology.<br />
        Updated sometimes. No analytics. No ads.
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

        <IndexTable section="Piano" items={data.piano} onOpen={(it, list, idx) => onOpen(it, 'Music · Piano', list, idx)} />
        <IndexTable section="Guitare" items={data.guitare} onOpen={(it, list, idx) => onOpen(it, 'Music · Guitare', list, idx)} />
        <IndexTable section="Clips" items={data.clips} noStatus onOpen={(it, list, idx) => onOpen(it, 'Music · Clips', list, idx)} />
      </div>
    </div>);

}

const GROUP_LABELS = { majors: 'Gammes majeures', minors: 'Gammes mineures' };

function IndexTable({ section, items, noStatus, onOpen }) {
  const [open, setOpen] = useState({});

  const groups = {};
  items.forEach((it, i) => {
    if (!it.group) return;
    if (groups[it.group] === undefined) groups[it.group] = { start: i, count: 0 };
    groups[it.group].count++;
  });

  return (
    <>
      <div className="section-divider">
        <h2>{section}</h2>
        <span className="count">{items.length} entries</span>
      </div>
      <table className="index">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Format</th>
            <th>Durée</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => {
            const isGroupStart = it.group && groups[it.group].start === i;
            const groupOpen = it.group ? !!open[it.group] : true;
            return (
              <React.Fragment key={i}>
                {isGroupStart &&
                <tr className={'group-head' + (groupOpen ? ' open' : '')}
                  onClick={() => setOpen((o) => ({ ...o, [it.group]: !o[it.group] }))}
                  style={{ cursor: 'pointer' }}>
                    <td className="name" colSpan={5}>
                      <span className="chev">›</span>
                      {GROUP_LABELS[it.group] || it.group}
                      <span className="g-count">({groups[it.group].count})</span>
                    </td>
                    <td className="dot-cell" />
                  </tr>
              }
                {groupOpen &&
                <tr className={(it.read ? 'read ' : '') + (it.group ? 'in-group' : '')}
                  onClick={() => onOpen && onOpen(it, items, i)} style={{ cursor: 'pointer' }}>
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
              }
              </React.Fragment>);

          })}
        </tbody>
      </table>
    </>);

}

// ─────────────────────────────────────────────────────────────────────
// Skool page
// ─────────────────────────────────────────────────────────────────────
function TechPage({ onBack, theme, onTheme, headerRef, onOpen }) {
  const data = window.GS_DATA.tech;
  return (
    <div className="screen active" data-theme={theme}>
      <div className="content">
        <BackBar onBack={onBack} />
        <ThemeToggle theme={theme} onTheme={onTheme} />

        <div className="content-head">
          <h1 ref={headerRef} style={{ fontFamily: "\"Helvetica Neue\"" }}>Skool</h1>
          <div className="right">
            Dev · IA · Design<br />
            {data.length} documents
          </div>
        </div>

        <table className="index">
          <thead>
            <tr>
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
            <tr key={i} className={it.status === 'Lu' ? 'read' : ''} onClick={() => onOpen && onOpen(it, data, i)} style={{cursor:'pointer'}}>
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
          {/* <div className="right">
            Pour échanger, partager,<br />
            ou simplement saluer.
          </div> */}
        </div>

        <div className="contact-grid">
          <div className="item">
            <span className="k">Insta Notrax</span>
            <span className="v"><a href="https://www.instagram.com/notrax.h/">@notrax.h</a></span>
          </div>
          <div className="item">
            <span className="k">Insta Murza</span>
            <span className="v"><a href="https://www.instagram.com/murza.h/">@murza.h</a></span>
          </div>
          <div className="item">
            <span className="k">Localisation</span>
            <span className="v">Paris, France</span>
          </div>
          {/* <div className="item">
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
          </div> */}
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
  window.GS_DATA.tech.forEach((it) => all.push({ ...it, where: 'Skool' }));

  const haystack = (it) => {
    const tagsCol = (it.detail?.cols || []).find((c) => /tag/i.test(c.k));
    return [it.name, it.cat, it.fmt, it.lang, tagsCol?.v].filter(Boolean).join(' ').toLowerCase();
  };
  const matches = q.trim().length > 0 ?
  all.filter((it) => haystack(it).includes(q.toLowerCase())) :
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
            {/* Music · Photo · Technology */}
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
            <tr key={i} onClick={() => onOpen && onOpen(it, matches, i)} style={{cursor:'pointer'}}>
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
// PDF viewer — renders all pages to canvases (fixes iOS Safari first-page-only)
// ─────────────────────────────────────────────────────────────────────
function PdfViewer({ src }) {
  const containerRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    async function render() {
      const container = containerRef.current;
      if (!container || !window.pdfjsLib) return;
      container.innerHTML = '';
      const pdf = await window.pdfjsLib.getDocument(src).promise;
      const containerWidth = container.clientWidth - 16;
      const dpr = window.devicePixelRatio || 1;
      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return;
        const page = await pdf.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = (containerWidth * dpr) / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      }
    }
    render();
    return () => { cancelled = true; };
  }, [src]);
  return <div className="d2-pdfviewer" ref={containerRef} />;
}

// ─────────────────────────────────────────────────────────────────────
// Detail page — single article / clip / PDF (inspired by Diogo Akio)
// ─────────────────────────────────────────────────────────────────────
function DetailPage({ item, parent, list, index, onBack, onNavigate, theme, onTheme }) {
  const d = item.detail || {};
  const isVideo = /vidéo|video/i.test(item.fmt || '');
  const isPdf = /pdf|article/i.test(item.fmt || '');
  const prev = list && index > 0 ? list[index - 1] : null;
  const next = list && index < list.length - 1 ? list[index + 1] : null;

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
      <BackBar onBack={onBack} />
      <ThemeToggle theme={theme} onTheme={onTheme} />

      {/* Top: single-line tagline + prev/next nav */}
      <header className="d2-top">
        <p className="d2-tagline">{tagline}</p>
        {(prev || next) &&
        <nav className="d2-nav">
            {prev &&
          <button className="d2-nav-btn prev" onClick={() => onNavigate(list, index - 1)}>
                <span className="arrow">←</span>
                <span className="lbl">Précédent</span>
                <span className="tip">{prev.name}</span>
              </button>
          }
            {next &&
          <button className="d2-nav-btn next" onClick={() => onNavigate(list, index + 1)}>
                <span className="lbl">Suivant</span>
                <span className="arrow">→</span>
                <span className="tip">{next.name}</span>
              </button>
          }
          </nav>
        }
      </header>

      {/* Hero */}
      <main className="d2-hero">
        <div className="d2-frame">
          <div className={`d2-media${(d.heroImage || d.heroVideo || d.heroDoc) ? ' has-image' : ''}`}>
            {d.heroImage && <img className="d2-img" src={d.heroImage} alt={heroTitle} />}
            {d.heroVideo && <video className="d2-video" src={d.heroVideo} controls playsInline preload="metadata" />}
            {d.heroDoc && (/\.pdf$/i.test(d.heroDoc)
              ? <PdfViewer src={d.heroDoc} />
              : <iframe className="d2-doc" src={d.heroDoc} title={heroTitle} />)}
            {/* <span className="d2-overlay d2-ol-tl">{heroLabel}</span> */}
            {/* <button className="d2-overlay d2-ol-tr d2-menu" aria-label="Menu">
              <span /><span /><span />
            </button> */}
            {/* <button className="d2-overlay d2-ol-r d2-next" aria-label="Suivant">→</button> */}
            <div className="d2-overlay d2-ol-bl">
              {/* <span className="d2-series">{heroSeries}</span> */}
              {/* <span className="d2-title">{heroTitle}</span> */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer: 4 cols */}
      <footer className="d2-foot">
        {cols.map((c, i) =>
        <div className="d2-col" key={i}>
            <span className="d2-k">{c.k}</span>
            <span className="d2-v">{c.v}</span>
          </div>
        )}
      </footer>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// App — orchestrates screens + typographic transition
// ─────────────────────────────────────────────────────────────────────
function App() {
  const [route, setRoute] = useState(() => {
    try {
      const saved = localStorage.getItem('gs.route');
      const valid = ['nav', 'music', 'tech', 'contact', 'search'];
      if (saved && valid.includes(saved)) return saved;
    } catch (_) {}
    return 'landing';
  }); // landing | nav | music | tech | contact | search | detail
  const [theme, setTheme] = useState('night');
  const [transitioning, setTransitioning] = useState(false);
  const [detail, setDetail] = useState(null); // { item, parent }
  const [parentRoute, setParentRoute] = useState('music');

  const navRefs = useRef({});
  const headerRefs = useRef({});

  const openDetail = useCallback((item, parent, fromRoute, list, index) => {
    setDetail({ item, parent, list, index });
    setParentRoute(fromRoute);
    setRoute('detail');
  }, []);
  const navigateDetail = useCallback((list, newIndex) => {
    setDetail((d) => ({ item: list[newIndex], parent: d.parent, list, index: newIndex }));
  }, []);
  const closeDetail = useCallback(() => {
    setRoute(parentRoute);
  }, [parentRoute]);

  // Handle keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (route === 'detail') setRoute(parentRoute);
        else if (route !== 'landing' && route !== 'nav') setRoute('nav');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, parentRoute]);

  // Persist route across refresh — landing becomes unreachable after first visit
  useEffect(() => {
    if (route === 'landing' || route === 'detail') return;
    try { localStorage.setItem('gs.route', route); } catch (_) {}
  }, [route]);

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
        registerRefs={(r) => {navRefs.current = r;}}
        theme={theme}
        onTheme={setTheme} />

      }
      {route === 'music' && <MusicPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('music')} onOpen={(it, parent, list, idx) => openDetail(it, parent, 'music', list, idx)} />}
      {route === 'tech' && <TechPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('tech')} onOpen={(it, list, idx) => openDetail(it, 'Technology', 'tech', list, idx)} />}
      {route === 'contact' && <ContactPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('contact')} />}
      {route === 'search' && <SearchPage onBack={goToNav} theme={theme} onTheme={setTheme} headerRef={headerRef('search')} onOpen={(it, list, idx) => openDetail(it, it.where, 'search', list, idx)} />}
      {route === 'detail' && detail && <DetailPage item={detail.item} parent={detail.parent} list={detail.list} index={detail.index} onBack={closeDetail} onNavigate={navigateDetail} theme={theme} onTheme={setTheme} />}
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
