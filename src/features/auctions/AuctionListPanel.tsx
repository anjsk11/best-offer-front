import { Loader2, RefreshCw } from 'lucide-react'
import type { AuctionListItem, PageResponse } from '../../api'
import { statusLabels } from '../../constants/auction'
import { formatCount, formatDate, formatMoney } from '../../utils/format'

type AuctionListPanelProps = {
  auctions: PageResponse<AuctionListItem>
  loading: boolean
  selectedId: number | null
  onPageChange: (updater: (current: number) => number) => void
  onRefresh: () => void
  onSelectAuction: (auctionId: number) => void
}

export function AuctionListPanel({
  auctions,
  loading,
  selectedId,
  onPageChange,
  onRefresh,
  onSelectAuction,
}: AuctionListPanelProps) {
  return (
    <div className="panel auction-list">
      <div className="panel-heading">
        <div>
          <h2>경매 목록</h2>
          <p>{formatCount(auctions.totalElements)}개 항목</p>
        </div>
        <button
          className="icon-button"
          type="button"
          aria-label="목록 새로고침"
          onClick={onRefresh}
        >
          {loading ? (
            <Loader2 className="spin" size={18} aria-hidden="true" />
          ) : (
            <RefreshCw size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="auction-items">
        {auctions.content.map((auction) => (
          <button
            className={`auction-row ${
              auction.id === selectedId ? 'selected' : ''
            }`}
            key={auction.id}
            type="button"
            onClick={() => onSelectAuction(auction.id)}
          >
            <span>
              <strong>{auction.title}</strong>
              <small>{formatDate(auction.endTime)}</small>
            </span>
            <span>
              <b>{formatMoney(auction.currentPrice)}</b>
              <i className={`status ${auction.status.toLowerCase()}`}>
                {statusLabels[auction.status]}
              </i>
            </span>
          </button>
        ))}
        {!loading && auctions.content.length === 0 && (
          <div className="empty">등록된 경매가 없습니다.</div>
        )}
      </div>

      <div className="pagination">
        <button
          type="button"
          disabled={auctions.first || loading}
          onClick={() => onPageChange((current) => current - 1)}
        >
          이전
        </button>
        <span>
          {auctions.totalPages === 0 ? 0 : auctions.number + 1} /{' '}
          {auctions.totalPages}
        </span>
        <button
          type="button"
          disabled={auctions.last || loading}
          onClick={() => onPageChange((current) => current + 1)}
        >
          다음
        </button>
      </div>
    </div>
  )
}
