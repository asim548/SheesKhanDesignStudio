"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string | false;
  animated?: boolean;
}

/** Trimmed logo aspect ~ 736×488 */
const sizes = {
  sm: { width: 110, height: 73 },
  md: { width: 168, height: 111 },
  lg: { width: 240, height: 159 },
  xl: { width: 320, height: 212 },
};

export default function Logo({
  className = "",
  size = "md",
  href = "/",
  animated = true,
}: LogoProps) {
  const dim = sizes[size];

  const img = (
    <Image
      src="/logo-trim.png"
      alt="Shees Khan"
      width={dim.width}
      height={dim.height}
      className="h-auto w-auto max-w-full object-contain"
      priority
    />
  );

  const inner = animated ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {img}
      </motion.div>
    </motion.div>
  ) : (
    <span className="transition-opacity duration-luxury group-hover:opacity-80">
      {img}
    </span>
  );

  if (href === false) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center ${className}`}
      aria-label="Shees Khan Design Studio — Home"
    >
      {inner}
    </Link>
  );
}
