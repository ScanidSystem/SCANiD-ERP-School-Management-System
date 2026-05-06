using System.Runtime.CompilerServices;

namespace ScanID.Api.Utilities
{
    /// <summary>
    /// Utility class for filesystem logging.
    /// </summary>
    public static class FileLogger
    {
        private static readonly string LogDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
        private static readonly string LogFile = Path.Combine(LogDirectory, $"app_log_{DateTime.Now:yyyyMMdd}.txt");

        static FileLogger()
        {
            if (!Directory.Exists(LogDirectory))
            {
                Directory.CreateDirectory(LogDirectory);
            }
        }

        /// <summary>
        /// Logs a message to a physical file on the server.
        /// </summary>
        /// <param name="message">The message to log.</param>
        /// <param name="level">Log level (Info, Warning, Error).</param>
        public static void Log(string message, string level = "Info", [CallerMemberName] string memberName = "", [CallerFilePath] string filePath = "")
        {
            try
            {
                string fileName = Path.GetFileName(filePath);
                string logEntry = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] [{level.ToUpper()}] [{fileName} -> {memberName}]: {message}{Environment.NewLine}";
                System.IO.File.AppendAllText(LogFile, logEntry);
            }
            catch
            {
                // Fail silently to prevent logger from crashing the app
            }
        }

        /// <summary>
        /// Logs an exception with stack trace to the file system.
        /// </summary>
        /// <param name="ex">The exception object.</param>
        public static void LogError(Exception ex, [CallerMemberName] string memberName = "", [CallerFilePath] string filePath = "")
        {
            Log($"{ex.Message}{Environment.NewLine}Stack Trace: {ex.StackTrace}", "Error", memberName, filePath);
        }
    }
}
