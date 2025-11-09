"use client";

import Link from "next/link";
import ThemeLogo from "@/components/layout/ThemeLogo";
import React from "react";

type FooterVariant = "primary" | "secondary" | "muted";

interface FooterSectionProps {
  title: string;
  links: { name: string; href: string }[];
  variant?: FooterVariant;
}

function FooterSection({
  title,
  links,
}: FooterSectionProps): React.ReactElement {
  const titleClass = `text-lg font-semibold mb-4 text-primary-foreground`;
  return (
    <div>
      <h4 className={titleClass}>{title}</h4>
      <ul className="space-y-2 text-sm text-primary-foreground">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-primary-foreground hover:text-primary"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const footerSections: {
  title: string;
  variant?: FooterVariant;
  links: { name: string; href: string }[];
}[] = [
  {
    title: "Sidor",
    variant: "primary" as FooterVariant,
    links: [
      { name: "Hem", href: "#" },
      { name: "Prenumerera", href: "/prenumeration" },
      { name: "Om Projectet", href: "/projectet" },
    ],
  },
  {
    title: "Juridiskt",
    variant: "muted" as FooterVariant,
    links: [
      { name: "Prenumerationsvillkor", href: "/prenumerationsvillkor" },
      { name: "Integritet & Cookies", href: "/integritet-cookies" },
      { name: "Kontakta Oss", href: "/kontakta-oss" },
    ],
  },
];

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-secondary text-primary-foreground mt-12 py-10 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-primary-foreground">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logga längst till vänster */}
          <div className="flex items-start">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-24 w-24">
                <ThemeLogo alt="Dagens Dos" width={96} height={96} />
              </div>
            </Link>
          </div>

          {/* Om Oss */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 text-primary-foreground`}
            >
              Dagens Dos
            </h4>
            <p className="text-sm text-primary-foreground">
              Vår mission är att leverera nyheter så att du kan känna dig
              minimalt informerad.
            </p>
          </div>

          {/* Dynamiska sektioner */}
          {footerSections.map((section) => (
            <FooterSection
              key={section.title}
              title={section.title}
              links={section.links}
              variant={section.variant}
            />
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-accent/30 text-center">
          <p className="text-sm text-primary-foreground">
            &copy; 2025 Dagens Dos. Alla rättigheter reserverade. Utvecklat av
            Josefine, Johan, Ahamed och Magui och en stor dos sarkasm.
          </p>
        </div>
      </div>
    </footer>
  );
}
