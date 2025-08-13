import './globals.css'

export const metadata = {
  title: 'Blocktionary - Learn Blockchain Terms',
  description: 'Master blockchain terminology through interactive learning',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
