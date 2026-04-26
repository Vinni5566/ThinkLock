import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense, lazy } from 'react';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";

const Contact = lazy(() => import("./pages/Contact"));
const ChatPage = lazy(() => import("./pages/dashboard/ChatPage"));
const ThinkingGraphPage = lazy(() => import("./pages/dashboard/ThinkingGraphPage"));
const CognitiveProfilePage = lazy(() => import("./pages/dashboard/CognitiveProfilePage"));
const AntiGamingPage = lazy(() => import("./pages/dashboard/AntiGamingPage"));
const ReasoningReplayPage = lazy(() => import("./pages/dashboard/ReasoningReplayPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const HistoryPage = lazy(() => import("./pages/dashboard/HistoryPage"));
const DependencyTrackerPage = lazy(() => import("./pages/dashboard/DependencyTrackerPage"));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
  </div>
);

import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/chat" replace />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="session/:id" element={<ChatPage />} />
              <Route path="thinking-graph" element={<ThinkingGraphPage />} />
              <Route path="cognitive-profile" element={<CognitiveProfilePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="anti-gaming" element={<AntiGamingPage />} />
              <Route path="reasoning-replay" element={<ReasoningReplayPage />} />
              <Route path="dependency-tracker" element={<DependencyTrackerPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
