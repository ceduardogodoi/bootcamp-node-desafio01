const express = require('express');

const server = express();
server.use(express.json());

/**
 * Constant projects already populated for ease purposes
 */
const projects = [
  {
    id: '1',
    title: 'James',
    tasks: ['Google Maps', 'Paypal']
  },
  {
    id: '2',
    title: 'iFood',
    tasks: ['Google Maps', 'Paypal']
  }
];

/** Variable that holds request counting */
let requestCount = 0;

/**
 * Middleware responsible for counting requests
 */
function requestCounter(req, res, next) {
  console.log(`Request counter: ${++requestCount}`);

  return next();
}

/** Applies the request counter middleware to the Server */
server.use(requestCounter);

/**
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The NextFunction function
 */
function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const exists = !!projects.find(project => project.id === id);

  if (!exists) {
    return res.status(404).send({ error: 'Project not found' });
  }

  return next();
}

/** Retrieves all Projects */
server.get('/projects', (_req, res) => {
  return res.json(projects);
});

/** Adds a new Project */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/** Updates a Project */
server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectChanged = projects.find(project => {
    if (project.id === id) {
      project.title = title;

      return true;
    }

    return false;
  });

  return res.json(projectChanged);
});

/** Deletes a Project */
server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.send();
});

/** Adds a Task into a Project */
server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectChanged = projects.find(project => {
    if (project.id === id) {
      project.tasks.push(title);

      return true;
    }

    return false;
  });

  return res.json(projectChanged);
});

/** The port which the server will be listening to */
server.listen(3000);
