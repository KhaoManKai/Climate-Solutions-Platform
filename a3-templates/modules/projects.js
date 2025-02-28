const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");
let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = projectData.map(project => {
                const sector = sectorData.find(sector => sector.id === project.sector_id);
                return { ...project, sector: sector ? sector.sector_name : "Unknown" };
            });
            resolve();
        } catch (err) {
            reject("Failed to initialize projects: " + err);
        }
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) {
            resolve(projects);
        } else {
            reject("No projects found");
        }
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            resolve(project);
        } else {
            reject("Unable to find requested project");
        }
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const sectorMap = {
            'electricity': 4,
            'transportation': 3,
            'agriculture': 5,
            'industry': 2,
            'land': 1        
        };

        const sectorId = sectorMap[sector.toLowerCase()];
        
        if (!sectorId) {
            reject("Unable to find requested projects");
            return;
        }

        const sectorProjects = projects.filter(project => project.sector_id === sectorId); 
        
        if (sectorProjects.length === 0) {
            reject("Unable to find requested projects");
        } else {
            resolve(sectorProjects);
        }
    });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };