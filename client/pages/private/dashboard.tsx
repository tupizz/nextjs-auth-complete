import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>Private page here ✋</h1>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  )
}
