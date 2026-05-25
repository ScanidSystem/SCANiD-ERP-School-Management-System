using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Generic Repository Interface representing the abstraction layer for database CRUD operations.
    /// This adheres strictly to the SOLID Principles:
    /// - Interface Segregation Principle (ISP): Keeps data access operations cohesive and granular.
    /// - Dependency Inversion Principle (DIP): Allows controllers and services to depend on abstractions rather than details.
    /// </summary>
    /// <typeparam name="T">The entity type.</typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// Retrieves an option for custom query evaluation (LINQ chaining).
        /// </summary>
        IQueryable<T> GetQueryable();

        /// <summary>
        /// Retrieves all entities asynchronously.
        /// </summary>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// Retrieves an entity by its unique ID.
        /// </summary>
        Task<T?> GetByIdAsync(int id);

        /// <summary>
        /// Registers a new entity.
        /// </summary>
        Task AddAsync(T entity);

        /// <summary>
        /// Bulk registers multiple entities at once.
        /// </summary>
        Task AddRangeAsync(IEnumerable<T> entities);

        /// <summary>
        /// Updates an existing entity.
        /// </summary>
        void Update(T entity);

        /// <summary>
        /// Deletes an entity.
        /// </summary>
        void Delete(T entity);

        /// <summary>
        /// Transacts memory states with physical storage.
        /// </summary>
        Task<bool> SaveChangesAsync();
    }
}
