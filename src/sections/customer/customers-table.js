import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import React, { useEffect, useState } from 'react';

export const CustomersTable = (props) => {
  const {
    count = 0,
    //items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  
  const [items, setItems] = useState([]);

  // NEW: State for loading and error handling (optional)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch data from server
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching data...');
        const response = await fetch('http://localhost:3001/data');  // Make sure the port and endpoint match your server setup
        if (!response.ok) throw new Error('Data fetch failed');
        const data = await response.json();
        setItems(data);  // Assuming the data structure matches your state
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);  // Empty dependency array means this effect runs once after the initial render
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Patient Name
                </TableCell>
                {/* <TableCell>
                  Email
                </TableCell> 
                 patient_name TEXT,
                room_number TEXT, 
                attending_person_name TEXT,
                audio_id TEXT,
                audio_label TEXT,
                send_timestamp DATETIME,
                reply_timestamp DATETIME,
                admin_comments TEXT,
                message_id INTEGER
                */}
                <TableCell>
                  Room Number
                </TableCell>
                <TableCell>
                  Attending Person Name
                </TableCell>
                <TableCell>
                  Send Timestamp
                </TableCell>
                <TableCell>
                  Reply Timestamp
                </TableCell>
                <TableCell>
                  Time Difference
                </TableCell>
                <TableCell>
                  Comments
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={customer.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.patient_name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.room_number}
                    </TableCell>
                    <TableCell>
                      {customer.attending_person_name}
                    </TableCell>
                    <TableCell>
                      {customer.send_timestamp}
                    </TableCell>
                    <TableCell>
                      {customer.reply_timestamp}
                    </TableCell>
                    <TableCell>
                      {customer.send_timestamp - customer.reply_timestamp}
                    </TableCell>
                    <TableCell>
                      {customer.admin_comments}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
