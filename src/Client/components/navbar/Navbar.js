import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const totalItems = useSelector((state) => state.cart.totalItems);
  const auth = useSelector((state) => state.auth.auth);
  const isAdmin = useSelector((state) => state.auth.admin);

  const navigation = [
    { name: 'Home', link: '/', current: true },
    { name: 'Products', link: '/products', current: false },
  ];

  return (
    <Disclosure
      as="nav"
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 transition">
              {({ open }) =>
                open ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )
              }
            </DisclosureButton>
          </div>

          {/* Logo + Nav Links */}
          <div className="flex items-center gap-10">
            <Link to="/">
              <img
                src="/LOGOPRO.png"
                alt="UrbanEdge Logo"
                className="h-8 sm:h-11 w-auto object-contain"
              />
            </Link>

            <nav className="hidden sm:flex gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className={cn(
                    item.current
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-600 hover:text-yellow-500',
                    'transition duration-200 relative group text-sm uppercase tracking-wide'
                  )}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-yellow-500 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-4">
            {auth && (
              <Link to="/cart" className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-yellow-500 transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {!auth ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-yellow-500 text-white px-3 py-1.5 rounded-md shadow hover:bg-yellow-600 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-500 transition"
                >
                  Orders
                </Link>

                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center rounded-full ring-2 ring-yellow-500 p-1 hover:ring-gray-400 transition">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt="profile"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={cn(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={cn(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Dashboard
                          </Link>
                        )}
                      </MenuItem>
                    )}
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/sign-out"
                          className={cn(
                            active ? 'bg-red-50 text-red-600' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Sign out
                        </Link>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Panel */}
      <DisclosurePanel className="sm:hidden bg-white text-gray-700">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.link}
              className={cn(
                item.current
                  ? 'bg-gray-100 text-yellow-500'
                  : 'hover:bg-gray-50 hover:text-yellow-500',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
