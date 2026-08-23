const API_BASE_URL = 'http://localhost:8080/api/inspector';

export const initializeTracking = async (data) => {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return { data: await response.json() };
};

export const getContainerDetails = async (containerId) => {
    const response = await fetch(`${API_BASE_URL}/container/${containerId}`);
    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return { data: await response.json() };
};

export const unlockSeal = async (data) => {
    const response = await fetch(`${API_BASE_URL}/unlock-seal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return { data: await response.json() };
};