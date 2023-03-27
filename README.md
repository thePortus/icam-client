# icam

*Index Conventionum Aevorum Mediorum - A Compendium for Medieval Conferences*

By [David J. Thomas](mailto:dave.a.base@gmail.com), [thePort.us](https://thePort.us) and [Matt King](mailto:matthewking1@usf.edu)

---

Check out the live project website at [https://icam.theport.us/](https://icam.theport.us/)

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
sudo nano nginx/conf/default.conf
# client angular settings file MUST contain the IP of the backend
sudo nano client/app/app.settings.ts
# the docker config file MUST contain your domain main in the certbot command line
sudo nano docker-compose.yml
```

Run `docker compose up -d`.

Now, bring the containers down with `docker compose down`. Then edit the `/nginx/conf/default.conf` file and uncomment out the lower server block to enable HTTPS traffic. Make sure to replace the server_name with your relevant URLs. Then, bring the containers back up with `docker compose up -d`.

Finally, set the certbot to autorenew.

``` sh
docker compose run --rm certbot renew
```

Now uncomment out the second server block code in `/nginx/conf/default.conf`. Make SURE to put your URL in each relevant spot or the server will not boot correctly.

Finally, restart the server!

``` sh
docker compose restart
```

If you have problems and the docker container keeps restarting, the certbot might not have run correctly. To fix this, first, bring down the container with `docker compose down`. Then, re-comment out the SSH lines in your `nginx/nginx.conf` file. Now, bring the image back up with `docker compose up -d`. Then run the command `docker compose run --rm certbot certonly --webroot --webroot-path /var/www/html/ --email sample@your_domain --agree-tos --no-eff-email -d your_domain -d www.your_domain`. Once it is complete, un-comment out the `nginx/nginx.conf` file and `docker compose up -d` to get it started.

---

## Customization

#### How to Change Site Title/Byline

Edit the `client/app.settings.ts` file to change any desired display or site information.

#### How to Change the Fonts

Go to [fonts.google.com](https://fonts.google.com) and select two fonts, one for headers and one for body text. Once you have selected two styles, look under the "Use on the Web" pane in the bottom right. Click the `@import` option and copy the code BETWEEN the two `<style>` tags (but don't copy the style tags themselves). Then, go to `client/styles.scss` and REPLACE line 9 with the new statement (just below where it says 'import google fonts').

Then, on lines 19, 20, and 21 of `client/styles.scss`, replate the names of the header/body fonts with your new fonts. That almost does it, but there is one last file to change. Edit `client/app.settings.ts` and change the `bodyFont` and `titleFont` properties to match your new fonts.

#### How to Change the Landing Page

Unfortunately, the landing page does take a little knowledge of Angular to edit. But, you might be able to figure your way around the templates. The files are all located in the `client/components/home` folder and its subdirectories.

#### How to Change the Fonts

Go to [fonts.google.com](https://fonts.google.com) and select two fonts, one for headers and one for body text. Once you have selected two styles, look under the "Use on the Web" pane in the bottom right. Click the `@import` option and copy the code BETWEEN the two `<style>` tags (but don't copy the style tags themselves). Then, go to `client/styles.scss` and REPLACE line 9 with the new statement (just below where it says 'import google fonts').

Then, on lines 19, 20, and 21 of `client/styles.scss`, replate the names of the header/body fonts with your new fonts. That almost does it, but there is one last file to change. Edit `client/app.settings.ts` and change the `bodyFont` and `titleFont` properties to match your new fonts.

#### How to Change the Landing Page

Unfortunately, the landing page does take a little knowledge of Angular to edit. But, you might be able to figure your way around the templates. The files are all located in the `client/components/home` folder and its subdirectories.
