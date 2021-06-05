# webprog

## please insert all project files into a php environment

---

**NOTE**

Index.php and Index.html are basically the same.
If you have any issues with the format of the page try the index.html.

---

## if you are having trouble you can download our php server which is already configured

Please download the php server from the following source and unpack it into the root directory

[https://kiwwi.net/projects/webprog/files/phpserverwebprog.zip](https://kiwwi.net/projects/webprog/files/phpserverwebprog.zip)

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

open ".\Apache24\conf\httpd.conf"

in line 4: edit the path of SRVROOT to the absolute path to the Apache24 folder
e.g.: 'Define SRVROOT "C:\Users\YOUR_USERNAME\webprogrammieren\webprog\Apache24"'

To run the server just execute the httpd.exe in ".\Apache24\bin\httpd.exe" from your commandline of choice
