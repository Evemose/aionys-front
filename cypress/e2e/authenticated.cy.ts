import engDictionary from '@/config/locales/dicts/en';
import ukDictionary from '@/config/locales/dicts/uk';

// TODO: delete created user after test
describe('Basic scenarios of authenticated user', () => {
    const username = `test`;
    const password = 'pass123G$%!';

    function login(lUsername?: string) {
        cy.get("button").contains(engDictionary.loginRegister.login).trigger('mouseover').click();
        cy.get('input[name="username"]').type(lUsername ?? username);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();
    }

    beforeEach(() => {
        cy.visit('/').wait(300); // wait so ui becomes interactive
        login()
    });

    it('should display elements on the logged-in page', () => {
        cy.get("[id='login-register-backdrop']").should('not.exist');
        cy.get("[id='header']").should('be.visible');
        cy.get("[id='notes-list-container']").should('be.visible');
        cy.get("[id='maximized-container']").should('be.visible');
    });

    it('should create and list notes', () => {
        function addNote(title: string, content: string) {
            cy.get("[id='add-note-card']").click();
            cy.get('input[name="title"]').type(title);
            cy.get('textarea[name="content"]').type(content);
            cy.contains("button", engDictionary.commons.save).trigger('mouseover').click();
        }

        function verifyInputEmpty() {
            cy.get('input[name="title"]').should('have.value', '');
            cy.get('textarea[name="content"]').should('have.value', '');
        }

        addNote('Note 1', 'Content of Note 1');
        verifyInputEmpty();
        addNote('Note 2', 'Content of Note 2');
        verifyInputEmpty();

        cy.contains('Note 1').should('be.visible');
        cy.contains('Note 2').should('be.visible');
    });

    it('should change language', () => {
        let updatesCounter = 0;

        function verifyTexts(dict: typeof ukDictionary | typeof engDictionary) {
            cy.get('[id=notes-search]').should('have.attr', 'placeholder', dict.notesList.search);
            // without wait, cypress fails to click the button
            cy.wait(1000).get("[id='add-note-card']").click();
            cy.get("label").contains(dict.noteFields.title).should('be.visible');
            cy.get("label").contains(dict.noteFields.content).should('be.visible');
            cy.get('button').contains(dict.commons.save).should('be.visible');

            cy.contains('Note 1').click(); // open note
            cy.get('button[id="edit-button"]').trigger('mouseover').then(() => {
                cy.contains(dict.commons.edit).should('exist');
            }).trigger('mouseout');
            cy.get('button[id="delete-button"]').trigger('mouseover').then(() => {
                cy.contains(dict.commons.delete).should('exist');
            }).trigger('mouseout');

            cy.get('button[id="edit-button"]').click();
            cy.get("label").contains(dict.noteFields.title).should('be.visible');
            cy.get("label").contains(dict.noteFields.content).should('be.visible');

            cy.get("input[name='title']").clear();
            cy.get("input[name='title']").type(`Updated Note 1 ${updatesCounter++}`);
            cy.get("button[id='save-button']").click();
            cy.get("[id='timestamp-selected-note']")
                .contains(`${dict.commons.editedAt}`).should('be.visible');
        }

        function selectLanguage(language: string) {
            cy.get('[id="language-select"]').trigger("mouseover").click();
            cy.contains(language).click();
        }

        selectLanguage('Українська')
        verifyTexts(ukDictionary);
        cy.reload();
        verifyTexts(ukDictionary);

        selectLanguage('English');
        verifyTexts(engDictionary);
        cy.reload();
        verifyTexts(engDictionary);
    });

    it('should show error when title is blank', () => {
        cy.contains('Note 1').click();
        cy.get("[id='edit-button']").click();
        cy.get('input[name="title"]').clear();
        cy.get("[id='save-button']").click();
        cy.contains('Must not be blank').should('be.visible');
        cy.get('input[name="title"]').type('Updated Note 1 v2');
        cy.get("[id='save-button']").click();
        cy.get('h1').contains('Updated Note 1 v2').should('be.visible');
    });

    it('should filter notes using search bar', () => {
        cy.get('input[id="notes-search"]').type('Note 1').type('{enter}');
        cy.contains('Note 2').should('not.exist');
    });

    it('should delete a note and persist after refresh', () => {

        function deleteNote(titlePart: string) {
            cy.contains(titlePart).click();
            cy.get('[id="delete-button"]').click();
            cy.contains(titlePart).should('not.exist');
            // wait for link to forward to home page
            cy.wait(100).reload();
            cy.contains(titlePart).should('not.exist');
        }

        deleteNote('Note 1');
        deleteNote('Note 2');
    });

    it('should log out', () => {
        cy.contains(username).click();
        cy.contains(engDictionary.loginRegister.logout).click();
        cy.contains('You must be logged in to access this page.').should('be.visible');
    });
});
