describe('Regressions', () => {
    it('cannot upload multiple resources from main input screen', () => {
        const myinput = 'This is a text document';
        cy.visit('/');

        cy.contains('a', 'Upload files or text').should('be.visible').click();
        cy.contains('a', 'Submit Text').should('be.visible').click();
        cy.get('.inputzone').type(myinput).should('have.value', myinput);
        cy.contains('button', "Submit Text").should('be.enabled') .click();
        cy.get('.tool.match').should('be.visible');

        cy.get('.resource').should('have.length', 1);

        cy.go('back');

        cy.contains('a', 'Submit Text').should('be.visible').click();
        cy.get('.inputzone').type(myinput).should('have.value', myinput);
        cy.contains('button', "Submit Text").should('be.enabled') .click();
        cy.get('.tool.match').should('be.visible');

        cy.get('.resource').should('have.length', 1);
    })
})
