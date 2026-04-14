# Use nginx to serve static files
FROM nginx:alpine

# Copy static files to nginx html directory
COPY *.html *.css *.js /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Inject environment variables into nginx.conf and start nginx
CMD ["/bin/sh", "-c", "sed -i s/REPLACE_GEMINI_KEY/$GEMINI_API_KEY/g /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
