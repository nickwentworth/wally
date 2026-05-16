export function buildLoginUrl() {
    const params = new URLSearchParams({
        redirect: 'http://localhost:5173',
    });

    return `http://localhost:8000/auth/google?${params}`;
}
