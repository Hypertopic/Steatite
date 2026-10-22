FROM php:8-apache

RUN apt-get update && apt-get install -y \
  sqlite3 \
  exiftool \
  netpbm
RUN a2enmod rewrite
COPY src/ /var/www/html/
RUN mkdir -p -m 755 thumbnail data optimized
RUN sqlite3 data/attributes <schema.sql
RUN chown -R www-data thumbnail data optimized

VOLUME /var/www/html/data
