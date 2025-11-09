import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-card p-6 rounded-xl shadow border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Integritet & Cookies</h1>

            <p className="text-muted-foreground mb-4">Vi tar integritet på stort allvar. Eller åtminstone tillräckligt för att skriva en trevlig text som får oss att låta hederliga. Här är vad vi gör med dina data — kortversionen:</p>

            <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <strong>Cookies:</strong> Vi använder cookies för att göra sajten användbar, minnas dina inställningar och ibland för att kunna gissa vilken artikel du vill klicka på härnäst.
              </li>
              <li>
                <strong>Spårning:</strong> Ja, vi räknar besök. Inte för att vara läskiga, utan för att veta om någon faktiskt läser våra sarkastiska rubriker.
              </li>
              <li>
                <strong>Delning:</strong> Vi delar inte din e-post med företag som skickar märkliga erbjudanden (utan att fråga). Med andra ord: vi är snälla — oftast.
              </li>
              <li>
                <strong>Rättigheter:</strong> Du kan begära att vi tar bort dina data. Du kan också välja att ignorera detta och fortsätta scrolla. Valet är ditt.
              </li>
            </ul>

            <p className="text-muted-foreground mt-4">Lång version? Vi har en längre version också, men den kräver kaffe och en jurist. För nu får denna text duga. Tack för att du läser (eller skummar)!</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
