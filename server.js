var express     = require('express');
var path        = require('path');
var bodyParser = require('body-parser');
var app         = express();
var mongoose    = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/projectsRepository');


var projectsDB = mongoose.model('projects', {
    projectName: String,
    contributor: String,
    technologies: String,
    description: String
});

app.configure(function() {
    app.use(express.static(__dirname + '/public'));        
    app.use(express.bodyParser());                                 
});

// Get all the Projects from the DB
app.get('/api/getProjects', function(req, res) {             
    projectsDB.find(function(err, projects) {
        if(err) {
            res.send(err);
        }
        res.json(projects);
    });
});

// Add new Project to the DB
app.post('/api/getProjects', function(req, res) {
    var newProject = new projectsDB(req.body);
    newProject.save(function(err, newProject) {
        if (err) {
            res.send(err);
        } else {
            res.json(newProject);
        }
    });
 });

  // Update the project in the collection by using ID
 app.put('/api/getProjects/:id', function(req, res){
    projectsDB.update(
        { _id: req.params.id },
        { $set: { 
            projectName: req.body.projectName,
            contributor: req.body.contributor,
            technologies: req.body.technologies,
            description: req.body.description
         } },
        { upsert: true, multi: true },
        function(err, Projects){
                    console.log(Projects);
                    res.json(Projects);
                }
    );
	});

 
  // Delete the project in the collection by using ID
 app.delete('/api/getProjects/:id', function(req, res){
	projectsDB.remove({_id: req.params.id}, 
	   function(err, Projects){
        if (err) {
            res.send(err);
        } else {
            res.json(Projects);
        }
	});
});

// get Technologies
app.get('/api/getTechnologies', function(req, res) {   
    projectsDB.find({'technologies' : req.body.technologies},
        function(err, technology) {
            if(err) {
                res.send(err);
            }
            else {
                res.json(technology);
            }
        });
});

// render index file
app.get('*', function (req, res) {  
    res.render('index'); 
});

// listen the port 8080
app.listen(8080, function() {
    console.log('App listening on port 8080');
});