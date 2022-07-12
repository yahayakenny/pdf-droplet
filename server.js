const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};

const Pdfmake = require("pdfmake");
const { dirname } = require("path");
let pdfmake = new Pdfmake(fonts);

app.post("/", (req, res) => {
  let studentArr = req.body.student;
  let docDefinition = {
    info: {
      title: "Student list",
    },
    pageSize: "A4",
    pageOrientation: "portrait",
    content: [
      {
        text: "Sapati College",
        alignment: "center",
        fontSize: 20,
        bold: true,
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: [100, 100, 100, 100, 80],
          body: [
            [
              { text: "Student Id", style: "tableHeader" },
              { text: "Name", style: "tableHeader" },
              { text: "Class", style: "tableHeader" },
              { text: "Gender", style: "tableHeader" },
              { text: "Status", style: "tableHeader" },
            ],
            ...studentArr.map((student) => [
              student.identification_number,

              student?.last_name + " " + student?.first_name,
              student.classroom.name,
              student.gender,
              student.status === "full"
                ? "Full"
                : student.status === "part"
                ? "Part"
                : "Owing",
            ]),
          ],
        },
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
  };

  let pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
  pdfDoc.pipe(fs.createWriteStream("new.pdf"));
  pdfDoc.end();
  res.send("hello");
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/new.pdf`);
});

app.listen(4000);
