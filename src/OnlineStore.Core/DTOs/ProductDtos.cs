namespace OnlineStore.Core.DTOs;

public class ProductCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public int CategoryId { get; set; }
    public int BrandId { get; set; }
    public string? ImageUrl { get; set; }
}

public class ProductUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public int CategoryId { get; set; }
    public int BrandId { get; set; }
    public string? ImageUrl { get; set; }
}

public class ProductReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}