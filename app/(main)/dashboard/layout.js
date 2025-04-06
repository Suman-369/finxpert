import React, { Suspense } from 'react'
import DashboardPage from './page'
import{BarLoader} from "react-spinners"

const DashboardLayout= () => {
  return (



    <div className='px-5'>
        <h1 className='text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text'>Dashboard</h1>


        {/* dashboard page */}
    <Suspense fallback={<BarLoader className="mt-4 " width={"100%"} color='#9333ea'></BarLoader>}>
            <DashboardPage></DashboardPage>
    </Suspense>


    </div>

  )
}

export default  DashboardLayout
