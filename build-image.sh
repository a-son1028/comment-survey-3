docker build --no-cache -t untadee/comment-survey-fe-2 ./fe
docker push untadee/comment-survey-fe-2:latest


docker build --no-cache -t untadee/comment-survey-be-2 ./be
docker push untadee/comment-survey-be-2:latest
