import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "./pages/LoadingScreen";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import ClientHome from "./pages/ClientHome";
import ClientPayments from "./pages/ClientPayments";
import FreelancerHome from "./pages/FreelancerHome";
import FreelancerEarnings from "./pages/FreelancerEarnings";
import FreelancerProfile from "./pages/FreelancerProfile";
import ClientProfile from "./pages/ClientProfile";
import FreelancerDetail from "./pages/FreelancerDetail";
import PremiumPlans from "./pages/PremiumPlans";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import FreelancerUploads from "./pages/FreelancerUploads";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoadingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/client" element={<ClientHome />} />
          <Route path="/client/payments" element={<ClientPayments />} />
          <Route path="/client/chat" element={<ChatPage role="client" />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/freelancer/:id" element={<FreelancerDetail />} />
          <Route path="/freelancer" element={<FreelancerHome />} />
          <Route path="/freelancer/chat" element={<ChatPage role="freelancer" />} />
          <Route path="/freelancer/earnings" element={<FreelancerEarnings />} />
          <Route path="/freelancer/profile" element={<FreelancerProfile />} />
          <Route path="/freelancer/premium" element={<PremiumPlans />} />
          <Route path="/freelancer/uploads" element={<FreelancerUploads />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
