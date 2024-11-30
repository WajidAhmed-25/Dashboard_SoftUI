import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { 
  Table as MuiTable,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import SoftButton from "components/SoftButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};


const EditModal = ({ isOpen, onClose, rowData, onUpdate }) => {
  const [editedData, setEditedData] = useState({
    order_id: "",
    user_id: "",
    status: "",
    description: "",
    is_active: "active"
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


useEffect(() => {
  const fetchData = async () => {
    try {
      const [productsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:8000/api/email-responses/all'),
        axios.get('http://localhost:8000/api/users')
      ]);


      const arrayVar = 0;  

      const productsData = Array.isArray(productsRes.data.data)
        ? productsRes.data.data.reduce((acc, product, index) => {
            acc[`product_${index}`] = {
              id: product.id,
              email_subject: product.email_subject
            };
            return acc;
          }, {})
        : {
            [`product_0`]: {
              id: productsRes.data.data[arrayVar].id,
              email_subject: productsRes.data.data[arrayVar].email_subject
            }
          };

      setProducts(productsData);

      console.log("All Products Being Displayed: ", productsData);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : [usersRes.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    }
  };

  if (isOpen) {
    fetchData();
  }
}, [isOpen]);












 
  useEffect(() => {
    const fetchOrderData = async () => {
      if (rowData?.id) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/api/order-logs/order/${rowData.id}`);
          
          console.log("All data of Order: ",response.data.logs[0])

          console.log("User ID from fetched data:", response.data.logs[0].user_id);
  
          console.log("data of order ID: ", response.data.logs[0].order_id)
          
          setEditedData(prev => ({
            ...prev,
            id: rowData.id,
            order_id: String(rowData.order_id || response.data.order_id || ""), 
            user_id: String(rowData.user_id || response.data.logs[0].user_id || ""), 
            status: rowData.status || response.data.status || "",
            description: rowData.description || response.data.description || "",
            is_active: rowData.is_active || response.data.is_active || "active"
          }));
         
        } catch (error) {
          console.error("Error fetching order data:", error);
          
       
          setEditedData(prev => ({
            ...prev,
            id: rowData.id,
            order_id: String(rowData.order_id || ""), 
            user_id: String(rowData.user_id || ""), 
            status: rowData.status || "",
            description: rowData.description || "",
            is_active: rowData.is_active || "active"
          }));
        } finally {
          setLoading(false);
        }
      }
    };
  
    if (isOpen && rowData) {
      fetchOrderData();
    }
  }, [rowData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editedData.status) newErrors.status = "Status is required";
    if (!editedData.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        console.log("Submitting data:", editedData);
        const response = await axios.put(`http://localhost:8000/api/order-logs/${editedData.id}`, editedData);
        if (response.status === 200) {
          onUpdate(response.data);
          onClose();
        }
      } catch (error) {
        console.error("Error updating order:", error);
        alert("Error updating order. Please try again.");
      }
    }

  };


  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      style={{overflow:'hidden'}}
    >
      <DialogContent sx={{overflow:'hidden',width:400,padding:'20px'}}>
        {loading ? (
          <Box sx={{ display: 'flex',width:'100%',justifyContent:'center',alignItems:'center',padding:'10px'}}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              component="form"
              sx={{
                display: 'flex',
                
                flexDirection: 'column',
                gap: 2.5,
                padding: '20px',
                marginBottom:'0px',
                borderRadius: '12px',
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                width: '100%',
                maxWidth: '600px',
                overflow:'hidden',
                margin: '0 auto',
              }}
            >
              <h2 style={{ textAlign: 'center', color: '#333', fontWeight: '600' }}>
                Edit Order Details
              </h2>
              
              <TextField
                label="ID"
                name="id"
                value={editedData.id || ""}
                disabled
                fullWidth
                style={{
                  backgroundColor: '#f4f4f4',
                  borderRadius: '8px',
                }}
              />





<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '5px', 
}}> 
  <label style={{ 
    fontWeight: '500', 
    color: '#555', 
    fontSize: '14px', 
    marginBottom: '0px', 
  }}> 
    Product 
  </label> 
  <select 
    name="order_id" 
    value={editedData.order_id || ""} 
    onChange={(e) => {
      const selectedId = e.target.value;
      handleInputChange({
        target: {
          name: 'order_id', 
          value: selectedId
        }
      });
    }} 
    style={{ 
      width: '100%', 
      padding: '12px', 
      borderRadius: '8px', 
      border: '1px solid #ddd', 
      fontSize: '14px', 
      backgroundColor: '#fff', 
    }} 
  > 
    <option value="">Select Product</option> 
    {rowData?.order_id && (
      <option 
        key={rowData.order_id} 
        value={rowData.order_id}
      >
        {Object.values(products).find(product => 
          product.id === rowData.order_id
        )?.email_subject || rowData.order_id}
      </option>
    )}
     
    {Object.values(products)
      .filter(product => product.id !== rowData?.order_id)
      .map(product => ( 
        <option key={product.id} value={product.id}> 
          {product.email_subject}
        </option> 
      )) 
    } 
  </select> 
</div>

        
        
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}>
                <label style={{
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '0px',
                }}>
                  User
                </label>
                <select
  name="user_id"
  value={editedData.user_id || ""}
  onChange={handleInputChange}
  style={{
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: '#fff',
  }}
>
  <option value="">Select User</option>
  {Array.isArray(users) && users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name || 'Unnamed User'}
    </option>
  ))}
</select>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}>
                <label style={{
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '0px',
                }}>
                  Status
                </label>
                <select
                  name="status"
                  value={editedData.status || ""}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                  }}
                >
                  <option value="">Select Status</option>
                  <option value="Assign">Assign</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Cancelled</option>
                </select>
                {errors.status && (
                  <p style={{ color: 'red', fontSize: '12px', marginTop: '2px' }}>
                    {errors.status}
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}>
                <label style={{
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                }}>
                  Description
                </label>
                <TextField
                  name="description"
                  value={editedData.description || ""}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  style={{
                    backgroundColor: '#f4f4f4',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}>
                <label style={{
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '2px',
                }}>
                  Is Active
                </label>
                <select
                  name="is_active"
                  value={editedData.is_active || "active"}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                  }}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            </Box>
            <br/>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.shape({
    id: PropTypes.number,
    order_id: PropTypes.string,
    user_id: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
    is_active: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

EditModal.defaultProps = {
  rowData: null,
};


function Table({ columns, rows, type }) {
  const { light } = colors;
  const { fontWeightBold } = typography;
  const { borderWidth } = borders;
  const [tableRows, setTableRows] = useState(rows);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [duplicateCounts, setDuplicateCounts] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    setTableRows(rows);
  }, [rows]);
  const handleRedirect = (order_id) => {
    if (type === "completed") {
      navigate("/CompleteDetail");
    } else if (type === "delivered") {
      navigate("/DeliveredDetail");
    } else if (type === "assign") {
      navigate("/AssignedDetail");
    } else {
      navigate(`/EditProduct/${order_id}/`);
    }
  };
  const handleEditClick = (row) => {
    if (!row.id) {
      console.error("No ID found in row data:", row);
      alert("Error: Cannot edit this row - No ID found");
      return;
    }
    setSelectedRow(row);
    setIsModalOpen(true);
    console.log("Selected Row ID is: ", row.id);
  };
  const handleUpdateLogs = async (updatedData) => {
    try {
      // Update the local state after successful API update from the modal
      const updatedRows = tableRows.map(row => 
        row.id === updatedData.id ? updatedData : row
      );
      setTableRows(updatedRows);
    } catch (error) {
      console.error("Error updating table state:", error);
      // Handle error appropriately
    }
  };
  const duplicateRow = (index) => {
    const newRows = [...tableRows];
    const rowToDuplicate = newRows[index];
    const baseId = rowToDuplicate.order_id;
    const currentCount = duplicateCounts[baseId] || 0;
    const newRow = {
      ...rowToDuplicate,
      id: null, // Ensure new row has no ID
      order_id: `${baseId}_copy_${currentCount + 1}`,
    };
    newRows.splice(index + 1, 0, newRow);
    setTableRows(newRows);
    setDuplicateCounts({
      ...duplicateCounts,
      [baseId]: currentCount + 1,
    });
  };
  // Rest of the render logic remains the same
  const renderColumns = columns.map(({ name }) => (
    <SoftBox
      key={name}
      component="th"
      pt={1.5}
      pb={1.25}
      pl={3}
      pr={3}
      textAlign="left"
      fontSize="16px"
      fontWeight={fontWeightBold}
      color="secondary"
      opacity={0.7}
      borderBottom={`${borderWidth[1]} solid ${light.main}`}
    >
      {name}
    </SoftBox>
  ));
  const renderRows = tableRows.map((row, index) => {
    const rowKey = `row-${index}`;
    const tableRow = columns.map(({ accessor }) => {
      if (accessor === "edit") {
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <SoftButton
              variant="gradient"
              color="info"
              style={{ padding: "10px", fontSize: "10px" }}
              onClick={() => handleEditClick(row)}
            >
              Edit
            </SoftButton>
          </SoftBox>
        );
      }
      if (accessor === "view") {
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <SoftButton
              variant="gradient"
              color="info"
              style={{ padding: "10px", fontSize: "10px" }}
              onClick={() => handleRedirect(row.order_id)}
            >
              View
            </SoftButton>
          </SoftBox>
        );
      }
      if (accessor === "duplicate") {
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <SoftButton
              variant="gradient"
              color="secondary"
              style={{ padding: "10px", fontSize: "10px" }}
              onClick={() => duplicateRow(index)}
            >
              Duplicate
            </SoftButton>
          </SoftBox>
        );
      }
      return (
        <SoftBox
          key={uuidv4()}
          component="td"
          p={1}
          textAlign="center"
          borderBottom={`${borderWidth[1]} solid ${light.main}`}
        >
          <SoftTypography
            variant="button"
            fontWeight="regular"
            color="secondary"
            sx={{ display: "inline-block", width: "max-content" }}
          >
            {row[accessor]}
          </SoftTypography>
        </SoftBox>
      );
    });
    return <TableRow key={rowKey}>{tableRow}</TableRow>;
  });
  return (
    <>
      <TableContainer>
        <MuiTable>
          <SoftBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </SoftBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rowData={selectedRow}
        onUpdate={handleUpdateLogs}
      />
    </>
  );
}
Table.defaultProps = {
  columns: [],
  rows: [],
  type: "",
};
Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ),
  rows: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
};
export default Table;