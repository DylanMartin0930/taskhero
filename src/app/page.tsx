"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);
  return (
    <>
      <span className="font-bold text-4xl">Home</span>
    </>
  );
}
