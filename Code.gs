function doPost(e) {
  // Parse the JSON data from the request
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Invalid JSON data'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Validate email
  const email = data.email;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Invalid email address'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Subscribers') || ss.insertSheet('Subscribers');
    
    // Check if headers exist, if not add them
    if (sheet.getRange('A1').getValue() === '') {
      sheet.getRange('A1:C1').setValues([['Email', 'Timestamp', 'Source']]);
    }
    
    // Add the new subscriber
    sheet.appendRow([
      email,
      new Date(),
      'Website Form'
    ]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Subscription successful'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Server error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight requests
function doOptions(e) {
  var headers = e.parameter.headers;
  var origin = e.parameter.origin;
  
  return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .setHeader('Access-Control-Allow-Methods', 'POST')
      .setHeader('Access-Control-Max-Age', '3600');
} 