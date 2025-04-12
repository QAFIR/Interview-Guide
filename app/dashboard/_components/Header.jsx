"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="relative flex items-center justify-center p-8 bg-secondary shadow-sm">
      {/* Left: Logo & title */}
      <div className="absolute left-4 flex items-center gap-2">
        <Link className="hidden md:block cursor-pointer" href="/">
          <Image src="/logo.svg" width={60} height={60} alt="logo" />
        </Link>
        <Link className="hidden md:block cursor-pointer" href="/">
          <h1 className="text-3xl font-extrabold text-red-600 tracking-tight">
            Interview Prep
          </h1>
        </Link>
      </div>

      {/* Center: Navigation */}
      <ul className="flex gap-6">
        <Link href="/dashboard">
          <li
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/dashboard" && "text-primary font-bold"
            }`}
          >
            Dashboard
          </li>
        </Link>
        <Link href="/dashboard/howit">
          <li
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/dashboard/howit" && "text-primary font-bold"
            }`}
          >
            How it Works?
          </li>
        </Link>
      </ul>

      {/* Right: UserButton */}
      <div className="absolute right-4">
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
