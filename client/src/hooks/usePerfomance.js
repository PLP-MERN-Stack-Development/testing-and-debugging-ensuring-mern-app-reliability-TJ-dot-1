import { useEffect } from 'react';

export const usePerformance = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log to analytics service
      console.log(`Component ${componentName} rendered in ${duration}ms`);
      
      // Warn for slow components
      if (duration > 100) {
        console.warn(`Slow component detected: ${componentName} took ${duration}ms`);
      }
    };
  });
};

// Server performance middleware
const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1e6;
    
    console.log(`API ${req.method} ${req.url} took ${duration.toFixed(2)}ms`);
    
    // Alert for slow endpoints
    if (duration > 1000) {
      console.warn(`Slow endpoint: ${req.method} ${req.url} took ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};