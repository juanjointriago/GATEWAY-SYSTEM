import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Root";
import { AuthLayout, DashboardLayout } from "../layouts";
import {
  DashboardPage,
  ForgotPassword,
  SignInPage,
  SignUpPage,
  UnitsPage,
} from "../pages";
import { UsersPage } from "../pages/users/UsersPage";
import { LevelsPage } from "../pages/levels/LevelsPage";
import { SubLevelsPage } from "../pages/sublevels/SubLevelsPage";
import { EventsPage } from "../pages/events/EventsPage";
import { FaqPage } from "../pages/faq/FaqPage";
import { SupportPage } from "../pages/support/SupportPage";
import { LocationsPage } from "../pages/locations/LocationsPage";
import { NotFound } from "../pages/errorPage/NotFound";
import { LanddingLayout } from "../layouts/LanddingLayout";
import { Policies } from "../pages/auth/Policies";
import { FeesPage } from "../pages/fees/FeesPage";
import { ProgressSheetPage } from "../pages/progress-sheet/ProgressSheetPage";
import { NewsPage } from "../pages/news/NewsPage";
import { ProgressSheetMain } from "../pages/progress-sheet/PrograssSheetMain";
import { ErasePage } from "../pages/auth/ErasePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      //Dahsbord routes
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
          { 
            path: "news", 
            element: <NewsPage /> 
          },
          {
            path: "student-progress", 
            element: <ProgressSheetMain /> 
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "levels",
            element: <LevelsPage />,
          },
          {
            path: "sub-levels",
            element: <SubLevelsPage />,
          },
          {
            path: "events",
            element: <EventsPage />,
          },
          {
            path: "faq",
            element: <FaqPage />,
          },
          {
            path: "support-page",
            element: <SupportPage />,
          },
          {
            path: "units",
            element: <UnitsPage />,
          },
          {
            path: "fees",
            element: <FeesPage />,
          },
          {
            path: "locations",
            element: <LocationsPage />,
          },
          {
            path: "progress-sheet/:uid", // Nueva ruta para ProgressSheetPage
            element: <ProgressSheetPage />,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "signin",
            element: <SignInPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
        ],
      },
      {
        path: "/",
        element: <LanddingLayout />,
        children: [
          {
            path: "policies",
            element: <Policies />,
          },
          {
            path: "erase-my-data",
            element: <ErasePage />,
          },
        ],
      },
    ],
  },
]);
