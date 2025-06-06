import React from 'react'

function Card({children}) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>{children}</div>
  )
}

export default Card