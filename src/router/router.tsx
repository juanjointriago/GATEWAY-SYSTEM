import { createBrowserRouter}  from 'react-router-dom'
import { Root } from '../Root'
import { DashboardLayout } from '../layouts'
import { DashboardPage } from '../pages'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        children: [
            //Dahsbord routes
            {
                path:'dashboard',
                element: <DashboardLayout/>,
                children:[
                    {
                        path:'',
                        element: <DashboardPage/>
                    },
                    {
                        path:'users',
                        // element: <UsersPage/>
                    },
                    {
                        path:'levels',
                        // element: <LevelsPage/>
                    },
                    {
                        path:'sub-levels',
                        // element: <SubLevelsPage/>
                    },
                    {
                        path:'events',
                        // element: <EventsPage/>
                    },
                    {
                        path:'faq',
                        // element: <FaqPage/>
                    },
                    {
                        path:'support-page',
                        // element: <SupportPage/>
                    },
                    // {
                        // path:'logout',
                        // element: <LogoutPage/>
                    // },
                ]
            }
        ]
    }
])