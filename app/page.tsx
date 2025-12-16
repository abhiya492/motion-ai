import BgGradient from "@/components/common/bg-gradient";
import Banner from "@/components/home/banner";
import HowItWorks from "@/components/home/howitworks";
import Pricing from "@/components/home/pricing";
import { Dot } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto w-full inset-0 h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]">
      <BgGradient />
      <Banner />
      <div className="flex items-center justify-center">
        <Dot className="text-purple-500"></Dot>
        <Dot className="text-purple-500"></Dot>
        <Dot className="text-purple-500"></Dot>
      </div>
      <HowItWorks />
      <div className="flex items-center justify-center">
        <Dot className="text-purple-500"></Dot>
        <Dot className="text-purple-500"></Dot>
        <Dot className="text-purple-500"></Dot>
      </div>

      <Pricing />

      <div className="flex items-center justify-center">
        <Dot className="text-purple-500"></Dot>
        <Dot className="text-purple-500"></Dot>
        <Dot className="text-purple-500"></Dot>
      </div>

      <footer className="bg-gray-300/20 dark:bg-gray-700/20 flex h-20 py-24 px-12 z-20 relative overflow-hidden flex-col gap-2">
        <p className="text-gray-900 dark:text-gray-100">All Rights Reserved, {new Date().getFullYear()}</p>
        <a href="https://x.com/ABHISHE96010387" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400">
          Built by Abhishek 🚀
        </a>
      </footer>
    </main>
  );
}
