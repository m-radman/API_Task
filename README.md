# QA AUTOMATION API TASK  
  
## Task Reequirements  
The application under test: https://demoqa.com/books  
  
### Objectives:  
 - Test `register` functionality, positive and few negative cases  
 - Test `login` functionality, positive and few negative cases  
 - Test books manipulation, `post` books to user collection and `delete` books from users collection (think about negative cases)  
  
## Solution  
- The implementation of `register` tests is available [here](https://github.com/m-radman/API_Task/blob/main/tests/register_user.test.js)  
- The implementation of `login` tests is available [here](https://github.com/m-radman/API_Task/blob/main/tests/login_user.test.js)  
- The implementation of `add books` tests is available [here](https://github.com/m-radman/API_Task/blob/main/tests/add_books.test.js)
- The implementation of `delete books` tests is available [here](https://github.com/m-radman/API_Task/blob/main/tests/delete_books.test.js)  
  
## How to run tests  
To run tests locally please follow the steps:  
  
  - `Step1` Clone this repository to your local machine
    > git clone https://github.com/m-radman/API_Task.git
  - `Step2` Install dependencies
    > npm install
  - `Step3` Running tests  
    - run all tests  
        >npm run test
    - run registration tests  
        > npm run test:register  
    - run login tests  
        > npm run test:login  
    - run adding books tests  
        > npm run test:add  
    - run delete tests  
        > npm run test:delete