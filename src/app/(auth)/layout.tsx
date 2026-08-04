export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#004e92] to-[#000428] relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
