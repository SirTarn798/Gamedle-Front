'use client';
import Link from 'next/link';
import router from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    img: string;
    role: string;
}

export default function User({ params }: { params: { userId: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const userId = React.use(params).userId;
    
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/${userId}`, { // Use relative URL and GET
                    method: 'GET',
                    headers: {
                        Accept: 'application/json', // Corrected Accept header
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }

                const result = await response.json();
                setUser(result.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [React.use(params).userId]); // Fetch when params.userId changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    const handleDelete = (id) => {
      const response = fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
    };

    return (
      <div className="container mx-auto px-4 py-8">

      {loading && <div className="text-center py-4">Loading user details...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      {user && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl leading-6 font-medium text-gray-900">User Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account information.</p>
            </div>
            <div className='flex gap-5'>
            {user.role != "ADMIN" ?
                        <Link href="/admin/users">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-red-800"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </Link> 
                      : 
                      null
            }

            {/* <Link href="">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-blue-800"
                onClick={()=>{return}}
              >
                Edit
              </button>
            </Link> */}
            <Link href="/admin/users">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-gray-500"
              >
                Back
              </button>
            </Link>
          </div>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <h2 className="text-4xl text-gray-900">{user.name}</h2>
            </div>
            
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className=" font-medium text-gray-500">User ID</dt>
                <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.id}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className=" font-medium text-gray-500">Role</dt>
                <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.role}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className=" font-medium text-gray-500">Email address</dt>
                <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className=" font-medium text-gray-500">Email verified</dt>
                <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email_verified_at ? (
                    <span className="text-green-600">
                      Verified on {new Date(user.email_verified_at).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-red-600">Not verified</span>
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className=" font-medium text-gray-500">Account created</dt>
                <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(user.created_at).toLocaleString()}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className=" font-medium text-gray-500">Last updated</dt>
                <dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(user.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
    );
}