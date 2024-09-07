# Freesource
https://nextstephacks-production.up.railway.app  
  
## Inspiration
The inspiration behind Free Source came from a deep dive into the challenges faced by communities and individuals, particularly the lack of connection between locals, rising costs of living, and the need for temporary labour. By reflecting on the innovative approaches of freelancers and the significant potential of crowd sourcing, we envisioned a platform that brings together these elements. Free Source was born from our desire to create a space where people could easily connect, find support, and share resources, ultimately fostering a stronger and more supportive community.

## What it does
Freesource is a website that allows it's users to either find local labour, or find jobs within their area. The application uses an algorithm to determine which jobs would be optimal for which labourer by considering skills and location.

## How we built it
To build Freesource, we used Node and PostgreSQL. When an individual visits our website, we use express to determine which route they are visiting on and serve the appropriate web page. These pages are written in EJS, and use vanilla CSS for styling. 

## Challenges we ran into
One of the main challenges that we ran into while building this website was the need to adapt and complete the project on a short time-frame.  In the past, none of our team members have participated in any hackathons before, so we were unfamiliar with the speed at which we needed to develop our project. Another major issue was that we had little to no experience with the tech stack we used to create the project. On our team, one of our members had never written code in JavaScript before this project, and needed to adapt very quickly. 

## Accomplishments that we're proud of
There were many aspects of this project that were difficult and time-consuming for us, however we are most proud of creating the algorithm that matches workers with employers. In order to implement this algorithm, we were required to structure our data in a specific way with longitude and latitude fields, that are then used to find the distance between users. This required the usage of an API that we had never used before, and complex math.

## What we learned
Overall, throughout this project our entire team learned greatly, as we were all relatively unfamiliar with the tech stack used. We learned many different concepts throughout the creation of this project such as how to write queries with PostgreSQL and how Git. Members of the team also gained many other useful skills including how to write JavaScript, API calls, time management, front-end development (HTML, CSS), and how to deploy projects to production.

## What's next for Freesource
Due to the short-time form in which Freesource was developed, there are many other features that we would like to add to the platform. Within the future, at the minimum we would like to add a review system, user profiles, and a transaction system. After this, we would hope to advertise our product and share it with both the local community, and individuals in other areas of the world.