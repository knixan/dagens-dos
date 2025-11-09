import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client"


export const authClient = createAuthClient({

  plugins: [stripeClient({
    subscription: true //if you want to enable subscription management
  })]
});

// Re-export common helpers that UI code may import directly
export const { signIn, signUp, useSession } = authClient;

export default authClient;
