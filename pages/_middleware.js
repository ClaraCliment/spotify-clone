import {getToken} from 'next-auth/jwt';
import {NextResponse} from 'next/server';

export async function middleware (req) {
    // the token will exist if the user is logged in
    const token = await getToken({req, secret: process.env.JWT_SECRET});
    const url = req.nextUrl.clone() 

    const { pathname } = req.nextUrl;

    // allow the requests if the following is true:
    // 1) it is a request for next-auth session & provider fetching
    // 2) if the token exists
    if(pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    // redirect if the user doesn't have a token and he requestes a protected root
    if (!token && pathname !== '/login') {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}