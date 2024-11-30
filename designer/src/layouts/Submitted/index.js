import React, { Component,useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import OrderTable from "examples/Tables/Table/OrderTable";
import { Grid } from "@mui/material";
import SoftInput from "components/SoftInput";
import "./style.css";
import SoftButton from "components/SoftButton";
import { Pagination } from "@mui/material";
import { apiUrl } from '../../config/config'


class Submitted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      filteredRows: [],
      filterValue: "", // add a state to store the filter value
      clientCodeFilter: "",
      idFilter: "",
      dateFrom: "",
      dateTo: "",
      tags: [],
      inputValue: "",
      sentimentFilter: "",
      currentPage: 1,
      itemsPerPage: 30,
      totalItems: 0,
    };

    // this.fetchDataUrl = "http://localhost/react-dashboard/fetchData.php?q=New_Order";
    this.fetchDataUrl = apiUrl+"/api/email_response/get/submitted/?page=";

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleClientCodeChange = this.handleClientCodeChange.bind(this);
    this.handleSentimentFilterChange = this.handleSentimentFilterChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.saveTag = this.saveTag.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    // this.fetchData();
    this.fetchData(this.state.currentPage);
  }


  fetchData(page) {
    axios
      .get(this.fetchDataUrl + page)
      .then((response) => {
        console.log("API response:", response.data.data);
        this.setState({
          rows: response.data.data,
          filteredRows: response.data.data, // Initialize filteredRows with data
          totalItems: response.data.total, // Set total items for pagination
        });

        console.log("---2");
        console.log(response.data.data);
        console.log(this.state);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }

  
  handleFilterChange(event) {
    const filterValue = event.target.value;
    this.setState({ filterValue });

    if (filterValue === "") {
      this.setState({ filteredRows: this.state.rows }); // show all data if filter value is empty
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

  // handleSentimentFilterChange(event) {
  //   this.setState({ sentimentFilter: event.target.value }, this.applyFilters);
  // }

  handleSentimentFilterChange(event) {
    const sentimentFilter = event.target.value;
    this.setState({ sentimentFilter });

    if (sentimentFilter === "") {
      this.setState({ filteredRows: this.state.rows }); // show all data if filter value is empty
    } else {
      const filteredRows = this.state.rows.filter((row) => {
        return row.sentiments === sentimentFilter;
      });
      this.setState({ filteredRows });
    }
  }

  // handlePageChange(event, page) {
  //   this.setState({ currentPage: page });
  // }

  handlePageChange(event, page) {
    // this.setState({ currentPage: page });
    // this.fetchData(page); // Fetch data for the selected page

    this.setState({ currentPage: page }, () => {
      this.fetchData(page);
      console.log("----");
      console.log(this.state);
    });
  }

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.addTag(this.state.inputValue);
      this.setState({ inputValue: "" });
    }
  }

  addTag(tagText) {
    if (tagText.trim() === "") return;

    const newTags = [...this.state.tags, tagText];
    this.setState({ tags: newTags }, () => {
      this.saveTag(tagText);
    });
  }

  removeTag(indexToRemove) {
    const newTags = this.state.tags.filter((_, index) => index !== indexToRemove);
    this.setState({ tags: newTags });
  }

  saveTag(tagText) {
    console.log("Saving tag:", tagText);
    fetch("/save-tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag: tagText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Tag saved:", data);
      })
      .catch((error) => {
        console.error("Error saving tag:", error);
      });
  }

  applyFilters() {
    const { rows, orderTypeFilter, sentimentFilter, clientCodeFilter, idFilter, dateFrom, dateTo } =
      this.state;

    const filteredRows = rows.filter((row) => {
      const matchesOrderType = orderTypeFilter === "" || row.order_type === orderTypeFilter;
      const matchesSentiment = sentimentFilter === "" || row.sentiments === sentimentFilter;
      const matchesClientCode =
        clientCodeFilter === "" ||
        row.client_code.toLowerCase().includes(clientCodeFilter.toLowerCase());
      const matchesId = idFilter === "" || row.id.toString().includes(idFilter);
      const matchesDateFrom = dateFrom === "" || new Date(row.datetime) >= new Date(dateFrom);
      const matchesDateTo = dateTo === "" || new Date(row.datetime) <= new Date(dateTo);
      
      return (
        matchesOrderType &&
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
    const { currentPage, itemsPerPage, filteredRows ,totalItems  } = this.state;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    // Render pagination controls
    // const pageCount = Math.ceil(filteredRows.length / itemsPerPage);
    // Render pagination controls
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
    console.log("State columns:", columns);
    console.log("State rows:", this.state.rows);

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
                <Grid item xs={1.5}>
                  <SoftTypography variant="h6" className="text_decor">
                    Tags
                  </SoftTypography>
                  <SoftBox pr={1}>
                    <SoftInput
                      placeholder="Type here..."
                      icon={{ component: "search", direction: "left" }}
                      value={this.state.newTag}
                      onChange={this.handleInputChange}
                      onKeyPress={this.handleInputKeyPress}
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
                <SoftTypography variant="h6">New Order</SoftTypography>
              </SoftBox>
              <SoftBox
                sx={{
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                        `${borderWidth[1]} solid ${borderColor}`,
                    },
                  },
                }}
              >
                <Table columns={columns} rows={currentItems} />
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
          <Card></Card>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }
}

export default Submitted;
