import rateLimit from "express-rate-limit";

const limiterConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // número máximo de solicitudes por IP
  message: "Too many requests from this IP, please try again later.",
});

export default limiterConfig;
