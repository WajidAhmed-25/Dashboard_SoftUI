import React, { Component } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from 'examples/Tables/Table-Log';
import { Grid } from "@mui/material";
import SoftInput from "components/SoftInput";
import "./style.css";
import { Pagination } from "@mui/material";
import { apiUrl } from "../../config/config";

class Assigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      filteredRows: [],
      clientCodeFilter: "",
      idFilter: "",
      dateFrom: "",
      dateTo: "",
      currentPage: 1,
      itemsPerPage: 50,
      totalItems: 0,
    };

    this.fetchDataUrl = `${apiUrl}/api/order-logs/status/Assign?page=`;

    this.handleClientCodeChange = this.handleClientCodeChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.state.currentPage);
  }

  fetchData(page) {
    axios
      .get(`${this.fetchDataUrl}${page}`)
      .then((response) => {
        console.log("API response Logs:", response.data);
        if (response.data) {
          const transformedRows = response.data.map((item) => ({
            id: item.id,
            order_id: item.order_id,
            status: item.status || "N/A",
            description: item.description || "N/A",
            email: item.user?.name || "N/A",
            created_at: new Date(item.created_at).toLocaleDateString(),
            updated_at: new Date(item.updated_at).toLocaleDateString(),
            is_active: item.is_active ? (
              <SoftTypography
                variant="caption"
                color="#8392ab"
                fontWeight="medium"
              >
                {item.is_active}
              </SoftTypography>
            ) : (
              <SoftTypography
                variant="caption"
                color="error"
                fontWeight="medium"
              >
                Inactive
              </SoftTypography>
            ),

            statusDisplay: (
              <SoftTypography
                variant="caption"
                // color={item.status === "Assign" ? "success" : "secondary"}
                color="#8392ab"
                fontWeight="medium"
              >
                {item.status || "N/A"}
              </SoftTypography>
            ),

            view: (
              <SoftTypography
                component="a"
                href="#"
                variant="caption"
                color="primary"
                fontWeight="medium"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleView(item.id);
                }}
                style={{ cursor: "pointer" }}
              >
                View
              </SoftTypography>
            ),

            edit: (
              <SoftTypography
                component="a"
                href="#"
                variant="caption"
                color="secondary"
                fontWeight="medium"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleEdit(item.id);
                }}
                style={{ cursor: "pointer" }}
              >
                Edit
              </SoftTypography>
            ),
          }));

          this.setState({
            rows: transformedRows,
            filteredRows: transformedRows,
            totalItems: response.data.length,
          });
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  handleClientCodeChange(event) {
    const clientCodeFilter = event.target.value;
    this.setState({ clientCodeFilter }, this.applyFilters);
  }

  handleIdChange(event) {
    const idFilter = event.target.value;
    this.setState({ idFilter }, this.applyFilters);
  }

  handleDateFromChange(event) {
    const dateFrom = event.target.value;
    this.setState({ dateFrom }, this.applyFilters);
  }

  handleDateToChange(event) {
    const dateTo = event.target.value;
    this.setState({ dateTo }, this.applyFilters);
  }

  handlePageChange(event, page) {
    this.setState({ currentPage: page }, () => {
      this.fetchData(page);
    });
  }

  handleView(id) {
    window.location.href = `/logs/view/${id}`;
  }

  handleEdit(id) {
    window.location.href = `/logs/edit/${id}`;
  }

  applyFilters() {
    const { rows, clientCodeFilter, idFilter, dateFrom, dateTo } = this.state;

    const filteredRows = rows.filter((row) => {
      const matchesClientCode =
        clientCodeFilter === "" || 
        row.email.toLowerCase().includes(clientCodeFilter.toLowerCase());
      
      const matchesId = 
        idFilter === "" || 
        row.id.toString().includes(idFilter);
      
      const matchesDateFrom = 
        dateFrom === "" || 
        new Date(row.created_at) >= new Date(dateFrom);
      
      const matchesDateTo = 
        dateTo === "" || 
        new Date(row.created_at) <= new Date(dateTo);

      return matchesClientCode && matchesId && matchesDateFrom && matchesDateTo;
    });

    this.setState({ filteredRows });
  }

  render() {
    const { currentPage, itemsPerPage, filteredRows, totalItems } = this.state;
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const columns = [
      { name: "ID", accessor: "id", width: "5%" },
      { name: "Order ID", accessor: "order_id", width: "10%" },
      { name: "User ", accessor: "email", width: "20%" },
      { name: "Status", accessor: "statusDisplay", width: "10%" },
      { name: "Description", accessor: "description", width: "20%" },
      { name: "Active Status", accessor: "is_active", width: "5%" },
      { name: "View", accessor: "view", width: "5%" },
      { name: "Edit", accessor: "edit", width: "5%" },
    ];

    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftBox mb={3}>
            {/* Filter Card */}
            <Card style={{ padding: "26px" }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <SoftTypography variant="h6" className="text_decor">
                    Client Email
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      placeholder="Type here..."
                      icon={{ component: "search", direction: "left" }}
                      value={this.state.clientCodeFilter}
                      onChange={this.handleClientCodeChange}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={2}>
                  <SoftTypography variant="h6" className="text_decor">
                    Log ID
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      placeholder="Type here..."
                      icon={{ component: "search", direction: "left" }}
                      value={this.state.idFilter}
                      onChange={this.handleIdChange}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={2}>
                  <SoftTypography variant="h6" className="text_decor">
                    From
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      type="date"
                      value={this.state.dateFrom}
                      onChange={this.handleDateFromChange}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={2}>
                  <SoftTypography variant="h6" className="text_decor">
                    To
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      type="date"
                      value={this.state.dateTo}
                      onChange={this.handleDateToChange}
                    />
                  </SoftBox>
                </Grid>
              </Grid>
            </Card>

            {/* Table Card */}
            <br />
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Logs</SoftTypography>
              </SoftBox>
              <SoftBox>
                <Table columns={columns} rows={filteredRows} />
              </SoftBox>
            </Card>

            {/* Pagination */}
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={this.handlePageChange}
              variant="outlined"
              shape="rounded"
              style={{ 
                marginTop: "20px", 
                marginBottom: "20px", 
                display: "flex",
                justifyContent: "center"
              }}
            />
          </SoftBox>
          <Footer />
        </SoftBox>
      </DashboardLayout>
    );
  }
}

export default Assigned;