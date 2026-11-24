// Vercel Routing Middleware: password-protects the whole site (page, scripts,
// card images) with HTTP Basic Auth. Any username works; the password comes
// from the SITE_PASSWORD environment variable in the Vercel project, so it
// never lands in this (public) repository. Without the variable the site
// stays locked.
import { next } from '@vercel/functions';

export const config = {
  matcher: '/:path*',
};

const REALM = 'Cabo';

function unauthorized(message: string, status = 401): Response {
  return new Response(message, {
    status,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

/** Compare without leaking the match length through timing. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export default function middleware(request: Request): Response {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) return unauthorized('Site is locked (no password configured).', 503);

  const header = request.headers.get('authorization') ?? '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (safeEqual(password, expected)) return next();
    } catch {
      // malformed header: fall through to 401
    }
  }
  return unauthorized('Password required.');
}
