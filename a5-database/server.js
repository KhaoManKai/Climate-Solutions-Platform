/********************************************************************************
 * WEB322 – Assignment 05
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: _______Hin Lum Lee__________ Student ID: ___132957234______ Date: ___16-Nov-2024_______
 *
 * Domains: https://web-assignment5-six.vercel.app
 ********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: true}));

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
              res.render("projects", { projects: [] });
          });
  } else {
      projectData
          .getAllProjects()
          .then((projects) => {
              res.render("projects", { projects: projects });
          })
          .catch((err) => {
              res.render("projects", { projects: [] });
          });
  }
});

app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  projectData
      .getProjectById(id)
      .then((project) => {
          if (!project) {
              throw new Error("Project not found");
          }
          res.render("project", { project: project });
      })
      .catch((err) => {
          res.status(404).render("404", {
              message: "Unable to find the requested project"
          });
      });
});

app.get("/solutions/addProject", (req, res) => {
    projectData.getAllSectors()
        .then((sectors) => {
            res.render("addProject", { sectors: sectors });
        })
        .catch((err) => {
            res.render("500", { message: err });
        });
});

app.post("/solutions/addProject", (req, res) => {
    projectData.addProject(req.body)
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch((err) => {
            res.render("500", { message: `Error adding project: ${err}` });
        });
});

app.get("/solutions/editProject/:id", (req, res) => {
    Promise.all([
        projectData.getProjectById(req.params.id),
        projectData.getAllSectors()
    ])
    .then(([project, sectors]) => {
        res.render("editProject", { project: project, sectors: sectors });
    })
    .catch((err) => {
        res.status(404).render("404", { message: err });
    });
});

app.post("/solutions/editProject", (req, res) => {
    projectData.editProject(req.body.id, req.body)
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch((err) => {
            res.render("500", { message: `Error updating project: ${err}` });
        });
});

app.get("/solutions/deleteProject/:id", (req, res) => {
    projectData.deleteProject(req.params.id)
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch((err) => {
            res.render("500", { message: `Error deleting project: ${err}` });
        });
});
app.use((_, res) => {
    res.status(404).render("404", {
        message: "The page doesn't exist"
    });
});
