const QUESTIONS=[
{id:"Q01",s:"SQL Server",p:3,type:"mc",t:"Which JOIN returns all records from the left table and matching records from the right table?",o:["INNER JOIN","LEFT JOIN","CROSS JOIN","SELF JOIN"],a:1},
{id:"Q02",s:"SQL Server",p:3,type:"mc",t:"Which command is used to create an index?",o:["ADD INDEX","BUILD INDEX","CREATE INDEX","NEW INDEX"],a:2},
{id:"Q03",s:"SQL Server",p:3,type:"mc",t:"What is the primary purpose of an index?",o:["Encrypt data","Reduce database size","Improve query performance","Delete duplicate data"],a:2},
{id:"Q04",s:"SQL Server",p:3,type:"mc",t:"Which statement is used to return unique values?",o:["GROUP BY","UNIQUE","DISTINCT","DIFFERENT"],a:2},
{id:"Q05",s:"SQL Server",p:5,type:"open",t:"What is the difference between a Clustered Index and a Nonclustered Index?"},
{id:"Q06",s:"SQL Server",p:5,type:"open",t:"A query that used to run in 2 seconds now takes 3 minutes. Mention three actions you would take to troubleshoot it."},
{id:"Q07",s:"SQL Server",p:2,type:"mc",t:"Which SQL function is commonly used to count records?",o:["TOTAL","SUM","COUNT","RECORDS"],a:2},
{id:"Q08",s:"SQL Server",p:6,type:"open",t:"What information can be obtained from an Execution Plan?"},

{id:"Q09",s:"C# / .NET",p:3,type:"mc",t:"What is a Class in C#?",o:["A variable","A blueprint for creating objects","A database table","A namespace"],a:1},
{id:"Q10",s:"C# / .NET",p:5,type:"open",t:"What is the difference between a Field and a Property?"},
{id:"Q11",s:"C# / .NET",p:3,type:"mc",t:"Which syntax is used to inherit from another class in C#?",o:["IMPLEMENT","EXTEND","INHERIT",":"],a:3},
{id:"Q12",s:"C# / .NET",p:3,type:"mc",t:"What is Exception Handling used for?",o:["Improving network speed","Handling runtime errors","Creating reports","Managing memory"],a:1},
{id:"Q13",s:"C# / .NET",p:3,type:"mc",t:"Which statement is used to handle exceptions?",o:["IF ELSE","TRY CATCH","SWITCH","FOREACH"],a:1},
{id:"Q14",s:"C# / .NET",p:5,type:"open",t:"Explain how you would consume a REST API from a C# application."},
{id:"Q15",s:"C# / .NET",p:6,type:"open",t:"What is the purpose of using Async and Await?"},

{id:"Q16",s:"Manufacturing IT Support",p:3,type:"open",t:"An operator reports that a workstation cannot access MES. What would be your first troubleshooting steps?"},
{id:"Q17",s:"Manufacturing IT Support",p:3,type:"open",t:"How would you determine whether a problem is related to the network, server, or application?"},
{id:"Q18",s:"Manufacturing IT Support",p:3,type:"open",t:"How would you verify communication between a workstation and a PLC/device on the network?"},
{id:"Q19",s:"Manufacturing IT Support",p:3,type:"open",t:"What information would you collect before escalating a production system issue?"},
{id:"Q20",s:"Manufacturing IT Support",p:3,type:"open",t:"What is the difference between a production issue and a system issue?"},

{id:"Q21",s:"SQL Analysis & MES Troubleshooting",p:3,type:"mc",t:"What is the expected result? SELECT Material, COUNT(*) AS Qty FROM WorkScan GROUP BY Material. Data: A100 OK, A100 OK, A200 NG, A100 OK.",o:["A100=1, A200=1","A100=3, A200=1","A100=4","Error"],a:1},
{id:"Q22",s:"SQL Analysis & MES Troubleshooting",p:4,type:"mc",t:"Which records will be returned? SELECT * FROM WorkScan WHERE Result = 'NG'. Data: A100 OK, A200 NG, A300 OK, A400 NG.",o:["A100, A300","A200 only","A200, A400","All records"],a:2},
{id:"Q23",s:"SQL Analysis & MES Troubleshooting",p:4,type:"mc",t:"SELECT Barcode FROM H_Unload WHERE Barcode = 'ABC123' returns 0 rows. Which situation could explain this?",o:["Material was scanned correctly at UNLOAD","Material was generated correctly","Material was not scanned at UNLOAD","ERP confirmation was successful"],a:2},
{id:"Q24",s:"SQL Analysis & MES Troubleshooting",p:4,type:"mc",t:"Which table should typically be checked first to verify if a barcode was scanned in production?",o:["User Master","Production Log / Scan History","Printer Configuration","Work Schedule"],a:1},
{id:"Q25",s:"SQL Analysis & MES Troubleshooting",p:3,type:"mc",t:"A barcode appears in LOAD history but not in UNLOAD history. What is the most likely conclusion?",o:["Barcode was duplicated","Barcode was deleted by SQL Server","Material was not processed or scanned at UNLOAD","Network cable is disconnected"],a:2},
{id:"Q26",s:"SQL Analysis & MES Troubleshooting",p:3,type:"mc",t:"Which query correctly counts all scans performed today when ScanDate is a datetime?",o:["WHERE ScanDate = CAST(GETDATE() AS DATE)","WHERE ScanDate >= CAST(GETDATE() AS DATE) AND ScanDate < DATEADD(DAY,1,CAST(GETDATE() AS DATE))","WHERE ScanDate = GETDATE()","WHERE ScanDate LIKE '%TODAY%'"],a:1},
{id:"Q27",s:"SQL Analysis & MES Troubleshooting",p:3,type:"mc",t:"SELECT TOP 10 * FROM InterfaceLog WHERE Status='ERROR' ORDER BY LogDate DESC. What is its purpose?",o:["Display the oldest successful transactions","Display the latest interface errors","Delete failed transactions","Generate new interface records"],a:1},
{id:"Q28",s:"SQL Analysis & MES Troubleshooting",p:1,type:"open",t:"Describe a situation where you would use exception handling (try-catch) in a production application. What risks would exist if it were not implemented correctly?"},
{id:"Q29",s:"SQL Analysis & MES Troubleshooting",p:2,type:"open",t:"A C# application needs to query information from a SQL Server database and display it to the operator on an MES screen. Describe the main steps you would follow to implement this functionality."}
];
