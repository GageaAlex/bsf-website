import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function EditorialsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
