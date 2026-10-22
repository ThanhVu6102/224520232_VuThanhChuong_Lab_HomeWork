export interface UserData {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export const mockData: UserData[] = [
  { id: 1, name: 'Alice Nguyen', role: 'Administrator', status: 'Active' },
  { id: 2, name: 'Bob Tran', role: 'Developer', status: 'Inactive' },
  { id: 3, name: 'Charlie Le', role: 'Designer', status: 'Active' },
  { id: 4, name: 'David Pham', role: 'Manager', status: 'Active' },
  { id: 5, name: 'Eva Hoang', role: 'Developer', status: 'Inactive' },
  { id: 6, name: 'Frank Vu', role: 'QA Engineer', status: 'Active' },
  { id: 7, name: 'Grace Do', role: 'DevOps Engineer', status: 'Active' },
  { id: 8, name: 'Henry Dang', role: 'Developer', status: 'Inactive' },
  { id: 9, name: 'Irene Bui', role: 'Product Owner', status: 'Active' },
  { id: 10, name: 'Jack Ngo', role: 'Business Analyst', status: 'Active' },
  { id: 11, name: 'Kim Tran', role: 'Designer', status: 'Inactive' },
  { id: 12, name: 'Liam Vo', role: 'Manager', status: 'Active' },
  { id: 13, name: 'Mia Phan', role: 'QA Engineer', status: 'Active' },
  { id: 14, name: 'Noah Le', role: 'Developer', status: 'Inactive' },
  { id: 15, name: 'Olivia Nguyen', role: 'Administrator', status: 'Active' },
];
