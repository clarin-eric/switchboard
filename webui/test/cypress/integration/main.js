describe('Frontpage', () => {
    it('renders all elements', () => {
        cy.visit('/');
        cy.contains('h2', 'Switchboard').should('be.visible');
        cy.contains('a', 'Upload files or text').should('be.visible');
        cy.contains('a', 'Tool inventory').should('be.visible');
        cy.contains('a', 'Help').should('be.visible');
        cy.contains('a', 'About').should('be.visible');
        cy.contains('a', 'Contact').should('be.visible');
    })
})


describe('Uploads', () => {
    it('can upload file', () => {
        cy.visit('/');

        cy.contains('a', 'Upload files or text').should('be.visible').click();

        const textFile = 'txt-sherlock-short.txt';
        cy.get('.dropzone > input').attachFile(textFile);

        cy.get('.tool.match').should('be.visible');
        cy.get('.value.namesize').contains('a', textFile).should('be.visible');
    })

    it('can submit url', () => {
        cy.visit('/');

        cy.contains('a', 'Upload files or text').should('be.visible').click();
        cy.contains('a', 'Submit URL').should('be.visible').click();

        cy.get('.inputzone').should('have.value', '');
        cy.contains('button', "Submit URL").should('be.disabled');

        const url = 'https://en.m.wikipedia.org/wiki/Bread';
        const urlFileName = 'Bread';
        cy.get('.inputzone').type(url).should('have.value', url);
        cy.contains('button', "Submit URL").should('be.enabled') .click();

        cy.get('.tool.match').should('be.visible');
        cy.get('.value.namesize').contains('a', urlFileName).should('be.visible');
    })

    it('can submit typed text', () => {
        const myinput = 'This is a text document';
        cy.visit('/');

        cy.contains('a', 'Upload files or text').should('be.visible').click();
        cy.contains('a', 'Submit Text').should('be.visible').click();

        cy.get('.inputzone').should('have.value', '');
        cy.contains('button', "Submit Text").should('be.disabled');

        cy.get('.inputzone') .type(myinput).should('have.value', myinput);
        cy.contains('button', "Submit Text").should('be.enabled') .click();

        cy.get('.tool-list-with-controls').contains('h2', "Matching Tools")
            .should('be.visible');
    })
})
