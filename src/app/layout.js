import './globals.css'

export const metadata = {
  title: '📚 Tienda de Libros - Tu Librería Online',
  description: 'Descubre tu próxima gran lectura. Miles de libros disponibles con envío rápido.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          button {
            font-family: inherit;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
