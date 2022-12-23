<h1>DEV-MOTIVATORS</h1>
<p>Backend of a website resembling popular websites such as "demotivators", "kwejk", "faktopedia", but with a programming theme. It will contain serious, motivating, but also funny thoughts, photos, quotes about programming.</p>
<h2>Implemented Features and Flow:</h2>
<ul>
  <li>Registration and Login: <code>jwt</code>, <code>bcrypt</code></li>
  <li>Non-logged in users can only browse motivators on the main page and in the trash bin</li>
  <li>Logged in users can create their own motivators and vote</li>
  <li>User adds motivator with title, description, keywords, and photo uploaded to <code>cloudinary</code></li>
  <li>Motivator, after being added, enters the "Waiting" phase and waits for moderator/admin approval</li>
  <li>After acceptance, it goes to the trash bin and from there to the main page after receiving a certain number of thumbs up.</li>
  <li>From the moment it enters the trash bin until it goes to the main page, the time is measured and displayed as "Safe IN" after being added to the main page.</li>
</ul>
<p>The application is tested using <code>Jest</code>, <code>Supertest</code>, and <code>Postman</code>. I also test functionality on the frontend in <code>NextJS 13</code>. <code>CircleCI</code> is used as CI/CD.</p>
<p>In the near future, I plan to add comments and the ability to search motivators by keywords using <code>Redis</code>.</p>