FROM php:7-apache

RUN echo "deb http://deb.debian.org/debian experimental main" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y \
  sqlite3 \
  exiftool \
  libtiff5 \
  && apt-get install -y -t experimental \
  netpbm
RUN a2enmod rewrite
COPY src/ /var/www/html/
RUN mkdir -p -m 755 thumbnail data
RUN sqlite3 data/attributes <schema.sql
RUN chown -R www-data thumbnail data

VOLUME /var/www/html/data
