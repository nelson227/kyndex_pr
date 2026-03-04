export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Users
  GET_USER: (id: string) => `/users/${id}`,
  UPDATE_PROFILE: (id: string) => `/users/${id}/profile`,
  GET_PROFILE: (id: string) => `/users/${id}/profile`,

  // Skills
  GET_SKILLS: '/skills',
  CREATE_SKILL: '/skills',
  UPDATE_SKILL: (id: string) => `/skills/${id}`,
  DELETE_SKILL: (id: string) => `/skills/${id}`,
  GET_USER_SKILLS: (userId: string) => `/users/${userId}/skills`,

  // Matching
  GET_MATCHES: '/matching/matches',
  GET_MATCH: (id: string) => `/matching/matches/${id}`,
  CREATE_MATCH_REQUEST: '/matching/requests',
  ACCEPT_MATCH: (id: string) => `/matching/requests/${id}/accept`,
  DECLINE_MATCH: (id: string) => `/matching/requests/${id}/decline`,

  // Service Requests
  GET_SERVICE_REQUESTS: '/service-requests',
  GET_SERVICE_REQUEST: (id: string) => `/service-requests/${id}`,
  CREATE_SERVICE_REQUEST: '/service-requests',
  APPLY_TO_REQUEST: (id: string) => `/service-requests/${id}/apply`,
  GENERATE_BRIEF: '/service-requests/generate-brief',
  REFINE_BRIEF: '/service-requests/refine-brief',
  GENERATE_HOMEPAGE_BRIEF: '/service-requests/homepage/generate-brief',
  GENERATE_HOMEPAGE_SERVICES: '/service-requests/homepage/generate-services',

  // Messaging
  GET_USERS_FOR_MESSAGING: '/messages/users',
  GET_CONVERSATIONS: '/messages/conversations',
  GET_CONVERSATION: (id: string) => `/messages/conversations/${id}`,
  GET_MESSAGES: (convId: string) => `/messages/conversations/${convId}/messages`,
  SEND_MESSAGE: (convId: string) => `/messages/conversations/${convId}/messages`,
  CREATE_CONVERSATION: '/messages/conversations',

  // Transactions
  GET_TRANSACTIONS: '/transactions',
  CREATE_TRANSACTION: '/transactions',
  GET_TRANSACTION: (id: string) => `/transactions/${id}`,
  COMPLETE_TRANSACTION: (id: string) => `/transactions/${id}/complete`,

  // Reviews
  CREATE_REVIEW: '/reviews',
  GET_REVIEWS: (userId: string) => `/users/${userId}/reviews`,

  // Credit Wallet
  GET_WALLET: '/wallet',
  ADD_CREDITS: '/wallet/add',
  TRANSFER_CREDITS: '/wallet/transfer',
} as const;
