import { Card, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import React, { useRef } from "react";
import "./style.css";
import myInvoiceImage from "../../../assets/images/go-digitizing-logo (1).png";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import borders from "assets/theme/base/borders";

const Invoice = () => {
  const contentRef = useRef();
  const { search } = useLocation();
  const selectedRows = JSON.parse(new URLSearchParams(search).get("selectedRows"));

  const saveDivAsPDF = () => {
    const element = contentRef.current;
    html2pdf().from(element).save();
  };

  console.log(selectedRows);
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Card
          ref={contentRef}
          id="content"
          className="card-main"
          style={{ margin: "0 auto", paddingLeft: "12px", marginBottom: "30px" }}
        >
          <SoftBox div style={{ paddingTop: "20px", paddingBottom: "20px", paddingLeft: "6px" }}>
            <Grid container spacing={0} width={{ marginBottom: "36px" }}>
              <Grid item xs={6} md={6}>
                <SoftBox div>
                  <img src={myInvoiceImage} alt="" style={{ width: "40%" }} />
                </SoftBox>
              </Grid>

              <Grid item xs={6} md={6} style={{ textAlign: "right", paddingRight: "12px" }}>
                <SoftTypography variant="p" className="Invoicetdr" style={{ fontSize:"12px" }}>
                  <SoftBox div> <b> Go Digitizing </b> </SoftBox>
                  USA: P.O. BOX 41382 Arlington, VA 22204<br/> 
                  Canada: 150 Milner Avenue Unit#49, Scarborough, Ontario M1S 3R3<br/>
                  Phone : (716) 566-5881
                </SoftTypography>
              </Grid>
              <Grid item xs={12} md={12} style={{ marginTop:"30px" , padding:"12px 8px" }}>
              <SoftBox div style={{borderBottom:"2px solid #aaa"}}> 
              </SoftBox>
              </Grid>
              
              <Grid item xs={6} md={6} style={{marginTop:"0px"}} >
                <SoftTypography variant="p" className="Invoicetd">
                   Invoice To:
                </SoftTypography>
              </Grid>
              <Grid item xs={6} md={6} style={{ textAlign: "right", paddingRight: "12px" }}>
                <SoftTypography variant="h3" className="Invoicetdr">
                   GO-1123184
                </SoftTypography>
              </Grid>
              <Grid item xs={6} md={6}>
                <SoftTypography variant="p" className="Invoicetd">
                  Samir
                </SoftTypography>
              </Grid>
              <Grid item xs={6} md={6} style={{ textAlign: "right", paddingRight: "12px" }}>
                <SoftBox Div className="Invoicetdr">
                  Date of invoice: 12/01/2023
                </SoftBox>
                <SoftBox Div className="Invoicetdr">
                  Due Date: 12/01/2023
                </SoftBox>
              </Grid>
              
            </Grid>
            {/* <Grid container style={{ marginBottom: "46px", paddingRight: "12px" }}>
              <Grid item xs={6} md={6}>
                <SoftTypography variant="p" className="Invoicetd">
                  Invoice no
                </SoftTypography>
              </Grid>
              <Grid item xs={3} md={3}>
                <SoftTypography variant="p" className="Invoicetd">
                  Invoice date:
                </SoftTypography>
              </Grid>
              <Grid item xs={3} md={3} style={{ textAlign: "right", paddingRight: "12px" }}>
                <SoftTypography variant="p" className="Invoicetd">
                  06/03/2019
                </SoftTypography>
              </Grid>

              <Grid item xs={6} md={6}>
                <SoftTypography variant="p" className="Invoicetd">
                  #0453119
                </SoftTypography>
              </Grid>
              <Grid item xs={3} md={3}>
                <SoftTypography variant="p" className="Invoicetd">
                  Due date:
                </SoftTypography>
              </Grid>
              <Grid item xs={3} md={3} style={{ textAlign: "right", paddingRight: "12px" }}>
                <SoftTypography variant="p" className="Invoicetd">
                  11/03/2019
                </SoftTypography>
              </Grid>
            </Grid> */}

            <SoftBox div variant="p" style={{fontSize:"14px" , fontWeight:"500"}}>
            Note:
            </SoftBox>
            <SoftBox div variant="p" style={{fontSize:"14px"}}>
            We have a state of the art portal up and running for our clients. This is a beta version 
            at the moment, let us know about any reviews or advices. Please visit our: <span>Client Portal</span> 
            or contact customer support.
            </SoftBox>



            <Grid container style={{ marginBottom: "0px" }}>
            <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="qty">
                  Qty
                </SoftTypography>
              </Grid>
              <Grid item xs={4} md={4} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="qty">
                  Item
                </SoftTypography>
              </Grid>
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="qty">
                  Qty
                </SoftTypography>
              </Grid>
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="qty">
                  Rate
                </SoftTypography>
              </Grid>
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="qty">
                  Amount
                </SoftTypography>
              </Grid>

              {selectedRows &&
                selectedRows.map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6} md={6} style={{ borderBottom: "1px solid #aaaa" }}>
                      <SoftTypography variant="p" className="Premium">
                        {item.category}
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                      <SoftTypography variant="p" className="Premium">
                        {item.id}
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                      <SoftTypography variant="p" className="Premium">
                        {item.rate}
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                      <SoftTypography variant="p" className="Premium">
                        {item.amount}
                      </SoftTypography>
                    </Grid>
                  </React.Fragment>
                ))}

                
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="Premium"></SoftTypography>
              </Grid>
              <Grid item xs={4} md={4} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="Premium"></SoftTypography>
              </Grid>
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="Premium"></SoftTypography>
              </Grid>
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="Premium" style={{ fontWeight: "600" }}>
                  Total
                </SoftTypography>
              </Grid>
              <Grid item xs={2} md={2} style={{ borderBottom: "1px solid #aaaa" }}>
                <SoftTypography variant="p" className="Premium" style={{ fontWeight: "600" }}>
                  $ 698
                </SoftTypography>
              </Grid>

              <SoftBox className="thankbox" div style={{ marginTop: "56px" }}>
                <SoftTypography variant="H4" className="Invoicetd">

                <b>THANKS FOR THE BUSINESS!</b>
                </SoftTypography>
                </SoftBox>

               
              <SoftBox Div>
              
              </SoftBox>
              <SoftBox Div>
              <SoftTypography variant="p" className="Invoicetd">
              DISCLAIMER: <br/>
            </SoftTypography>
              <SoftTypography variant="p" className="Invoicetd">
              The information in this message may be proprietary and/or confidential, and protected from disclosure. If the reader of this message is not the intended recipient, or an employee or agent responsible for delivering this message to the intended recipient, you are hereby notified that any dissemination, distribution or copying of this communication is strictly prohibited. If you have received this communication in error, please notify gO Digitizing immediately by replying to this message and deleting it from your computer.

                </SoftTypography>
              </SoftBox>

              <Grid container style={{ marginBottom: "0px" }}>
                <Grid item xs={10} md={10}>
                  <SoftTypography variant="p" className="Invoicetd">
                    email: support@creative-tim.com
                  </SoftTypography>
                </Grid>
                {/* <Grid item xs={2} md={2}>
          <SoftButton variant="gradient" color="info" id="downloadBtn" onClick={saveDivAsPDF}>Print</SoftButton>
        </Grid> */}
              </Grid>
            </Grid>
          </SoftBox>
        </Card>
        <SoftButton variant="gradient" color="info" id="downloadBtn" onClick={saveDivAsPDF}>
          Print
        </SoftButton>
      </DashboardLayout>
    </>
  );
};

export default Invoice;
