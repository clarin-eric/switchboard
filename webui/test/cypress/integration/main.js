describe('Frontpage', () => {
    it('renders all elements', () => {
        cy.visit('http://localhost:8080');
        cy.contains('h2', 'Switchboard').should('be.visible');
        cy.contains('a', 'Upload files or text').should('be.visible');
        cy.contains('a', 'Tool inventory').should('be.visible');
        cy.contains('a', 'Help').should('be.visible');
        cy.contains('a', 'About').should('be.visible');
        cy.contains('a', 'Contact').should('be.visible');
    })
})

describe('Text input', () => {
    it('accepts input', () => {
        const myinput = 'This is a text document';
        cy.visit('http://localhost:8080');

        cy.contains('a', 'Upload files or text').should('be.visible').click();
        cy.contains('a', 'Submit Text').should('be.visible').click();

        cy.get('.form-control', {timeout:200}).should('have.value', '');
        cy.contains('button', "Submit Text").should('be.disabled');
        cy.get('.form-control') .type(myinput).should('have.value', myinput);
        cy.contains('button', "Submit Text").should('be.enabled') .click();

        cy.get('.value.namesize').contains('a', 'submitted_text.txt').should('be.visible');
        cy.get('.tool.match').should('be.visible');
    })
})
