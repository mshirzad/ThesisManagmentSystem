FROM python:3.8.15-alpine

ENV PYTHONUNBUFFERED 1

COPY ./ThesisManagementSystem/requirements.txt /requirements.txt

RUN apk update
RUN apk add make automake gcc g++ subversion python3-dev

RUN pip install --upgrade pip
RUN pip install -r /requirements.txt

RUN apk add --update postgresql-client
# RUN apk add --update --virtual .temp-build-deps gcc libc-dev linux-headers 
RUN apk add --update --virtual gcc libc-dev linux-headers 
RUN apk add --update --virtual postgresql-dev musl-dev zlib zlib-dev

RUN mkdir /app
WORKDIR /app
COPY ./ThesisManagementSystem /app

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser -D user
RUN chown -R user:user /vol/
RUN chmod -R 755 /vol/web
USER user



### For AWS ###

# FROM python:3.8.14-slim-buster

# WORKDIR /app
# COPY ./ThesisManagementSystem ./

# RUN pip install --upgrade pip

# RUN pip install -r /app/requirements.txt 

# # CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
# CMD ["python", "manage.py", "collectstatic"]
# CMD ["python", "manage.py", "migrate"]
# CMD ["gunicorn", "ThesisManagementSystem.wsgi:application", "--bind", "0.0.0.0:8000"]