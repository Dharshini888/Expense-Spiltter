import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import AddExpenseForm from '../components/AddExpenseForm';
import AddMemberForm from '../components/AddMemberForm';
import Balances from '../components/Balances';
import GroupDetail from '../components/GroupDetail';
import GroupList from '../components/GroupList';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console warnings
const originalWarn = console.warn;
const originalError = console.error;
beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

describe('Expense Management Components Test Suite', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // AddExpenseForm Tests (4 tests)
  test('Form_AddExpenseForm renders all form fields correctly', () => {
    const mockMembers = ['Alice', 'Bob', 'Charlie'];
    const mockOnAddExpense = jest.fn();
    const mockPostAdd = jest.fn();

    render(
      <AddExpenseForm 
        groupId={1} 
        members={mockMembers} 
        onAddExpense={mockOnAddExpense} 
        postAdd={mockPostAdd}
      />
    );

    expect(screen.getByTestId('add-expense-form')).toBeInTheDocument();
    expect(screen.getByTestId('desc-input')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('payer-select')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-expense-button')).toBeInTheDocument();
    
    // Check if members are populated in dropdown
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('Form_AddExpenseForm validates required fields and amount format', async () => {
    const mockOnAddExpense = jest.fn();
    const mockPostAdd = jest.fn();

    render(
      <AddExpenseForm 
        groupId={1} 
        members={['Alice']} 
        onAddExpense={mockOnAddExpense} 
        postAdd={mockPostAdd}
      />
    );

    // Try to submit empty form
    fireEvent.click(screen.getByTestId('add-expense-button'));

    await waitFor(() => {
      expect(screen.getByText(/Fill all fields correctly/)).toBeInTheDocument();
    });

    // Test invalid amount
    fireEvent.change(screen.getByTestId('desc-input'), { target: { value: 'Test expense' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '-10' } });
    fireEvent.change(screen.getByTestId('payer-select'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2023-12-01' } });

    fireEvent.click(screen.getByTestId('add-expense-button'));

    await waitFor(() => {
      expect(screen.getByText(/Fill all fields correctly/)).toBeInTheDocument();
    });

    expect(mockOnAddExpense).not.toHaveBeenCalled();
  });

  test('Form_AddExpenseForm submits valid expense successfully', async () => {
    const mockOnAddExpense = jest.fn().mockResolvedValue({});
    const mockPostAdd = jest.fn();

    render(
      <AddExpenseForm 
        groupId={1} 
        members={['Alice']} 
        onAddExpense={mockOnAddExpense} 
        postAdd={mockPostAdd}
      />
    );

    // Fill form with valid data
    fireEvent.change(screen.getByTestId('desc-input'), { target: { value: 'Dinner' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '25.50' } });
    fireEvent.change(screen.getByTestId('payer-select'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2023-12-01' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-expense-button'));
    });

    await waitFor(() => {
      expect(mockOnAddExpense).toHaveBeenCalledWith(1, 'Dinner', 25.50, 'Alice', '2023-12-01');
      expect(mockPostAdd).toHaveBeenCalled();
    });

    // Form should be cleared - number input returns null when empty, text inputs return empty string
    expect(screen.getByTestId('desc-input')).toHaveValue('');
    expect(screen.getByTestId('amount-input')).toHaveValue(null);
    expect(screen.getByTestId('payer-select')).toHaveValue('');
    expect(screen.getByTestId('date-input')).toHaveValue('');
  });

  test('ErrorHandling_AddExpenseForm handles API error gracefully', async () => {
    const mockOnAddExpense = jest.fn().mockRejectedValue(new Error('Server error'));
    const mockPostAdd = jest.fn();

    render(
      <AddExpenseForm 
        groupId={1} 
        members={['Alice']} 
        onAddExpense={mockOnAddExpense} 
        postAdd={mockPostAdd}
      />
    );

    // Fill form with valid data
    fireEvent.change(screen.getByTestId('desc-input'), { target: { value: 'Dinner' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '25.50' } });
    fireEvent.change(screen.getByTestId('payer-select'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2023-12-01' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-expense-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });

    expect(mockPostAdd).not.toHaveBeenCalled();
  });

  // AddMemberForm Tests (3 tests)
  test('Form_AddMemberForm renders correctly and validates input', async () => {
    const mockOnAddMember = jest.fn();
    const mockPostAdd = jest.fn();

    render(
      <AddMemberForm 
        groupName="Test Group" 
        onAddMember={mockOnAddMember} 
        postAdd={mockPostAdd}
      />
    );

    expect(screen.getByTestId('add-member-form')).toBeInTheDocument();
    expect(screen.getByTestId('member-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-member-button')).toBeInTheDocument();

    // Try to submit empty form
    fireEvent.click(screen.getByTestId('add-member-button'));

    await waitFor(() => {
      expect(screen.getByText('Member name required')).toBeInTheDocument();
    });

    expect(mockOnAddMember).not.toHaveBeenCalled();
  });

  test('Form_AddMemberForm submits valid member successfully', async () => {
    const mockOnAddMember = jest.fn().mockResolvedValue({});
    const mockPostAdd = jest.fn();

    render(
      <AddMemberForm 
        groupName="Test Group" 
        onAddMember={mockOnAddMember} 
        postAdd={mockPostAdd}
      />
    );

    fireEvent.change(screen.getByTestId('member-input'), { target: { value: 'New Member' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-member-button'));
    });

    await waitFor(() => {
      expect(mockOnAddMember).toHaveBeenCalledWith('Test Group', 'New Member');
      expect(mockPostAdd).toHaveBeenCalled();
    });

    // Input should be cleared
    expect(screen.getByTestId('member-input')).toHaveValue('');
  });

  test('ErrorHandling_AddMemberForm handles API error', async () => {
    const mockOnAddMember = jest.fn().mockRejectedValue(new Error('Member already exists'));
    const mockPostAdd = jest.fn();

    render(
      <AddMemberForm 
        groupName="Test Group" 
        onAddMember={mockOnAddMember} 
        postAdd={mockPostAdd}
      />
    );

    fireEvent.change(screen.getByTestId('member-input'), { target: { value: 'Duplicate Member' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-member-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Member already exists')).toBeInTheDocument();
    });
  });

  // Balances Tests (2 tests)
  test('State_Balances displays member balances correctly', () => {
    const mockBalances = [
      { member: 'Alice', balance: 15.50 },
      { member: 'Bob', balance: -10.25 },
      { member: 'Charlie', balance: 0.00 }
    ];

    render(<Balances balances={mockBalances} />);

    expect(screen.getByTestId('balances-section')).toBeInTheDocument();
    expect(screen.getByTestId('balances-list')).toBeInTheDocument();
    expect(screen.getByText('Balances')).toBeInTheDocument();

    // Check balance formatting
    expect(screen.getByText(/Alice: ₹\+15\.50/)).toBeInTheDocument();
    expect(screen.getByText(/Bob: ₹-10\.25/)).toBeInTheDocument();
    expect(screen.getByText(/Charlie: ₹\+0\.00/)).toBeInTheDocument();
  });

  test('State_Balances shows empty state when no balances', () => {
    render(<Balances balances={[]} />);

    expect(screen.getByText('No balances to show.')).toBeInTheDocument();
  });

  // GroupList Tests (3 tests)
  test('State_GroupList displays groups correctly', () => {
    const mockGroups = [
      { groupId: 1, groupName: 'Trip to Goa', members: ['Alice', 'Bob'] },
      { groupId: 2, groupName: 'House Expenses', members: ['Charlie', 'Dave', 'Eve'] }
    ];
    const mockOnSelect = jest.fn();

    render(<GroupList groups={mockGroups} onSelect={mockOnSelect} selectedGroupId={1} />);

    expect(screen.getByTestId('group-list')).toBeInTheDocument();
    expect(screen.getByTestId('group-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('group-item-2')).toBeInTheDocument();

    expect(screen.getByText('Trip to Goa')).toBeInTheDocument();
    expect(screen.getByText('House Expenses')).toBeInTheDocument();
    expect(screen.getByText('(2 members)')).toBeInTheDocument();
    expect(screen.getByText('(3 members)')).toBeInTheDocument();
  });

  test('State_GroupList handles group selection', () => {
    const mockGroups = [
      { groupId: 1, groupName: 'Test Group', members: ['Alice'] }
    ];
    const mockOnSelect = jest.fn();

    render(<GroupList groups={mockGroups} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByTestId('group-item-1'));

    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  test('State_GroupList shows empty state when no groups', () => {
    const mockOnSelect = jest.fn();

    render(<GroupList groups={[]} onSelect={mockOnSelect} />);

    expect(screen.getByTestId('empty-groups')).toBeInTheDocument();
    expect(screen.getByText('No groups created yet.')).toBeInTheDocument();
  });

  // GroupDetail Tests (3 tests)
  test('State_GroupDetail displays group information correctly', () => {
    const mockGroup = { groupId: 1, groupName: 'Test Group' };
    const mockMembers = ['Alice', 'Bob'];
    const mockExpenses = [
      { expenseId: 1, description: 'Dinner', amount: 50.00, payer: 'Alice', date: '2023-12-01' }
    ];
    const mockBalances = [
      { member: 'Alice', balance: 25.00 },
      { member: 'Bob', balance: -25.00 }
    ];
    const mockProps = {
      group: mockGroup,
      members: mockMembers,
      expenses: mockExpenses,
      balances: mockBalances,
      onAddMember: jest.fn(),
      onAddExpense: jest.fn(),
      refreshData: jest.fn()
    };

    render(<GroupDetail {...mockProps} />);

    expect(screen.getByTestId('group-detail')).toBeInTheDocument();
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByTestId('group-members')).toBeInTheDocument();
    expect(screen.getByTestId('member-item-Alice')).toBeInTheDocument();
    expect(screen.getByTestId('member-item-Bob')).toBeInTheDocument();
    expect(screen.getByTestId('expense-list')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
  });

  test('State_GroupDetail shows empty states correctly', () => {
    const mockGroup = { groupId: 1, groupName: 'Empty Group' };
    const mockProps = {
      group: mockGroup,
      members: [],
      expenses: [],
      balances: [],
      onAddMember: jest.fn(),
      onAddExpense: jest.fn(),
      refreshData: jest.fn()
    };

    render(<GroupDetail {...mockProps} />);

    expect(screen.getByText('No members.')).toBeInTheDocument();
    expect(screen.getByText('No expenses added yet.')).toBeInTheDocument();
    expect(screen.getByText('No balances to show.')).toBeInTheDocument();
  });

  test('Form_GroupDetail integrates with AddMemberForm and AddExpenseForm', () => {
    const mockGroup = { groupId: 1, groupName: 'Integration Test' };
    const mockMembers = ['Alice'];
    const mockOnAddMember = jest.fn();
    const mockOnAddExpense = jest.fn();
    const mockRefreshData = jest.fn();

    const mockProps = {
      group: mockGroup,
      members: mockMembers,
      expenses: [],
      balances: [],
      onAddMember: mockOnAddMember,
      onAddExpense: mockOnAddExpense,
      refreshData: mockRefreshData
    };

    render(<GroupDetail {...mockProps} />);

    // Check that both forms are rendered
    expect(screen.getByTestId('add-member-form')).toBeInTheDocument();
    expect(screen.getByTestId('add-expense-form')).toBeInTheDocument();

    // Test member form
    fireEvent.change(screen.getByTestId('member-input'), { target: { value: 'Bob' } });
    fireEvent.click(screen.getByTestId('add-member-button'));

    // Test expense form has members populated
    const payerSelect = screen.getByTestId('payer-select');
    expect(payerSelect).toBeInTheDocument();
    
    // Use more specific selector to avoid multiple "Alice" elements
    expect(screen.getByRole('option', { name: 'Alice' })).toBeInTheDocument();
  });
});