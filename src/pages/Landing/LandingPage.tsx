import styles from './LandingPage.module.css'
import { Header } from './sections/Header'
import { HeroSection } from './sections/HeroSection'
import { AppPreviewSection } from './sections/AppPreviewSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { ShareSection } from './sections/ShareSection'
import { FlowSection } from './sections/FlowSection'
import { RoadmapSection } from './sections/RoadmapSection'
import { CtaSection } from './sections/CtaSection'

export const LandingPage = () => (
  <div className={styles.wrapper}>
    <div className={styles.page}>
      <Header />
      <HeroSection />
      <div className={styles.divider}>§ 01 &nbsp; Inside the app</div>
      <AppPreviewSection />
      <div className={styles.divider}>§ 02 &nbsp; What's inside</div>
      <FeaturesSection />
      <ShareSection />
      <div id="how-it-works" className={styles.divider}>§ 03 &nbsp; How it flows</div>
      <FlowSection />
      <RoadmapSection />
      <CtaSection />
      <footer className={styles.footer}>
        <div>© 2026 Pinnel · Plan · Route · Share</div>
        <div>Milan · Paris · Tokyo · Your city next</div>
      </footer>
    </div>
  </div>
)
