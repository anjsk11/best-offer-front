import type { Notice } from '../../types/ui'
import { AuctionDetailView } from './AuctionDetailView'
import { AuctionListPanel } from './AuctionListPanel'
import { useAuctionExplorer } from './useAuctionExplorer'

type AuctionExplorerProps = {
  onNotice: (notice: Notice | null) => void
  refreshKey: number
}

export function AuctionExplorer({
  onNotice,
  refreshKey,
}: AuctionExplorerProps) {
  const explorer = useAuctionExplorer({ onNotice, refreshKey })

  return (
    <section className="workspace">
      <AuctionListPanel
        auctions={explorer.auctions}
        loading={explorer.loading}
        onPageChange={explorer.setPage}
        onRefresh={explorer.refreshCurrentPage}
        onSelectAuction={explorer.selectAuction}
        selectedId={explorer.selectedId}
      />
      <AuctionDetailView
        bids={explorer.bids}
        detail={explorer.detail}
        detailLoading={explorer.detailLoading}
        onClearSelection={explorer.clearSelection}
        onNotice={onNotice}
        onRefreshList={explorer.refreshCurrentPage}
        onRefreshSelected={explorer.refreshSelectedAuction}
        selectedAuction={explorer.selectedAuction}
      />
    </section>
  )
}
