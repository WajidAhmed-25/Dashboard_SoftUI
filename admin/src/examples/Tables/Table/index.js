import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import SoftButton from "components/SoftButton";
import "./style.css";
import { useNavigate } from "react-router-dom";
import SoftInput from "components/SoftInput";
import axios from "axios";
import { apiUrl } from '../../../config/config'
function Table({ columns, rows, type }) {
  const { light } = colors;
  const { fontWeightBold } = typography;
  const { borderWidth } = borders;
  

  const [tableRows, setTableRows] = useState(rows);
  const [editingRowId, setEditingRowId] = useState(null);
  const [duplicateCounts, setDuplicateCounts] = useState({});
  const [formData, setFormData] = useState({
    attachments: "",
    category: "",
    client_code: "",
    colors_list: "",
    date: "",
    datetime: "",
    email_address: "",
    email_subject: "",
    garment_type: "",
    id: "",
    number_of_colors: "",
    order_type: "",
    other_details: "",
    placement: "",
    priority: "",
    required_file_format: "",
    sentiments: "",
    size: "",
  });

  const navigate = useNavigate();

  const categoryOptions = ["New Order", "Edit Request", "Follow Up"];
  const orderOptions = ["Vector", "Digitizing"];
  const priorityOptions = ["Normal", "Happy", "Negative"];

  useEffect(() => {
    setTableRows(rows);
  }, [rows]);

  const handleRedirect = (id) => {
    if (type === "completed") {
      navigate("/CompleteDetail");
    } else if (type === "delivered") {
      navigate("/DeliveredDetail");
    } else if (type === "assign") {
      navigate("/AssignedDetail");
    } else {
      navigate(`/EditProduct/${id}/`);
    }
  };

  const handleEditClick = (id, row) => {
    setFormData(row);
    setEditingRowId(id);
  };

  const handleInputChange = (e, accessor) => {
    setFormData({
      ...formData,
      [accessor]: e.target.value,
    });
  };

  console.log(formData);

const handleSaveClick = () => {
  const dataToSend = {
    id: formData.id, // assuming the formData includes the id
    data: {
      email_subject: formData.email_subject,
      category: formData.category,
      priority: formData.priority,
      size: formData.size,
      placement: formData.placement,
      order_type: formData.order_type,
      required_file_format: formData.required_file_format,
      number_of_colors: formData.number_of_colors,
      colors_list: formData.colors_list,
      other_details: formData.other_details,
      garment_type: formData.garment_type,
      sentiments: formData.sentiments,
      attachments: formData.attachments,
      date: formData.date,
      email_address: formData.email_address,
      client_code: formData.client_code,
    }
  };
  const dataToSend2 = {
    id: formData.id, // assuming the formData includes the id
    email_subject: formData.email_subject,
    category: formData.category,
    priority: formData.priority,
    size: formData.size,
    placement: formData.placement,
    order_type: formData.order_type,
    required_file_format: formData.required_file_format,
    number_of_colors: formData.number_of_colors,
    colors_list: formData.colors_list,
    other_details: formData.other_details,
    garment_type: formData.garment_type,
    sentiments: formData.sentiments,
    attachments: formData.attachments,
    date: formData.date,
    email_address: formData.email_address,
    client_code: formData.client_code,
   
  };

  console.log('Data being sent:', dataToSend2);

  // axios.post(`http://localhost/react-dashboard/updatedatabyid.php?id=${formData.id}`, dataToSend)
  axios.post(`${apiUrl}/api/email_response/update/${formData.id}`, dataToSend2)
    .then((response) => {
      console.log('Data updated successfully:', response.data);
      if (response.data.success) {
        // Refresh the table by refetching the data
        axios.get(`${apiUrl}/api/email_response/fetch/${formData.id}`)
          .then((response) => {
            const newRows = tableRows.map((row) =>
              row.id === editingRowId ? { ...row, ...response.data.data } : row
            );
            setTableRows(newRows);
          })
          .catch((error) => {
            console.error('There was an error fetching the updated data!', error);
          });
        setEditingRowId(null);
      } else {
        console.error('Update failed:', response.data.message);
      }
    })
    .catch((error) => {
      console.error('There was an error updating the data!', error);
    });
};


  const duplicateRow = (index) => {
    const newRows = [...tableRows];
    const rowToDuplicate = newRows[index];

    const baseId = rowToDuplicate.id.split(" ")[0];
    const currentCount = duplicateCounts[baseId] || 0;
    const suffix = String.fromCharCode(97 + currentCount);

    const newRow = {
      ...rowToDuplicate,
      id: `${baseId} (${suffix})`,
    };

    newRows.splice(index + 1, 0, newRow);
    setTableRows(newRows);

    setDuplicateCounts({
      ...duplicateCounts,
      [baseId]: currentCount + 1,
    });
  };

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

  const getEmojiForSentiment = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return "🥰"; // Happy emoji
      case "Negative":
        return "😡"; // Angry emoji
      case "Neutral":
        return "😊"; // Neutral emoji for other sentiments
      default:
        return "";
    }
  };

  const renderRows = tableRows.map((row, index) => {
    const rowKey = `row-${index}`;
    const isEditing = row.id === editingRowId;

    const tableRow = columns.map(({ accessor }) => {
      if (accessor === "attachments") {
        const src = row[accessor].substring(
          row[accessor].indexOf('"') + 1,
          row[accessor].lastIndexOf('"')
        );
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <div className="image-container">
              <img
                src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                alt="Thumbnail"
                className="image-preview"
              />
              <img
                src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                alt="Preview"
                className="image-hover"
              />
            </div>
          </SoftBox>
        );
      }

      if (accessor === "sentiments") {
        const sentimentEmoji = getEmojiForSentiment(row[accessor]);
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <span className="icon">
              {sentimentEmoji}
              <button className="duplicate-btn" onClick={() => duplicateRow(index)}>
                Duplicate
              </button>
            </span>
          </SoftBox>
        );
      }

      if (accessor === "status") {
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            {type === "delivered" ? "Complete By me" : "Complete By Designer"}
          </SoftBox>
        );
      }






      if (accessor === "edit") {
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            {isEditing ? (
              <SoftButton
                variant="gradient"
                color="info"
                style={{ padding: "10px", fontSize: "10px" }}
                onClick={handleSaveClick}
              >
                Save
              </SoftButton>
            ) : (
              <SoftButton
                variant="gradient"
                color="info"
                style={{ padding: "10px", fontSize: "10px" }}
                onClick={() => handleEditClick(row.id, row)}
              >
                Edit
              </SoftButton>
            )}
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
              onClick={() => handleRedirect(row.id)}
            >
              view
            </SoftButton>
          </SoftBox>
        );
      }

      const isInputField = [
        "order_type",
        "category",
        "priority",
        "client_code",
        "email_subject",
        "datetime",
      ].includes(accessor);

      if (isEditing && isInputField) {
        if (accessor === "order_type") {
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="left"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              <select
                style={{
                  width: "100%",
                  height: "60%",
                  borderRadius: "9px",
                  padding: "10px",
                  border: "1px solid #aaaa",
                }}
                value={formData[accessor]}
                onChange={(e) => handleInputChange(e, accessor)}
              >
                {orderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </SoftBox>
          );
        }

        if (accessor === "category") {
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="left"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              <select
                style={{
                  width: "100%",
                  height: "60%",
                  borderRadius: "9px",
                  padding: "10px",
                  border: "1px solid #aaaa",
                }}
                value={formData[accessor]}
                onChange={(e) => handleInputChange(e, accessor)}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </SoftBox>
          );
        }

        if (accessor === "priority") {
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="left"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              <select
                style={{
                  width: "100%",
                  height: "60%",
                  borderRadius: "9px",
                  padding: "10px",
                  border: "1px solid #aaaa",
                }}
                value={formData[accessor]}
                onChange={(e) => handleInputChange(e, accessor)}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </SoftBox>
          );
        }

        if (accessor === "datetime") {
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="left"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              <SoftInput
                type="date"
                placeholder="From"
                value={formData[accessor]}
                onChange={(e) => handleInputChange(e, accessor)}
              />
            </SoftBox>
          );
        }

        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="left"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <input
              style={{
                width: "100%",
                height: "60%",
                borderRadius: "9px",
                padding: "10px",
                border: "1px solid #aaaa",
              }}
              type="text"
              value={formData[accessor]}
              onChange={(e) => handleInputChange(e, accessor)}
            />
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

  return useMemo(
    () => (
      <TableContainer>
        <MuiTable>
          <SoftBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </SoftBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, tableRows, editingRowId, formData]
  );
}

Table.defaultProps = {
  columns: [],
  rows: [],
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
};

export default Table;
