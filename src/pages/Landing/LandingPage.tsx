import styles from './LandingPage.module.css'

export const LandingPage = () => {
  return (
    <div className={styles.page}>
      <section id="hero" className={styles.hero}>
        <h1>Pinnel</h1>
        <p>Plan the trip. Fix the chaos. Share the whole thing.</p>
      </section>

      <section id="features" className={styles.features}>
        <h2>Features</h2>
        <ul>
          <li>Map + card workspace</li>
          <li>Place cards with photo, rating, price, hours</li>
          <li>Route optimization</li>
          <li>Daily schedule builder</li>
          <li>Mobile view for use during the trip</li>
          <li>Trip sharing — public trip page</li>
          <li>One-tap duplicate — Trip Remix</li>
        </ul>
      </section>

      <section id="how-it-works" className={styles.howItWorks}>
        <h2>How it works</h2>
        <ol>
          <li>Pick a city — map loads, place cards appear</li>
          <li>Add cards (museums, food, viewpoints)</li>
          <li>Hit Finalize — Pinnel reorders stops by proximity</li>
          <li>Publish — anyone can clone it in one tap</li>
        </ol>
      </section>

      <section id="cta" className={styles.cta}>
        <h2>Ready to plan?</h2>
        <p>Stop winging it.</p>
        <a href="/dashboard">Get started</a>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Pinnel</p>
      </footer>
    </div>
  )
}
