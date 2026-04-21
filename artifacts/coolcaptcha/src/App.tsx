import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin/dashboard";
import RSSFeeds from "@/pages/admin/rss-feeds";
import Categories from "@/pages/admin/categories";
import AdminArticles from "@/pages/admin/articles";

setBaseUrl(import.meta.env.VITE_API_URL || "http://localhost:8020");

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/login" component={Login} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/rss-feeds">
        <ProtectedRoute>
          <RSSFeeds />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/categories">
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/articles">
        <ProtectedRoute>
          <AdminArticles />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
