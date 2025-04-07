
const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface(process.stdin, process.stdout);
const path = require("path");
rl.question("Do you wish to process a File (f) or Directory (d): ", function (question1) {
  if (question1.toLowerCase() === "f") {
    rl.question("File: ", function (questionFile) {
      fs.readFile(questionFile, function (err, fileData) {
        if (err) console.log(err.message);
        else {
          const content = fileData.toString().replace(/\s+/g, " ");
          const words = content.replace(/[^\w\s']/g, "").split(" ");

          console.log(`Number of Characters (including spaces): ${content.length}`);
          console.log(`Number of Words: ${words.length}`);
          console.log(`Longest Word: ${words.reduce((a, b) => (a.length > b.length ? a : b))}`);
          //most repeated word
          const wordCounts = {};
          words.forEach((word) => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          });
          const mostRepeatedWord = Object.entries(wordCounts).reduce((a, b) =>
            a[1] > b[1] ? a : b
          );
          console.log(`Most Repeated Word: ${mostRepeatedWord[0]} - ${mostRepeatedWord[1]} times`);
        }
      });
      rl.close();
    });
  } else if (question1.toLowerCase() === "d") {
    rl.question("Directory: ", function (questionDirect) {
      fs.readdir(questionDirect, (err, files) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log(`Files (reverse alphabetical order): ${files.sort().reverse().join(", ")}`);

        //file sizes
        files.forEach((file) => {
          const filePath = path.join(questionDirect, file);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log(`${file}: ${stats.size} bytes`);
          });
        });
      });
    });
  }
});
