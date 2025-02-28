/********************************************************************************
 * WEB322 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: _______Hin Lum Lee__________ Student ID: ___132957234______ Date: ___04-Oct-2024_______
 * 
 * Domains: https://web-assignment4-six.vercel.app
 ********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
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
    res.render("home");
  });
  
  app.get("/about", (_, res) => {
    res.render("about");
  });

app.get("/solutions/projects", (req, res) => {
    const sector = req.query.sector;
    if (sector) {
        projectData
            .getProjectsBySector(sector)
            .then((projects) => {
                res.render("projects", { projects: projects });
            })
            .catch((err) => {
                res.status(404).render("404", {
                    message: "Couldn't find projects for the specified sector"
                });
            });
    } else {
        projectData
            .getAllProjects()
            .then((projects) => {
                res.render("projects", { projects: projects });
            })
            .catch((err) => {
                res.status(404).render("404", {
                    message: "Couldn't find any projects"
                });
            });
    }
});

app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  projectData
      .getProjectById(id)
      .then((project) => {
          res.render("project", { project: project });
      })
      .catch((err) => {
          res.status(404).render("404", {
              message: "Unable to find the requested project"
          });
      });
});

app.use((_, res) => {
  res.status(404).render("404", {
    message: "The page doesn't exist"
});
});
