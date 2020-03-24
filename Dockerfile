FROM php:7-apache

RUN echo "deb http://deb.debian.org/debian experimental main" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y \
  sqlite3 \
  exiftool \
  && apt-get install -y -t experimental \
  netpbm
RUN a2enmod rewrite
COPY src/ /var/www/html/
RUN mkdir -p -m 755 picture thumbnail attribute
RUN sqlite3 attribute/database <schema.sql
RUN chown -R www-data picture thumbnail attribute

VOLUME ["/var/www/html/picture", "/var/www/html/attribute"]
