const dayjs = require("dayjs");


describe('Validate Test Complete', function () {

    it('consulta lista de tarefas', function() {
        cy.request('https://gorest.co.in/public/v2/todos')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.headers['content-type']).to.include('application/json');
                expect(response.body).to.be.an('array');
            })
    })

    it('verifico resultados da consulta', function () {
        cy.request('https://gorest.co.in/public/v2/todos')
            .then((response) => {
            cy.log(JSON.stringify(response.body, null, 1));
        })
    })

    it('verifica se as tarefas tem status "completed"', function() {
        cy.request('https://gorest.co.in/public/v2/todos')
            .then((response) => {

                const completedTask = response.body.filter(todo => todo.status === 'completed')

                completedTask.forEach(todo => {
                    expect(todo.status).to.eq('completed');
                    cy.log(JSON.stringify(completedTask, null, 1));
                })
            })
    })

    it('Encontra tarefas e valida formato "due_on"', function() {
        cy.request('https://gorest.co.in/public/v2/todos')
            .then((response) => {
                expect(response.body).to.be.an('array');

                response.body.forEach((todo) => {
                    expect(todo).to.have.property('due_on');

                    const isoDateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}(Z|[+-]\d{2}:\d{2})/;
                    const dueOn = todo.due_on;
                    const dueDate = dayjs(dueOn);

                    expect(todo.due_on).to.match(isoDateFormat);
                    expect(dueDate.isValid()).to.be.true;
                    cy.log(JSON.stringify(todo, null, 1));
                })
            })
    })
})



