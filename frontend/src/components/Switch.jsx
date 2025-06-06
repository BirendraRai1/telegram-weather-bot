import React from 'react'

function Switch({ checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  )
}

export default Switch