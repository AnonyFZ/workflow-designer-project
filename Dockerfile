FROM siomiz/node-opencv:2.4.x
ENV NODE_ENV development
WORKDIR /usr/src/app
RUN npm install
EXPOSE 8888

CMD ["npm", "run", "start"]
