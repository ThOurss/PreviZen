const API_URL = process.env.REACT_APP_API_URL;

export const submitForm = async (form) => {
    const res = await fetch(`${API_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });
    return res.json();
};
