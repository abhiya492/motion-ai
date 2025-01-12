import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";


export default function Banner() {
    return (
      <section className="lg:max-w-6xl mx-auto flex flex-col z-0 items-center justify-center py-28 sm:pt-32 transition-all animate-in">
        <h1 className="py-6 text-center text-5xl font-extrabold text-gray-900">
          Turn your words into{" "}
          <span className="underline underline-offset-8 decoration-dashed decoration-purple-200">
            captivating
          </span>{" "}
          blog posts
        </h1>
        <h2 className="text-center text-2xl font-semibold text-gray-700 px-4 lg:px-0 lg:max-w-4xl">
          Convert your video or voice into a Blog Post in seconds with the power
          of AI!
        </h2>
  
        <Button
          variant={"link"}
          className="mt-6 text-xl rounded-full px-12 py-8 lg:mt-20 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg hover:no-underline transform transition duration-300 ease-in-out hover:scale-105"
        >
          <Link href="/#pricing" className="flex gap-2 items-center">
            <span className="relative">Get SpeakEasy </span>
            <ArrowRight className="animate-pulse" />
          </Link>
        </Button>
      </section>
    );
  }
