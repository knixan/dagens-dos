'use server';

import { cookies } from 'next/headers';

export async function setConsentCookie(value: 'accepted' | 'declined') {
    const cookieStore = await cookies()
    cookieStore.set({
        name: 'CookieConsent',
        value,
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });
}