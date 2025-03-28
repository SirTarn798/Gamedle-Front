'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Admin
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        <Link href="/admin/users" className="block">
          <div className="h-44 w-full bg-gray-100 rounded-xl flex flex-col justify-center items-center shadow duration-300 hover:bg-white hover:shadow-xl">
            <img src="/user2.png" className="h-[50px]" alt="Users Icon" />
            <span className="mt-6 leading-5 text-center">
              Users
            </span>
          </div>
        </Link>

        <Link href="/admin/pokemons" className="block">
          <div className="h-44 w-full bg-gray-100 rounded-xl flex flex-col justify-center items-center shadow duration-300 hover:bg-white hover:shadow-xl">
            <img src="/pokeball.png" className="h-[50px]" alt="Pokeball Icon" />
            <span className="mt-6 leading-5 text-center">
              Pokemon
            </span>
          </div>
        </Link>

        <Link href="/admin/champions" className="block">
          <div className="h-44 w-full bg-gray-100 rounded-xl flex flex-col justify-center items-center shadow duration-300 hover:bg-white hover:shadow-xl">
            <img src="/poro.png" className="h-[50px]" alt="Pokeball Icon" />
            <span className="mt-6 leading-5 text-center">
              Champions
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}