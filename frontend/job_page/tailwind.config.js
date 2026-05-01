tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "on-tertiary-fixed": "#25005a",
              "outline": "#76777d",
              "surface-dim": "#d8dadc",
              "secondary-fixed-dim": "#b9c7e0",
              "on-secondary-container": "#57657b",
              "error": "#ba1a1a",
              "error-container": "#ffdad6",
              "on-surface": "#191c1e",
              "tertiary-fixed-dim": "#d2bbff",
              "secondary-container": "#d5e3fd",
              "on-background": "#191c1e",
              "primary-fixed-dim": "#bec6e0",
              "on-error": "#ffffff",
              "primary-fixed": "#dae2fd",
              "inverse-surface": "#2d3133",
              "surface-bright": "#f7f9fb",
              "on-tertiary-container": "#9863ff",
              "on-error-container": "#93000a",
              "on-primary-container": "#7c839b",
              "background": "#f7f9fb",
              "on-secondary-fixed-variant": "#3a485c",
              "tertiary-fixed": "#eaddff",
              "on-surface-variant": "#45464d",
              "primary": "#000000",
              "on-secondary": "#ffffff",
              "on-tertiary": "#ffffff",
              "on-primary": "#ffffff",
              "on-secondary-fixed": "#0d1c2f",
              "inverse-primary": "#bec6e0",
              "secondary-fixed": "#d5e3fd",
              "primary-container": "#131b2e",
              "surface-tint": "#565e74",
              "tertiary-container": "#25005a",
              "surface-variant": "#e0e3e5",
              "tertiary": "#000000",
              "surface-container-highest": "#e0e3e5",
              "surface": "#f7f9fb",
              "on-primary-fixed-variant": "#3f465c",
              "outline-variant": "#c6c6cd",
              "surface-container": "#eceef0",
              "surface-container-low": "#f2f4f6",
              "on-tertiary-fixed-variant": "#5a00c6",
              "secondary": "#515f74",
              "on-primary-fixed": "#131b2e",
              "inverse-on-surface": "#eff1f3",
              "surface-container-high": "#e6e8ea",
              "surface-container-lowest": "#ffffff"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "fontFamily": {
              "headline": ["Manrope"],
              "body": ["Inter"],
              "label": ["Inter"]
      }
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.material-symbols-outlined': {
          'font-variation-settings': "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        },
        '.glass-card': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(20px)',
        },
        '.recommended-job-card': {
          'position': 'relative',
          'display': 'flex',
          'align-items': 'flex-start',
          'gap': '1.5rem',
          'padding': '2rem',
          'background-color': '#ffffff',
          'border-radius': '0.75rem',
          'transition': 'all 0.3s',
          '&:hover': {
            'transform': 'scale(1.01)',
          },
        },
        '.company-branding-logo': {
          'width': '4rem',
          'height': '4rem',
          'border-radius': '0.75rem',
          'background-color': '#eceef0',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'flex-shrink': 0,
        },
        '.job-application-btn': {
          'background-color': '#000000',
          'color': '#ffffff',
          'padding': '0.625rem 2rem',
          'border-radius': '9999px',
          'font-weight': '700',
          'font-size': '0.875rem',
          'transition': 'transform 0.2s',
          '&:hover': {
            'transform': 'translateY(-2px)',
          },
          '&:active': {
            'transform': 'translateY(0)',
          },
        },
        '.ai-match-velocity-pill': {
          'padding': '0.25rem 0.75rem',
          'background-color': '#d2bbff',
          'color': '#25005a',
          'border-radius': '9999px',
          'display': 'flex',
          'align-items': 'center',
          'gap': '0.375rem',
          'font-size': '0.75rem',
          'font-weight': '700',
        },
      })
    }
  ]
}
