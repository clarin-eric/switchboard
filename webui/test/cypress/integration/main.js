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

describe('Uploaded file', () => {
    it('works', () => {
        cy.visit('http://localhost:8080');

        cy.contains('a', 'Upload files or text').should('be.visible').click();

        const textFile = 'txt-sherlock-short.txt';
        cy.get('.dropzone > input').attachFile(textFile);

        // for a very short while this shows up...
        cy.get('.value.namesize').contains('span', 'Uploading...');

        // then we get real data
        cy.get('.tool.match').should('be.visible');
        cy.get('.value.namesize').contains('a', textFile).should('be.visible');
    })
})

describe('Submitted URL', () => {
    it('works', () => {
        cy.visit('http://localhost:8080');

        cy.contains('a', 'Upload files or text').should('be.visible').click();
        cy.contains('a', 'Submit URL').should('be.visible').click();

        cy.get('.inputzone').should('have.value', '');
        cy.contains('button', "Submit URL").should('be.disabled');

        const url = 'https://en.m.wikipedia.org/wiki/Bread';
        const urlFileName = 'Bread';
        cy.get('.inputzone').type(url).should('have.value', url);
        cy.contains('button', "Submit URL").should('be.enabled') .click();

        // for a very short while this shows up...
        cy.get('.value.namesize').contains('span', 'Uploading...');

        // then we get real data
        cy.get('.tool.match').should('be.visible');
        cy.get('.value.namesize').contains('a', urlFileName).should('be.visible');
    })
})

describe('Typed text', () => {
    it('works', () => {
        const myinput = 'This is a text document';
        cy.visit('http://localhost:8080');

        cy.contains('a', 'Upload files or text').should('be.visible').click();
        cy.contains('a', 'Submit Text').should('be.visible').click();

        cy.get('.inputzone').should('have.value', '');
        cy.contains('button', "Submit Text").should('be.disabled');

        cy.get('.inputzone') .type(myinput).should('have.value', myinput);
        cy.contains('button', "Submit Text").should('be.enabled') .click();

        cy.get('.tool.match').should('be.visible');
        cy.get('.value.namesize').contains('a', 'submitted_text.txt').should('be.visible');
    })
})

