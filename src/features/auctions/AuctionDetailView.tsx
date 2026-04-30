import {
  BadgePlus,
  Clock3,
  Gavel,
  Loader2,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  api,
  type AuctionDetail,
  type AuctionListItem,
  type BidHistoryItem,
} from '../../api'
import { statusLabels } from '../../constants/auction'
import type { Notice } from '../../types/ui'
import { formatDate, formatMoney } from '../../utils/format'
import { toNotice } from '../../utils/notice'

type AuctionDetailViewProps = {
  bids: BidHistoryItem[]
  detail: AuctionDetail | null
  detailLoading: boolean
  selectedAuction: AuctionListItem | undefined
  onClearSelection: () => void
  onNotice: (notice: Notice | null) => void
  onRefreshList: () => Promise<void>
  onRefreshSelected: () => Promise<void>
}

export function AuctionDetailView({
  bids,
  detail,
  detailLoading,
  selectedAuction,
  onClearSelection,
  onNotice,
  onRefreshList,
  onRefreshSelected,
}: AuctionDetailViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  async function handleDelete() {
    if (!detail) return
    if (!confirm(`'${detail.title}' 경매를 삭제할까요?`)) return

    try {
      await api.deleteAuction(detail.id)
      onClearSelection()
      await onRefreshList()
      onNotice({ tone: 'success', message: '경매가 삭제되었습니다.' })
    } catch (error) {
      onNotice(toNotice('error', error))
    }
  }

  if (detailLoading) {
    return (
      <div className="detail-area">
        <div className="panel loading-panel">
          <Loader2 className="spin" size={24} aria-hidden="true" />
          불러오는 중
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="detail-area">
        <div className="panel loading-panel">경매를 선택하세요.</div>
      </div>
    )
  }

  return (
    <div className="detail-area">
      <article className="panel detail-card">
        <div className="detail-top">
          <div>
            <i className={`status ${detail.status.toLowerCase()}`}>
              {statusLabels[detail.status]}
            </i>
            <h2>{detail.title}</h2>
            <p>{detail.description}</p>
          </div>
          <div className="detail-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil size={16} aria-hidden="true" />
              수정
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={() => void handleDelete()}
            >
              <Trash2 size={16} aria-hidden="true" />
              삭제
            </button>
          </div>
        </div>

        <dl className="metrics">
          <div>
            <dt>현재가</dt>
            <dd>{formatMoney(detail.currentPrice)}</dd>
          </div>
          <div>
            <dt>시작가</dt>
            <dd>{formatMoney(detail.startPrice)}</dd>
          </div>
          <div>
            <dt>판매자</dt>
            <dd>{detail.sellerNickname}</dd>
          </div>
          <div>
            <dt>마감</dt>
            <dd>{formatDate(detail.endTime)}</dd>
          </div>
        </dl>
      </article>

      <BidForm
        key={`bid-${detail.id}`}
        auction={detail}
        onNotice={onNotice}
        onRefresh={onRefreshSelected}
      />

      {isEditOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setIsEditOpen(false)}
        >
          <div
            aria-modal="true"
            className="modal-panel"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              aria-label="수정 팝업 닫기"
              className="icon-button modal-close"
              type="button"
              onClick={() => setIsEditOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <EditAuctionForm
              key={`edit-${detail.id}`}
              auction={detail}
              onClose={() => setIsEditOpen(false)}
              onNotice={onNotice}
              onRefresh={onRefreshSelected}
            />
          </div>
        </div>
      )}

      <section className="panel bid-history">
        <div className="panel-heading">
          <div>
            <h2>입찰 내역</h2>
            <p>{selectedAuction?.title ?? detail.title}</p>
          </div>
          <Clock3 size={18} aria-hidden="true" />
        </div>
        <ul>
          {bids.map((bid) => (
            <li key={bid.bidId}>
              <span>{bid.bidderNickname}</span>
              <strong>{formatMoney(bid.bidPrice)}</strong>
              <small>{formatDate(bid.bidTime)}</small>
            </li>
          ))}
        </ul>
        {bids.length === 0 && (
          <div className="empty">아직 입찰 내역이 없습니다.</div>
        )}
      </section>
    </div>
  )
}

type DetailFormProps = {
  auction: AuctionDetail
  onClose?: () => void
  onNotice: (notice: Notice | null) => void
  onRefresh: () => Promise<void>
}

function BidForm({ auction, onNotice, onRefresh }: DetailFormProps) {
  const [form, setForm] = useState({
    bidPrice: String(auction.currentPrice + 1000),
    bidderId: '',
  })

  async function handleBid(event: FormEvent) {
    event.preventDefault()

    try {
      await api.placeBid(auction.id, {
        bidPrice: Number(form.bidPrice),
        bidderId: Number(form.bidderId),
      })
      await onRefresh()
      onNotice({ tone: 'success', message: '입찰이 완료되었습니다.' })
    } catch (error) {
      onNotice(toNotice('error', error))
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleBid}>
      <h3>
        <BadgePlus size={18} aria-hidden="true" />
        입찰하기
      </h3>
      <label>
        입찰가
        <input
          min={auction.currentPrice + 1}
          required
          type="number"
          value={form.bidPrice}
          onChange={(event) =>
            setForm({
              ...form,
              bidPrice: event.target.value,
            })
          }
        />
      </label>
      <label>
        입찰자 ID
        <input
          min="1"
          required
          type="number"
          value={form.bidderId}
          onChange={(event) =>
            setForm({
              ...form,
              bidderId: event.target.value,
            })
          }
        />
      </label>
      <button className="primary-button" type="submit">
        <Gavel size={17} aria-hidden="true" />
        제안 제출
      </button>
    </form>
  )
}

function EditAuctionForm({
  auction,
  onClose,
  onNotice,
  onRefresh,
}: DetailFormProps) {
  const [form, setForm] = useState({
    title: auction.title,
    description: auction.description,
  })

  async function handleUpdate(event: FormEvent) {
    event.preventDefault()

    try {
      await api.updateAuction(auction.id, {
        title: form.title.trim(),
        description: form.description.trim(),
      })
      await onRefresh()
      onClose?.()
      onNotice({ tone: 'success', message: '경매 정보가 수정되었습니다.' })
    } catch (error) {
      onNotice(toNotice('error', error))
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleUpdate}>
      <h3>
        <Pencil size={18} aria-hidden="true" />
        경매 수정
      </h3>
      <label>
        제목
        <input
          required
          value={form.title}
          onChange={(event) =>
            setForm({
              ...form,
              title: event.target.value,
            })
          }
        />
      </label>
      <label>
        설명
        <textarea
          required
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
        />
      </label>
      <button className="secondary-button" type="submit">
        저장
      </button>
    </form>
  )
}
