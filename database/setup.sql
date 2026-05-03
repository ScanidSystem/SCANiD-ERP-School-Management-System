-- SCANID Database Setup Script (SQL Server)
-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ScanID_DB')
BEGIN
    CREATE DATABASE ScanID_DB;
END
GO

USE ScanID_DB;
GO

-- 1. Schools Table
CREATE TABLE Schools (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) UNIQUE,
    Address NVARCHAR(500),
    ContactLabel NVARCHAR(100),
    Email NVARCHAR(200),
    TotalStudents INT DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'Active', -- Active, Inactive
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 2. Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FullName NVARCHAR(200),
    Email NVARCHAR(200) UNIQUE,
    Role NVARCHAR(50) NOT NULL, -- superadmin, admin, teacher, student
    SchoolId INT NULL,
    FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

-- 3. Teachers Table (Linked to User)
CREATE TABLE Teachers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT UNIQUE,
    SchoolId INT,
    EmployeeId NVARCHAR(50) UNIQUE,
    Designation NVARCHAR(100),
    Department NVARCHAR(100),
    Qualification NVARCHAR(200),
    JoiningDate DATE,
    Status NVARCHAR(20) DEFAULT 'Active',
    Salary DECIMAL(18,2),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

-- 4. Students Table
CREATE TABLE Students (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RegistrationNumber NVARCHAR(50) UNIQUE,
    FullName NVARCHAR(200) NOT NULL,
    SchoolId INT,
    Standard NVARCHAR(20), -- e.g., 10th
    Section NVARCHAR(10),  -- e.g., A
    DateOfBirth DATE,
    Gender NVARCHAR(10),
    FatherName NVARCHAR(200),
    MotherName NVARCHAR(200),
    ContactNumber NVARCHAR(20),
    Address NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Active',
    RollNumber INT,
    FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

-- 5. Attendance Table
CREATE TABLE Attendance (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT,
    Date DATE NOT NULL,
    Status NVARCHAR(10), -- Present, Absent, Late
    MarkedByUserId INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (MarkedByUserId) REFERENCES Users(Id)
);

-- 6. Fees Table
CREATE TABLE Fees (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT,
    InvoiceNumber NVARCHAR(50) UNIQUE,
    Type NVARCHAR(100), -- Tuition, Exam, Transport
    Amount DECIMAL(18,2),
    DueDate DATE,
    PaidDate DATE NULL,
    Status NVARCHAR(20), -- Paid, Pending, Overdue
    PaymentMethod NVARCHAR(50),
    Remarks NVARCHAR(500),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);

-- 7. Exam Marks Table
CREATE TABLE Marks (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT,
    Subject NVARCHAR(100),
    ExamName NVARCHAR(100), -- Final, Mid-Term
    MarksObtained DECIMAL(5,2),
    TotalMarks DECIMAL(5,2),
    Grade NVARCHAR(5),
    TeacherComments NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);

-- 8. Messages Table
CREATE TABLE Messages (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SenderId INT,
    ReceiverId INT, -- 0 for Broadcast
    Subject NVARCHAR(200),
    Content NVARCHAR(MAX),
    IsRead BIT DEFAULT 0,
    Type NVARCHAR(20), -- Alert, Memo, Chat
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SenderId) REFERENCES Users(Id)
);

-- INSERT DUMMY DATA
-- Insert Schools
INSERT INTO Schools (Name, Code, Address, Email, TotalStudents)
VALUES ('Greenwood High', 'GWH001', '123 Academic Way', 'admin@greenwood.edu', 1250),
       ('St. Xavier International', 'SXI002', '456 Education Lane', 'office@stxavier.edu', 890);

-- Insert Users (Passwords are 'Pass123' hashed for this example)
-- SuperAdmin
INSERT INTO Users (Username, PasswordHash, FullName, Email, Role)
VALUES ('superadmin', 'hashed_pass_here', 'Devendra Parte', 'superadmin@scanid.com', 'superadmin');

-- School Admin
INSERT INTO Users (Username, PasswordHash, FullName, Email, Role, SchoolId)
VALUES ('schooladmin', 'hashed_pass_here', 'John Doe', 'admin@greenwood.edu', 'admin', 1);

-- Teacher
INSERT INTO Users (Username, PasswordHash, FullName, Email, Role, SchoolId)
VALUES ('teacher1', 'hashed_pass_here', 'Sarah Wilson', 'sarah@greenwood.edu', 'teacher', 1);

-- Insert Teachers
INSERT INTO Teachers (UserId, SchoolId, EmployeeId, Designation, Department, Qualification, JoiningDate)
VALUES (3, 1, 'EMP001', 'Senior Faculty', 'Mathematics', 'PhD in Applied Math', '2020-01-15');

-- Insert Students
INSERT INTO Students (RegistrationNumber, FullName, SchoolId, Standard, Section, DateOfBirth, FatherName, RollNumber)
VALUES ('REG2024001', 'Alice Johnson', 1, '10th', 'A', '2009-05-12', 'Robert Johnson', 1),
       ('REG2024002', 'Bob Smith', 1, '10th', 'A', '2009-08-22', 'Michael Smith', 2);

-- Insert Sample Attendance
INSERT INTO Attendance (StudentId, Date, Status, MarkedByUserId)
VALUES (1, GETDATE(), 'Present', 3),
       (2, GETDATE(), 'Absent', 3);

-- Insert Sample Fees
INSERT INTO Fees (StudentId, InvoiceNumber, Type, Amount, DueDate, Status)
VALUES (1, 'INV-1001', 'Tuition Fee', 5000.00, '2024-06-01', 'Pending'),
       (2, 'INV-1002', 'Tuition Fee', 5000.00, '2024-05-01', 'Paid');

-- Insert Sample Marks
INSERT INTO Marks (StudentId, Subject, ExamName, MarksObtained, TotalMarks, Grade)
VALUES (1, 'Mathematics', 'Mid-Term', 85, 100, 'A'),
       (1, 'Science', 'Mid-Term', 78, 100, 'B+');
GO
