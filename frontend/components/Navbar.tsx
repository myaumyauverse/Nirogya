'use client'

import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-md border-b-2 border-primary-200 flexBetween max-container padding-container relative z-30 py-5 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
        <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="hilink-logo.svg" alt="logo" width={150} height={80}></Image>
        </Link>

        <ul className="hidden h-full gap-12 lg:flex">
            {NAV_LINKS.map((link, index)=> (
                <motion.li
                  key={link.key}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <Link href={link.href} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
                      {link.label}
                  </Link>
                </motion.li>
            ))}
        </ul>

        <Image src="menu.svg" alt="menu" width={32} height={32} className="inline-block cursor-pointer lg:hidden hover:opacity-70 transition-opacity">

        </Image>

    </motion.nav>
  )
}

export default Navbar
