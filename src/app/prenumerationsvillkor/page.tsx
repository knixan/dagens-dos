import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-card p-6 rounded-xl shadow border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Prenumerationsvillkor</h1>

            <p className="text-muted-foreground mb-4">Tack för att du väljer att låta oss debitera dig varje månad för en tjänst som mestadels består av korta, träffsäkra rubriker och en obefintlig känsla av ansvar. Här är några punkter du borde läsa, eller inte — det är upp till dig.</p>

            <ol className="list-decimal pl-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <strong>Betalning:</strong> Du godkänner att vi drar pengar från ditt konto. Vi föredrar att kalla det &quot;stöd till journalistik&quot;, du kan kalla det vad du vill. Ingen återbetalning för åsikter som uppstår efter köp.
              </li>
              <li>
                <strong>Uppsägning:</strong> Du kan avsluta prenumerationen när som helst. Vi tar det inte personligt — kanske bara lite. Avsluta via kontosidan och njut av friheten.
              </li>
              <li>
                <strong>Innehåll:</strong> Vi lovar inga Nobelpris i rapportering. Innehållet levereras &quot;som det är&quot; och kan innehålla satir, ironi och dåliga skämt.
              </li>
              <li>
                <strong>Ansvarsbegränsning:</strong> Vi ansvarar inte för eventuella plötsliga insikter, förlorad tid eller obekväma sanningar som kan uppstå av att läsa våra artiklar.
              </li>
              <li>
                <strong>Personuppgifter:</strong> Vi samlar bara in den information vi behöver för att skicka räkningar och nyhetsbrev till dig. Vi lovar att inte sälja din e-post till rymdvarelser (utan uttryckligt tillstånd).
              </li>
            </ol>

            <p className="text-muted-foreground mt-4">Genom att fortsätta så bekräftar du att du läst (åtminstone rubrikerna av) dessa villkor och accepterar dem. Välkommen till klubben — vi har kaffe (ibland).</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
