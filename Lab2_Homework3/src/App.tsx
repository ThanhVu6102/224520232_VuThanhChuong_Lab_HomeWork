import FlashSaleCard from './components/FlashSaleCard'

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header__eyebrow">
          Zero-drift countdown · FSM-driven checkout
        </span>
        <h1 className="app-header__title">Shopee 11.11 Flash Sale</h1>
        <p className="app-header__subtitle">
          Reserve your item, lock the inventory for exactly 5 minutes, and check out
          before the hold expires.
        </p>
      </header>

      <main className="app-stage">
        <FlashSaleCard />
      </main>

      <footer className="app-footer">
        IDLE → RESERVING → LOCKED → CHECKOUT → SUCCESS · LOCKED → EXPIRED
      </footer>
    </div>
  )
}
