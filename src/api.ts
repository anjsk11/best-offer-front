const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? ''

export type AuctionStatus = 'ON_SALE' | 'COMPLETED' | 'DELETED'

export type AuctionListItem = {
  id: number
  title: string
  currentPrice: number
  endTime: string
  status: AuctionStatus
}

export type AuctionDetail = AuctionListItem & {
  description: string
  startPrice: number
  sellerNickname: string
}

export type BidHistoryItem = {
  bidId: number
  bidderNickname: string
  bidPrice: number
  bidTime: string
}

export type PageResponse<T> = {
  totalPages: number
  totalElements: number
  size: number
  content: T[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const text = await response.text()
  const data = text ? tryParseJson(text) : null

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data
        ? String(data.message)
        : text || `HTTP ${response.status}`
    throw new Error(message)
  }

  return data as T
}

function tryParseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function pageable(page: number, size: number, sort?: string) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  })

  if (sort) {
    params.set('sort', sort)
  }

  return params.toString()
}

export const api = {
  signup(payload: { email: string; password: string; nickname: string }) {
    return request<string>('/api/v1/users/signup', {
      method: 'POST',
      body: payload,
    })
  },
  login(payload: { email: string; password: string }) {
    return request<string>('/api/v1/users/login', {
      method: 'POST',
      body: payload,
    })
  },
  getAuctions(page = 0, size = 8) {
    return request<PageResponse<AuctionListItem>>(
      `/api/v1/auctions?${pageable(page, size, 'endTime,asc')}`,
    )
  },
  createAuction(payload: {
    title: string
    description: string
    startPrice: number
    endTime: string
  }) {
    return request<string>('/api/v1/auctions', {
      method: 'POST',
      body: payload,
    })
  },
  getAuction(auctionId: number) {
    return request<AuctionDetail>(`/api/v1/auctions/${auctionId}`)
  },
  updateAuction(
    auctionId: number,
    payload: { title: string; description: string },
  ) {
    return request<string>(`/api/v1/auctions/${auctionId}`, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteAuction(auctionId: number) {
    return request<string>(`/api/v1/auctions/${auctionId}`, {
      method: 'DELETE',
    })
  },
  getBidHistory(auctionId: number, page = 0, size = 6) {
    return request<PageResponse<BidHistoryItem>>(
      `/api/v1/auctions/${auctionId}/bids?${pageable(page, size, 'bidTime,desc')}`,
    )
  },
  placeBid(
    auctionId: number,
    payload: { bidPrice: number; bidderId: number },
  ) {
    return request<string>(`/api/v1/auctions/${auctionId}/bids`, {
      method: 'POST',
      body: payload,
    })
  },
}
