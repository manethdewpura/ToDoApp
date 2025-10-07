/// <reference types="cypress" />
const API_BASE = Cypress.env('API_BASE') || 'http://localhost:3000/api';

describe('ToDoApp E2E - Tasks', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_BASE}/tasks`, {
      statusCode: 200,
      body: {
        success: true,
        data: [],
      },
    }).as('getTasks');
  });

  it('loads the app and shows empty state', () => {
    cy.visit('/');
    cy.wait('@getTasks');
    cy.contains('Add New Task').should('be.visible');
    cy.contains('Recent Tasks').should('be.visible');
    cy.contains('No tasks yet').should('exist');
  });

  it('adds a task successfully', () => {
    cy.intercept('POST', `${API_BASE}/tasks`, (req) => {
      const { title, description } = req.body;
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: 1,
            title,
            description,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });
    }).as('createTask');

    cy.intercept('GET', `${API_BASE}/tasks`, {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: 1,
            title: 'My first task',
            description: 'Do something important',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    }).as('getTasksAfterCreate');

    cy.visit('/');
    cy.wait('@getTasks');

    cy.get('input#title').type('My first task');
    cy.get('textarea#description').type('Do something important');
    cy.contains('button', 'Add Task').click();

    cy.wait('@createTask');
    cy.wait('@getTasksAfterCreate');

    cy.contains('Task added successfully!').should('be.visible');
    cy.contains('My first task').should('be.visible');
    cy.contains('Do something important').should('be.visible');
  });

  it('completes a task', () => {
    const task = {
      id: 2,
      title: 'Complete me',
      description: 'Mark as done',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    cy.intercept('GET', `${API_BASE}/tasks`, {
      statusCode: 200,
      body: { success: true, data: [task] },
    }).as('getTasksWithItem');

    cy.intercept('PATCH', `${API_BASE}/tasks/${task.id}/complete`, {
      statusCode: 200,
      body: {
        success: true,
        data: { ...task, status: 'COMPLETED', updatedAt: new Date().toISOString() },
      },
    }).as('completeTask');

    cy.intercept('GET', `${API_BASE}/tasks`, {
      statusCode: 200,
      body: { success: true, data: [] },
    }).as('getTasksAfterComplete');

    cy.visit('/');
    cy.wait('@getTasksWithItem');

    cy.get('button[title="Mark as complete"]').first().click();

    cy.wait('@completeTask');
    cy.wait('@getTasksAfterComplete');

    cy.contains('Task completed!').should('be.visible');
    cy.contains('Complete me').should('not.exist');
  });
});


