import React from 'react';

const PdfComponent = ({ pathToPdf }) => {
    console.log("pdfComponent: " + pathToPdf)
    return (
        <embed height="100%" with="100%" src={pathToPdf} alt='' type="application/pdf" />
    )
}

export default PdfComponent