'use server'

import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    adminAuthRoutes,
    authRoutes,
    createStoreRoute,
    factoryAuthRoutes,
    privateRoutes,
    sellerAuthRoutes,
    alreadyVerifiedUser,
    alreadyResetPassword,
    affiliateAuthRoutes,
    createAffiliateRoute

} from "@/routes"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';


// ✅ Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

import { auth as a } from '@/auth'
const { auth } = NextAuth(authConfig);
export default auth(async (req) => {

    // First: Run next-intl locale detection
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;


    
      // Then: Run existing auth & role checks
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isAlreadyVerifiedUserRoute = nextUrl.pathname.startsWith(alreadyVerifiedUser)
    const isAlreadyResetPasswordRoute = nextUrl.pathname.startsWith(alreadyResetPassword)
    const isSellerRoute = nextUrl.pathname.startsWith(sellerAuthRoutes);
    const isAffiliateRoute = nextUrl.pathname.startsWith(affiliateAuthRoutes);
    const isAdminRoute = nextUrl.pathname.startsWith(adminAuthRoutes);
    const isFactoryRoute = nextUrl.pathname.startsWith(factoryAuthRoutes);
    const isCreateStoreRoute = nextUrl.pathname.startsWith(createStoreRoute);
    const isCreateAffiliateRoute = nextUrl.pathname.startsWith(createAffiliateRoute);



    // block if a already logged in user try to access to auth routes 
    if (isAuthRoute || isAlreadyVerifiedUserRoute || isAlreadyResetPasswordRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return;
    }

    // block if a not logged in user try to access these routes 
    if (isPrivateRoute) {
        if (!isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return;
    }



    // only simple user can get to this route:
    if (isCreateStoreRoute) {
        if (isLoggedIn) {
            const session = await a()
            if (session?.user.role === "SELLER") {
                return Response.redirect(new URL("/sellerDashboard", nextUrl));
            }
            else if (session?.user.role === "ADMIN" || session?.user.role === "FACTORY") {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
            }
            return
        }
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    // only simple user can get to this route:
    if (isCreateAffiliateRoute) {
        if (isLoggedIn) {
            const session = await a()
            if (session?.user.isAffiliate === true) {
                return Response.redirect(new URL("/affiliateDashboard", nextUrl));
            } else if (session?.user.role === "ADMIN" || session?.user.role === "FACTORY") {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
            }
            return
        }
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    // Detect seller 
    if (isSellerRoute) {
        if (!isLoggedIn) {
            // Redirect to login if the user is not logged in
            return Response.redirect(new URL("/auth/sign-in", nextUrl));
        }
        // const session = await a()
        // if (session?.user.role !== "SELLER") {
        //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        // }
        return
    }


    // Detect affiliate user 
    if (isAffiliateRoute) {
        if (!isLoggedIn) {
            // Redirect to login if the user is not logged in
            return Response.redirect(new URL("/auth/sign-in", nextUrl));
        }
        // const session = await a()
        // if (session?.user.isAffiliate === false) {
        //     return Response.redirect(new URL("/createAffiliateAccount", nextUrl));
        // }
        return
    }



    // Detect admin 
    if (isAdminRoute) {
        if (!isLoggedIn) {
            // Redirect to login if the user is not logged in
            return Response.redirect(new URL("/auth/sign-in", nextUrl));
        }
        const session = await a()
        if (session?.user.role !== "ADMIN") {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return
    }

    // Detect factory admin 
    if (isFactoryRoute) {
        if (!isLoggedIn) {
            // Redirect to login if the user is not logged in
            return Response.redirect(new URL("/auth/sign-in", nextUrl));
        }
        const session = await a()
        if (session?.user.role !== "FACTORY") {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return
    }




    return;
})


export const config = {
    matcher: ['/((?!_next|api|trpc|.*\\..*).*)'],
  };
  