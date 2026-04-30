export const sessionStorageKey = 'best-offer-session'

const profileStorageKey = 'best-offer-profile'

export type StoredProfile = {
  email: string
  nickname: string
}

export function readStoredProfile() {
  const rawProfile = localStorage.getItem(profileStorageKey)

  if (!rawProfile) {
    return null
  }

  try {
    const profile = JSON.parse(rawProfile) as Partial<StoredProfile>

    if (typeof profile.email === 'string' && typeof profile.nickname === 'string') {
      return profile as StoredProfile
    }
  } catch {
    return null
  }

  return null
}

export function saveStoredProfile(profile: StoredProfile) {
  localStorage.setItem(profileStorageKey, JSON.stringify(profile))
}
