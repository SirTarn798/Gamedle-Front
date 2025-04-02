'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the Champion interface
interface Champion {
  id: number;
  name: string;
  title: string;
  release_date: string;
  resource_type: string;
  gender: string;
  region: string;
  icon_url: string;
}

// Define the pagination metadata structure
interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

// Define the API response structure for champions
interface ApiResponse {
  data: Champion[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
}

export default function ChampionsPage() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchChampions = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/champions?page=${page}`);

      if (!response.ok) {
        throw new Error('Failed to fetch champions');
      }

      const result: ApiResponse = await response.json();

      setChampions(result.data);
      setPagination(result.meta);
      setCurrentPage(result.meta.current_page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setChampions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchChampions();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      fetchChampions(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between items-center'>
        <h1 className="text-4xl mb-6">Champion List</h1>
        <div className='flex gap-5'>
          <Link href="/search/champions">
            <button
              className="bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-blue-500"
            >
              Search
            </button>
          </Link>
          <Link href="/upload/champion">
            <button
              className="bg-green-300 hover:bg-green-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-green-500"
            >
              Upload File
            </button>
          </Link>
          <Link href="/upload/champion/picture">
            <button
              className="bg-green-300 hover:bg-green-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-green-500"
            >
              Upload Image
            </button>
          </Link>
          <Link href="/upload/champion/icon">
            <button
              className="bg-green-300 hover:bg-green-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-green-500"
            >
              Upload Icon
            </button>
          </Link>
          <Link href="/admin">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-gray-500"
            >
              Back
            </button>
          </Link>
        </div>
      </div>

      {loading && <div className="text-center py-4">Loading champions...</div>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && champions.length === 0 && (
        <div className="text-center py-4">No champions found.</div>
      )}

      {champions.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {champions.map((champion) => (
                <tr key={champion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {champion.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full object-cover mr-2"
                        src={champion.icon_url}
                        alt={`${champion.name} Icon`}
                      />
                      <div className="font-medium text-gray-900">{champion.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {champion.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium flex center">
                    <Link href={`/admin/champions/${champion.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                      View
                    </Link>
                    {/* You can add more actions here, like edit or delete */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pagination.from}</span> to{' '}
                    <span className="font-medium">{pagination.to}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Previous button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white font-medium ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      &laquo; Previous
                    </button>

                    {/* Page numbers */}
                    {pagination.links
                      .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                      .map((link, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(parseInt(link.label))}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white font-medium ${
                            link.active
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {link.label}
                        </button>
                      ))}

                    {/* Next button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white font-medium ${
                        currentPage === pagination.last_page
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      Next &raquo;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}