
# WCU CSC468 Group 4 "Spotter"

Spotter is a cloud-based music sharing web application that allows users to connect with others who share their musical interests. The app utilizes real-time geolocation to find other users in proximity and display the music they are currently listening to.


## Deployment

To deploy this project:

1. Initialize Group 4 profile on CloudLab using main branch

2. Run

```bash
  bash /local/repository/cloud/k8s/deploy_spotter.sh
```
3. After services are built project is accessible at 
```bash
http://{host-ip}:30088
```
4. To deploy the Kubernetes Dashboard run 
```bash
bash /local/repository/cloud/k8s/launch_dashboard.sh
```


## Achievements 
We take great pride in transforming an initial concept into a working prototype over the course of this semester. Additionally, we successfully designed and built a functional cloud infrastructure around our application, complete with a robust CI/CD pipeline (fully coming this week...). Throughout the spring we acquainted ourselves with three of the most popular technologies in the devops sector: Docker, Kubernetes, and Jenkins.
## Current Challenges


**Geolocation API**

We are currently using Chrome's "chrome://flags/#unsafely-treat-insecure-origin-as-secure" flag to provide geolocation functionality. To use the flag, input the URL into the flag and restart the browser.

**Spotify API**

Due to limitations with Spotify's API, small scale applications must register each user who will be accessing the API for a total of 25 concurrent users. 

Due to the ephemeral nature of CloudLab experiments, our site's IP address changes often. This is more of an annoyance than an issue, as each deployment means we need to input a unique callback address in Spotter's Spotify Dashboard.

**Web Dev Inexperience**
The application is currently written in vanilla JS. We are planning to refactor the application using React moving forward.


## Team

- [@AyalaBrianna](https://github.com/AyalaBrianna)
- [@seanwho88](https://github.com/seanwho88)
- [@Smith2230](https://github.com/Smith2230)
- [@DRockwell0](https://github.com/DRockwell0) 
- [@mikec1233](https://github.com/mikec1233) -- [@linkedin](https://www.linkedin.com/in/michael-collins-b27760223/)





