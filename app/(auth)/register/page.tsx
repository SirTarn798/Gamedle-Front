'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState('');
    const router = useRouter();

    const urlUsersAPI = "http://localhost/api/users"
    const handleSubmit = async (event) => {
        event.preventDefault();
        setRegistrationError('');
        setRegistrationSuccess('');

        if (password !== confirmPassword) {
            setRegistrationError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(urlUsersAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setRegistrationSuccess('Registration successful!');

                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setRegistrationError(data.message || 'Registration failed. Please try again.');
                console.error('Registration error:', data);
            }
        } catch (error) {
            setRegistrationError('An unexpected error occurred. Please try again later.');
            console.error('Registration fetch error:', error);
        }
    };

    return (
        <div className="relative z-10 w-full flex flex-col items-center">
            <h1 className="text-white text-shadow-md text-8xl">REGISTER</h1>

            <form onSubmit={handleSubmit} className="w-4/12 bg-mainTheme bg-opacity-50 p-6 rounded-lg text-white">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                    <h1 className="text-xl">Username</h1>
                    <input
                        type="text"
                        className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <h1 className="text-xl">Email</h1>
                    <input
                        type="email"
                        className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <h1 className="text-xl">Password</h1>
                    <input
                        type="password"
                        className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <h1 className="text-xl">Re-enter Password</h1>
                    <input
                        type="password"
                        className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    <button
                        type="submit"
                        className="border-2 border-white hover:bg-acceptGreen hover:border-0 hover:text-black text-white px-8 py-2 rounded-md transition-colors duration-200 font-medium"
                    >
                        Sign Up
                    </button>
                </div>
                <div className='flex-row justify-center text-center'>
                  {registrationError && <p className="mt-4 text-red-500">{registrationError}</p>}
                  {registrationSuccess && <p className="mt-4 text-green-500 text-2xl">{registrationSuccess}</p>}
                </div>
            </form>
        </div>
    );
}

export default Register;