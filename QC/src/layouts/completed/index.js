import React, { Component } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from 'examples/Tables/Table-Log';
import { Grid, Pagination } from "@mui/material";
import SoftInput from "components/SoftInput";
import "./style.css";
import { apiUrl } from "../../config/config";

class Completed extends Component {
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

    this.fetchDataUrl = `${apiUrl}/api/order-logs/status/Completed?page=`;
  }

  componentDidMount() {
    this.fetchData(this.state.currentPage);
  }

  fetchData(page) {
    axios
      .get(`${this.fetchDataUrl}${page}`)
      .then((response) => {
        console.log("API response Logs:", response.data);
        if (Array.isArray(response.data)) {
          const transformedRows = response.data.map((item) => ({
            id: item.id || "N/A",
            order_id: item.order_id || "N/A",
            status: item.status || "N/A",
            description: item.description || "N/A",
            email: item.user?.name || "N/A",
            is_active: item.is_active || "N/A",
            created_at: new Date(item.created_at).toLocaleDateString(),
            updated_at: new Date(item.updated_at).toLocaleDateString(),
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
                  this.handleEdit(item);
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

  handleClientCodeChange = (event) => {
    const clientCodeFilter = event.target.value;
    this.setState({ clientCodeFilter }, this.applyFilters);
  }

  handleIdChange = (event) => {
    const idFilter = event.target.value;
    this.setState({ idFilter }, this.applyFilters);
  }

  handleDateFromChange = (event) => {
    const dateFrom = event.target.value;
    this.setState({ dateFrom }, this.applyFilters);
  }

  handleDateToChange = (event) => {
    const dateTo = event.target.value;
    this.setState({ dateTo }, this.applyFilters);
  }

  handlePageChange = (event, page) => {
    this.setState({ currentPage: page }, () => {
      this.fetchData(page);
    });
  }

  handleView = (id) => {
    window.location.href = `/logs/view/${id}`;
  }

  handleEdit = (item) => {
    // Store the item data in localStorage before navigation
    localStorage.setItem('editLogData', JSON.stringify(item));
    window.location.href = `/logs/edit/${item.id}`;
  }

  applyFilters = () => {
    const { rows, clientCodeFilter, idFilter, dateFrom, dateTo } = this.state;

    const filteredRows = rows.filter((row) => {
      const matchesClientCode =
        !clientCodeFilter || row.email.toLowerCase().includes(clientCodeFilter.toLowerCase());
      const matchesId = !idFilter || row.id.toString().includes(idFilter);
      const matchesDateFrom = !dateFrom || new Date(row.created_at) >= new Date(dateFrom);
      const matchesDateTo = !dateTo || new Date(row.created_at) <= new Date(dateTo);

      return matchesClientCode && matchesId && matchesDateFrom && matchesDateTo;
    });

    this.setState({ filteredRows });
  }

  render() {
    const { currentPage, itemsPerPage, filteredRows, totalItems } = this.state;
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const columns = [
      { name: "ID", accessor: "id" },
      { name: "Order ID", accessor: "order_id" },
      { name: "User", accessor: "email" },
      { name: "Status", accessor: "status" },
      { name: "Description", accessor: "description" },

      { name: "Active Status", accessor: "is_active" },
      // { name: "Created At", accessor: "created_at" },
      // { name: "Updated At", accessor: "updated_at" },
      { name: "View", accessor: "view" },
      { name: "Edit", accessor: "edit" },
    ];

    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftBox mb={3}>
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
            <br />
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Logs</SoftTypography>
              </SoftBox>
              <SoftBox>
                <Table columns={columns} rows={filteredRows} />
              </SoftBox>
            </Card>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={this.handlePageChange}
              variant="outlined"
              shape="rounded"
              style={{ marginTop: "20px", marginBottom: "20px", textAlign: "center" }}
            />
          </SoftBox>
          <Footer />
        </SoftBox>
      </DashboardLayout>
    );
  }
}

export default Completed;