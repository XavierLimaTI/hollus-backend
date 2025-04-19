import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';

// Configure security middleware
export const securityHeaders = helmet();

export const dataSanitization = [
  // Prevent MongoDB operator injection
  mongoSanitize(),
  
  // Prevent XSS attacks
  xss(),
  
  // Prevent HTTP Parameter Pollution
  hpp()
];

// Global rate limiter - more restrictive than your current API limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos'
});