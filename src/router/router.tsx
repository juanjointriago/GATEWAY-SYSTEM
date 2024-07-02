import { createBrowserRouter } from 'react-router-dom'
import { Root } from '../Root'
import { AuthLayout, DashboardLayout } from '../layouts'
import { DashboardPage, ForgotPassword, SignInPage, SignUpPage } from '../pages'
import { UsersPage } from '../pages/users/UsersPage'
import { LevelsPage } from '../pages/levels/LevelsPage'
import { SubLevelsPage } from '../pages/sublevels/SubLevelsPage'
import { EventsPage } from '../pages/events/EventsPage'
import { FaqPage } from '../pages/faq/FaqPage'
import { SupportPage } from '../pages/support/SupportPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            //Dahsbord routes
            {
                path: 'dashboard',
                element: <DashboardLayout />,
                children: [
                    {
                        path: '',
                        element: <DashboardPage />
                    },
                    {
                        path: 'users',
                        element: <UsersPage />
                    },
                    {
                        path: 'levels',
                        element: <LevelsPage />
                    },
                    {
                        path: 'sub-levels',
                        element: <SubLevelsPage />
                    },
                    {
                        path: 'events',
                        element: <EventsPage />
                    },
                    {
                        path: 'faq',
                        element: <FaqPage />
                    },
                    {
                        path: 'support-page',
                        element: <SupportPage />
                    },
                    {
                        path: 'courses',
                        element: <SupportPage />
                    },
                ],
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'signin',
                        element: <SignInPage />
                    },
                    {
                        path: 'signup',
                        element: <SignUpPage />
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPassword />
                    },
                ]
            },
        ]
    }
])