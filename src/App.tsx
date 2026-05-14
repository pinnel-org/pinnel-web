// Claude workflow works!
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LandingPage } from '@/pages/Landing/LandingPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { TripPlannerPage } from '@/pages/TripPlanner/TripPlannerPage'
import { PublicTripPage } from '@/pages/PublicTrip/PublicTripPage'
import { ExplorePage } from '@/pages/Explore/ExplorePage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/t/:slug" element={<PublicTripPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute><TripPlannerPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
)
