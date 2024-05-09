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
                    // {
                    //     path:'products',
                    //     element: <Products/>
                    // }
                ]
            }
        ]
    }
])