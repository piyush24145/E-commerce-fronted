// src/components/Stats.js
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    id: 1,
    name: 'Transactions every 24 h',
    value: 44_000_000,
    suffix: '',
    icon: BanknotesIcon,
    colorFrom: 'from-emerald-400',
    colorTo: 'to-emerald-600',
  },
  {
    id: 2,
    name: 'Assets under holding',
    value: 119,
    suffix: ' T',
    icon: BuildingLibraryIcon,
    colorFrom: 'from-indigo-400',
    colorTo: 'to-indigo-600',
  },
  {
    id: 3,
    name: 'New users annually',
    value: 46_000,
    suffix: '',
    icon: UserGroupIcon,
    colorFrom: 'from-pink-400',
    colorTo: 'to-pink-600',
  },
];

export default function Stats() {
  // fire count-up once the grid scrolls into view
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative isolate bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-24 sm:py-32"
    >
      {/* subtle pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3 text-center">
          {stats.map(
            ({ id, name, value, suffix, icon: Icon, colorFrom, colorTo }) => (
              <div
                key={id}
                className="relative mx-auto flex max-w-xs flex-col items-center gap-y-4 p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-[0_0_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-transform hover:-translate-y-1"
              >
                {/* diamond glow behind number */}
                <span
                  className={`pointer-events-none absolute inset-0 -z-10 before:absolute before:inset-4 before:rounded-[20%] before:bg-gradient-to-br ${colorFrom} ${colorTo} before:rotate-45 before:blur-xl before:opacity-30`}
                />
                <Icon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
                <dd className="order-first text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  {inView ? (
                    <CountUp end={value} duration={2} separator="," />
                  ) : (
                    0
                  )}
                  {suffix}
                </dd>
                <dt className="text-base leading-7 text-gray-600 dark:text-gray-300">
                  {name}
                </dt>
              </div>
            )
          )}
        </dl>
      </div>
    </section>
  );
}