export const IP = process.env.EC2_IP || "http://localhost";
export const PORT = process.env.PORT || 8080;

export const SERVER_URL = `${IP}:${PORT}`;
export const FRONTEND_URL = process.env.EC2_IP || process.env.CORS_ALLOW_ORIGIN || "http://localhost:5173";