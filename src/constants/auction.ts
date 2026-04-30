import type { AuctionListItem, PageResponse } from '../api'

export const statusLabels = {
  ON_SALE: '진행중',
  COMPLETED: '종료',
  DELETED: '삭제됨',
} as const

export const emptyAuctionPage: PageResponse<AuctionListItem> = {
  content: [],
  empty: true,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
}
