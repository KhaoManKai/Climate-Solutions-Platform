/********************************************************************************
 * WEB322 – Assignment 03
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: _______Hin Lum Lee__________ Student ID: ___132957234______ Date: ___04-Oct-2024_______
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// my info
const name = "Hin Lum Lee";
const studentId = "132957234";
app.use(express.static('public'));
projectData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing projects data:", err);
  });

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  
  if (sector) {
    projectData
      .getProjectsBySector(sector)
      .then((projects) => res.json(projects))
      .catch((err) => res.status(404).json({ error: err }));
  } else {
    projectData
      .getAllProjects()
      .then((projects) => res.json(projects))
      .catch((err) => res.status(404).json({ error: err }));
  }
});

app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  projectData
    .getProjectById(id)
    .then((project) => res.json(project))
    .catch((err) => res.status(404).json({ error: err }));
});

app.use((_, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});