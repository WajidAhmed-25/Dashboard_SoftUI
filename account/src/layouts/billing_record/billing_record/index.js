import React, { Component } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { Grid } from "@mui/material";
import SoftInput from "components/SoftInput";
import { Pagination } from "@mui/material";
import "./style.css";

class BillingRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [], // To hold the raw data from the API
      filteredRows: [], // To hold the filtered rows based on the user's input
      selectedRows: [], // To track selected rows for the "View Invoice" action
      filterValue: "",
      clientCodeFilter: "",
      idFilter: "",
      dateFrom: "",
      dateTo: "",
      sentimentFilter: "",
      currentPage: 1,
      itemsPerPage: 50,
    };

    this.fetchDataUrl = "http://localhost:8000/api/order-logs/";

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleClientCodeChange = this.handleClientCodeChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handleSentimentFilterChange = this.handleSentimentFilterChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    axios
      .get(this.fetchDataUrl)
      .then((response) => {
        console.log("API response:", response.data);
        const rows = response.data.map((item) => ({
          id: item.id,
          order_id: item.order_id,
          user_name: item.user.name,
          email_subject: item.email_response.email_subject,
          category: item.email_response.category,
          order_type: item.email_response.order_type,
          client_code: item.email_response.client_code,
          sentiments: item.email_response.sentiments,
          priority: item.email_response.priority,
          created_at: item.email_response.created_at,
          attachments: item.email_response.attachments,
        }));

        this.setState({ rows, filteredRows: rows });
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }

  handleFilterChange(event) {
    const filterValue = event.target.value;
    this.setState({ filterValue }, this.applyFilters);
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

  handleSentimentFilterChange(event) {
    const sentimentFilter = event.target.value;
    this.setState({ sentimentFilter }, this.applyFilters);
  }

  handlePageChange(event, page) {
    this.setState({ currentPage: page });
  }

  handleCheckboxChange(id, isChecked) {
    const { rows } = this.state;
    const selectedRow = rows.find((row) => row.id === id);

    if (isChecked) {
      this.setState((prevState) => ({
        selectedRows: [...prevState.selectedRows, selectedRow],
      }));
    } else {
      this.setState((prevState) => ({
        selectedRows: prevState.selectedRows.filter((row) => row.id !== id),
      }));
    }
  }

  applyFilters() {
    const { rows, filterValue, sentimentFilter, clientCodeFilter, idFilter, dateFrom, dateTo } = this.state;

    const filteredRows = rows.filter((row) => {
      const matchesFilterValue =
        filterValue === "" || row.order_type === filterValue || row.required_file_format === filterValue;
      const matchesSentiment = sentimentFilter === "" || row.sentiments === sentimentFilter;
      const matchesClientCode =
        clientCodeFilter === "" || row.client_code.toLowerCase().includes(clientCodeFilter.toLowerCase());
      const matchesId = idFilter === "" || row.id.toString().includes(idFilter);
      const matchesDateFrom = dateFrom === "" || new Date(row.created_at) >= new Date(dateFrom);
      const matchesDateTo = dateTo === "" || new Date(row.created_at) <= new Date(dateTo);

      return (
        matchesFilterValue &&
        matchesSentiment &&
        matchesClientCode &&
        matchesId &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    this.setState({ filteredRows });
  }

  render() {
    const { currentPage, itemsPerPage, filteredRows, selectedRows } = this.state;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(filteredRows.length / itemsPerPage);

    const columns = [
      { name: "", accessor: "sentiments" },
      { name: "", accessor: "priority" },
      { name: "Order No.", accessor: "id" },
      { name: "Client ID", accessor: "order_id" },
      { name: "Category", accessor: "category" },
      { name: "Type", accessor: "order_type" },
      { name: "Upload From", accessor: "user_name" },
      { name: "Date", accessor: "created_at" },
      { name: "Attachments", accessor: "attachments" },
      { name: "Code", accessor: "client_code" },
      { name: "Subject", accessor: "email_subject" },
      { name: "View", accessor: "view" },
    ];

    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftBox mb={3}>
            <Card style={{ padding: "26px" }}>
              <Grid container spacing={2}>
                {/* Order Type Filter */}
                <Grid item xs={1.5}>
                  <SoftTypography variant="h6" className="text_decor">
                    Order Type
                  </SoftTypography>
                  <select
                    style={{
                      width: "100%",
                      height: "60%",
                      borderRadius: "9px",
                      padding: "6px",
                      fontSize: "0.875rem",
                      border: "1px solid #aaaa",
                    }}
                    value={this.state.filterValue}
                    onChange={this.handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Digitizing">Digitizing</option>
                    <option value="Vector">Vector</option>
                  </select>
                </Grid>
                {/* Client Code Filter */}
                <Grid item xs={2.5}>
                  <SoftTypography variant="h6" className="text_decor">
                    Client Code
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
                {/* Order No. Filter */}
                <Grid item xs={2}>
                  <SoftTypography variant="h6" className="text_decor">
                    Order No.
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
                {/* Date From Filter */}
                <Grid item xs={1.5}>
                  <SoftTypography variant="h6" className="text_decor">
                    From
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      type="date"
                      placeholder="From"
                      value={this.state.dateFrom}
                      onChange={this.handleDateFromChange}
                    />
                  </SoftBox>
                </Grid>
                {/* Date To Filter */}
                <Grid item xs={1.5}>
                  <SoftTypography variant="h6" className="text_decor">
                    To
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      type="date"
                      placeholder="To"
                      value={this.state.dateTo}
                      onChange={this.handleDateToChange}
                    />
                  </SoftBox>
                </Grid>
                {/* Sentiments Filter */}
                <Grid item xs={1.5}>
                  <SoftTypography variant="h6" className="text_decor">
                    Sentiments
                  </SoftTypography>
                  <select
                    style={{
                      width: "100%",
                      height: "60%",
                      borderRadius: "9px",
                      padding: "6px",
                      fontSize: "0.875rem",
                      border: "1px solid #aaaa",
                    }}
                    value={this.state.sentimentFilter}
                    onChange={this.handleSentimentFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </Grid>
              </Grid>
            </Card>
          </SoftBox>
          
          {/* Table */}
          <Table
            columns={columns}
            rows={currentItems}
            handleCheckboxChange={this.handleCheckboxChange}
          />

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
  <Pagination
    count={pageCount}
    page={currentPage}
    onChange={this.handlePageChange}
    color="primary"
    shape="rounded"
    sx={{ color: 'white' }}
  />
</div>

        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }
}

export default BillingRecord;
