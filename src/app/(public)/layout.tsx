import { Navbar } from "@/components/layout/navbar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div>
    <Navbar />
      {children}
    </div>
  );
}