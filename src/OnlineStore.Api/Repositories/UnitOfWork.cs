using OnlineStore.Api.Data;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.Api.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IRepository<Category> Categories { get; }
    public IRepository<Brand> Brands { get; }
    public IProductRepository Products { get; }
    public IOrderRepository Orders { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Categories = new Repository<Category>(context);
        Brands = new Repository<Brand>(context);
        Products = new ProductRepository(context);
        Orders = new OrderRepository(context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}