# javascript-video-play-counter
#junior Fullstacker interpretation

### hestiaCP nginx nodejs express host running on custom port using native infrastructure
#solved the issue by creating custom nodejs app using express by adding an include to the sites true nginx.conf

# build default nodeapp install.sh asigning the user express port & custom URI after the main site
### INSTRUCTIONS
 - git clone repo into /home/$user/web/$site/
 - chmod -R $user:$user $nodeapp
 - sudo ./install.sh $user $express.PORT $epress.FOLDER
# this should show system path ip nodeapp docroot will take:
 * $user (running the nodejs app)
 * $express.PORT (port in your app.js)
 * $express.FOLDER (websites home url + this is the link everything gets rendered)
Then copy & rename 2 files into /home/$user/conf/web/$site/ named nginx.conf_$express.PORT & nginx.ssl.conf_$express.PORT respectively & replace the %placeholders% of both files with the passed arguments
