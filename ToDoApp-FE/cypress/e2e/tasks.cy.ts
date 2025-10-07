/// <reference types="cypress" />

type Task = {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
};

const api = (path: string) => `**/api${path}`;

describe('ToDoApp - Tasks E2E', () => {

  it('shows empty state on initial load', () => {
    cy.intercept('GET', api('/tasks'), {
      statusCode: 200,
      body: { success: true, data: [] },
    }).as('getTasks');

    cy.visit('/');
    cy.wait('@getTasks');

    cy.contains('No tasks yet!').should('be.visible');
    cy.contains('Add New Task').should('be.visible');
  });

  it('creates a task via the form and refreshes list', () => {
    const newTask: Task = {
      id: 1,
      title: 'Write Cypress tests',
      description: 'Cover create and complete flows',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    let created = false;

    cy.intercept('GET', api('/tasks'), (req) => {
      if (created) {
        req.reply({ statusCode: 200, body: { success: true, data: [newTask] } });
      } else {
        req.reply({ statusCode: 200, body: { success: true, data: [] } });
      }
    }).as('getTasks');

    cy.intercept('POST', api('/tasks'), (req) => {
      expect(req.headers['content-type']).to.include('application/json');
      const body = req.body as { title: string; description: string };
      expect(body.title).to.equal(newTask.title);
      expect(body.description).to.equal(newTask.description);
      created = true;
      req.reply({ statusCode: 201, body: { success: true, data: newTask } });
    }).as('createTask');

    cy.visit('/');
    cy.wait('@getTasks');

    cy.get('#title').type(newTask.title);
    cy.get('#description').type(newTask.description);
    cy.contains('button', 'Add Task').click();

    cy.wait('@createTask');
    cy.wait('@getTasks');

    cy.contains(newTask.title).should('be.visible');
    cy.contains(newTask.description).should('be.visible');
  });

  it('completes a task from the list and removes it', () => {
    const task: Task = {
      id: 11,
      title: 'Incomplete task',
      description: 'Click check to complete',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    let completed = false;
    cy.intercept('GET', api('/tasks'), (req) => {
      if (completed) {
        req.reply({ statusCode: 200, body: { success: true, data: [] } });
      } else {
        req.reply({ statusCode: 200, body: { success: true, data: [task] } });
      }
    }).as('getTasks');

    cy.intercept('PATCH', api(`/tasks/${task.id}/complete`), (req) => {
      completed = true;
      req.reply({ statusCode: 200, body: { success: true, data: { ...task, isCompleted: true } } });
    }).as('completeTask');

    cy.visit('/');
    cy.wait('@getTasks');

    cy.contains(task.title).should('be.visible');
    cy.contains(task.description).should('be.visible');

    cy.get('button[title="Mark as complete"]').first().click({ force: true });

    cy.wait('@completeTask');
    cy.wait('@getTasks');
    cy.contains('No tasks yet!').should('be.visible');
  });

  it('shows an error toast when creation fails', () => {

    (Cypress as any).on('uncaught:exception', (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      if (/Failed to create task/i.test(message)) {
        return false;
      }
      return true;
    });

    cy.intercept('GET', api('/tasks'), {
      statusCode: 200,
      body: { success: true, data: [] },
    }).as('getTasksEmpty');

    cy.intercept('POST', api('/tasks'), {
      statusCode: 400,
      body: { success: false, error: { message: 'Failed to create task', statusCode: 400 } },
    }).as('createFail');

    cy.visit('/');
    cy.wait('@getTasksEmpty');

    cy.get('#title').type('Bad Task');
    cy.get('#description').type('This will fail');
    cy.contains('button', 'Add Task').click();

    cy.wait('@createFail');

    cy.contains(/failed to add task|failed to create task/i).should('be.visible');
  });
});

