FROM ubuntu:latest

ARG NODE_V

ENV NODE_V=20
#normalement la derniere pour Node est la 20 pour ubuntu

RUN echo "Updating..."
RUN apt-get update -y > /dev/null
RUN apt-get upgrade -y > /dev/null
RUN apt-get install build-essential -y > /dev/null

RUN echo "Installing NPM && Nestjs"
WORKDIR /Transcendence
RUN apt-get install -y ca-certificates curl gnupg git
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_V.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y > /dev/null
RUN npm install -g npm@latest
RUN npm i -g @nestjs/cli
RUN npm i -g @nestjs/schematics
#installe des trucs en plus comme ca
RUN echo "Installing VueJS & NuxtJS"
RUN npm install -g @vue/cli
RUN npm install @nuxtjs/modules
#test pour voir si on peut installer les modules directement

RUN echo "The front has started"
EXPOSE 3000
WORKDIR /Transcendence/frontend
RUN npm i axios
#on déplacera cette ligne au dessus avec les autres composants à installer quand on aura tout hors de frontend
#CMD ["sleep", "infinity"]
CMD ["npm", "run", "dev"]
#CMD ["sh", "start_front.sh"]

# https://github.com/Freya-Tenebrae/Transcendence.git Transcendence