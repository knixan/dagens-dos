'use client';
import Link from 'next/link';
import React from 'react';

type Variant = 'nav' | 'login' | 'primary';

const variantClasses: Record<Variant, string> = {
  nav: 'whitespace-nowrap text-base font-medium transition duration-150 ease-in-out text-muted-foreground hover:text-primary',
  login: 'whitespace-nowrap text-base font-medium transition duration-150 ease-in-out text-foreground hover:text-primary mr-4',
  primary: 'whitespace-nowrap text-base font-medium transition duration-150 ease-in-out inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90',
};

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
}

export default function LinkButton({ href, children, variant = 'nav', className = '', ...rest }: LinkButtonProps): React.ReactElement {
  const classes = `${variantClasses[variant]} ${className}`.trim();
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}