namespace OnlineStore.Core.Entities;

public class Product
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? ImageUrl { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public int BrandId { get; set; }
    public Brand? Brand { get; set; }
}