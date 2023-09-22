FROM ubuntu:latest

ARG NODE_V

RUN echo "Updating..."
RUN apt-get update -y > /dev/null
RUN apt-get upgrade -y > /dev/null
RUN apt-get install build-essential -y > /dev/null

RUN echo "Installing NPM && Nestjs"
WORKDIR /Transcendence/login/src
RUN apt-get install -y ca-certificates curl gnupg git
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_V.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y > /dev/null
RUN npm install -g npm@latest
RUN npm i -g @nestjs/cli
RUN npm i -g @nestjs/schematics

RUN echo "The front has started"
#CMD ["sleep", "infinity"]
CMD ["npm","start"]
