import React, { useEffect, useState } from 'react';

function UserHome() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:4000/getUserData', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });

                const data = await response.json();

                if (response.ok) {
                    setUserData(data.user);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h2>User Home Page</h2>
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    <p>Password: {userData.password}</p>
                    <p>Organization ID: {userData.organization_id}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default UserHome;