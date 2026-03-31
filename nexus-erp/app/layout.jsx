import "./globals.css";

export const metadata = {
  title: "Nexus ERP",
  description: "Sistema de gestão para pequenas empresas — estoque, vendas, financeiro e muito mais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
