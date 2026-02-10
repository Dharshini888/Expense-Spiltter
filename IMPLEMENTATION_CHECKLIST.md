# Implementation Plan Checklist

## Original Question/Task

**Question:** <h1>Expense Splitter: Basic Group Expense Management System</h1>

<h2>Overview</h2>
<p>
You are required to implement a simple Expense Splitter application that allows users to create expense groups, add members to those groups, record shared expenses, and view how much each member owes or is owed within a group. The backend should be implemented using Spring Boot with MySQL as the database, and the frontend should be implemented using React.
</p>
<p>
This application will help users keep track of group expenses and easily determine the balances between group members.
</p>
<p>
<b>Note:</b> Use MySQL as the backend database.
</p>

<h2>Question Requirements</h2>

<h3>1. Group Management</h3>
<ul>
  <li>
    <b>Create a Group</b>
    <ul>
      <li>Implement functionality to create a new expense group with a unique group name.</li>
      <li>Each group must have at least one member at creation.</li>
      <li>
        <b>Example:</b> Creating a group named <i>Trip to Goa</i> with members <i>Alice</i> and <i>Bob</i>.
      </li>
    </ul>
  </li>
  <li>
    <b>Add Member to Group</b>
    <ul>
      <li>Allow adding a new member to an existing group by specifying the group name and the member's name.</li>
      <li>
        <b>Example:</b> Adding <i>Charlie</i> to the group <i>Trip to Goa</i>.
      </li>
    </ul>
  </li>
</ul>

<h3>2. Expense Recording</h3>
<ul>
  <li>
    <b>Add Expense</b>
    <ul>
      <li>Allow recording a new expense for a group.</li>
      <li>Each expense must have:
        <ul>
          <li>Expense description (e.g., "Lunch at Café")</li>
          <li>Amount (positive number, up to two decimal places)</li>
          <li>Payer (the member who paid)</li>
          <li>Date of expense</li>
        </ul>
      </li>
      <li>When an expense is added, the amount should be split equally among all current group members.</li>
      <li>
        <b>Example:</b> In group <i>Trip to Goa</i> (members: Alice, Bob, Charlie), Alice pays ₹900 for "Lunch at Café". Each member owes ₹300.
      </li>
    </ul>
  </li>
</ul>

<h3>3. Balance Calculation</h3>
<ul>
  <li>
    <b>View Group Balances</b>
    <ul>
      <li>Implement functionality to view the current balance for each member in a group.</li>
      <li>
        The balance for each member is calculated as: <br>
        <i>Balance = Total amount paid by the member - Total share owed by the member</i>
      </li>
      <li>
        <b>Example:</b> If Alice paid ₹900 and the group has 3 members, Alice's balance is ₹600 (paid ₹900, owed ₹300). Bob and Charlie each owe ₹300.
      </li>
      <li>
        The balances should be displayed as a list of members with their respective balances (positive means they are owed, negative means they owe).
      </li>
    </ul>
  </li>
</ul>

<h3>4. Frontend Requirements (React)</h3>
<ul>
  <li>
    <b>Display Groups and Members</b>
    <ul>
      <li>Show a list of all groups and their members.</li>
    </ul>
  </li>
  <li>
    <b>Add Expense Form</b>
    <ul>
      <li>Provide a form to add a new expense to a selected group with fields for description, amount, payer, and date.</li>
    </ul>
  </li>
  <li>
    <b>Display Balances</b>
    <ul>
      <li>Show the calculated balances for each member in a selected group.</li>
    </ul>
  </li>
</ul>

<h3>5. Validation and Error Handling</h3>
<ul>
  <li>
    <b>Group Name Uniqueness</b>
    <ul>
      <li>Do not allow creation of groups with duplicate names. Show an error message if a duplicate group name is entered.</li>
    </ul>
  </li>
  <li>
    <b>Expense Amount Validation</b>
    <ul>
      <li>Amount must be a positive number greater than zero and up to two decimal places. Show an error message for invalid amounts.</li>
    </ul>
  </li>
  <li>
    <b>Member Existence</b>
    <ul>
      <li>Do not allow adding expenses for non-existent members. Show an error if the payer is not a group member.</li>
    </ul>
  </li>
</ul>

<h3>6. API and Data Requirements</h3>
<ul>
  <li>
    <b>API Endpoints</b>
    <ul>
      <li>Implement RESTful endpoints for:
        <ul>
          <li>Creating a group</li>
          <li>Adding a member to a group</li>
          <li>Adding an expense to a group</li>
          <li>Fetching group details (members, expenses, balances)</li>
        </ul>
      </li>
      <li>
        Use standard HTTP status codes:<br>
        <ul>
          <li>201 for successful creation</li>
          <li>400 for validation errors</li>
          <li>404 for not found (e.g., group or member does not exist)</li>
        </ul>
      </li>
      <li>
        All responses should be in JSON format.
      </li>
    </ul>
  </li>
</ul>

<h3>7. Example Data</h3>
<ul>
  <li>
    <b>Sample Group Creation Request:</b>
    <ul>
      <li>
        <b>POST /groups</b><br>
        <b>Request:</b> { "groupName": "Trip to Goa", "members": ["Alice", "Bob"] }
      </li>
      <li>
        <b>Response (201):</b> { "groupId": 1, "groupName": "Trip to Goa", "members": ["Alice", "Bob"] }
      </li>
    </ul>
  </li>
  <li>
    <b>Sample Add Expense Request:</b>
    <ul>
      <li>
        <b>POST /groups/1/expenses</b><br>
        <b>Request:</b> { "description": "Lunch at Café", "amount": 900, "payer": "Alice", "date": "2024-06-01" }
      </li>
      <li>
        <b>Response (201):</b> { "expenseId": 1, "description": "Lunch at Café", "amount": 900, "payer": "Alice", "date": "2024-06-01" }
      </li>
    </ul>
  </li>
  <li>
    <b>Sample Balances Response:</b>
    <ul>
      <li>
        <b>GET /groups/1/balances</b><br>
        <b>Response (200):</b>
        <pre>
{
  "balances": [
    { "member": "Alice", "balance": 600 },
    { "member": "Bob", "balance": -300 },
    { "member": "Charlie", "balance": -300 }
  ]
}
        </pre>
      </li>
    </ul>
  </li>
</ul>

<h3>8. Error Message Format</h3>
<ul>
  <li>
    All error responses must be in the following format:
    <pre>
{
  "error": "Error message here"
}
    </pre>
  </li>
</ul>

**Created:** 2025-08-01 07:51:43
**Total Steps:** 11

## Detailed Step Checklist

### Step 1: Read and analyze backend dependencies from pom.xml and confirm project structure.
- [x] **Status:** ✅ Completed
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/pom.xml
- **Description:** Ensures all required backend libraries are available and understand entrypoints for adding entities, repositories, services, and controllers.

### Step 2: Implement backend entity classes for Group, Member, and Expense with correct relationships.
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/model/Group.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/model/Member.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/model/Expense.java
- **Description:** Foundation data model for the expense splitter; enables persistence and relationship management for groups, members, and expenses.

### Step 3: Create repository interfaces for Group, Member, and Expense.
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/repository/GroupRepository.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/repository/MemberRepository.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/repository/ExpenseRepository.java
- **Description:** Adds data access layer for efficient CRUD and custom queries on persisted model objects.

### Step 4: Implement backend service layer with business logic for group and expense management.
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/service/GroupService.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/service/ExpenseService.java
- **Description:** Centralizes application logic and validation, ensuring a clean separation between controller and repository. Handles all required constraints and computational logic.

### Step 5: Create REST controllers for group and expense operations with required endpoints and error handling.
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/controller/GroupController.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/controller/ExpenseController.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/exception/GlobalExceptionHandler.java
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/main/java/com/examly/springapp/ExpenseSplitterApplication.java
- **Description:** Exposes backend services as RESTful APIs with JSON responses and error handling conforming to requirements for frontend integration and automated testing.

### Step 6: Implement JUnit test cases for backend logic and endpoints as required by test cases JSON.
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/test/java/com/examly/springapp/controller/GroupControllerTest.java
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp/src/test/java/com/examly/springapp/controller/ExpenseControllerTest.java
- **Description:** Provides complete automated testing for backend REST endpoints, validating that requirements and error handling match test expectations.

### Step 7: Compile, build, and run backend tests
- [x] **Status:** ✅ Completed
- **Description:** Verifies backend compiles cleanly and all backend test cases pass as required.

### Step 8: Read and analyze frontend dependencies from package.json and confirm project structure.
- [x] **Status:** ✅ Completed
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/package.json
- **Description:** Confirms the React frontend has correct dependencies installed before component implementation.

### Step 9: Implement React frontend components, utilities, and styling
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/GroupList.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/GroupDetail.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/AddMemberForm.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/AddExpenseForm.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/Balances.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/utils/api.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/utils/constants.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/index.css
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/App.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/App.css
- **Description:** Implements all required UI features for group/expense management, state, and display; ensures modern design and minimal styling for usability and testability.

### Step 10: Implement Jest test cases for frontend components as per test cases JSON.
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/GroupList.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/GroupDetail.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/AddExpenseForm.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/components/Balances.test.js
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/reactapp/src/App.test.js
- **Description:** Ensures all required frontend tests are in place and passing by testing key rendering, validation, and error logic, fully matching sample data and formats.

### Step 11: Install, lint, build, and run Jest tests for frontend.
- [x] **Status:** ✅ Completed
- **Description:** Compiles, lints, and validates that all required frontend components and tests are built and functioning as expected.

## Completion Status

| Step | Status | Completion Time |
|------|--------|----------------|
| Step 1 | ✅ Completed | 2025-08-01 07:51:52 |
| Step 2 | ✅ Completed | 2025-08-01 07:52:07 |
| Step 3 | ✅ Completed | 2025-08-01 07:52:24 |
| Step 4 | ✅ Completed | 2025-08-01 07:52:57 |
| Step 5 | ✅ Completed | 2025-08-01 07:53:48 |
| Step 6 | ✅ Completed | 2025-08-01 07:54:44 |
| Step 7 | ✅ Completed | 2025-08-01 07:55:29 |
| Step 8 | ✅ Completed | 2025-08-01 07:55:45 |
| Step 9 | ✅ Completed | 2025-08-01 07:58:34 |
| Step 10 | ✅ Completed | 2025-08-01 07:58:45 |
| Step 11 | ✅ Completed | 2025-08-01 08:00:24 |

## Notes & Issues

### Errors Encountered
- None yet

### Important Decisions
- Step 11: Frontend dependencies installed, build succeeded, linting passed, and all Jest tests executed successfully.

### Next Actions
- Begin implementation following the checklist
- Use `update_plan_checklist_tool` to mark steps as completed
- Use `read_plan_checklist_tool` to check current status

### Important Instructions
- Don't Leave any placeholders in the code.
- Do NOT mark compilation and testing as complete unless EVERY test case is passing. Double-check that all test cases have passed successfully before updating the checklist. If even a single test case fails, compilation and testing must remain incomplete.
- Do not mark the step as completed until all the sub-steps are completed.

---
*This checklist is automatically maintained. Update status as you complete each step using the provided tools.*