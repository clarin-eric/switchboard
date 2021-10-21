describe('My First Test', () => {
    it('finds the content "type"', () => {
        cy.visit('http://localhost:8080')
        cy.contains('Switchboard')
    })
})
