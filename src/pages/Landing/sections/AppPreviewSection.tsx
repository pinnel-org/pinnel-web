import styles from './AppPreviewSection.module.css'

interface CardData {
  num: string
  tag: string
  tagClass: string
  title: string
  sub: string
  info: string[]
  comment?: string
  pinClass: string
}

const cards: CardData[] = [
  {
    num: '1', tag: 'Landmark', tagClass: '', pinClass: styles.pin1,
    title: 'Duomo di Milano', sub: 'Piazza del Duomo',
    info: ['★ 4.8', '2h', '€10'],
    comment: 'Book the rooftop ticket in advance — totally worth it at sunset.',
  },
  {
    num: '2', tag: 'Food', tagClass: styles.tagAmber, pinClass: styles.pin2,
    title: 'Luini Panzerotti', sub: 'Via Santa Radegonda 16',
    info: ['★ 4.6', '30m', '€5'],
    comment: 'Grab one walking to the Duomo. The baked version is underrated.',
  },
  {
    num: '3', tag: 'Gallery', tagClass: styles.tagTeal, pinClass: styles.pin3,
    title: 'Galleria Vittorio Emanuele II', sub: 'Piazza del Duomo',
    info: ['★ 4.7', '45m', 'Free'],
  },
  {
    num: '4', tag: 'Neighborhood', tagClass: '', pinClass: styles.pin4,
    title: 'Navigli District', sub: 'South Milan canals',
    info: ['★ 4.5', '3h', '—'],
  },
]

// Static Google Maps-style SVG of central Milan — non-interactive visual for the landing page
const MapSvg = () => (
  <svg className={styles.mapSvg} viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice">
    {/* Base land — Google Maps warm off-white */}
    <rect width="600" height="520" fill="#f2ebe0" />

    {/* === PARKS === */}
    {/* Parco Sempione — large park, top-left */}
    <path d="M 0,18 L 148,18 L 148,188 Q 74,194 0,188 Z" fill="#b8d898" />
    <path d="M 6,24 L 142,24 L 142,183 Q 71,188 6,183 Z" fill="#a8c888" />

    {/* Giardini Pubblici Indro Montanelli — top-right */}
    <rect x="492" y="0" width="108" height="128" rx="10" fill="#c0da9c" />
    <rect x="498" y="5" width="97" height="118" rx="8" fill="#b0cc8c" />

    {/* Small ornamental garden near Cordusio */}
    <ellipse cx="250" cy="178" rx="26" ry="18" fill="#d0e8b4" />

    {/* === WATER === */}
    {/* Naviglio Grande canal — horizontal at bottom */}
    <path d="M -4,396 Q 90,390 205,394 Q 285,398 295,393 Q 385,387 500,393 Q 555,396 604,392 L 604,410 Q 555,414 500,410 Q 385,404 295,410 Q 285,415 205,411 Q 90,407 -4,413 Z" fill="#9dc8e2" />
    {/* Naviglio Pavese — vertical canal south */}
    <path d="M 290,396 Q 282,448 276,520 L 299,520 Q 305,448 313,396 Z" fill="#9dc8e2" opacity="0.85" />

    {/* === BUILDING BLOCKS === */}
    {/* Top row */}
    <rect x="158" y="2" width="84" height="62" rx="3" fill="#e3d9c6" />
    <rect x="254" y="2" width="90" height="62" rx="3" fill="#e3d9c6" />
    <rect x="356" y="2" width="88" height="62" rx="3" fill="#e3d9c6" />
    <rect x="456" y="2" width="28" height="62" rx="3" fill="#e3d9c6" />

    {/* Second row */}
    <rect x="158" y="80" width="84" height="78" rx="3" fill="#e3d9c6" />
    <rect x="254" y="80" width="90" height="78" rx="3" fill="#e3d9c6" />
    <rect x="356" y="80" width="88" height="78" rx="3" fill="#e3d9c6" />
    <rect x="456" y="80" width="28" height="78" rx="3" fill="#e3d9c6" />
    <rect x="496" y="80" width="104" height="78" rx="3" fill="#e3d9c6" />

    {/* Left side column */}
    <rect x="0" y="210" width="82" height="76" rx="3" fill="#e3d9c6" />
    <rect x="0" y="304" width="82" height="84" rx="3" fill="#e3d9c6" />

    {/* Blocks around Duomo area */}
    <rect x="158" y="178" width="68" height="58" rx="3" fill="#e3d9c6" />
    <rect x="238" y="178" width="58" height="58" rx="3" fill="#e3d9c6" />
    <rect x="374" y="178" width="48" height="58" rx="3" fill="#e3d9c6" />
    <rect x="434" y="178" width="50" height="58" rx="3" fill="#e3d9c6" />
    <rect x="498" y="178" width="102" height="58" rx="3" fill="#e3d9c6" />

    {/* Piazza del Duomo — open square */}
    <rect x="312" y="232" width="54" height="46" rx="4" fill="#ece4d0" />

    <rect x="158" y="248" width="68" height="64" rx="3" fill="#e3d9c6" />
    <rect x="238" y="248" width="58" height="64" rx="3" fill="#e3d9c6" />
    <rect x="374" y="248" width="48" height="48" rx="3" fill="#e3d9c6" />
    <rect x="434" y="248" width="50" height="48" rx="3" fill="#e3d9c6" />
    <rect x="498" y="248" width="102" height="48" rx="3" fill="#e3d9c6" />

    {/* Lower center blocks */}
    <rect x="158" y="330" width="68" height="60" rx="3" fill="#e3d9c6" />
    <rect x="238" y="330" width="58" height="60" rx="3" fill="#e3d9c6" />
    <rect x="310" y="314" width="56" height="76" rx="3" fill="#e3d9c6" />
    <rect x="378" y="306" width="48" height="84" rx="3" fill="#e3d9c6" />
    <rect x="438" y="306" width="50" height="84" rx="3" fill="#e3d9c6" />
    <rect x="500" y="306" width="100" height="84" rx="3" fill="#e3d9c6" />

    {/* Navigli area blocks */}
    <rect x="90" y="304" width="60" height="84" rx="3" fill="#e3d9c6" />
    <rect x="162" y="304" width="68" height="84" rx="3" fill="#e3d9c6" />
    <rect x="0" y="420" width="82" height="100" rx="3" fill="#e3d9c6" />
    <rect x="90" y="422" width="60" height="98" rx="3" fill="#e3d9c6" />
    <rect x="162" y="420" width="68" height="100" rx="3" fill="#e3d9c6" />
    <rect x="316" y="420" width="56" height="100" rx="3" fill="#e3d9c6" />
    <rect x="438" y="420" width="52" height="100" rx="3" fill="#e3d9c6" />
    <rect x="502" y="420" width="98" height="100" rx="3" fill="#e3d9c6" />

    {/* === MAIN ROADS (white) === */}
    {/* Horizontal arteries */}
    <rect x="0" y="66" width="600" height="12" fill="white" />
    <rect x="148" y="168" width="452" height="10" fill="white" />
    <rect x="0" y="228" width="600" height="14" fill="white" />
    <rect x="0" y="296" width="600" height="8" fill="white" />
    <rect x="0" y="390" width="600" height="8" fill="white" />

    {/* Vertical arteries */}
    <rect x="148" y="0" width="10" height="520" fill="white" />
    <rect x="242" y="0" width="10" height="520" fill="white" />
    <rect x="366" y="0" width="9" height="296" fill="white" />
    <rect x="366" y="304" width="9" height="216" fill="white" />
    <rect x="430" y="0" width="8" height="520" fill="white" />
    <rect x="496" y="0" width="8" height="390" fill="white" />

    {/* Via Torino — diagonal route Duomo → Navigli */}
    <path d="M 304,228 L 292,296 Q 272,344 250,390"
      stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" />

    {/* === SECONDARY ROADS (light tan) === */}
    <line x1="0" y1="198" x2="600" y2="198" stroke="#f0e8d8" strokeWidth="5" />
    <line x1="0" y1="264" x2="600" y2="264" stroke="#f0e8d8" strokeWidth="5" />
    <line x1="148" y1="354" x2="600" y2="354" stroke="#f0e8d8" strokeWidth="5" />
    <line x1="180" y1="66" x2="180" y2="228" stroke="#f0e8d8" strokeWidth="4" />
    <line x1="314" y1="168" x2="314" y2="228" stroke="#f0e8d8" strokeWidth="4" />
    <line x1="400" y1="168" x2="400" y2="296" stroke="#f0e8d8" strokeWidth="4" />

    {/* === WALKING ROUTE (Google blue dashed) === */}
    {/* Galleria → Luini → Duomo → Via Torino → Navigli */}
    <path
      d="M 352,183 L 295,193 L 340,255 Q 308,330 244,390"
      stroke="#4285f4"
      strokeWidth="4.5"
      fill="none"
      strokeDasharray="12 7"
      opacity="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* === STREET LABELS === */}
    <text x="250" y="224" fill="#888" fontSize="7.5" fontFamily="Arial,sans-serif" opacity="0.85" fontWeight="500">Corso Vittorio Emanuele II</text>
    <text x="172" y="163" fill="#888" fontSize="7" fontFamily="Arial,sans-serif" opacity="0.8">Via Dante</text>
    <text x="262" y="288" fill="#888" fontSize="7" fontFamily="Arial,sans-serif" opacity="0.8">Via Torino</text>
    <text x="14" y="407" fill="#5b8ca8" fontSize="7.5" fontFamily="Arial,sans-serif" opacity="0.9" fontWeight="500">Naviglio Grande</text>
  </svg>
)

export const AppPreviewSection = () => (
  <section className={styles.wrap}>
    <div className={styles.heading}>
      <h2 className={styles.h2}>A <em>map</em>, a stack of cards, and one clean day.</h2>
      <p>Pick a city. Browse cards for places — museums, food, viewpoints — each with info and your notes. Every card you add drops a pin on the map. Finalize and Pinnel handles the route.</p>
    </div>
    <div className={styles.window}>
      <div className={styles.chrome}>
        <div className={styles.dots}><span /><span /><span /></div>
        <div className={styles.windowTitle}>pinnel.app / trips / <strong>milan-weekend</strong></div>
        <div className={styles.windowMeta}>PLANNING</div>
      </div>
      <div className={styles.appBody}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHead}>
            <div className={styles.tripTitle}>Milan Weekend</div>
            <div className={styles.tripMeta}>3 days · 4 places</div>
          </div>
          <div className={styles.tabs}>
            <span className={`${styles.tab} ${styles.tabActive}`}>Cards</span>
            <span className={styles.tab}>Schedule</span>
            <span className={styles.tab}>Route</span>
          </div>
          <div className={styles.cardList}>
            {cards.map((c) => (
              <div key={c.num} className={styles.card}>
                <div className={`${styles.cardPin} ${c.pinClass}`}>{c.num}</div>
                <span className={`${styles.cardTag} ${c.tagClass}`}>{c.tag}</span>
                <div className={styles.cardTitle}>{c.title}</div>
                <div className={styles.cardSub}>{c.sub}</div>
                <div className={styles.cardInfo}>
                  {c.info.map((item, i) => <span key={i}>{item}</span>)}
                </div>
                {c.comment && <div className={styles.cardComment}>{c.comment}</div>}
              </div>
            ))}
            <div className={styles.addCard}>+ Add a card</div>
          </div>
        </aside>
        <div className={styles.mapArea}>
          <MapSvg />
          <div className={styles.mapToolbar}>
            <div className={`${styles.mapBtn} ${styles.mapBtnActive}`}>Map</div>
            <div className={styles.mapBtn}>Satellite</div>
          </div>
          {/* Pin 1 — Duomo (center of Piazza del Duomo) */}
          <div className={styles.mapPin} style={{ left: '57%', top: '49%' }}><div className={styles.pinBody}><span>1</span></div></div>
          {/* Pin 2 — Luini Panzerotti (Via Santa Radegonda, just north-west of Duomo) */}
          <div className={`${styles.mapPin} ${styles.mapPinTeal}`} style={{ left: '49%', top: '37%' }}><div className={styles.pinBody}><span>2</span></div></div>
          {/* Pin 3 — Galleria Vittorio Emanuele II (just north of Duomo) */}
          <div className={`${styles.mapPin} ${styles.mapPinAmber}`} style={{ left: '59%', top: '35%' }}><div className={styles.pinBody}><span>3</span></div></div>
          {/* Pin 4 — Navigli District (along the Naviglio Grande canal) */}
          <div className={`${styles.mapPin} ${styles.mapPinInk}`} style={{ left: '41%', top: '83%' }}><div className={styles.pinBody}><span>4</span></div></div>
          <div className={styles.mapInfo}>
            <div className={styles.mapInfoLabel}>Optimized Route</div>
            <div className={styles.mapInfoTitle}>4 stops · 1 day</div>
            <div className={styles.mapInfoStats}>
              <span><strong>6.2</strong> km</span>
              <span><strong>1h 20</strong> walk</span>
              <span><strong>€15</strong></span>
            </div>
          </div>
          <button className={styles.finalizeBtn}>Finalize Trip →</button>
        </div>
      </div>
    </div>
  </section>
)
