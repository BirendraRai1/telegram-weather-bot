import React from 'react'

function Input({ placeholder,value, onChange, type = 'text' }) {
  //console.log("value and onChange is ",value)
  return (
    <div style={{ marginBottom: '12px' }}>
        <input
            placeholder={placeholder}
            onChange={onChange}
            style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            flex: '1',
            fontSize:'14px'
            }}
      />
    </div>
  )
}

export default Input