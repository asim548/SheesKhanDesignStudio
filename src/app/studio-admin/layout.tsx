export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen bg-ivory text-base text-espresso">
      {children}
    </div>
  );
}
