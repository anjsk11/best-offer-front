import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, type AuctionDetail, type BidHistoryItem } from '../../api'
import { emptyAuctionPage } from '../../constants/auction'
import type { Notice } from '../../types/ui'
import { toNotice } from '../../utils/notice'

type UseAuctionExplorerOptions = {
  onNotice: (notice: Notice | null) => void
  refreshKey: number
}

export function useAuctionExplorer({
  onNotice,
  refreshKey,
}: UseAuctionExplorerOptions) {
  const [page, setPage] = useState(0)
  const [auctions, setAuctions] = useState(emptyAuctionPage)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<AuctionDetail | null>(null)
  const [bids, setBids] = useState<BidHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const selectedAuction = useMemo(
    () => auctions.content.find((auction) => auction.id === selectedId),
    [auctions.content, selectedId],
  )

  const loadAuctions = useCallback(
    async (nextPage = 0) => {
      setLoading(true)
      try {
        const response = await api.getAuctions(nextPage)
        setAuctions(response)
        onNotice(null)
        setSelectedId((current) => current ?? response.content[0]?.id ?? null)
      } catch (error) {
        onNotice(toNotice('error', error))
      } finally {
        setLoading(false)
      }
    },
    [onNotice],
  )

  const loadAuctionDetail = useCallback(
    async (auctionId: number) => {
      setDetailLoading(true)
      try {
        const [auction, history] = await Promise.all([
          api.getAuction(auctionId),
          api.getBidHistory(auctionId),
        ])
        setDetail(auction)
        setBids(history.content)
      } catch (error) {
        onNotice(toNotice('error', error))
      } finally {
        setDetailLoading(false)
      }
    },
    [onNotice],
  )

  const refreshCurrentPage = useCallback(
    () => loadAuctions(page),
    [loadAuctions, page],
  )

  const refreshSelectedAuction = useCallback(async () => {
    await Promise.all([
      loadAuctions(page),
      detail ? loadAuctionDetail(detail.id) : Promise.resolve(),
    ])
  }, [detail, loadAuctionDetail, loadAuctions, page])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
    setDetail(null)
    setBids([])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAuctions(page)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadAuctions, page, refreshKey])

  useEffect(() => {
    if (selectedId === null) return undefined

    const timer = window.setTimeout(() => {
      void loadAuctionDetail(selectedId)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadAuctionDetail, selectedId])

  return {
    auctions,
    bids,
    clearSelection,
    detail,
    detailLoading,
    loading,
    page,
    refreshCurrentPage,
    refreshSelectedAuction,
    selectedAuction,
    selectedId,
    selectAuction: setSelectedId,
    setPage,
  }
}
