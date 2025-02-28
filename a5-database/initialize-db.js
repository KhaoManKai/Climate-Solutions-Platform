require('dotenv').config();
const { sequelize, Sector, Project } = require('./modules/projects');

sequelize.sync({ force: true })
    .then(async () => {
        try {
            await Sector.bulkCreate([
                { id: 1, sector_name: 'Land' },
                { id: 2, sector_name: 'Industry' },
                { id: 3, sector_name: 'Transportation' },
                { id: 4, sector_name: 'Electricity' },
                { id: 5, sector_name: 'Agriculture' }
            ]);
            
            await Project.bulkCreate([
                {   
                    sector_id: 1,
                    title: "Abandoned Farmland Restoration",
                    feature_img_url: "https://drawdown.org/sites/default/files/solutions/solution_farmlandrestoration01.jpg",
                    summary_short: "Restoration can bring degraded farmland back into productivity and sequester carbon in the process.",
                    intro_short: "Around the world, many farmers are abandoning previously cultivated or grazed lands due to factors such as damaging agricultural practices, desertification, and economic challenges, which threaten food security and contribute to greenhouse gas emissions.",
                    impact: "Worldwide, millions of hectares of farmland have been abandoned due to land degradation. We project that by 2050, 189.51-296.12 million hectares could be restored and converted to regenerative annual cropping or other productive, carbon-friendly farming systems.",
                    original_source_url: "https://drawdown.org/solutions/abandoned-farmland-restoration"
                },
                {   
                    sector_id: 2,
                    title: "Alternative Cement",
                    feature_img_url: "https://drawdown.org/sites/default/files/solutions2020/solution_alternativecement02.jpg",
                    summary_short: "Conventional cement production is a significant source of carbon dioxide. Reformulation can reduce emissions by millions of metric tons each year.",
                    intro_short: "Cement production is a major contributor to greenhouse gas emissions, with portland cement being the most common form.",
                    impact: "Cement is the second-most-used substance in the world after water, and cement production is a significant source of greenhouse gas emissions.",
                    original_source_url: "https://drawdown.org/solutions/alternative-cement"
                },
                {   
                    sector_id: 3,
                    title: "Bicycle Infrastructure",
                    feature_img_url: "https://drawdown.org/sites/default/files/solutions2020/solution_bicycle_infrastructure.jpg",
                    summary_short: "Infrastructure is essential for supporting safe and abundant bicycle use, which curbs emissions by reducing the need for fossil-fuel-dependent transportation.",
                    intro_short: "Project Drawdown's bicycle infrastructure solution involves building bike lanes to encourage cycling and reduce reliance on motorized road vehicles.",
                    impact: "We assume an increase in bicycle infrastructure will drive bicycling from under 3 percent to almost 5-6 percent of urban trips globally by 2050.",
                    original_source_url: "https://drawdown.org/solutions/bicycle-infrastructure"
                }
            ]);
            console.log("Data inserted successfully!");
        } catch (err) {
            console.log("Error inserting data:", err);
        }
        process.exit();
    })
    .catch((err) => {
        console.log("Unable to sync database:", err);
        process.exit();
    });