import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestaurantDetails from "./pages/RestaurantDetails";
import WriteReview from "./pages/WriteReview";
import ProfileManagement from "./pages/ProfileManagement";
import ClaimRestaurant from "./pages/ClaimRestaurant";
import AddEditRestaurant from "./pages/AddEditRestaurant";
import OwnerAnalyticsDashboard from "./pages/OwnerAnalyticsDashboard";
import RestaurantProfileManagement from "./pages/RestaurantProfileManagement";
import ReviewsDashboard from "./pages/ReviewsDashboard";
import AssistantInterface from "./pages/AssistantInterface";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/write-review/:id" element={<WriteReview />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/claim" element={<ClaimRestaurant />} />
        <Route path="/add-restaurant" element={<AddEditRestaurant />} />
        <Route path="/owner-dashboard" element={<OwnerAnalyticsDashboard />} />
        <Route path="/restaurant-manage" element={<RestaurantProfileManagement />} />
        <Route path="/reviews-dashboard" element={<ReviewsDashboard />} />
        <Route path="/assistant" element={<AssistantInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
