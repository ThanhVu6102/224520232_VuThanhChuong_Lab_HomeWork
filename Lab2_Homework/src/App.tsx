import { useState } from 'react';
import { DataGrid, type ColumnDef } from './components/DataGrid';
import { mockData, type UserData } from './data';

const columns: ColumnDef<UserData>[] = [
  { header: 'ID', accessorKey: 'id', sortable: true },
  { header: 'Name', accessorKey: 'name', sortable: true },
  { header: 'Role', accessorKey: 'role', sortable: true },
  { header: 'Status', accessorKey: 'status', sortable: true },
];

function App() {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  return (
    <main className="app">
      <h1 className="app__title">Enterprise Data Grid</h1>
      <p className="app__subtitle">
        An accessible user directory with filtering, sorting, pagination, and
        full keyboard navigation.
      </p>

      <DataGrid
        data={mockData}
        columns={columns}
        ariaLabel="User management directory"
        onRowSelect={setSelectedUser}
      />

      <p className="app__selection">
        {selectedUser
          ? `Selected user: ${selectedUser.name} (${selectedUser.role}, ${selectedUser.status})`
          : 'No user selected. Focus a row and press Enter or Space to select it.'}
      </p>
    </main>
  );
}

export default App;
