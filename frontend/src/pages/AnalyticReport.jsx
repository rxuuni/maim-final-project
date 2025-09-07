import React from 'react'
import { useAuth } from '../context/AuthContext'

function AnalyticReport() {
  const {user} = useAuth()
  return (
    <><div>AnalyticReport</div><Payment
      event={event}
      selectedSeat="Row A - Seat 5"
      user={user} /></>

  )
}

export default AnalyticReport