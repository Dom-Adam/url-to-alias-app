# Backend

The backend is split up into a controller and data layer. I decided to leave out the service layer since it was not needed. Because the data is essentially just a mapping, I decided to go with a key-value database, which offers better performance. I, however, separated the data logic into a separate layer, so it would be easy to switch to a relational database.

| Package                | Reason                                                                                         |
| :--------------------- | :--------------------------------------------------------------------------------------------- |
| express                | most popular backend framework for Typescript                                                  |
| express-validator      | makes validation in express apps easier                                                        |
| lmdb                   | database that offers extemely fast writes and because of memory mapping even synchronous reads |
| unique-names-generator | used for creating alias if none was provided                                                   |
| jest                   | most popular test runner for Typescript and Javascript                                         |
| supertest              | used to mock network requests                                                                  |

# Frontend

The frontend is kept pretty simple. Because of the simplicity of the app, I decided to not use any state management libraries or rest clients to keep the bundle size small.

| Package                | Reason                                                  |
| :--------------------- | :------------------------------------------------------ |
| react                  | most popular web frontend framework                     |
| @testing-library/react | standard for testing in react                           |
| antd                   | provides good styles and form validation out of the box |
| msw                    | makes mocking fetch requests easier                     |

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

To run end to end tests, run this command

```bash
npm run e2e-test
```
