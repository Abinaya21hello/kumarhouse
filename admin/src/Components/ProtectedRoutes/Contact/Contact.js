import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TablePagination, // Import TablePagination from @mui/lab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../api/axiosInstance';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.black,
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : theme.palette.background.default,
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [page, setPage] = useState(0); // Page number for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get('api/getcontact', {
        withCredentials: true,
      });

      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(true);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.includes(term) ||
      contact.category.toLowerCase().includes(term) ||
      contact.message.toLowerCase().includes(term) ||
      contact.location.toLowerCase().includes(term)
    );
    setFilteredContacts(filtered);
  };

  const handleDelete = async () => {
    if (!currentContact) return;

    try {
      await axiosInstance.delete(`api/contact/${currentContact._id}`, {
        withCredentials: true,
      });

      setContacts(prevContacts => prevContacts.filter(contact => contact._id !== currentContact._id));
      setFilteredContacts(prevFilteredContacts => prevFilteredContacts.filter(contact => contact._id !== currentContact._id));
      handleCloseDeleteDialog();

      // Show success toast notification
      alert('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      // Show error toast notification
      alert('Error deleting contact. Please try again.');
    }
  };

  const handleOpenDeleteDialog = (contact) => {
    setCurrentContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setCurrentContact(null);
    setDeleteDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Contact List
      </Typography>
      {error && <Typography color="error">Error fetching contacts. Please try again.</Typography>}
      <SearchBar
        placeholder="Search contacts"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Message</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact, index) => (
                <StyledTableRow key={contact._id} index={index}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.category}</TableCell>
                  <TableCell>{contact.message}</TableCell>
                  <TableCell>{contact.location}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(contact)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        component="div"
        count={filteredContacts.length} // Total number of rows
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Contact</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete <strong>{currentContact ? currentContact.name : ''}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
};

export default ContactList;
