import React, { Component } from 'react';
import axios from 'axios';
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };

    this.fetchDataUrl = 'http://localhost/react-dashboard/fetchData.php';
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    axios.get(this.fetchDataUrl)
      .then(response => {
        console.log('API response:', response.data);
        this.setState({ rows: response.data });
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }

  render() {
    const columns = [
      { name: 'Email Subject', accessor: 'email_subject' },
      { name: 'Category', accessor: 'category' },
      { name: 'Priority', accessor: 'priority' },
      { name: 'Size', accessor: 'size' },
      { name: 'Placement', accessor: 'placement' },
      { name: 'Order Type', accessor: 'order_type' },
      { name: 'Required File Format', accessor: 'required_file_format' },
      { name: 'Number of Colors', accessor: 'number_of_colors' },
      { name: 'Colors List', accessor: 'colors_list' },
      { name: 'Other Details', accessor: 'other_details' },
      { name: 'Garment Type', accessor: 'garment_type' },
      { name: 'Sentiments', accessor: 'sentiments' },
      { name: 'Attachments', accessor: 'attachments' },
      { name: 'Date', accessor: 'date' },
      { name: 'Email Address', accessor: 'email_address' },
      { name: 'Client Code', accessor: 'client_code' }
    ];

    console.log('State rows:', this.state.rows);

    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftBox mb={3}>
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Data Table</SoftTypography>
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
                <Table columns={columns} rows={this.state.rows} />
              </SoftBox>
            </Card>
          </SoftBox>
          <Card>
          </Card>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }
}

export default Tables;
