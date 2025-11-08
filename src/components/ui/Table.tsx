import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Column {
  label: string;
  value: (row: any) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface CustomTableProps {
  columns: Column[];
  rows: any[];
  striped?: boolean;
}

export const Table: React.FC<CustomTableProps> = ({
  columns,
  rows,
  striped,
}) => {
  const { t } = useTranslation();
  const hasData = rows && rows.length > 0;

  return (
    <TableContainer component={Paper} className="!shadow-none !rounded-2xl">
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                align={col.align || "left"}
                style={{ width: col.width || "auto", fontWeight: "bold" }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {hasData ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  backgroundColor:
                    striped && rowIndex % 2 === 0
                      ? "action.hover"
                      : "background.paper",
                }}
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} align={col.align || "left"}>
                    {col.value(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                style={{ padding: "20px", fontStyle: "italic", color: "#666" }}
              >
                {t("defaults.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
