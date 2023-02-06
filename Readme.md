<h1>Chat Application</h1>

<p>A chat application built using the holepunch libraries such as hyperswarm, corestore, hyperdrive. This application lets users connect with each other p2p rather than connecting to the centralized server. The main advantage of p2p network is to let users connect directly to each other which reduces the latency. This is useful for remote areas where there is very shortage of internet access. Users can connect directly to the peer and can chat.</p>

<h2>Appendix</h2>

<p>To deploy the app please refer to the <a href="#deployment">deployment section</a></p>

<p><b>Note:</b> To run the backend server, you need to create a .env file in the root directory of the project and to connect to a topic, you need to create a .env file in the frontend directory of the project. Check the .env.example file to populate your .env files</p>

<h2>Features</h2>

<ul>
    <li>Realtime chat functionality</li>
    <li>P2P network to reduce latnecy</li>
    <li>Create new topic or join to a topic</li>
    <li>Beautiful UI</li>
    <li>Persistant data using corestore and hyperdrive</li>
</ul>

<h2>Tech Stack</h2>

<p><b>Frontend:</b> HTML, CSS, React, Hyperswarm, HyperswarmDHTRelay, HyperswarmDHTRelayStream</p>
<p><b>Backend:</b> Express, cors, morgan, Corestore, Hyperdrive</p>

<h2 id="deployment">Deployment</h2>

<p>Clone the project</p>

```
git clone https://github.com/adijoshi-1/holepunch.git
```

<h3>Backend</h3>

<p>Install backend dependencies</p>

```
npm install
```

<p>Start the backend server in dev-environment</p>

```
npm run dev
```

<h3>Frontend</h3>

<p>Install frontend dependencies</p>

```
cd frontend
npm install
```

<p>Generate the topic</p>

```
npm run generate-topic
```

<p><b>Note:</b> Populate the .env file in the frontend directory. Check the .env.example file</p>

<p>Run the frotnend React app</p>

```
npm start
```

<h2>ScreenShots</h2>

<h2>Feedback</h2>

<p>For any potential queries, please reach out to me at <a href="email:aditya@coindelta.io">aditya@coindetla.io</a></p>

<h2>Authors</h2>

<ul>
    <li>Aditya Joshi</li>
</ul>
