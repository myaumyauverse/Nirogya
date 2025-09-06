'use client'

import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from 'framer-motion'
import Button from "./Button"
import LanguageToggle from "./LanguageToggle"
import { useLanguage } from "@/contexts/LanguageContext"

const Navbar = () => {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/doctor/dashboard')
  const { t } = useLanguage()

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-md border-b-2 border-primary-200 flexBetween max-container padding-container relative z-30 py-5 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
        <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/hilink-logo.svg" alt="logo" width={170} height={90}></Image>
        </Link>

        <ul className="hidden h-full gap-12 lg:flex">
            {NAV_LINKS.map((link, index)=> (
                <motion.li
                  key={link.key}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                      onClick={(e) => {
                        e.preventDefault()

                        // If we're not on the home page, navigate to home page first
                        if (pathname !== '/') {
                          window.location.href = `/${link.href}`
                        } else {
                          // If we're on home page, just scroll to the section
                          const element = document.querySelector(link.href)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' })
                          }
                        }
                      }}
                    >
                      {t(`nav.${link.key}`)}
                    </a>
                  ) : (
                    <Link href={link.href} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
                      {t(`nav.${link.key}`)}
                    </Link>
                  )}
                </motion.li>
            ))}
        </ul>

        <div className="lg:flexCenter hidden gap-4">
          <LanguageToggle />
          {isDashboard ? (
            <Link href="/doctor/login">
              <Button
                type="button"
                title={t('nav.logout')}
                variant="btn_primary"
              />
            </Link>
          ) : (
            <Link href="/doctor/login">
              <Button
                type="button"
                title={t('nav.doctorLogin')}
                variant="btn_primary"
              />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageToggle />
          <Image src="menu.svg" alt="menu" width={32} height={32} className="inline-block cursor-pointer hover:opacity-70 transition-opacity" />
        </div>
    </motion.nav>
  )
}

export default Navbar
