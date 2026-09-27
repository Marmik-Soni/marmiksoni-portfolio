import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from "@/components/Hero/Hero";
import { Editorial } from "@/components/Editorial/Editorial";
import { Services } from "@/components/Services/Services";

export default function Home() {
  return (
    <div className="page">
      <Navbar />
      <Hero />
      <Editorial />
      <Services />
    </div>
  );
}
