# Base image
FROM node:16.19.0-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn install

RUN yarn global add serve@14.2.1

# Bundle app source
COPY . .

# # Creates a "dist" folder with the production build
# RUN yarn build

# # Start the server using the production build
# CMD [ "node", "dist/main.js" ]