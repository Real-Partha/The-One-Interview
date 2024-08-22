import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetUid = () => {
    const [username, setUsername] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (username) {
            axios.get(`${import.meta.env.VITE_API_URL}/checkusername`, { params: { username } })
                .then(response => {
                    console.log(response.data);
                    setIsValid(response.data.status);
                })
                .catch(error => {
                    console.error('There was an error checking the username!', error);
                    setIsValid(false);
                });
        }
    }, [username]);

    const handleUsernameChange = (event) => {
        const newUsername = event.target.value.slice(0, 15);
        setUsername(newUsername);
    };

    return (
        <div style={styles.container}>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                style={{ ...styles.input, borderColor: isValid ? 'green' : 'red' }}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    input: {
        width: '300px',
        height: '40px',
        fontSize: '16px',
        padding: '10px',
        borderWidth: '2px',
        borderStyle: 'solid',
    },
};

export default GetUid;