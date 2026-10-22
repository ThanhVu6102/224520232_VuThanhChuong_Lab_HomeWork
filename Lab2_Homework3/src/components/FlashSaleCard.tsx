import type { ReactNode } from 'react'
import './FlashSaleCard.css'

const INITIAL_STOCK = 1
const PRICE_VND = 5_000_000
const ORIGINAL_PRICE_VND = 10_000_000
const LOCK_DURATION_MS = 300_000

export type SaleState =
  | { status: 'IDLE'; stock: number }
  | { status: 'RESERVING'; stock: number }
  | { status: 'LOCKED'; stock: number; timeLeft: number }
  | { status: 'CHECKOUT' }
  | { status: 'EXPIRED' }
  | { status: 'SUCCESS' }

const saleState: SaleState = { status: 'IDLE', stock: INITIAL_STOCK }

function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}₫`
}

function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function renderStockSection(state: SaleState): ReactNode {
  if (state.status === 'IDLE' || state.status === 'RESERVING') {
    return (
      <section className="flash-card__stock" aria-label="Remaining stock">
        <span className="flash-card__stock-label">
          🔥 Only {state.stock} left at this price!
        </span>
        <div className="flash-card__stock-bar">
          <div className="flash-card__stock-fill" />
        </div>
      </section>
    )
  }
  return null
}

function renderPanel(state: SaleState): ReactNode {
  switch (state.status) {
    case 'IDLE':
      return (
        <>
          <p className="flash-card__hint">
            Grab it before someone else does — the hold only lasts 5 minutes.
          </p>
          <button className="btn btn--primary" type="button">
            Buy Now
          </button>
        </>
      )
    case 'RESERVING':
      return (
        <>
          <span className="spinner" aria-hidden="true" />
          <p className="flash-card__hint">Reserving your item… locking inventory for you.</p>
        </>
      )
    case 'LOCKED':
      return (
        <>
          <p className="flash-card__hint">
            Inventory locked! Complete checkout before the hold runs out.
          </p>
          <div className="countdown" role="timer">
            {formatCountdown(LOCK_DURATION_MS)}
          </div>
          <div
            className="hold-bar"
            role="progressbar"
            aria-label="Hold time remaining"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
          >
            <div className="hold-bar__fill" style={{ width: '100%' }} />
          </div>
          <button className="btn btn--primary" type="button">
            Checkout
          </button>
        </>
      )
    case 'CHECKOUT':
      return (
        <>
          <span className="spinner" aria-hidden="true" />
          <p className="flash-card__hint">Processing your payment…</p>
        </>
      )
    case 'EXPIRED':
      return (
        <>
          <p className="flash-card__alert">Out of stock / Lock expired</p>
          <p className="flash-card__hint">
            The 5-minute hold ended and the inventory was released back to the pool.
          </p>
          <button className="btn btn--primary" type="button" disabled>
            Buy Now
          </button>
        </>
      )
    case 'SUCCESS':
      return (
        <>
          <div className="flash-card__success" aria-hidden="true">
            ✓
          </div>
          <p className="flash-card__success-text">Purchase Successful!</p>
          <p className="flash-card__hint">Order confirmed — your item ships within 24 hours.</p>
        </>
      )
  }
}

export default function FlashSaleCard() {
  const isUrgent = false

  return (
    <article className={`flash-card${isUrgent ? ' flash-card--urgent' : ''}`}>
      <header className="flash-card__banner">
        <span className="flash-card__bolt" aria-hidden="true">
          ⚡
        </span>
        <span className="flash-card__banner-text">Flash Sale</span>
        <span className="flash-card__banner-tag">11.11 Special</span>
      </header>

      <section className="flash-card__product">
        <div className="flash-card__thumb" aria-hidden="true">
          <span className="flash-card__thumb-emoji">📱</span>
        </div>
        <div className="flash-card__meta">
          <h2 className="flash-card__name">Hero X9 Ultra · Obsidian Black</h2>
          <div className="flash-card__price">
            <span className="flash-card__price-now">{formatVnd(PRICE_VND)}</span>
            <span className="flash-card__price-old">{formatVnd(ORIGINAL_PRICE_VND)}</span>
          </div>
          <span className="flash-card__discount-badge">Save 50% today only</span>
        </div>
      </section>

      {renderStockSection(saleState)}

      <section className="flash-card__panel" aria-live="polite">
        {renderPanel(saleState)}
      </section>
    </article>
  )
}
