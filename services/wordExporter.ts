
// This is a placeholder for a real library. In a real project, you'd use a library like 'html-to-docx-file-saver'.
// For this environment, we'll simulate the download by creating a printable view.

const generateHtmlForDoc = (title: string, content: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; margin: 40px; }
            h1 { font-size: 24px; text-align: center; }
            h2 { font-size: 20px; border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 20px;}
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            p { margin: 5px 0; }
            .receipt { border: 1px solid #000; padding: 15px; margin-bottom: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Parroquia San Isidro Labrador</h1>
            <h2>${title}</h2>
          </div>
          ${content}
        </body>
      </html>
    `;
};


export const exportToWord = (title: string, content: string) => {
    const htmlContent = generateHtmlForDoc(title, content);
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/ /g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
