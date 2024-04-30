# Utiliza la imagen base de Node.js
FROM node:21.7.1-alpine3.18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la API al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que se ejecutará la API
EXPOSE 3000

# Ejecuta el comando para iniciar la API 
CMD [ "npm","run", "dev" ]