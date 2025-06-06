import React from 'react'

function Button({ onClick, children, style }) {
  return (
     <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  )
}

export default Button