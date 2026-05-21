using OnlineStore.Core.Entities;

namespace OnlineStore.Core.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetAllWithDetailsAsync();
    Task<Order?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Order>> GetByUserIdAsync(string userId);
}