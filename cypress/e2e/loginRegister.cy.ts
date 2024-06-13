import engDictionary from "@/config/locales/dicts/en";

// TODO: delete created user after test
describe('Login and register', () => {
    const newUsername = `user${Math.floor(Math.random() * 10000)}`
    const password = 'pass123G$%!';

    beforeEach(() => {
        cy.visit('/').wait(300); // wait so ui becomes interactive
    });

    it('should display login page for unlogged user', () => {
        cy.visit('/');
        cy.get("h3").contains(engDictionary.commons.mustBeLoggedIn).should('be.visible');
    });

    it('should show registration error on weak password', () => {
        // for some reason, the button click does not do anything unless we trigger a mouseover
        cy.get("button").contains(engDictionary.loginRegister.login).trigger('mouseover').click();
        cy.contains('button', engDictionary.loginRegister.dontHaveAnAccount).click();
        cy.get('input[name="username"]').type(newUsername);
        cy.get('input[name="password"]').type("12g");
        cy.get('input[name="passwordConfirmation"]').type("12g");
        cy.get('button[type="submit"]').click();
        cy.contains(engDictionary
            .errors["Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit and one special character"]).should('be.visible');
        cy.get('input[name="password"]').clear();
        cy.get('input[name="password"]').type(password);
        cy.get('input[name="passwordConfirmation"]').clear();
        cy.get('input[name="passwordConfirmation"]').type(password);
        cy.get('button[type="submit"]').click();
        cy.get("[id='login-register-backdrop']").should('not.exist');
        cy.contains(engDictionary.commons.mustBeLoggedIn).should('not.exist');
    });
});