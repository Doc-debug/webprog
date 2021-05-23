# webprog

Please download the php server from the following source and unpack it in the root directory

[http://kiwwi.net/projects/webprog/files/phpserverwebprog.zip](http://kiwwi.net/projects/webprog/files/phpserverwebprog.zip)


File Structure should be as following:

```
> Apache24
> php8.0
> public
    > api
    > css
    > fonts
    > img
    > js
    > music
    index.html
    ...
.gitignore
```

open Apache24/conf/httpd.conf

in line 4 

edit the path of SRVROOT to the absolute path to the Apache24 folder

e.g.: 'Define SRVROOT "C:\Users\max\webprogrammieren\webprog\Apache24"'
