FROM node:19.6.0
MAINTAINER KHJ

#폴더 만들기
RUN mkdir -p /app


RUN apt-get update && \
    apt-get install -y build-essential python

#폴더를 workdir로 지정
WORKDIR /app

#폴더에 파일 복사 ADD [어플리케이션 파일 위치] [컨테이너 내부의 파일 위치]
#Dockerfile과 서버파일이 같은 위치라서 ./
ADD ./ /app

#패키지 설치
RUN npm install

#환경설정
ENV NODE_ENV=production

#서버실행
CMD node app.js
