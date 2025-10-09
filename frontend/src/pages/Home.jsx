import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import Footer from '../components/Footer'

function Home() {
    const {userData} = useSelector(state => state.user)
  return (
    <div className='w-full min-h-screen pt-[100px] flex flex-col items-center bg-gradient-to-br from-orange-50 to-red-50'>
      {userData?.role === 'user' && <UserDashboard/>}
      {userData?.role === 'owner' && <OwnerDashboard/>}
      {userData?.role === 'deliveryBoy' && <DeliveryBoy/>}
      <Footer />
    </div>
  )
}

export default Home
