import styles from './FeaturesSection.module.css'

const features = [
  {
    num: '/ 01',
    title: <>Cards with <em>context</em></>,
    desc: 'Each place is a card — photo, info, rating, price, hours. Add it, drop a comment, done.',
  },
  {
    num: '/ 02',
    title: <>Live <em>map pins</em></>,
    desc: 'Google Maps on one side, cards on the other. Resize the map. Every card you pick lands as a pin.',
  },
  {
    num: '/ 03',
    title: <>Smart <em>routing</em></>,
    desc: 'Hit finalize and Pinnel reorders stops so you walk less and see more. No backtracking.',
  },
  {
    num: '/ 04',
    title: <>In your <em>pocket</em></>,
    desc: "Open the trip on mobile. See what's next, where to go, and what you planned to do there.",
  },
]

export const FeaturesSection = () => (
  <section className={styles.features}>
    <div className={styles.head}>
      <h2 className={styles.h2}>
        Pick a city. Drop cards. Get a <em>day that actually works.</em>
      </h2>
      <div className={styles.pill}>Milan · Paris · Tokyo</div>
    </div>
    <div className={styles.grid}>
      {features.map((f, i) => (
        <div key={i} className={styles.feat}>
          <div className={styles.featNum}>{f.num}</div>
          <h3 className={styles.featTitle}>{f.title}</h3>
          <p className={styles.featDesc}>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
)
