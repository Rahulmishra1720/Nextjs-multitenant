'use client';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { supabase } from '../supabase';

const Employee = (): React.ReactElement => {
  const [tenants, setTenants] = React.useState<any[]>([]);
  React.useEffect(() => {
    loadTenantsData();
  }, []);

  const loadTenantsData = async () => {
    const tenantResponse = await getTenants();
    setTenants(tenantResponse);
  };
  const getTenants = async (): Promise<any[]> => {
    let { data, error } = await supabase.from('tenant').select('*');
    return data || [];
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align='left'>{'Tenant id'}</TableCell>
            <TableCell align="left">{'Tenant Name'}</TableCell>
            <TableCell align="left">{'Tenant Email'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tenants.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row.id}</TableCell>
              <TableCell align="left">{row.tenant_name}</TableCell>
              <TableCell align="left">{row.tenant_email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Employee;