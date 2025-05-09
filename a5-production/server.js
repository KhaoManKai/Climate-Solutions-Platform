/********************************************************************************
 * Domains: https://hin-lum-climate-solution.vercel.app/
 ********************************************************************************/

require('dotenv').config();
console.log("MONGODB:", process.env.MONGODB);

const mongoose = require('mongoose');
const authData = require("./modules/auth-service");
const clientSessions = require("client-sessions");
const projectData = require("./modules/projects");
const express = require('express');
const app = express();



const HTTP_PORT = process.env.PORT || 8080;

console.log("Environment variables loaded:",{
  MONGODB: process.env.MONGODB ? "Found" : "Not found",
  PGDATABASE: process.env.PGDATABASE ? "Found" : "Not found"
});

if(process.env.MONGODB){
  mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    console.log('MongoDB connected successfully');
  }).catch(err => console.error('MongoDB connection error:', err));
}else{
  console.error('MONGODB environment variable is not defined');
}

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(clientSessions({
  cookieName: "session",
  secret: "web322_assignment6", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/solutions/projects", async (req,res)=>{

  try{
    if(req.query.sector){
      let projects = await projectData.getProjectsBySector(req.query.sector);
      console.log(projects);
      (projects.length > 0) ? res.render("projects", {projects: projects}) : res.status(404).render("404", {message: `No projects found for sector: ${req.query.sector}`});
  
    }else{
      let projects = await projectData.getAllProjects();
      res.render("projects", {projects: projects});
    }
  }catch(err){
    res.status(404).render("404", {message: err});
  }

});

app.get("/solutions/projects/:id", async (req,res)=>{
  try{
    let project = await projectData.getProjectById(req.params.id);
    console.log(project);
    res.render("project", {project: project})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

app.get("/solutions/addProject", ensureLogin, async (req, res) => {
  let sectors = await projectData.getAllSectors()
  res.render("addProject", { sectors: sectors })
});

app.post("/solutions/addProject", ensureLogin, async (req, res) => {
  
  try {
    await projectData.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }

});

app.get("/solutions/editProject/:id", ensureLogin, async (req, res) => {

  try {
    let project = await projectData.getProjectById(req.params.id);
    let sectors = await projectData.getAllSectors();

    res.render("editProject", { project, sectors });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }

});

app.post("/solutions/editProject", ensureLogin, async (req, res) => {

  try {
    await projectData.editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.get("/solutions/deleteProject/:id", ensureLogin, async (req, res) => {
  try {
    await projectData.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})

app.get("/login", (req, res) => {
  res.render("login", { errorMessage: "", userName: "" });
});

app.get("/register", (req, res) => {
  res.render("register", { errorMessage: "", successMessage: "", userName: "" });
});

app.post("/register", (req, res) => {
  authData.registerUser(req.body)
    .then(() => {
      res.render("register", { errorMessage: "", successMessage: "User created", userName: "" });
    })
    .catch((err) => {
      res.render("register", { errorMessage: err, successMessage: "", userName: req.body.userName });
    });
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  
  authData.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      }
      res.redirect("/solutions/projects");
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});
async function initialize() {
  try {
    await projectData.initialize();
    console.log('Project data initialized');
    await authData.initialize();
    console.log('Auth data initialized');
  } catch (err) {
    console.error('Failed to initialize:', err);
    throw err;
  }
}
if (require.main === module) {
  initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT} (with initialization errors)`);
    });
  });
}
module.exports = {
  app,
  initialize
};
