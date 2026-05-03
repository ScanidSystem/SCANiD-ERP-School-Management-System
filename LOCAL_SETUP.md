# Local Setup Instructions for SCANID

Follow these steps to set up the application on your local machine with a .NET Core backend and SQL Server.

## 1. Prerequisites
- **Visual Studio 2022** or **Visual Studio Code**
- **.NET 8.0 SDK**
- **SQL Server** (Express or Developer Edition)
- **SQL Server Management Studio (SSMS)**
- **Node.js** (v18 or higher)

## 2. Database Setup
1. Open SQL Server Management Studio (SSMS).
2. Connect to your local SQL Server instance.
3. Open a new query window.
4. Copy the contents of `/database/setup.sql` into the window.
5. Execute the script to create the `ScanID_DB` database and populate it with sample data.

## 3. Backend Setup (.NET Core)
1. Open a terminal and navigate to the `/backend/ScanID.Api` folder.
2. Open `appsettings.json` and update the `DefaultConnection` string with your local server name.
   - Example: `Server=localhost\\SQLEXPRESS;Database=ScanID_DB;...`
3. Run the following command to restore dependencies:
   ```bash
   dotnet restore
   ```
4. Run the application:
   ```bash
   dotnet run
   ```
5. The API will typically be available at `http://localhost:5000` or `https://localhost:5001`. You can view the Swagger UI at `https://localhost:5001/swagger`.

## 4. Frontend Setup (React)
1. Navigate to the root directory of the React project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (if not present) and add your API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 5. Mapping UI to Database
The React frontend has been structured to call the API endpoints provided by the .NET backend. All "Master" data (Schools, Teachers, Students) are fetched dynamically from the SQL Server via the `StudentsController`, `SchoolsController`, etc.

### Notes:
- **Authentication**: The current setup uses a simplified login flow. You should implement JWT Authentication in the `AccountController` for production.
- **CORS**: Ensure the `Program.cs` in the backend allows the origin of your React app (usually `http://localhost:3000` or `http://localhost:5173`).
