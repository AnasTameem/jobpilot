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
        '.glass-effect': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(20px)',
        },
        '.nebula-bg': {
          'background': 'linear-gradient(135deg, #131b2e 0%, #25005a 100%)',
        },
        '.nav-link-disabled': {
          'pointer-events': 'none',
          'opacity': '0.3',
          'cursor': 'not-allowed',
        },
        '.resume-upload-zone': {
          'background-color': '#ffffff',
          'border': '2px dashed #c6c6cd',
          'border-radius': '1.8rem',
          'padding': '3rem',
          'display': 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center',
          'min-height': '400px',
          'transition': 'all 0.3s',
          'text-align': 'center',
          '&:hover': {
            'background-color': '#eceef0',
          },
        },
        '.onboarding-form-input': {
          'width': '100%',
          'padding': '1rem 1.25rem',
          'background-color': '#eceef0',
          'border': 'none',
          'border-radius': '0.75rem',
          'transition': 'all 0.2s',
          'color': '#191c1e',
          '&:focus': {
            'box-shadow': '0 0 0 2px rgba(152, 99, 255, 0.2)',
            'outline': 'none',
          },
        },
        '.analysis-trigger-btn': {
          'width': '100%',
          'padding': '1.25rem',
          'background-color': '#000000',
          'color': '#ffffff',
          'border-radius': '0.75rem',
          'font-weight': '700',
          'font-size': '1.125rem',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'gap': '0.5rem',
          'transition': 'transform 0.1s',
          '&:active': {
            'transform': 'scale(0.98)',
          },
        },
      })
    }
  ]
}
