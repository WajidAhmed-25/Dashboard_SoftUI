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
import { Link, useNavigate } from "react-router-dom";
import SoftInput from "components/SoftInput";

function Table({ columns, rows, type, handleCheckboxChange, handleViewInvoice, selectedRows }) {
  const { light } = colors;
  const { fontWeightBold } = typography;
  const { borderWidth } = borders;

  const [tableRows, setTableRows] = useState(rows);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [duplicateCounts, setDuplicateCounts] = useState({});
  const navigate = useNavigate();

  const categoryOptions = ["New Order", "Edit Request", "Follow Up"];
  const Options = ["Portal", "Email", "Other"];
  const orderOptions = ["Vector", "Digitizing"];
  const priorityOptions = ["Normal", "Happy", "Negative"];

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
    } else if (type === "Edit") {
      navigate("/EditDetail");
    } else if (type === "followup") {
      navigate("/FollowUpDetail");
    } else if (type === "others") {
      navigate("/OthersDetail");
    } else if (type === "logs") {
      navigate("/LogsDetail");
    } else {
      navigate(`/EditProduct/${order_id}`);
    }
  };
  

  const handleEditClick = (id) => {
    setEditingRowId(id);
    setEditingData(tableRows.find((row) => row.id === id));
  };

  const handleInputChange = (e, accessor) => {
    setEditingData({
      ...editingData,
      [accessor]: e.target.value,
    });
  };

  const handleSaveClick = () => {
    const newRows = tableRows.map((row) =>
      row.id === editingRowId ? { ...row, ...editingData } : row
    );
    setTableRows(newRows);
    setEditingRowId(null);
  };

  // const handleCheckboxChange = (id, isChecked) => {
  //   onCheckboxChange(id, isChecked);
  // };

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
            {/* <SoftButton
              variant="gradient"
              color="info"
              style={{ padding: "10px", fontSize: "10px" }}
            >
              <a href={`${row[accessor]}`} style={{ color: "white" }} download rel="noreferrer">
                Download
              </a>
            </SoftButton> */}
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

      // Assuming you have a function or a place where you're iterating over rows and accessing values
      if (accessor === "sentiments") {
        if (type === "assign" || type === "completed" || type === "delivered") {
          const sentimentEmoji = getEmojiForSentiment(row[accessor]);
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="center"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              <h4>{sentimentEmoji}</h4>
            </SoftBox>
          );
        } else {
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
                <h4>{sentimentEmoji}</h4>

                <button className="duplicate-btn" onClick={() => duplicateRow(index)}>
                  Duplicate
                </button>
              </span>
              <h2></h2>
            </SoftBox>
          );
        }
      }
      if (type === "delivered") {
        if (accessor === "status") {
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="center"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              Complete By me
            </SoftBox>
          );
        }
      } else {
        if (accessor === "status") {
          return (
            <SoftBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign="center"
              borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
              Complete By Designer
            </SoftBox>
          );
        }
      }

      if (accessor === "upload_from" && isEditing) {
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
              value={editingData[accessor]}
              onChange={(e) => handleInputChange(e, accessor)}
            >
              {Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
                onClick={() => handleEditClick(row.id)}
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
              onClick={() => handleRedirect(row.order_id)} // Pass the order_id to the function
            >
              View
            </SoftButton>
          </SoftBox>
        );
      }

      if (accessor === "id" && isEditing) {
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
              value={row[accessor]}
              disabled
            />
          </SoftBox>
        );
      }

      if (accessor === "order_type" && isEditing) {
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
              value={editingData[accessor]}
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

      if (accessor === "datetime" && isEditing) {
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
              value={row[accessor]}
              onChange={(e) => handleInputChange(e, accessor)}
            />
          </SoftBox>
        );
      }

      if (accessor === "category" && isEditing) {
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
              value={editingData[accessor]}
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

      if (accessor === "priority" && isEditing) {
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
              value={editingData[accessor]}
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

      if (accessor === "client_code" && isEditing) {
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
                width: "104%",
                height: "60%",
                borderRadius: "9px",
                padding: "10px",
                border: "1px solid #aaaa",
              }}
              type="text"
              value={row[accessor]}
            />
          </SoftBox>
        );
      }

      if (accessor === "email_subject") {
        if (isEditing) {
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
                  width: "107%",
                  height: "60%",
                  borderRadius: "9px",
                  padding: "10px",
                  border: "1px solid #aaaa",
                }}
                type="text"
                value={row[accessor]}
                onChange={(e) => handleInputChange(e, accessor)}
              />
            </SoftBox>
          );
        } else {
          const subject = row[accessor];
          const truncatedSubject = subject.length > 15 ? `${subject.substring(0, 15)}...` : subject;
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
                sx={{ display: "inline-block", width: "max-content"}}
            
              >
                {truncatedSubject}
              </SoftTypography>
            </SoftBox>
          );
        }
      }

      if (accessor === "assign_to") {
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
              Ahmed
            </SoftTypography>
          </SoftBox>
        );
      }

      if (accessor === "billing") {
        return (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign="left"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
          >
            <input
              type="checkbox"
              checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
              style={{ padding: "15px" }}
              onChange={(e) => handleCheckboxChange(row.id, e.target.checked)}
            />
            {/* {selectedRows.some((selectedRow) => selectedRow.id === row.id) && (
              <>
                <Link to={`/Invoice?selectedRows=${JSON.stringify(selectedRows)}`}>
                  <SoftButton
                    variant="gradient"
                    color="info"
                    style={{ padding: "10px", fontSize: "10px" }}
                    onClick={() => handleViewInvoice(row.id)}
                  >
                    View Invoice
                  </SoftButton>
                </Link>
              </>
            )} */}
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
          {isEditing ? (
            <input
              type="text"
              value={editingData[accessor] || ""}
              onChange={(e) => handleInputChange(e, accessor)}
            />
          ) : (
            <SoftTypography
              variant="button"
              fontWeight="regular"
              color="secondary"
              sx={{ display: "inline-block", width: "max-content" }}
            >
              {row[accessor]}
            </SoftTypography>
          )}
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
    [columns, tableRows, editingRowId, editingData]
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
