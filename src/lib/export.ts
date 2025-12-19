import { JobApplication } from '@/types';

export function exportToCSV(applications: JobApplication[]): void {
  const headers = [
    'Company',
    'Position',
    'Status',
    'Priority',
    'Applied Date',
    'Location',
    'Salary',
    'Job Type',
    'Contact Name',
    'Contact Email',
    'URL',
    'Created At',
  ];

  const rows = applications.map(app => [
    app.company,
    app.position,
    app.status,
    app.priority,
    app.appliedDate || '',
    app.location || '',
    app.salary || '',
    app.jobType || '',
    app.contactName || '',
    app.contactEmail || '',
    app.url || '',
    app.createdAt,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  downloadFile(csvContent, 'job-applications.csv', 'text/csv');
}

export function exportToPDF(applications: JobApplication[]): void {
  // For a simple PDF export, we'll create an HTML representation
  // In a production app, you might use jsPDF or similar library
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Job Applications Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Job Applications Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <p>Total Applications: ${applications.length}</p>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Applied Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${applications
              .map(
                app => `
              <tr>
                <td>${app.company}</td>
                <td>${app.position}</td>
                <td>${app.status}</td>
                <td>${app.priority}</td>
                <td>${app.appliedDate || 'N/A'}</td>
                <td>${app.location || 'N/A'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'job-applications.html';
  link.click();
  URL.revokeObjectURL(url);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
