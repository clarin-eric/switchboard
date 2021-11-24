describe('Resource content and archives', () => {
    it('can show content', () => {
        const myinput = 'This is a text document';
        cy.visit('/');

        cy.contains('a', 'Upload files or text').click();

        cy.contains('a', 'Submit Text').click();
        cy.get('.inputzone').type(myinput).should('have.value', myinput);
        cy.contains('button', "Submit Text").click();

        cy.contains('a', "Show content").click();
        cy.get('.resource .content pre')
            .should('be.visible')
            .should('satisfy', $el => $el[0].innerText === myinput);
    })

    it('can unzip', () => {
        const zipfile = 'ziptest.zip';
        const entry = 'ziptest/a.txt';
        const entryfilename = 'a.txt';
        cy.visit('/');

        cy.contains('a', 'Upload files or text').click();

        cy.get('.dropzone > input').attachFile(zipfile);

        cy.get('.results').should('be.visible');
        cy.contains('a', "Show content").click();

        cy.get('.resource').contains('a', zipfile).should('be.visible');
        cy.get('.resource .outline').should('be.visible');

        cy.get('.resource .outline')
            .contains('label', entry)
            .click();

        cy.get('.resource')
            .should('have.length', 2);
        cy.get('.resource').first().contains('a', zipfile)
            .should('be.visible');
        cy.get('.resource').eq(1).contains('a', entryfilename)
            .should('be.visible');
    })
})
