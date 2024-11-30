import React, { Component } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { CardContent, Grid, TableContainer } from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Select from "react-select";
import { colourOptions } from "./edit-product/data/data.ts";
import { Modal, Box } from "@mui/material";
import Table from "react-bootstrap/Table";
import "./style.css";
import { Height } from "@mui/icons-material";
import ImageUploader from "./edit-product/Image_Uploader.js";
import Moon from "../assets/images/curved-images/designer.jpg";
import Moon_1 from "../assets/images/small-logos/icon-sun-cloud.png";
import pdf from "../assets/images/printofly LOGO TEST (5) (1).pdf";
import zip from "../assets/images/all_files.zip";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import NewUploader from "./edit-product/New_Uploader.js";

class DeliveredDetail extends Component {
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
    this.downloadAllImages = this.downloadAllImages.bind(this);
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

  downloadAllImages() {
    const zip = new JSZip();
    const promises = [];

    // Select all image elements and other files like links to zip, rar, pdf, etc.
    const images = document.querySelectorAll("img.img_styling");
    const links = document.querySelectorAll('a[href$=".zip"], a[href$=".rar"], a[href$=".pdf"]');

    // Function to fetch and add a file to the zip
    const addToZip = (url, filename) => {
      return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(filename, blob);
        });
    };

    // Process all images
    images.forEach((img) => {
      const filename = img.src.split("/").pop();
      const promise = addToZip(img.src, filename);
      promises.push(promise);
    });

    // Process all other files
    links.forEach((link) => {
      const url = link.href;
      const filename = url.split("/").pop();
      const promise = addToZip(url, filename);
      promises.push(promise);
    });

    // Wait for all files to be added to the zip and then save it
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "all_files.zip");
      });
    });
  }

  handleDownload(fileUrl, fileName) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  renderFilePreview(url) {
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "zip":
        return "ZIP";
      case "rar":
        return "RAR";
      case "eps":
        return "EPS";
      case "ai":
        return "AI";
      case "doc":
        return "DOC";
      case "docx":
        return "DOCX";
      case "cnd":
        return "CND";
      case "dst":
        return "DST";
      case "emb":
        return "EMB";
      case "exp":
        return "EXP";
      case "pes":
        return "PES";
      case "ppt":
        return "PPT";
      case "pxf":
        return "PXF";
      case "heic":
        return "HEIC";
      case "svg":
        return "SVG";
      case "bmp":
        return "BMP";
      case "pso":
        return "PSO";
      case "cdr":
        return "CDR";
      default:
        return null;
    }
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
            <Grid item xs={2} style={{ textAlign: "center" }}>
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
            </Grid>
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
                  <NewUploader />
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

              <Card style={{ marginTop: "24px" }}>
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

                      <Grid item xs={12}>
                        <Box mb={2}>
                          <Box mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Designer Upload
                            </SoftTypography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon_1} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <a href={pdf} className="img_styling">
                                {this.renderFilePreview(pdf)}
                              </a>
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <a href={zip} className="img_styling">
                                {this.renderFilePreview(zip)}
                              </a>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <SoftButton
                          variant="gradient"
                          color="info"
                          style={{
                            padding: "10px",
                            fontSize: "10px",
                            width: "100%",
                            marginTop: "12px",
                          }}
                          onClick={() => this.downloadAllImages()}
                        >
                          Download All
                        </SoftButton>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={2}>
                          <Box mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Qc Design Upload
                            </SoftTypography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon_1} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <img src={Moon} className="img_styling" />
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <a href={pdf} className="img_styling">
                                {this.renderFilePreview(pdf)}
                              </a>
                            </Grid>
                            <Grid item xs={2} className="grid_view">
                              <a href={zip} className="img_styling">
                                {this.renderFilePreview(zip)}
                              </a>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <SoftButton
                          variant="gradient"
                          color="info"
                          style={{
                            padding: "10px",
                            fontSize: "10px",
                            width: "100%",
                            marginTop: "12px",
                          }}
                          onClick={() => this.downloadAllImages()}
                        >
                          Download All
                        </SoftButton>
                      </Grid>

                      {/* <Grid item xs={12} md={12}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Upload Design
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput type="file" disabled={!this.state.isEditing} />
                        </SoftBox>
                      </Grid> */}
                      {/* <Grid item xs={12} md={3}>
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
                      </Grid> */}
                      {/* <Grid item xs={12} md={3}>
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
                            Accept
                          </SoftButton>
                        </SoftBox>
                      </Grid> */}
                      <Grid item xs={12} md={3}>
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
                            View Status
                          </SoftButton>
                        </SoftBox>
                      </Grid>
                      {/* <Grid item xs={12} md={3}>
                        <SoftBox mb={2} display="flex" alignItems="center" style={{ marginTop:"15px" }}>
                          <span>
                            <SoftInput type="checkbox" />
                          </span>
                          <SoftTypography style={{ marginLeft:"9px",fontSize:"15px" }} component="label" variant="caption" fontWeight="bold">
                              Self By Me
                            </SoftTypography>
                        </SoftBox>
                      </Grid> */}
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
                  <th className="table_head">Previously Assigned</th>
                  <th className="table_head">Completed by</th>
                  {/* <th className="table_head">Monthly Design</th>
                  <th className="table_head">Pending Design</th>
                  <th className="table_head">Level</th>
                  <th className="table_head">Assign To</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Designer 1</td>
                  <td>Designer 2</td>
                  {/* <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="checkbox" />
                  </td> */}
                </tr>
                <tr>
                  <td>Designer 1</td>
                  <td>Designer 2</td>
                  {/* <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="checkbox" />
                  </td> */}
                </tr>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  {/* <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="checkbox" />
                  </td> */}
                </tr>
                <tr>
                  <td>1</td>
                  <td>QC</td>
                  {/* <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>
                    <SoftInput type="checkbox" />
                  </td> */}
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

export default DeliveredDetail;
