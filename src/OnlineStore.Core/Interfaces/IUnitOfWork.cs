using OnlineStore.Core.Entities;

namespace OnlineStore.Core.Interfaces;

public interface IUnitOfWork
{
    IRepository<Category> Categories { get; }
    IRepository<Brand> Brands { get; }
    IProductRepository Products { get; }
    IOrderRepository Orders { get; }

    Task<int> SaveChangesAsync();
}