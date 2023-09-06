FROM ubuntu:latest

RUN echo "Updating..."
RUN apt-get update -y > /dev/null
RUN apt-get upgrade -y > /dev/null
RUN apt-get install build-essential -y > /dev/null

RUN echo "Installing NPM && Nestjs"
RUN apt-get install nodejs -y > /dev/null
RUN apt-get install npm -y > /dev/null
RUN npm i -g @nestjs/cli
RUN nodejs --version
RUN npm --version

RUN echo "Cloning Transcendence"
RUN apt-get install git -y > /dev/null
RUN git clone https://github.com/Freya-Tenebrae/Transcendence.git Transcendence

RUN echo "The back has started"
CMD ["sleep","infinity"]