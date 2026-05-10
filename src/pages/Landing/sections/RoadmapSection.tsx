import styles from './RoadmapSection.module.css'

const nowItems = [
  'Log in, create trips per destination',
  'Map + card workspace with resizable panels',
  'Add cards, drop pins, leave comments',
  'Route optimization & daily schedule',
  'Mobile view for use during the trip',
  'Share a finished trip · one-tap duplicate',
]

const nextItems = [
  'Attach photos & articles to any card',
  'Follow other travelers, curate feeds',
  'User-created cards for hidden places',
  'Collections: "Best of Milan by locals"',
  'Reviews tied to real completed trips',
  'Collaborative trips with friends',
]

export const RoadmapSection = () => (
  <section className={styles.roadmap}>
    <div className={`${styles.col} ${styles.now}`}>
      <span className={styles.label}>Now / MVP</span>
      <h3 className={styles.h3}>What you get <em>today</em></h3>
      <ul className={styles.list}>
        {nowItems.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
    <div className={`${styles.col} ${styles.next}`}>
      <span className={styles.label}>Next / Coming</span>
      <h3 className={styles.h3}>A <em>social network</em> for travel</h3>
      <ul className={styles.list}>
        {nextItems.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  </section>
)
