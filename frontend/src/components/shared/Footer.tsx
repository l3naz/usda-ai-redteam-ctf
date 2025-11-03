import usdaLogo from "figma:asset/fe46ba86f87cfc9f9ab97c58bcc60686524f146d.png";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-16 transition-colors duration-200" style={{ borderColor: 'rgba(46, 133, 64, 0.2)' }} role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* USDA Branding */}
          <div className="flex items-center gap-3">
            <img 
              src={usdaLogo} 
              alt="USDA – United States Department of Agriculture"
              className="transition-opacity duration-200 hover:opacity-90"
              style={{ 
                width: '45px', 
                height: 'auto',
                objectFit: 'contain'
              }}
            />
            <div>
              <p className="text-sm transition-colors duration-200 text-foreground" style={{ 
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem'
              }}>
                U.S. Department of Agriculture | AI Center of Excellence
              </p>
              <p className="text-xs text-muted-foreground transition-colors duration-200">
                Advanced Cybersecurity Training Platform
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground" aria-label="Footer navigation">
            <a 
              href="#" 
              className="transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1 hover:text-success dark:hover:text-teal"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1 hover:text-success dark:hover:text-teal"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              aria-label="Terms of Service"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1 hover:text-success dark:hover:text-teal"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              aria-label="Section 508 Accessibility Statement"
            >
              Accessibility
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1 hover:text-success dark:hover:text-teal"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              aria-label="Contact Support"
            >
              Contact Support
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-6 text-center text-xs text-muted-foreground transition-colors duration-200" style={{ borderTop: '1px solid rgba(46, 133, 64, 0.2)' }}>
          <p style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
            © 2025 United States Department of Agriculture. All rights reserved.
          </p>
          <p className="mt-1" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
            For official use only. This training platform is compliant with federal security standards and WCAG 2.1 AA accessibility guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
