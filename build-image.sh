docker build --no-cache -t untadee/comment-survey-fe ./fe
docker push untadee/comment-survey-fe:latest


docker build --no-cache -t untadee/comment-survey-be ./be
docker push untadee/comment-survey-be:latest
