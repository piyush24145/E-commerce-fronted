// src/components/Sellers.js

import { motion } from 'framer-motion'
import {
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import {
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa'

const people = [
  {
    name: 'Leslie Alexander',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    twitter: '#',
    linkedin: '#',
  },
  {
    name: 'Michael Foster',
    role: 'Head of Operations',
    imageUrl:
      'https://images.unsplash.com/photo-1603415526960-f7e0328f5994?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    twitter: '#',
    linkedin: '#',
  },
  {
    name: 'Whitney Francis',
    role: 'VP, Marketing',
    imageUrl:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    twitter: '#',
    linkedin: '#',
  },
  {
    name: 'Tom Cook',
    role: 'CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1502767089025-6572583495b4?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    twitter: '#',
    linkedin: '#',
  },
]

export default function Sellers() {
  return (
    <section className="relative isolate bg-gray-50 dark:bg-slate-900 py-24 sm:py-32">
      {/* pattern bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Meet our Leadership
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            We’re a dynamic group of individuals passionate about what we do and dedicated to delivering results.
          </p>
        </div>

        <ul
          role="list"
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {people.map((person, idx) => (
            <motion.li
              key={person.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group rounded-3xl p-6 transition-all hover:-translate-y-2 hover:brightness-110"
            >
              {/* gradient glow */}
              <div className="absolute inset-0 -z-10 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-400 before:to-pink-500 before:blur-xl before:opacity-40" />

              {/* glass card */}
              <div className="relative z-10 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg shadow-lg p-6 text-center overflow-hidden">
                {/* shine on hover */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute -left-full top-0 h-full w-1/3 skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[250%]" />
                </div>

                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover shadow-md"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {person.name}
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">{person.role}</p>

                {/* Social links */}
                <div className="mt-4 flex justify-center gap-4 text-indigo-500 dark:text-indigo-400">
                  <a href={person.twitter} target="_blank" rel="noreferrer" className="hover:text-indigo-700">
                    <FaTwitter className="h-5 w-5" />
                  </a>
                  <a href={person.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-700">
                    <FaLinkedinIn className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}