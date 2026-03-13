import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute, NotFound } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./styles/global.css";

// Pages
import Explore             from "./pages/Explore";
import RestaurantDetails   from "./pages/RestaurantDetails";
import Login               from "./pages/Login";
import Signup              from "./pages/Signup";
import ProfileManagement   from "./pages/ProfileManagement";
import UserPreferences     from "./pages/UserPreferences";
import FavoritesPage       from "./pages/FavoritesPage";
import HistoryPage         from "./pages/HistoryPage";
import AssistantInterface  from "./pages/AssistantInterface";
import AddRestaurant       from "./pages/AddRestaurant";
import OwnerDashboard      from "./pages/OwnerDashboard";
import ClaimRestaurant     from "./pages/ClaimRestaurant";
import WriteReview         from "./pages/WriteReview";

const NO_NAV = ["/login", "/signup"];

function Layout() {
  const path = window.location.pathname;
  return (
    <>
      {!NO_NAV.includes(path) && <Navbar />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/"                         element={<Explore />} />
            <Route path="/restaurants/:id"          element={<RestaurantDetails />} />
            <Route path="/restaurants/:id/claim"    element={<ProtectedRoute><ClaimRestaurant /></ProtectedRoute>} />
            <Route path="/restaurants/:id/review"   element={<ProtectedRoute><WriteReview /></ProtectedRoute>} />
            <Route path="/login"                    element={<Login />} />
            <Route path="/signup"                   element={<Signup />} />

            {/* User — protected */}
            <Route path="/profile"       element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
            <Route path="/preferences"   element={<ProtectedRoute><UserPreferences /></ProtectedRoute>} />
            <Route path="/favorites"     element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/history"       element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/assistant"     element={<ProtectedRoute><AssistantInterface /></ProtectedRoute>} />
            <Route path="/add-restaurant"element={<ProtectedRoute><AddRestaurant /></ProtectedRoute>} />

            {/* Owner — protected + role */}
            <Route path="/owner/dashboard" element={<ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
