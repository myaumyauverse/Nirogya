import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SOCIALS } from '@/constants'

const Footer = () => {
  return (
    <footer className="bg-primary-500 py-16">
      <div className="max-container padding-container">
        <div className="text-left mb-12">
          {/* Logo and Description */}
          <Link href="/" className="mb-6 inline-block">
            <Image src="/hilink-logo.svg" alt="Waterborne Disease Awareness" width={170} height={90} />
          </Link>
          <p className="regular-16 text-primary-100 mb-8 max-w-2xl leading-relaxed">
            Dedicated to raising awareness about waterborne diseases and promoting
            clean water access for communities in Northeast India. Together, we can prevent
            waterborne illnesses and save lives.
          </p>
          <div className="flex gap-4 mb-8">
            {SOCIALS.links.map((link, index) => (
              <Link key={index} href="/" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                <Image src={link} alt="Social media" width={20} height={20} className="filter brightness-0 invert" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="regular-14 text-primary-200">
              © 2025 Nirogya - Northeast India. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="regular-14 text-primary-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
