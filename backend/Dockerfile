FROM node:20

WORKDIR /app

COPY package*.json ./

ARG BUILD=true
RUN if [ "$BUILD" = "true" ]; then \
       npm install --omit=dev; \
    else \
       npm install; \
    fi


COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]