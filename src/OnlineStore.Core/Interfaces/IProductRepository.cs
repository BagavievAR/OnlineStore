using OnlineStore.Core.Entities;

namespace OnlineStore.Core.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetAllWithDetailsAsync();
    Task<Product?> GetByIdWithDetailsAsync(int id);
}