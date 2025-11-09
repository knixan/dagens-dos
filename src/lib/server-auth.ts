import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

//säkerställ att användaren är admin, annars omdirigera till inloggningssidan
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user || session.user.role !== 'admin') {
    // skickas till inloggningssidan om inte admin
    redirect('/logga-in');
  }

  return session;
}
export async function requireAdminOrEditor() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    redirect("/logga-in");
  }

  const role = session.user.role;

  // Allow both admin and editor
  if (role !== "admin" && role !== "editor") {
    redirect("/logga-in");
  }

  return session;
}

// Få nuvarande session utan att kräva inloggning
export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}
// Säkerställ att användaren är inloggad, annars omdirigera till inloggningssidan
export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/logga-in');
  }
  return session;
}
