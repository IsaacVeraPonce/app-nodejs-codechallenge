# Utiliza la imagen base de Node.js
FROM node:21.7.1-alpine3.18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la API al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Ejecuta el comando para iniciar la API 
CMD [ "npm","run", "start:dev" ]