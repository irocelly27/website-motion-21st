export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora absolute inset-0">
        <span className="left-[-10%] top-[-10%] h-[50vw] w-[50vw] bg-violet" />
        <span className="right-[-15%] top-[20%] h-[45vw] w-[45vw] bg-cyan [animation-delay:-7s]" />
        <span className="bottom-[-20%] left-[25%] h-[40vw] w-[40vw] bg-pink [animation-delay:-14s]" />
      </div>
      <div className="grain absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-ink)_75%)]" />
    </div>
  );
}
