docker build --no-cache -t untadee/comment-survey-fe-3 ./fe
docker push untadee/comment-survey-fe-3:latest


docker build --no-cache -t untadee/comment-survey-be-3 ./be
docker push untadee/comment-survey-be-3:latest
