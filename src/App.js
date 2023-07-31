import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  CircularProgress,
  Typography,
  InputBase,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridToolbar, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport } from "@mui/x-data-grid";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles"; // Import styled to style the avatars
import "./App.css"; // Import the custom CSS file for the hover effect

const ROWS_PER_PAGE = 5; // Number of students to display per page

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "avatar", // Add the photo column after the ID column
    headerName: "Photo",
    width: 150,
    renderCell: AvatarCell, // Use the custom AvatarCell for the avatar column
  },
  { field: "name", headerName: "Name", width: 200 },
  { field: "college", headerName: "College", width: 300 },
  { field: "course", headerName: "Course", width: 350 },
  { field: "email", headerName: "Email", width: 300, headerClassName: "bold-column" }, // New column for email
];

const AvatarCellRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .avatar": {
    width: theme.spacing(6),
    height: theme.spacing(6),
    fontSize: "1.5rem",
    borderRadius: "50%", // Make the avatar circular
    overflow: "hidden", // Hide any overflow (in case the image is not perfectly square)
  },
}));

function AvatarCell(params) {
  // Generate the profile photo URL using the provided image index
  const profileImageIndex = params.row.id;
  const profileImageUrl = `${process.env.PUBLIC_URL}/images/${profileImageIndex}.png`;

  return (
    <AvatarCellRoot>
      <Avatar className="avatar-mini">
        <img src={profileImageUrl} alt={`Profile ${profileImageIndex}`} />
      </Avatar>
    </AvatarCellRoot>
  );
}

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for the side navigation drawer
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [paginatedStudents, setPaginatedStudents] = useState([]);

  useEffect(() => {
    fetchStudentData();
  }, []); // Fetch data only once when the component mounts

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("https://flask-resume-api.onrender.com/api/resume");
      // Add a unique id to each student entry in the response data
      const studentsWithId = response.data.map((student, index) => ({
        ...student,
        id: index + 1,
      }));
      setApiResponse(studentsWithId);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiResponse) {
      // Convert data from the API into the format expected by the DataGrid
      const paginatedData = apiResponse.map((student, index) => {
        return {
          id: student.education[0]?.education_id || index + 1,
          name: student.first_name + " " + student.last_name,
          college: student.education[0]?.school_name || "",
          course: student.education[0]?.field_of_study || "",
          email: student.email || "", // Get the email from the JSON data
        };
      });

      setPaginatedStudents(paginatedData);

      // Calculate the total number of pages based on the number of students
      const totalPages = Math.ceil(apiResponse.length / ROWS_PER_PAGE);
      setTotalPages(totalPages);
    }
  }, [apiResponse]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const handleDownloadCSV = () => {
    // Code to download the data as a CSV file
    const csvData = paginatedStudents.map((student) => {
      return `${student.id},${student.name},${student.college},${student.course},${student.email}`; // Include email in CSV
    });
    const csvHeaders = "ID,Name,College,Course,Email\n";
    const csv = csvHeaders + csvData.join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <div className="menu-icon" onClick={handleDrawerToggle}>
              <MenuIcon style={{ color: "white" }} />
            </div>
            <Typography variant="h4" className="header-text">
              Admin Dashboard - Students
            </Typography>
          </div>
          <div className="header-right">
            <div className="search">
              <InputBase
                placeholder="Search by name..."
                onChange={handleSearch}
                value={searchQuery}
                startAdornment={<SearchIcon style={{ color: "white" }} />}
                inputProps={{ style: { color: "white" } }}
              />
            </div>
          </div>
        </div>
      </header>
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
        <List>
          {/* Add the "menu-item" class to apply the hover effect */}
          <ListItem button onClick={handleDownloadCSV} className="menu-item">
            <ListItemIcon>
              <CloudDownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Download CSV" />
          </ListItem>
          <Divider />
          {/* Add more items for the side navigation drawer here if needed */}
        </List>
      </Drawer>
      <main className="page-content">
        <Container maxWidth="xl" className="main-content">
          <Paper elevation={3} className="table-container">
            {loading ? (
              <div className="loading">
                <CircularProgress />
              </div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={paginatedStudents}
                  columns={columns}
                  pageSize={ROWS_PER_PAGE}
                  components={{
                    Toolbar: CustomGridToolbar, // Use CustomGridToolbar here
                  }}
                  rowHeight={80} // Increase the row height
                />
              </div>
            )}
          </Paper>
          {apiResponse && apiResponse.education && (
            <div className="pagination">
              <Typography variant="caption" gutterBottom>
                Page {currentPage + 1} of {totalPages}
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                shape="rounded"
              />
            </div>
          )}
        </Container>
      </main>
      <footer className="App-footer">
        <Typography variant="h6" gutterBottom>
          Copyright © 2023 Suraj Singh
        </Typography>
      </footer>
    </div>
  );
}

function CustomGridToolbar() {
  return (
    <GridToolbar>
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarExport />
    </GridToolbar>
  );
}

export default App;
