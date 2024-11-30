import React, { Component } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { CardContent, Grid, Icon, TableContainer } from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Select from "react-select";
import { Modal, Box } from "@mui/material";
import Table from "react-bootstrap/Table";
import "./style.css";
import { Height } from "@mui/icons-material";
import ImageUploader from "./edit-product/Image_Uploader";
import OrdersOverview from "layouts/dashboard/components/OrderOverview/index.js";
import TimelineItem from "examples/Timeline/TimelineItem/index.js";
import NewUploader from "./edit-product/New_Uploader";

class AssignedDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      tags: [],
      inputValue: "",
      filteredRows: [],
      filterValue: "", // add a state to store the filter value
      open: false,
      uploadedImage: null,
      isEditing: false,
      tags: [],
      inputValue: "",
    };

    this.fetchDataUrl = "http://localhost/react-dashboard/fetchData.php?q=Edit_Request";

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.saveTag = this.saveTag.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    axios
      .get(this.fetchDataUrl)
      .then((response) => {
        console.log("API response:", response.data);
        this.setState({ rows: response.data, filteredRows: response.data }); // initialize filteredRows with all data
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

  handleChange(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ uploadedImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  handleEditToggle() {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  handleDownload(imageSrc) {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "downloaded_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    const { open, uploadedImage, isEditing } = this.state;

    console.log("State rows:", this.state.rows);

    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftTypography variant="h4">Email Subject</SoftTypography>
          <SoftTypography variant="p">Email Address</SoftTypography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <SoftTypography variant="p">Date</SoftTypography>
            </Grid>
            {/* <Grid item xs={2} style={{ textAlign: "center" }}>
              <SoftButton
                variant="gradient"
                color="info"
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
                onClick={this.handleEditToggle}
              >
                {isEditing ? "Save" : "Edit"}
              </SoftButton>
            </Grid> */}
          </Grid>
          <SoftBox mb={3}></SoftBox>
          <div className="row">
            <div className="col-lg-4">
            <Card style={{ padding: "4px" }}>
                <CardContent>
                  <SoftTypography
                    variant="h4"
                    style={{ paddingBottom: "12px", paddingTop: "12px" }}
                  >
                    Product Image
                  </SoftTypography>
                  <NewUploader/>
                  {/* <ImageUploader onDownload={this.handleDownload} /> */}
                  {/* <SoftButton
                      variant="gradient"
                      color="info"
                      component="span"
                      style={{
                        marginRight: 10,
                        fontSize: "9px",
                        width:"100%"
                      }}
                      onClick={() => document.getElementById('hidden-download-button').click()}
                    >
                      Download
                    </SoftButton> */}
                </CardContent>
              </Card>

              <Card  style={{marginTop:"316px", height:"50% !important"}}>
                <SoftBox pt={3} px={3}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Orders overview
                  </SoftTypography>
                  <SoftBox mt={1} mb={2}>
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      <SoftTypography display="inline" variant="body2" verticalAlign="middle">
                        <Icon
                          sx={{
                            fontWeight: "bold",
                            color: ({ palette: { success } }) => success.main,
                          }}
                        >
                          arrow_upward
                        </Icon>
                      </SoftTypography>
                      &nbsp;
                      <SoftTypography variant="button" color="text" fontWeight="medium">
                        24%
                      </SoftTypography>{" "}
                      this month
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox p={2}>
                  <TimelineItem
                    color="success"
                    icon="notifications"
                    title="$2400, Design changes"
                    dateTime="22 DEC 7:20 PM"
                  />
                  <TimelineItem
                    color="error"
                    icon="inventory_2"
                    title="New order #1832412"
                    dateTime="21 DEC 11 PM"
                  />
                  <TimelineItem
                    color="info"
                    icon="shopping_cart"
                    title="Server payments for April"
                    dateTime="21 DEC 9:34 PM"
                  />
                  <TimelineItem
                    color="warning"
                    icon="payment"
                    title="New card added for order #4395133"
                    dateTime="20 DEC 2:20 AM"
                  />
                  <TimelineItem
                    color="primary"
                    icon="vpn_key"
                    title="New card added for order #4395133"
                    dateTime="18 DEC 4:54 AM"
                  />
                  <TimelineItem
                    color="dark"
                    icon="paid"
                    title="New order #9583120"
                    dateTime="17 DEC"
                  />
                </SoftBox>
              </Card>
            </div>
            <div className="col-lg-8">
            <Card style={{ padding: "3px" }}>
                <CardContent>
                  <SoftTypography variant="h4" style={{ paddingBottom: "10px" }}>
                    Client Code
                  </SoftTypography>
                  <SoftBox component="form" role="form">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Category
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Priority
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Size
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Placement
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Order Type
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Other Detail
                            </SoftTypography>
                          </SoftBox>
                          <textarea
                            style={{ width: "100%", height: "200px", border: "1px solid #d7d7d7" }}
                            disabled={!this.state.isEditing}
                          ></textarea>
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Garment Type
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>

                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Sentiments
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>

                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Price
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>
                      {/* <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                            Colors List
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" />
                        </SoftBox>
                      </Grid> */}
                    </Grid>
                  </SoftBox>
                </CardContent>
              </Card>

              <Card style={{ marginTop: "24px", height: "500px" }}>
                <CardContent>
                  <SoftBox component="form" role="form">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              File Format
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Color
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Color List
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="text" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Project Tags
                            </SoftTypography>
                          </SoftBox>
                          <div className="tag-input-container">
                            <input
                              type="text"
                              className="tag-input"
                              placeholder="Add a tag"
                              value={this.state.inputValue}
                              onChange={this.handleInputChange}
                              onKeyDown={this.handleKeyDown}
                              disabled={!this.state.isEditing}
                            />
                            <div className="tag-list">
                              {this.state.tags.map((tag, index) => (
                                <div className="tag" key={index}>
                                  <span>{tag}</span>
                                  <button onClick={() => this.removeTag(index)}>x</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </SoftBox>
                      </Grid>
                      


                      
                      <Grid item xs={12} md={12}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Upload Design
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="file"  />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftButton
                            variant="gradient"
                            color="info"
                            style={{
                              padding: "10px",
                              fontSize: "10px",
                              width: "100%",
                              marginTop: "12px",
                            }}
                          >
                            Download
                          </SoftButton>
                        </SoftBox>
                      </Grid>
                      {/* <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftButton
                            variant="gradient"
                            color="info"
                            style={{
                              padding: "10px",
                              fontSize: "10px",
                              width: "100%",
                              marginTop: "12px",
                            }}
                            onClick={this.handleOpen}
                          >
                            Assign To
                          </SoftButton>
                        </SoftBox>
                      </Grid> */}
                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftButton
                            variant="gradient"
                            color="info"
                            style={{
                              padding: "10px",
                              fontSize: "10px",
                              width: "100%",
                              marginTop: "12px",
                            }}
                          >
                            Submit
                          </SoftButton>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </SoftBox>
                </CardContent>
              </Card>
            </div>
          </div>

        </SoftBox>
        <Footer />

        <Modal open={open} onClose={this.handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Table striped bordered hover>
              <thead style={{ fontSize: "12px", textAlign: "center" }}>
                <tr>
                  <th className="table_head">Designer Id</th>
                  <th className="table_head">Designer Name</th>
                  <th className="table_head">Monthly Design</th>
                  <th className="table_head">Pending Design</th>
                  <th className="table_head">Level</th>
                  <th className="table_head">Assign To</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="radio" name="2" />
                  </td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="radio" name="2" />
                  </td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="radio" name="2" />
                  </td>
                </tr>
              </tbody>
            </Table>
            <SoftButton
              style={{ width: "100%" }}
              variant="gradient"
              color="info"
              onClick={this.handleClose}
            >
              Close
            </SoftButton>
          </Box>
        </Modal>
      </DashboardLayout>
    );
  }
}

export default AssignedDetail;
