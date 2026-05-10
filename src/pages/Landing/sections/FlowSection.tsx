import styles from './FlowSection.module.css'

const steps = [
  { num: '1', label: 'Start', title: <>Create a <em>trip</em></>, desc: 'Pick a city. Map loads, cards appear. The workspace is yours.' },
  { num: '2', label: 'Collect', title: <>Add <em>cards</em></>, desc: 'Browse places, add the ones you like. Leave notes. Pins show up on the map.' },
  { num: '3', label: 'Optimize', title: <><em>Finalize</em> it</>, desc: 'Pinnel orders the stops by proximity and time. Add a schedule.' },
  { num: '4', label: 'Go', title: <>Travel <em>calm</em></>, desc: 'Open it on your phone. Every day has a clear, walkable plan.' },
  { num: '5', label: 'Pass on', title: <><em>Share</em> it</>, desc: 'Publish the trip. Others can clone it and tailor it to their own dates.' },
]

export const FlowSection = () => (
  <section className={styles.flow}>
    {steps.map((s) => (
      <div key={s.num} className={styles.step}>
        <div className={`${styles.stepNum} ${styles[`stepNum${s.num}`]}`}>{s.num}</div>
        <div className={styles.stepLabel}>{s.label}</div>
        <h3 className={styles.stepTitle}>{s.title}</h3>
        <p className={styles.stepDesc}>{s.desc}</p>
      </div>
    ))}
  </section>
)
