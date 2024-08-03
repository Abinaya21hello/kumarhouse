import React, { useState, useEffect } from 'react';

import CountdownTimer from './CountdownTimer'; // Import the CountdownTimer component
import { client } from '../../clientaxios/Client'; // Assuming client is configured for Axios requests
import axiosInstance from '../../api/axiosInstance';

const OffersPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [expireDates, setExpireDates] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in (e.g., by checking token in localStorage)
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
            fetchOffers(token);
        } else {
            setIsLoggedIn(false);
            setExpireDates([]);
        }
    }, []);

    const fetchOffers = async (token) => {
        try {
            const response = await axiosInstance.get('api/getoffer', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const dates = response.data.map(offer => new Date(offer.expireDate));
            setExpireDates(dates);
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError(err.message);
        }
    };

    // Example function to handle login
    const handleLogin = async () => {
        try {
            // Perform login API call (replace with your actual login logic)
            const response = await axiosInstance.post('api/login', {
                username: 'your_username',
                password: 'your_password'
            });
            
            // Assuming login is successful and token is received
            const token = response.data.token;

            // Store token in localStorage
            localStorage.setItem('accessToken', token);

            // Update isLoggedIn state
            setIsLoggedIn(true);

            // Fetch offers using the obtained token
            fetchOffers(token);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    // If not logged in, render the login button
    if (!isLoggedIn) {
        return (
            <div>
                <button onClick={handleLogin}>Log In</button>
                <p>Please log in to view offers.</p>
            </div>
        );
    }

    // If there's an error fetching offers, display the error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render the list of expire dates
    return (
        <div>
            {expireDates.length > 0 ? (
                expireDates.map((date, index) => (
                    <div key={index} className="offer">
                        <CountdownTimer targetDate={date} />
                        <h1>welochdgfhg</h1>
                    </div>
                ))
            ) : (
                <div>No offers available.</div>
            )}
        </div>
    );
};

export default OffersPage;
