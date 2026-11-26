# Sitio estático de Heart Graphic servido con nginx.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
# Archivos internos que no deben publicarse (igual que _redirects en Netlify).
RUN cd /usr/share/nginx/html && rm -rf mockups assets/referencias *.xlsx Dockerfile nginx.conf .dockerignore _redirects LEEME.txt
EXPOSE 80
