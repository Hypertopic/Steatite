Steatite – Pictures archive for qualitative analysis
====================================================

License: [GNU Affero General Public License](http://www.gnu.org/licenses/agpl.html)

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Steatite>

Notice
------

Steatite is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

Installation requirements
-------------------------

- Git client
- Apache HTTP server with PHP and rewrite module
- Netpbm (Linux, MacOS X, Mingw32)
- SQLite 3

Installation procedure
----------------------

- In a Web folder:

        git clone git@github.com:Hypertopic/Steatite.git
        cd Steatite
        mkdir -m 755 picture thumbnail attribute
        sqlite3 attribute/database <schema.sql
        chown -R www-data picture thumbnail attribute

- If the last command threw an error, your system may use a different username for Apache-owned files. Change it accordingly.

- Set Apache PATH environment to include `mkdir`, `file` and `anytopnm` (see wiki for OS-dependent procedures). 

- In `/etc/php5/apache2/php.ini` (or equivalent), set `upload_max_filesize` and `max_file_uploads` high enough for your mass uploading needs.
