export default function Figure({ src, label }) {
  return (
    <div className="figure">
      <img src={src} alt="" />
      <div className="label">{label}</div>
    </div>
  )
}
