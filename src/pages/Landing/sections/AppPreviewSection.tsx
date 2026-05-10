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

// Static SVG illustration — not a real map, just a visual for the landing page demo
const MapSvg = () => (
  <svg className={styles.mapSvg} viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="mapGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,20,16,0.08)" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="600" height="520" fill="url(#mapGrid)" />
    <path d="M 50 80 Q 200 100, 350 200 T 560 340" stroke="#b8a988" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
    <path d="M 50 80 Q 200 100, 350 200 T 560 340" stroke="#f4ede1" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M 100 450 Q 220 380, 340 400 T 580 440" stroke="#b8a988" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round" />
    <path d="M 100 450 Q 220 380, 340 400 T 580 440" stroke="#f4ede1" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M 280 40 L 290 510" stroke="#b8a988" strokeWidth="5" fill="none" opacity="0.4" strokeLinecap="round" />
    <path d="M 280 40 L 290 510" stroke="#f4ede1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M 20 280 L 580 270" stroke="#b8a988" strokeWidth="5" fill="none" opacity="0.4" strokeLinecap="round" />
    <path d="M 20 280 L 580 270" stroke="#f4ede1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="130" cy="200" rx="60" ry="40" fill="#c9d8b5" opacity="0.7" />
    <ellipse cx="450" cy="160" rx="50" ry="35" fill="#c9d8b5" opacity="0.7" />
    <ellipse cx="420" cy="430" rx="55" ry="30" fill="#c9d8b5" opacity="0.7" />
    <rect x="200" y="220" width="30" height="25" fill="#d4c8b0" opacity="0.6" />
    <rect x="240" y="210" width="25" height="30" fill="#d4c8b0" opacity="0.6" />
    <rect x="320" y="240" width="35" height="20" fill="#d4c8b0" opacity="0.6" />
    <rect x="360" y="300" width="28" height="28" fill="#d4c8b0" opacity="0.6" />
    <rect x="180" y="340" width="22" height="32" fill="#d4c8b0" opacity="0.6" />
    <path d="M 300 270 L 340 250 L 380 290 L 260 420" stroke="#e8471c" strokeWidth="2.5" fill="none" strokeDasharray="6 5" opacity="0.7" />
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
          <div className={styles.mapZoom}>
            <div className={styles.zoomBtn}>+</div>
            <div className={styles.zoomBtn}>−</div>
          </div>
          <div className={styles.mapPin} style={{ left: '50%', top: '52%' }}><div className={styles.pinBody}><span>1</span></div></div>
          <div className={`${styles.mapPin} ${styles.mapPinAmber}`} style={{ left: '57%', top: '48%' }}><div className={styles.pinBody}><span>2</span></div></div>
          <div className={`${styles.mapPin} ${styles.mapPinTeal}`} style={{ left: '63%', top: '56%' }}><div className={styles.pinBody}><span>3</span></div></div>
          <div className={`${styles.mapPin} ${styles.mapPinInk}`} style={{ left: '43%', top: '80%' }}><div className={styles.pinBody}><span>4</span></div></div>
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
