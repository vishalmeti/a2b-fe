import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import AppRoutes from "./AppRoutes"; // Your existing routes component

function App() {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </Provider>
  );
}

export default App;
