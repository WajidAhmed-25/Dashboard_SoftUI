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
import "./style.css";
import { Pagination } from "@mui/material";
import { apiUrl } from "../../config/config";

class EditRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      filteredRows: [],
      filterValue: "",
      clientCodeFilter: "",
      idFilter: "",
      dateFrom: "",
      dateTo: "",
      tags: [],
      inputValue: "",
      sentimentFilter: "",
      currentPage: 1,
      itemsPerPage: 50,
      totalItems: 0,
    };

    this.fetchDataUrl = `${apiUrl}/api/email_response/get/edit_request?page=`;

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleClientCodeChange = this.handleClientCodeChange.bind(this);
    this.handleSentimentFilterChange = this.handleSentimentFilterChange.bind(this);
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
        console.log("API response:", response.data.data);
        if (response.data && response.data.data) {
          this.setState({
            rows: response.data.data,
            filteredRows: response.data.data,
            totalItems: response.data.total,
          });
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  handleFilterChange(event) {
    const filterValue = event.target.value;
    this.setState({ filterValue });

    if (filterValue === "") {
      this.setState({ filteredRows: this.state.rows });
    } else {
      const filteredRows = this.state.rows.filter((row) => {
        return row.order_type === filterValue || row.required_file_format === filterValue;
      });
      this.setState({ filteredRows });
    }
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
    this.setState({ sentimentFilter });

    if (sentimentFilter === "") {
      this.setState({ filteredRows: this.state.rows });
    } else {
      const filteredRows = this.state.rows.filter((row) => row.sentiments === sentimentFilter);
      this.setState({ filteredRows });
    }
  }

  handlePageChange(event, page) {
    this.setState({ currentPage: page }, () => {
      this.fetchData(page);
    });
  }

  applyFilters() {
    const { rows, filterValue, clientCodeFilter, idFilter, dateFrom, dateTo, sentimentFilter } =
      this.state;

    const filteredRows = rows.filter((row) => {
      const matchesFilterValue = filterValue === "" || row.order_type === filterValue;
      const matchesClientCode =
        clientCodeFilter === "" ||
        row.client_code.toLowerCase().includes(clientCodeFilter.toLowerCase());
      const matchesId = idFilter === "" || row.id.toString().includes(idFilter);
      const matchesDateFrom = dateFrom === "" || new Date(row.datetime) >= new Date(dateFrom);
      const matchesDateTo = dateTo === "" || new Date(row.datetime) <= new Date(dateTo);
      const matchesSentiment = sentimentFilter === "" || row.sentiments === sentimentFilter;

      return (
        matchesFilterValue &&
        matchesClientCode &&
        matchesId &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesSentiment
      );
    });

    this.setState({ filteredRows });
  }

  render() {
    const { currentPage, itemsPerPage, filteredRows, totalItems } = this.state;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const columns = [
      { name: "", accessor: "sentiments" },
      { name: "Order No.", accessor: "id" },
      { name: "Category", accessor: "category" },
      { name: "Type", accessor: "order_type" },
      { name: "Date", accessor: "datetime" },
      { name: "Attachments", accessor: "attachments" },
      { name: "Priority", accessor: "priority" },
      { name: "Code", accessor: "client_code" },
      { name: "Subject", accessor: "email_subject" },
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
                <Grid item xs={1}>
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
            <br />
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Edit Request</SoftTypography>
              </SoftBox>
              <SoftBox>
                <Table columns={columns} rows={currentItems}  style="background-color:pink;"/>
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

export default EditRequest;
