# icam

*Index Conventionum Aevorum Mediorum - A Compendium for Medieval Conferences*

By [David J. Thomas](mailto:dave.a.base@gmail.com), [thePort.us](https://thePort.us) and [Matt King](mailto:matthewking1@usf.edu)

---

Full Stack (MySQL ExpressJS Angular NodeJS) app for browsing the proceedings of conferences in Medieval Studies.

---

## Installation

Current installation is on a Docker setup.


Install docker, and docker-compose locally. Then clone this repo and move inside the directory.

``` sh
git clone https://github.com/thePortus/icam-client.git
cd icam-client
```

Thenm, modify the following files with your desired accounts/passwords/ports

``` sh
# you must change the server_name and redirect to have the url to which you are deploying
/nginx/conf/default.conf
# client angular settings file MUST contain the IP of the backend
/client/app/app.settings.ts
```

Run `docker compose up -d`. Now that docker is up and running, perform a dry run for http certbot certificates

``` sh
docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d example.org -d www.example.org
```

Once successful, run the command again without the dry run flag.

``` sh
docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d example.org -d www.example.org
```

Now, bring the containers down with `docker compose down`. Then edit the `/client/nginx/conf/default.conf` file and uncomment out the lower server block to enable HTTPS traffic. Make sure to replace the server_name with your relevant URLs. Then, bring the containers back up with `docker compose up -d`.

Finally, set the certbot to autorenew.

``` sh
docker compose run --rm certbot renew
```

Now uncomment out the second server block code in `/client/nginx/conf/default.conf`. Make SURE to put your URL in each relevant spot or the server will not boot correctly.

Finally, restart the server!

``` sh
docker compose restart
```

---

## Customization

#### How to Change Site Title/Byline

Edit the `client/app.settings.ts` file to change any desired display or site information.

#### How to Change the Fonts

Go to [fonts.google.com](https://fonts.google.com) and select two fonts, one for headers and one for body text. Once you have selected two styles, look under the "Use on the Web" pane in the bottom right. Click the `@import` option and copy the code BETWEEN the two `<style>` tags (but don't copy the style tags themselves). Then, go to `client/styles.scss` and REPLACE line 9 with the new statement (just below where it says 'import google fonts').

Then, on lines 19, 20, and 21 of `client/styles.scss`, replate the names of the header/body fonts with your new fonts. That almost does it, but there is one last file to change. Edit `client/app.settings.ts` and change the `bodyFont` and `titleFont` properties to match your new fonts.

#### How to Change the Landing Page

Unfortunately, the landing page does take a little knowledge of Angular to edit. But, you might be able to figure your way around the templates. The files are all located in the `client/components/home` folder and its subdirectories.
