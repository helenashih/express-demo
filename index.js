const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json()); // app uses the middleware return for post processing pipeline

const courses = [
    {id: 1, name: 'English'},
    {id: 2, name: 'Math'},
    {id: 3, name: 'Physics'},
    {id: 4, name: 'Social Study'}
    ];

app.get('/', (req, res) => {
   res.send('Hola Planet Earth!!');
});

app.get('/api/courses', (req, res) => {
   res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) {
       res.status(404).send(`Course of the given ID ${req.params.id} is not found.`);
       return;
   }
   res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query);
});

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error) {
        //400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);

})

app.put('/api/courses/:id', (req, res) =>{
    // find the course first and if not exist return 404.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send(`Course of the given ID ${req.params.id} is not found.`);
        return;
    }

    // otherwise validate (400 invalid)
    const {error} = validateCourse(req.body); // eq. to (const)result.error
    if (error) {
        //400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    // and then update
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not exists, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send(`Course of the given ID ${req.params.id} is not found.`);
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    // return a response
    res.send(course);
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
   return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
