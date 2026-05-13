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

// Static SVG city-map illustration — non-interactive visual for the landing page
const MapSvg = () => (
  <svg className={styles.mapSvg} viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice">
    {/* Base map background */}
    <rect width="600" height="520" fill="#e8e8e8" />

    {/* City blocks */}
    <rect x="0" y="0" width="120" height="80" fill="#dcdcdc" />
    <rect x="140" y="0" width="130" height="80" fill="#dcdcdc" />
    <rect x="290" y="0" width="90" height="80" fill="#dcdcdc" />
    <rect x="400" y="0" width="200" height="80" fill="#dcdcdc" />

    <rect x="0" y="100" width="80" height="100" fill="#dcdcdc" />
    <rect x="100" y="100" width="160" height="100" fill="#dcdcdc" />
    <rect x="280" y="100" width="100" height="45" fill="#dcdcdc" />
    <rect x="400" y="100" width="200" height="100" fill="#dcdcdc" />

    <rect x="0" y="220" width="80" height="80" fill="#dcdcdc" />
    <rect x="100" y="220" width="160" height="80" fill="#dcdcdc" />
    <rect x="280" y="165" width="100" height="135" fill="#dcdcdc" />
    <rect x="400" y="220" width="90" height="80" fill="#dcdcdc" />
    <rect x="510" y="220" width="90" height="80" fill="#dcdcdc" />

    <rect x="0" y="320" width="80" height="80" fill="#dcdcdc" />
    <rect x="100" y="320" width="70" height="80" fill="#dcdcdc" />
    <rect x="190" y="320" width="70" height="80" fill="#dcdcdc" />
    <rect x="280" y="320" width="100" height="80" fill="#dcdcdc" />
    <rect x="400" y="320" width="200" height="80" fill="#dcdcdc" />

    <rect x="0" y="420" width="120" height="100" fill="#dcdcdc" />
    <rect x="140" y="420" width="120" height="100" fill="#dcdcdc" />
    <rect x="280" y="420" width="100" height="100" fill="#dcdcdc" />
    <rect x="400" y="420" width="200" height="100" fill="#dcdcdc" />

    {/* Green areas (parks) */}
    <rect x="100" y="165" width="160" height="35" fill="#c8d8b0" opacity="0.8" />
    <rect x="400" y="165" width="90" height="35" fill="#c8d8b0" opacity="0.8" />
    <rect x="510" y="165" width="90" height="35" fill="#c8d8b0" opacity="0.8" />
    <rect x="100" y="420" width="160" height="100" fill="#c8d8b0" opacity="0.7" />

    {/* Main roads — horizontal (white lines) */}
    <rect x="0" y="88" width="600" height="10" fill="white" />
    <rect x="0" y="208" width="600" height="10" fill="white" />
    <rect x="0" y="308" width="600" height="10" fill="white" />
    <rect x="0" y="408" width="600" height="10" fill="white" />

    {/* Main roads — vertical (white lines) */}
    <rect x="88" y="0" width="10" height="520" fill="white" />
    <rect x="268" y="0" width="10" height="520" fill="white" />
    <rect x="388" y="0" width="10" height="520" fill="white" />
    <rect x="498" y="0" width="10" height="520" fill="white" />

    {/* Secondary roads — horizontal */}
    <rect x="0" y="158" width="600" height="6" fill="#f0f0f0" />
    <rect x="0" y="358" width="260" height="6" fill="#f0f0f0" />
    <rect x="398" y="358" width="202" height="6" fill="#f0f0f0" />

    {/* Secondary roads — vertical */}
    <rect x="178" y="0" width="6" height="300" fill="#f0f0f0" />
    <rect x="178" y="318" width="6" height="202" fill="#f0f0f0" />

    {/* Diagonal boulevard */}
    <path d="M 268 0 L 388 208" stroke="white" strokeWidth="8" fill="none" />
    <path d="M 388 208 L 268 308" stroke="white" strokeWidth="8" fill="none" />

    {/* Route path through the city */}
    <path
      d="M 230 180 L 310 180 L 310 260 L 430 260 L 430 350 L 230 420"
      stroke="#e8471c"
      strokeWidth="3"
      fill="none"
      strokeDasharray="8 6"
      opacity="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
          <div className={styles.mapPin} style={{ left: '38%', top: '35%' }}><div className={styles.pinBody}><span>1</span></div></div>
          <div className={`${styles.mapPin} ${styles.mapPinTeal}`} style={{ left: '52%', top: '50%' }}><div className={styles.pinBody}><span>2</span></div></div>
          <div className={`${styles.mapPin} ${styles.mapPinAmber}`} style={{ left: '62%', top: '42%' }}><div className={styles.pinBody}><span>3</span></div></div>
          <div className={`${styles.mapPin} ${styles.mapPinInk}`} style={{ left: '42%', top: '68%' }}><div className={styles.pinBody}><span>4</span></div></div>
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
