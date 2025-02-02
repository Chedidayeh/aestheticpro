// array of routes that accessible to only logged in users
// these routes require Auth
// type : string

export const privateRoutes = [
    "/MarketPlace/create-client-product/upload",
    "/MarketPlace/create-client-product/preview",
]




// array of routes that accessible to not logged in users
// these routes don't require Auth
// type : string

export const createStoreRoute = "/MarketPlace/create-seller-profile"
export const createAffiliateRoute = "/createAffiliateAccount"



// array of routes that accessible to all not logged in users
// these routes require Auth
// type : string
export const authRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
]


// the prefix for sellers auth routes
// routes that starts with this prefix are used for seller Dashboard navigation
// type : string
export const sellerAuthRoutes = '/sellerDashboard'


// the prefix for affiliate users auth routes
// routes that starts with this prefix are used for affiliate Dashboard navigation
// type : string
export const affiliateAuthRoutes = '/affiliateDashboard'


// the prefix for admin auth routes
// routes that starts with this prefix are used for admin Dashboard navigation
// type : string
export const adminAuthRoutes = '/adminDashboard'


// the prefix for factory auth routes
// routes that starts with this prefix are used for factory Dashboard navigation
// type : string
export const factoryAuthRoutes = '/factoryDashboard'


export const alreadyVerifiedUser = '/auth/verify-email'

export const alreadyResetPassword = '/auth/reset-password'

export const DEFAULT_LOGIN_REDIRECT = "/"

