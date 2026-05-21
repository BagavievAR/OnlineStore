using Microsoft.EntityFrameworkCore;
using OnlineStore.Api.Data;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.Api.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Order>> GetAllWithDetailsAsync()
    {
        return await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(string userId)
    {
        return await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId)
            .ToListAsync();
    }
}