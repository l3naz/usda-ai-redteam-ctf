import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-16 transition-colors duration-200" style={{ borderColor: 'rgba(46, 133, 64, 0.2)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* USDA Branding */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 transition-colors duration-200 shadow-sm" style={{ backgroundColor: '#2E8540' }}>
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm transition-colors duration-200" style={{ 
                color: 'var(--foreground)', 
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
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a 
              href="#" 
              className="transition-colors duration-200"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2E8540';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2E8540';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2E8540';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              Accessibility
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2E8540';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              Contact Support
            </a>
          </div>
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
