export default function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8 }}
      />
    </label>
  )
}
