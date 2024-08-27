
export const IP = import.meta.env.VITE_EC2_IP || "http://localhost"
export const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 8080

export const SERVER_URL = `${IP}:${SERVER_PORT}`;
export const FRONTEND_URL = process.env.EC2_IP || process.env.CORS_ALLOW_ORIGIN || "http://localhost:5173";