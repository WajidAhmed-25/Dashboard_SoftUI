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
import { Modal, Box } from "@mui/material";
import Table from "react-bootstrap/Table";
import "./style.css";
import OrdersOverview from "layouts/dashboard/components/OrderOverview/index.js";
import TimelineItem from "examples/Timeline/TimelineItem/index.js";
import NewUploader from "./New_Uploader.js";
import { withRouter } from "react-router-dom";
import { apiUrl } from '../../config/config'
class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      orderlogsdata: {},
      designerid: {},
      rows: [],
      tags: [],
      inputValue: "",
      filteredRows: [],
      designers: [],
      filterValue: "", // add a state to store the filter value
      open: false,
      uploadedImage: null,
      isEditing: false,
      productId: null,
      error: null,
      assignOrderAvailable: false,
      formData: {
        category: "",
        priority: "",
        size: "",
        placement: "",
        order_type: "",
        other_details: "",
        garment_type: "",
        sentiments: "",
        price: "",
        required_file_format: "",
        colors_list: "",
        attachments: "", // Add attachments field here
        client_code: "",
        email_subject: "",
        email_address: "",
        date: "",
        color: "",
        price: "",
        project_tag: "",
        selectedDesignerId: null,
        currentPage: 1,
        itemsPerPage: 10,
        selectedFiles: [],
      },
    };

    const route = window.location.pathname.split("/").slice(1);
    const getID = route[1];
    this.fetchDataUrl = `${apiUrl}/api/email_response/fetch/${getID}`;
    this.updateDataUrl = `${apiUrl}/api/email_response/update/${getID}`;
    this.getDataUrl = `${apiUrl}/api/user/get_designer/`;
    this.assignDataUrl = `${apiUrl}/api/order/assign`;
    this.orderLogsDataUrl = `${apiUrl}/api/order/logs/${getID}`;

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.updateEditToggle = this.updateEditToggle.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.saveTag = this.saveTag.bind(this);
    this.updateAttachments = this.updateAttachments.bind(this); // Add this line
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.updateToggle = this.updateToggle.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    this.getData();
    this.orderLogs();
  }
  
  
  orderLogs() {
    const statusMapping = {
      pending: {
        color: "error",
        icon: "inventory_2"
      },
      assign: {
        color: "primary",
        icon: "assignment_turned_in"
      },
      completed: {
        color: "success",
        icon: "check_circle"
      },
      canceled: {
        color: "warning",
        icon: "cancel"
      },
      reject: {
        color: "warning",
        icon: "cancel"
      },
      shipped: {
        color: "info",
        icon: "local_shipping"
      },
      delivered: {
        color: "success",
        icon: "delivery_dining"
      },
      returned: {
        color: "error",
        icon: "arrow_back"
      },
      refunded: {
        color: "warning",
        icon: "money_off"
      },
      on_hold: {
        color: "default",
        icon: "pause"
      },
      in_process: {
        color: "primary",
        icon: "hourglass_empty"
      },
      partially_fulfilled: {
        color: "info",
        icon: "partial"
      },
      failed: {
        color: "error",
        icon: "error"
      },
      pending_payment: {
        color: "warning",
        icon: "payment"
      },
      awaiting_shipment: {
        color: "info",
        icon: "local_post_office"
      },
      processing: {
        color: "primary",
        icon: "build"
      },
      awaiting_confirmation: {
        color: "default",
        icon: "confirmation_number"
      }
      // Add more status mappings as needed
    };
    axios
      .get(this.orderLogsDataUrl)
      .then((response) => {
        // Check if 'response.data' and 'response.data.data' exist
        if (response && response.data && Array.isArray(response.data)) {
          const logs = response.data.map((log) => {
            // Get color and icon based on status using the statusMapping
            const normalizedStatus = log.status.toLowerCase().replace(/\s+/g, '_'); 
            const statusDetails = statusMapping[normalizedStatus] || {
              color: "default", // Fallback color
              icon: "help" // Fallback icon
            };
  
            return {
              title: `Order #${log.order_id} - ${log.status} - ${log.user.name}`, // Customize the title
              dateTime: new Date(log.created_at).toLocaleString(), // Format the date and time
              color: statusDetails.color, // Set color based on status
              icon: statusDetails.icon // Set icon based on status
            };
          });
  
          // Set the state with the logs
          this.setState({
            orderlogsdata: logs,
          });
        } else {
          console.error("Unexpected response format or no data found.");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }
  
  
  fetchData() {
    axios
      .get(this.fetchDataUrl)
      .then((response) => {
        const tags = response.data.data.project_tag ? response.data.data.project_tag.split(",") : [];
        this.setState({
          rows: response.data.data,
          filteredRows: response.data.data,
          formData: response.data.data,
          designerid: response.data.data.assigned_order?.user_id,
          tags,
        }); // initialize filteredRows with all data
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }

  getData() {
    axios
      .get(this.getDataUrl)
      .then((response) => {
        console.log("designers :",response.data);
        this.setState({ designers: response.data });
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
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

  handleTagChange(event) {
    const { value } = event.target;
    this.setState({ inputValue: value });
  }

  handleRadioChange(designerId) {
    this.setState({ selectedDesignerId: designerId });
  }

  handleSubmit() {
    const { selectedDesignerId } = this.state;
    const route = window.location.pathname.split("/").slice(1);
    const getID = route[1];

    if (selectedDesignerId) {
      // Prepare the data to be sent to the API
      const params = new URLSearchParams();
      params.append("order_id", getID);
      params.append("user_id", selectedDesignerId);
      params.append("status", "Pending");

      // Post data to the API
      // fetch(this.assignDataUrl, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded", // Correct content type for form data
      //   },
      //   body: params.toString(), // Convert the params to URL-encoded string
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log("Success:", data);
      //     this.setState({ assignOrderAvailable: true });
      //     this.getData();
      //     // this.updateToggle();
      //     this.handleClose(); // Close the modal after submission
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
      axios
      .post(
        this.assignDataUrl,
        params.toString(), // Convert the params to URL-encoded string
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Correct content type for form data
          },
        }
      )
      .then((response) => {
        console.log("Success:", response.data);
        this.setState({ assignOrderAvailable: true });
        this.getData();
        // this.updateToggle();
        this.handleClose(); // Close the modal after submission
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    } else {
      alert("Please select a designer.");
    }
  }

  handleFileSelect(files) {
    this.setState({ selectedFiles: files });
  }


 
  // updateEditToggle() {
  //   console.log("SelectedFile:", this.state.selectedFiles);
  //   // If there are selected files to upload
  //   if (this.state.selectedFiles && this.state.selectedFiles.length > 0) {
  //     const formData = new FormData();
  //     this.state.selectedFiles.forEach((file) => {
  //       formData.append("files[]", file); // Ensure files[] matches the server-side field
  //     });
  
  //     // Call the file upload API
  //     fetch("http://localhost/react-dashboard/file-uploading.php", {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.status === "success") {
  //           console.log("Files uploaded successfully!");
  
  //           // Handle the response as needed (e.g., updating attachments)
  //           const updatedAttachments = JSON.stringify(
  //             data.file_paths.map((path) => ({
  //               filename: path.filename,
  //               file_path: path.file_path,
  //               mimeType: path.mimeType,
  //             }))
  //           );
  
  //           // Prepare the form data for updating other fields
  //           const dataToSend = {
  //             id: this.state.formData.id,
  //             data: {
  //               ...this.state.formData,
  //               attachments: updatedAttachments, // Add the uploaded file paths here
  //             },
  //           };
  
  //           // Call the existing API to update form data
  //           axios.post(this.updateDataUrl, dataToSend)
  //             .then((response) => {
  //               console.log("Data updated successfully:", response.data);
  //               if (response.data.success) {
  //                 this.setState({ isEditing: false });
  //                 this.fetchData(); // Fetch updated data
  //               } else {
  //                 console.error("Update failed:", response.data.message);
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("There was an error updating the data!", error);
  //             });
  //         } else {
  //           console.error("File upload failed:", data.message);
  //         }
  //       })
  //       .catch((error) => console.error("Error during file upload:", error));
  //   }
  // }
  
  
  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.addTag(this.state.inputValue);
      this.setState({ inputValue: "" });
    }
  }

  addTag(tagText) {
    if (tagText.trim() === "") return;

    this.setState((prevState) => {
      const newTags = [...prevState.tags, tagText];
      return {
        tags: newTags,
        formData: {
          ...prevState.formData,
          project_tag: newTags.join(","),
        },
      };
    });
  }

  removeTag(e, indexToRemove) {
    e.preventDefault();
    this.setState((prevState) => {
      const newTags = prevState.tags.filter((_, index) => index !== indexToRemove);
      return {
        tags: newTags,
        formData: {
          ...prevState.formData,
          project_tag: newTags.join(","),
        },
      };
    });
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

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ selectedDesignerId: null });
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
    if (this.state.isEditing) {
      // If saving, make API call
      // this.saveChanges();
      this.updateEditToggle();
    }

    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  updateEditToggle() {
    console.log("Selected Files:", this.state.selectedFiles);
    
    // Ensure there are selected files
    if (this.state.selectedFiles && this.state.selectedFiles.length > 0) {
      const formData = new FormData();
      this.state.selectedFiles.forEach((file) => {
        formData.append("file", file); // Ensure this matches the server-side field
      });
  
      // Log each entry in FormData to ensure it's properly populated
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
    
      // Call the file upload API
      // fetch("http://localhost/react-dashboard/file-uploading.php", {
        axios.post(`${apiUrl}/api/email_response/fileupload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => {
            const data = response.data;
            if (data.status === "success") {
              console.log("Files uploaded successfully!");
              
              const dataToSend = {
                id: this.state.formData.id,
                // data: {
                  email_subject: this.state.formData.email_subject,
                  category: this.state.formData.category,
                  priority: this.state.formData.priority,
                  size: this.state.formData.size,
                  placement: this.state.formData.placement,
                  order_type: this.state.formData.order_type,
                  required_file_format: this.state.formData.required_file_format,
                  number_of_colors: this.state.formData.number_of_colors,
                  colors_list: this.state.formData.colors_list,
                  other_details: this.state.formData.other_details,
                  garment_type: this.state.formData.garment_type,
                  sentiments: this.state.formData.sentiments,
                  attachments: this.state.formData.attachments,
                  date: this.state.formData.date,
                  email_address: this.state.formData.email_address,
                  price: this.state.formData.price,
                  color: this.state.formData.color,
                  project_tag: this.state.tags.join(","),
                // },
              };
        
              // Call the API to update form data
              axios.post(this.updateDataUrl, dataToSend)
                .then((response) => {
                  console.log("Data updated successfully:", response.data);
                  if (response.data.success) {
                    this.setState({ isEditing: false });
                    this.fetchData();
                  } else {
                    console.error("Update failed:", response.data.message);
                  }
                })
                .catch((error) => {
                  console.error("There was an error updating the data!", error);
                });
            } else {
              console.error("File upload failed:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error during file upload:", error);
          });
        
      
    } else {
      console.error("No files selected for upload.");
      const dataToSend = {
        id: this.state.formData.id,
        // data: {
          email_subject: this.state.formData.email_subject,
          category: this.state.formData.category,
          priority: this.state.formData.priority,
          size: this.state.formData.size,
          placement: this.state.formData.placement,
          order_type: this.state.formData.order_type,
          required_file_format: this.state.formData.required_file_format,
          number_of_colors: this.state.formData.number_of_colors,
          colors_list: this.state.formData.colors_list,
          other_details: this.state.formData.other_details,
          garment_type: this.state.formData.garment_type,
          sentiments: this.state.formData.sentiments,
          attachments: this.state.formData.attachments,
          date: this.state.formData.date,
          email_address: this.state.formData.email_address,
          price: this.state.formData.price,
          color: this.state.formData.color,
          project_tag: this.state.tags.join(","),
        // },
      };

      // Call the API to update form data
      axios.post(this.updateDataUrl, dataToSend)
        .then((response) => {
          console.log("Data updated successfully:", response.data);
          if (response.data.success) {
            this.setState({ isEditing: false });
            this.fetchData();
          } else {
            console.error("Update failed:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("There was an error updating the data!", error);
        });
    }
  }
  
  

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  }

  updateAttachments(newAttachments) {
    console.log("newAttachments", newAttachments);
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        attachments: newAttachments,
      },
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

  getFormattedDate(date) {
    return new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric', 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  }
  renderOrderLogs() {
    const { orderlogsdata } = this.state;
    console.log("orderlogsdata:", orderlogsdata);
    
    
    // Ensure orderlogsdata is an array
    if (!Array.isArray(orderlogsdata)) {
      return null; // or return a placeholder message if appropriate
    }
  
    return orderlogsdata.map((log, index) => (
      <TimelineItem
        key={index}
        color={log.color}
        icon={log.icon}
        title={log.title}
        dateTime={this.getFormattedDate(log.dateTime)}
      />
    ));
  }
  
  render() {
    
    const { formData, isEditing, open, inputValue, tags, designers } = this.state;
    console.log("Form Data :", formData);
    const formattedDate = this.getFormattedDate(this.state.formData.date);
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftTypography variant="h4">{formData.email_subject}</SoftTypography>
          <SoftTypography variant="p">{formData.email_address}</SoftTypography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <SoftTypography variant="p">{formData.date}</SoftTypography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "center" }}>
              {isEditing ? (
                <SoftButton
                  variant="gradient"
                  color="info"
                  style={{
                    fontSize: "14px",
                    width: "100%",
                  }}
                  onClick={this.updateEditToggle}
                >
                  Save
                </SoftButton>
              ) : (
                <SoftButton
                  variant="gradient"
                  color="info"
                  style={{
                    fontSize: "14px",
                    width: "100%",
                  }}
                  onClick={this.handleEditToggle}
                >
                  Edit
                </SoftButton>
              )}
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
                  <NewUploader
                    attachments={formData.attachments || ""}
                    onUpdate={this.updateAttachments}
                    onFileSelect={this.handleFileSelect}
                    edit={this.state.isEditing}
                  />
                </CardContent>
              </Card>
              <Card style={{ marginTop: "316px", height: "50% !important" }}>
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
                      title={"$"+this.state.formData.price+", "+this.state.formData.category}
                      dateTime={formattedDate}  
                    />
                    {this.renderOrderLogs()} {/* Rendering the logs here */}  
                    {/* <TimelineItem
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
                    /> */}
                </SoftBox>

              </Card>
            </div>
            <div className="col-lg-8">
              <Card style={{ padding: "3px" }}>
                <CardContent>
                  <SoftTypography variant="h4" style={{ paddingBottom: "10px" }}>
                    {formData.client_code}
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
                          <select
                            style={{
                              width: "100%",
                              height: "40%",
                              borderRadius: "9px",
                              padding: "10px",
                              border: "1px solid #aaaa",
                            }}
                            name={"category"}
                            value={formData.category}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          >
                            <option value="">Select Category</option>
                            {this.state.assignOrderAvailable && (
                              <option value="Assign Order">Assign Order</option>
                            )}
                            <option value="New Order">New Order</option>
                            <option value="Edit Request">Edit Request</option>
                            <option value="Follow Up">Follow Up</option>
                            <option value="Others">Others</option>
                            <option value="Logs">Logs</option>
                          </select>
                          {/* <SoftInput
                            type="text"
                            name={"category"}
                            value={formData.category}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          /> */}
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Priority
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"priority"}
                            value={formData.priority}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Size
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"size"}
                            value={formData.size}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Placement
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"placement"}
                            value={formData.placement}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Order Type
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"order_type"}
                            value={formData.order_type}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
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
                            name={"other_details"}
                            value={formData.other_details}
                            style={{ width: "100%", height: "200px", border: "1px solid #d7d7d7" }}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
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
                          <SoftInput
                            type="text"
                            name={"garment_type"}
                            value={formData.garment_type}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Sentiments
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"sentiments"}
                            value={formData.sentiments}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Price
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"price"}
                            value={formData.price}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </SoftBox>
                </CardContent>
              </Card>

              <Card style={{ padding: "3px", marginTop: "20px" }}>
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
                          <SoftInput
                            type="text"
                            name={"required_file_format"}
                            value={formData.required_file_format}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Color
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"color"}
                            value={formData.color}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <SoftBox mb={2}>
                          <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              Color List
                            </SoftTypography>
                          </SoftBox>
                          <SoftInput
                            type="text"
                            name={"colors_list"}
                            value={formData.colors_list}
                            disabled={!isEditing}
                            onChange={this.handleInputChange}
                          />
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
                              onChange={this.handleTagChange}
                              onKeyDown={this.handleKeyDown}
                              disabled={!this.state.isEditing}
                            />
                            <div className="tag-list">
                              {tags.map((tag, index) => (
                                <div className="tag" key={index}>
                                  <span>{tag}</span>
                                  {this.state.isEditing && (
                                    <button onClick={(e) => this.removeTag(e, index)}>x</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
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
                            onClick={this.handleOpen}
                          >
                            Assign To
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
                          >
                            Submit
                          </SoftButton>
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
                  <th className="table_head">Designer Id</th>
                  <th className="table_head">Designer Name</th>
                  <th className="table_head">Monthly Design</th>
                  <th className="table_head">Pending Design</th>
                  <th className="table_head">Level</th>
                  <th className="table_head">Assign To</th>
                </tr>
              </thead>
              <tbody>
                {designers.map((designer, index) => (
                  <tr key={index}>
                    <td>{designer.designer_id}</td>
                    <td>{designer.designer_name}</td>
                    <td>{designer.monthly_design}</td>
                    <td>{designer.pending_design}</td>
                    <td>{designer.level}</td>
                    <td>
                      <SoftInput
                        type="radio"
                        name="designer"
                        value={designer.designer_id}
                        asd={this.state.designerid}
                        checked={this.state.designerid === designer.designer_id}
                        onChange={() => this.handleRadioChange(designer.designer_id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <SoftButton
              style={{ width: "100%" }}
              variant="gradient"
              color="info"
              onClick={this.handleSubmit}
              disabled={!this.state.selectedDesignerId}
            >
              Submit
            </SoftButton>
          </Box>
        </Modal>
      </DashboardLayout>
    );
  }
}

export default EditProduct;
